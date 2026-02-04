# Process 演进过程（v0.1）

本文件记录从“全量对话导出”到“三个可交付物”的完整流程，便于未来复跑与团队协作。

## 目标
- 生成《金瓶梅》相关的结构化 Chunk（可复用）
- 生成一篇“温柔理性”的博客转写（可发布）
- 形成清晰的方法论流程（可复现）

## 输入
- `input/conversations.json`
  - ChatGPT 导出的完整对话 JSON

## 输出
- `deliverables/jinpingmei_report.md`
- `deliverables/jinpingmei_report.json`
- `deliverables/jinpingmei_blog.md`
- `deliverables/conversation_insights.md`
- `deliverables/conversation_insights.json`

## 工具与脚本
- `scripts/analyze_conversations.py`
  - 全量对话基础分析（主题/问题/变化点）
- `scripts/extract_topic.py`
  - 关键词专题抽取 + 观点聚类

## 步骤流程
1. 全量对话解析
   - 读取 `conversations.json`
   - 提取 user/assistant 消息，按时间排序
   - 生成全量概览：主题、问题、变化点

2. 专题抽取（以“金瓶梅”为例）
   - 关键词过滤：包含“金瓶梅”的句子
   - 聚类：基于句子词汇 Jaccard 相似度的启发式聚类
   - 生成 `jinpingmei_report.md/json`

3. 博客转写
   - 选取聚类中规模较大的 6–8 个观点簇
   - 生成温柔理性风格短文

## 验收标准（v0.1）
- 结构稳定：字段名一致，可复跑
- 可读性：输出为清晰 Markdown
- 可扩展：未来可替换聚类与摘要方法

## 人工判断点
- 观点聚类是否合并/拆分
- 博客文风是否符合“温柔理性”
- 是否需要加入时间线或观点演化

## 常见失败模式
- 关键词命中偏少或噪音偏高
- 聚类过碎（阈值过高）或过粗（阈值过低）
- 博客过于“报告感”，缺乏自然叙事

## 迭代到 v0.2 的方向
- 引入 LLM 总结与更稳健的主题标签
- 加入“观点演化时间线”
- 增加可视化或前端简版展示

## 运行命令（参考）
```bash
python3 scripts/analyze_conversations.py \
  --input input/conversations.json \
  --output deliverables/conversation_insights.md \
  --json deliverables/conversation_insights.json

python3 scripts/extract_topic.py \
  --input input/conversations.json \
  --keyword 金瓶梅 \
  --roles user \
  --output deliverables/jinpingmei_report.md \
  --json deliverables/jinpingmei_report.json
```
