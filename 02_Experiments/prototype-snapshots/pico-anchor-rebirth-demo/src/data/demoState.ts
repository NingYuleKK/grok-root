import { chapters, defaultChapterId } from "./chapters";
import { demoUsers } from "./demoUsers";
import type { ActivityState, ArchiveCard, GiftProgress, MilestoneStatus } from "../types/activity";

export const STORAGE_KEY = "pico-anchor-rebirth-demo:v1";
export const STREAMER_ID = "streamer-taotao";

function milestones(): Record<string, MilestoneStatus> {
  return {
    "4": { milestoneId: "4", title: "4 格：入席", reward: "解锁「入席」小动效", isUnlocked: false },
    "8": { milestoneId: "8", title: "8 格：头像贴纸", reward: "解锁「沙龙女主人头像贴纸」", isUnlocked: false },
    "12": { milestoneId: "12", title: "12 格：通关", reward: "解锁头像框、证书、伴手礼发放权", isUnlocked: false },
  };
}

function giftProgress(): Record<string, GiftProgress> {
  const chapter = chapters.find((item) => item.chapterId === defaultChapterId)!;
  return Object.fromEntries(
    chapter.gifts.map((gift) => [
      gift.giftId,
      {
        giftId: gift.giftId,
        count: 0,
        isLit: false,
      },
    ]),
  );
}

function archiveCards(): ArchiveCard[] {
  return chapters.map((chapter) => ({
    chapterId: chapter.chapterId,
    status: chapter.chapterId === defaultChapterId ? "进行中" : "未开始",
    grantedSouvenirCount: 0,
  }));
}

export function createInitialDemoState(): ActivityState {
  return {
    streamer: {
      id: STREAMER_ID,
      nickname: "桃桃",
      avatar: "桃",
      level: "PICO 潜力主播 Lv.7",
      currentChapterId: defaultChapterId,
      completedChapterIds: [],
      certificates: [],
      souvenirsToGive: [],
      archiveCards: archiveCards(),
      hallPassCount: 0,
    },
    users: demoUsers.map((user) => ({ ...user, receivedSouvenirs: [] })),
    wall: {
      chapterId: defaultChapterId,
      giftProgress: giftProgress(),
      litGiftIds: [],
      milestoneStatus: milestones(),
      isCompleted: false,
      isGrandSlam: false,
      emperorSetCount: 0,
      sponsorRanking: [],
      recentEvents: [
        {
          id: "event-init",
          type: "gift",
          copy: "桃桃收到玫瑰沙龙任务包，等待第一位来客点灯。",
          timestamp: new Date().toISOString(),
        },
      ],
    },
    contributions: [],
  };
}

export const initialDemoState = createInitialDemoState();
