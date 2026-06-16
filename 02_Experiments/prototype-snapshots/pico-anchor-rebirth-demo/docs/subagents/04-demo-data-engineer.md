# Subagent 4: Demo Data Engineer

## Scope

生成 mock 数据与轻量状态机，覆盖送礼、礼物墙、飘屏、里程碑、通关、帝王套、大满贯、伴手礼回赠和个人页沉淀。

## Outputs

- `src/types/activity.ts`
- `src/data/demoState.ts`
- `src/state/activityStore.ts`

## State Machine

`activityStore` 支持：

- `sendGift(giftId, senderId)`
- `sendRandomGiftByTier(tier, senderId)`
- `sendEmperorSet(senderId)`
- `unlockMilestone(milestoneId)`
- `completeChapter()`
- `grantSouvenir(souvenirId, receiverId)`
- `resetChapter()`
- `resetDemo()`
- `getSponsorRanking()`
- `getCurrentProgress()`
- `getRecentEvents()`

## Persistence

状态写入 localStorage。`npm run reset:demo` 会刷新 `src/generated/resetToken.ts`，让浏览器下次加载时使用新的状态 key，从而恢复初始演示数据。
