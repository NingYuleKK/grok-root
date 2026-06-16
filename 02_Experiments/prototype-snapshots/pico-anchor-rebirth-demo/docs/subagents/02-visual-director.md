# Subagent 2: Visual Director

## Scope

为 9 个章节生成视觉 token，约束 demo 的背景、卡片、边框、图标、粒子和标题气质。

## Outputs

- `src/data/themeTokens.ts`

## Direction

- 场景基底：移动端直播活动页，黑色直播间背景。
- 质感方向：高饱和、高对比、高可读。
- 资产原则：原创 SVG/CSS 视觉，不依赖外部图片或外链字体。
- 玫瑰沙龙：奶油白、玫瑰红、鎏金、珍珠色。
- 赛博章节：黑、银白、青蓝、霓虹粉。
- 黄金秀场：金色、橙色、闪光粒子。
- 兔耳贵族：奶油白、浅金、柔粉。
- 暗黑联动：黑紫、暗红、银色。

## Implementation Notes

页面通过章节 ID 读取 token。核心按钮和状态反馈使用 `accentColor`，正文容器保持高对比，避免文字压在复杂光效上。
