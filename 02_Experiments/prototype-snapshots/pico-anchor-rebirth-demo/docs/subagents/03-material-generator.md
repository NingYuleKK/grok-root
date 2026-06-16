# Subagent 3: Material Generator

## Scope

为 9 个章节生成本地 SVG 素材包，并输出 manifest 供 demo 页面读取。

## Outputs

- `scripts/generateMaterials.ts`
- `src/generated/materials/manifest.ts`
- `public/generated/materials/...`

## Generator Contract

生成器从 `src/data/chapters.ts` 和 `src/data/themeTokens.ts` 读取配置，写入：

- `poster.svg`
- `identity-card.svg`
- `certificate.svg`
- `avatar-frame.svg`
- `share-card.svg`
- `banner.svg`
- 12 个礼物 icon
- 1 个帝王套 icon
- 3 到 5 个伴手礼 icon

## Validation

脚本会校验章节数量为 9，并确认每个写出的 SVG 文件存在。demo 页面只从 `materialManifest` 读取路径，不在组件里硬编码素材路径。
