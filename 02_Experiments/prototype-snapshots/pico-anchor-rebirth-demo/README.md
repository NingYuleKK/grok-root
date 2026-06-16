# 主播大作战：重生之我在 PICO 当主播

一个移动端直播活动 demo，核心不是打榜，而是主播身份闯关、关系署名和伴手礼回赠。

## 运行命令

```bash
npm install
npm run generate:materials
npm run dev
```

其他命令：

```bash
npm test
npm run build
npm run reset:demo
```

`npm run reset:demo` 会刷新 demo 状态 token。浏览器刷新后会回到初始演示数据。

## 页面路径

- `/` 活动入口
- `/room` 直播间 demo
- `/profile/streamer` 主播个人页
- `/profile/sponsor` 老板个人页
- `/materials` 物料库

## 推荐演示流程

1. 打开首页。
2. 进入直播间。
3. 点击“普通用户送低档礼物”，观察礼物墙点亮和飘屏。
4. 点击“一键点亮到 8/12”，观察里程碑。
5. 点击“老板送高档礼物”或“一键通关”。
6. 观察通关仪式弹窗。
7. 点击“前往发放伴手礼”。
8. 把“沙龙小扇子”赠给“月色老板”。
9. 打开老板个人页，查看亲赠来源说明。
10. 打开主播个人页，查看时代主播图鉴和证书墙。
11. 打开物料库，查看所有 subagent 生成物料。

## 已实现能力

- 9 个重生章节叙事配置。
- 程序化 SVG 物料生成，共 200 个本地 SVG。
- 礼物墙、送礼、飘屏、4/8/12 里程碑。
- 12 格通关仪式、证书、头像框、伴手礼发放权。
- 帝王套加冕和大满贯状态。
- 主播个人页的时代主播图鉴 / 重生通关档案。
- 老板个人页的赞助人名片与收到的亲赠伴手礼。
- localStorage 持久化。

## Mock 说明

本 demo 不接真实后端、不接真实支付、不接登录系统。主播、用户、礼物、贡献、证书和伴手礼都来自本地 mock 数据。

## 关键文件

- `src/data/chapters.ts`
- `src/data/themeTokens.ts`
- `src/data/demoState.ts`
- `src/state/activityStore.ts`
- `scripts/generateMaterials.ts`
- `src/generated/materials/manifest.ts`
- `docs/subagents/*.md`
