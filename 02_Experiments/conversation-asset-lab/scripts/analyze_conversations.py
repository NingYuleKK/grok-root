#!/usr/bin/env python3
"""Analyze ChatGPT exported conversations into basic topic chunks and insights.

MVP heuristics (no external models):
- Topic chunks via keyword frequency per message window
- Cognitive change points via change-language pattern matching
- Exploration points via question detection
"""
from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

CJK_RE = re.compile(r"[\u4e00-\u9fff]+")
WORD_RE = re.compile(r"[A-Za-z0-9_']+")
SENT_SPLIT_RE = re.compile(r"(?<=[。！？?!])\s*")

STOPWORDS_EN = {
    "the", "a", "an", "and", "or", "but", "if", "then", "so", "to", "of", "in", "on", "for",
    "with", "is", "are", "was", "were", "be", "been", "being", "this", "that", "these", "those",
    "i", "you", "he", "she", "we", "they", "it", "my", "your", "his", "her", "our", "their",
    "me", "us", "them", "as", "at", "by", "from", "into", "about", "over", "after", "before",
    "not", "no", "yes", "can", "could", "should", "would", "will", "just", "do", "does", "did",
    "have", "has", "had", "also", "there", "here", "what", "why", "how", "when", "where", "which",
}

STOPWORDS_ZH = {
    "我们", "你们", "他们", "她们", "它们", "我们", "你", "我", "他", "她", "它", "的", "了", "在",
    "是", "有", "也", "还", "就", "都", "而", "与", "和", "或", "但", "如果", "因为", "所以", "一个",
    "这个", "那个", "这些", "那些", "进行", "进行", "可以", "能", "可能", "应该", "需要", "非常", "比较",
}

CHANGE_MARKERS = [
    "我意识到", "我发现", "我开始", "我决定", "我改", "我调整", "我转向", "不再", "从而", "之前", "现在",
    "原本", "后来", "转而", "改为", "改变", "变化", "修正", "升级", "更新了", "重新",
]

QUESTION_MARKERS = [
    "为什么", "怎么", "如何", "什么", "是否", "是不是", "能不能", "可以吗", "要不要", "会不会",
]


@dataclass
class Message:
    role: str
    text: str
    create_time: float | None


def _extract_text(content: dict[str, Any] | None) -> str:
    if not content:
        return ""
    parts = content.get("parts") or []
    texts: list[str] = []
    for part in parts:
        if isinstance(part, str):
            texts.append(part)
        elif isinstance(part, dict):
            if "text" in part and isinstance(part["text"], str):
                texts.append(part["text"])
    return "".join(texts).strip()


def _collect_messages(conversation: dict[str, Any]) -> list[Message]:
    messages: list[Message] = []
    mapping = conversation.get("mapping") or {}
    for node in mapping.values():
        msg = node.get("message")
        if not msg:
            continue
        role = msg.get("author", {}).get("role")
        if role not in ("user", "assistant"):
            continue
        text = _extract_text(msg.get("content"))
        if not text:
            continue
        create_time = msg.get("create_time")
        messages.append(Message(role=role, text=text, create_time=create_time))
    # stable sort by create_time, keeping original order for equal/None
    return [m for _, m in sorted(enumerate(messages), key=lambda x: (x[1].create_time is None, x[1].create_time or 0, x[0]))]


def _sentences(text: str) -> list[str]:
    chunks = [s.strip() for s in SENT_SPLIT_RE.split(text) if s.strip()]
    return chunks if chunks else [text.strip()] if text.strip() else []


def _tokenize(text: str) -> Iterable[str]:
    # CJK sequences as tokens (len>=2)
    for chunk in CJK_RE.findall(text):
        if chunk in STOPWORDS_ZH:
            continue
        if len(chunk) >= 2:
            yield chunk
    # English-like tokens
    for token in WORD_RE.findall(text.lower()):
        if token in STOPWORDS_EN:
            continue
        if len(token) >= 3:
            yield token


def _top_keywords(texts: Iterable[str], top_k: int = 6) -> list[str]:
    counter = Counter()
    for text in texts:
        counter.update(_tokenize(text))
    # filter noisy tokens
    cleaned = [(w, c) for w, c in counter.most_common() if not w.startswith('turn') and w != 'cite']
    return [w for w, _ in cleaned[:top_k]]


def _detect_changes(messages: list[Message]) -> list[dict[str, Any]]:
    findings: list[dict[str, Any]] = []
    for msg in messages:
        if msg.role != "user":
            continue
        for sent in _sentences(msg.text):
            if any(marker in sent for marker in CHANGE_MARKERS):
                findings.append({
                    "text": sent,
                    "create_time": msg.create_time,
                })
    return findings


def _detect_questions(messages: list[Message]) -> list[str]:
    questions: list[str] = []
    for msg in messages:
        if msg.role != 'user':
            continue
        for sent in _sentences(msg.text):
            if not sent:
                continue
            if '?' in sent or '？' in sent or any(marker in sent for marker in QUESTION_MARKERS):
                cleaned = sent.replace('\n', ' ').strip()
                if 3 <= len(cleaned) <= 120:
                    questions.append(cleaned)
    return questions


def _chunk_messages(messages: list[Message], chunk_size: int) -> list[dict[str, Any]]:
    chunks: list[dict[str, Any]] = []
    buffer: list[Message] = []
    for msg in messages:
        buffer.append(msg)
        if len(buffer) >= chunk_size:
            chunks.append(_chunk_summary(buffer))
            buffer = []
    if buffer:
        chunks.append(_chunk_summary(buffer))
    return chunks


def _chunk_summary(messages: list[Message]) -> dict[str, Any]:
    user_texts = [m.text for m in messages if m.role == "user"]
    all_texts = [m.text for m in messages if m.role == "user"]
    summary = ""
    for text in user_texts:
        if text.strip():
            summary = text.strip().replace("\n", " ")
            if len(summary) > 140:
                summary = summary[:140] + "…"
            break
    return {
        "summary": summary,
        "keywords": _top_keywords(all_texts),
        "message_count": len(messages),
    }


def analyze_conversations(path: Path, limit: int | None, chunk_size: int, max_messages: int | None) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        conversations = json.load(f)

    results = []
    for idx, conv in enumerate(conversations):
        if limit is not None and idx >= limit:
            break
        title = conv.get("title") or "(untitled)"
        messages = _collect_messages(conv)
        if not messages:
            continue
        if max_messages:
            messages = messages[:max_messages]
        chunks = _chunk_messages(messages, chunk_size)
        changes = _detect_changes(messages)
        questions = _detect_questions(messages)
        results.append({
            "title": title,
            "conversation_id": conv.get("conversation_id") or conv.get("id"),
            "message_count": len(messages),
            "chunks": chunks,
            "cognitive_changes": changes[:10],
            "exploration_questions": questions[:10],
        })

    question_counter = Counter()
    for item in results:
        for q in item["exploration_questions"]:
            normalized = q.strip().replace("\n", " ")
            if normalized:
                question_counter[normalized] += 1

    return {
        "total_conversations": len(results),
        "conversations": results,
        "top_questions": question_counter.most_common(20),
    }


def write_markdown(report: dict[str, Any], out_path: Path) -> None:
    lines: list[str] = []
    lines.append("# Conversation Insights")
    lines.append("")
    lines.append(f"Total conversations analyzed: {report['total_conversations']}")
    lines.append("")
    lines.append("## Top Exploration Questions")
    for q, count in report["top_questions"]:
        lines.append(f"- ({count}) {q}")
    lines.append("")

    for conv in report["conversations"]:
        lines.append(f"## {conv['title']}")
        lines.append(f"Conversation ID: {conv['conversation_id']}")
        lines.append(f"Messages: {conv['message_count']}")
        lines.append("")
        lines.append("Chunks:")
        for idx, chunk in enumerate(conv["chunks"], 1):
            kw = ", ".join(chunk["keywords"]) if chunk["keywords"] else "(none)"
            summary = chunk["summary"] or "(no summary)"
            lines.append(f"- {idx}. {summary}")
            lines.append(f"  Keywords: {kw}")
        lines.append("")
        lines.append("Cognitive Change Points:")
        if conv["cognitive_changes"]:
            for change in conv["cognitive_changes"]:
                lines.append(f"- {change['text']}")
        else:
            lines.append("- (none detected)")
        lines.append("")
        lines.append("Exploration Questions:")
        if conv["exploration_questions"]:
            for q in conv["exploration_questions"]:
                lines.append(f"- {q}")
        else:
            lines.append("- (none detected)")
        lines.append("")

    out_path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Path to conversations.json")
    parser.add_argument("--output", default="outputs/conversation_insights.md")
    parser.add_argument("--json", dest="json_output", default="outputs/conversation_insights.json")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of conversations")
    parser.add_argument("--chunk-size", type=int, default=8)
    parser.add_argument("--max-messages", type=int, default=None)
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)
    json_path = Path(args.json_output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.parent.mkdir(parents=True, exist_ok=True)

    report = analyze_conversations(
        input_path,
        limit=args.limit,
        chunk_size=args.chunk_size,
        max_messages=args.max_messages,
    )

    json_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    write_markdown(report, output_path)

    print(f"Wrote {output_path}")
    print(f"Wrote {json_path}")


if __name__ == "__main__":
    main()
