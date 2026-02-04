#!/usr/bin/env python3
"""Extract and cluster topic-specific viewpoints from ChatGPT conversations export.

MVP rule-based clustering (no external dependencies).
"""
from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

SENT_SPLIT_RE = re.compile(r"(?<=[。！？?!])\s*")
CJK_RE = re.compile(r"[\u4e00-\u9fff]+")
WORD_RE = re.compile(r"[A-Za-z0-9_']+")

STOPWORDS_ZH = {
    "我们", "你们", "他们", "她们", "它们", "我们", "你", "我", "他", "她", "它", "的", "了", "在",
    "是", "有", "也", "还", "就", "都", "而", "与", "和", "或", "但", "如果", "因为", "所以", "一个",
    "这个", "那个", "这些", "那些", "可以", "能", "可能", "应该", "需要", "非常", "比较",
}

STOPWORDS_EN = {
    "the", "a", "an", "and", "or", "but", "if", "then", "so", "to", "of", "in", "on", "for",
    "with", "is", "are", "was", "were", "be", "been", "being", "this", "that", "these", "those",
    "i", "you", "he", "she", "we", "they", "it", "my", "your", "his", "her", "our", "their",
}


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
    return [m for _, m in sorted(enumerate(messages), key=lambda x: (x[1].create_time is None, x[1].create_time or 0, x[0]))]


def _sentences(text: str) -> list[str]:
    chunks = [s.strip() for s in SENT_SPLIT_RE.split(text) if s.strip()]
    return chunks if chunks else [text.strip()] if text.strip() else []


def _tokenize(text: str) -> Iterable[str]:
    for chunk in CJK_RE.findall(text):
        if chunk in STOPWORDS_ZH:
            continue
        if len(chunk) >= 2:
            yield chunk
    for token in WORD_RE.findall(text.lower()):
        if token in STOPWORDS_EN:
            continue
        if len(token) >= 3:
            yield token


def _jaccard(a: set[str], b: set[str]) -> float:
    if not a or not b:
        return 0.0
    inter = a & b
    union = a | b
    return len(inter) / len(union)


def _cluster_sentences(sentences: list[str], threshold: float) -> list[list[str]]:
    clusters: list[list[str]] = []
    cluster_tokens: list[set[str]] = []
    for sent in sentences:
        tokens = set(_tokenize(sent))
        if not tokens:
            continue
        assigned = False
        for i, ctok in enumerate(cluster_tokens):
            if _jaccard(tokens, ctok) >= threshold:
                clusters[i].append(sent)
                cluster_tokens[i] = ctok | tokens
                assigned = True
                break
        if not assigned:
            clusters.append([sent])
            cluster_tokens.append(tokens)
    return clusters


def extract_topic(input_path: Path, keyword: str, roles: set[str]) -> dict[str, Any]:
    with input_path.open("r", encoding="utf-8") as f:
        conversations = json.load(f)

    matched_sentences: list[dict[str, Any]] = []
    matched_conversations: list[dict[str, Any]] = []

    for conv in conversations:
        title = conv.get("title") or "(untitled)"
        conv_id = conv.get("conversation_id") or conv.get("id")
        messages = _collect_messages(conv)
        if not messages:
            continue
        conv_has_keyword = False
        for msg in messages:
            if msg.role not in roles:
                continue
            for sent in _sentences(msg.text):
                if keyword in sent:
                    conv_has_keyword = True
                    matched_sentences.append({
                        "sentence": sent.replace("\n", " ").strip(),
                        "role": msg.role,
                        "create_time": msg.create_time,
                        "conversation_id": conv_id,
                        "title": title,
                    })
        if conv_has_keyword:
            matched_conversations.append({
                "conversation_id": conv_id,
                "title": title,
            })

    # cluster user viewpoints only
    user_sentences = [m["sentence"] for m in matched_sentences if m["role"] == "user"]
    clusters = _cluster_sentences(user_sentences, threshold=0.28)

    cluster_summaries = []
    for idx, cluster in enumerate(sorted(clusters, key=len, reverse=True), 1):
        counter = Counter()
        for sent in cluster:
            counter.update(_tokenize(sent))
        keywords = [w for w, _ in counter.most_common(6)]
        cluster_summaries.append({
            "cluster_id": idx,
            "size": len(cluster),
            "keywords": keywords,
            "examples": cluster[:5],
            "sentences": cluster,
        })

    return {
        "keyword": keyword,
        "matched_conversation_count": len(matched_conversations),
        "matched_sentence_count": len(matched_sentences),
        "matched_conversations": matched_conversations,
        "clusters": cluster_summaries,
    }


def write_markdown(report: dict[str, Any], out_path: Path) -> None:
    lines: list[str] = []
    lines.append(f"# 专题抽取：{report['keyword']}")
    lines.append("")
    lines.append(f"涉及对话数量：{report['matched_conversation_count']}")
    lines.append(f"命中句子数量：{report['matched_sentence_count']}")
    lines.append("")
    lines.append("## 观点聚类概览")
    if not report["clusters"]:
        lines.append("- （未检测到相关观点）")
    for cluster in report["clusters"]:
        kw = "、".join(cluster["keywords"]) if cluster["keywords"] else "(无关键词)"
        lines.append(f"- 观点 {cluster['cluster_id']}（{cluster['size']}条）关键词：{kw}")
    lines.append("")

    lines.append("## 观点详情")
    for cluster in report["clusters"]:
        kw = "、".join(cluster["keywords"]) if cluster["keywords"] else "(无关键词)"
        lines.append(f"### 观点 {cluster['cluster_id']}")
        lines.append(f"关键词：{kw}")
        lines.append("示例句：")
        for ex in cluster["examples"]:
            lines.append(f"- {ex}")
        lines.append("")

    out_path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--keyword", required=True)
    parser.add_argument("--roles", default="user", help="Comma separated roles: user,assistant")
    parser.add_argument("--output", default="outputs/topic_report.md")
    parser.add_argument("--json", dest="json_output", default="outputs/topic_report.json")
    args = parser.parse_args()

    roles = {r.strip() for r in args.roles.split(",") if r.strip()}
    report = extract_topic(Path(args.input), args.keyword, roles)

    out_path = Path(args.output)
    json_path = Path(args.json_output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.parent.mkdir(parents=True, exist_ok=True)

    json_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    write_markdown(report, out_path)

    print(f"Wrote {out_path}")
    print(f"Wrote {json_path}")


if __name__ == "__main__":
    main()
