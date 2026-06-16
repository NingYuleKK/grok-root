import { describe, expect, test } from "vitest";
import { createActivityStore } from "../state/activityStore";
import { chapters } from "../data/chapters";
import { createInitialDemoState } from "../data/demoState";

describe("activity store", () => {
  test("点亮礼物会推进进度、触发 4/8/12 里程碑并沉淀主播档案", () => {
    const store = createActivityStore(createInitialDemoState(), { persist: false });
    const chapter = chapters.find((item) => item.chapterId === "rose-salon");
    expect(chapter).toBeDefined();

    for (const gift of chapter!.gifts.slice(0, 4)) {
      store.sendGift(gift.giftId, "moon-boss");
    }

    expect(store.getCurrentProgress()).toEqual({ lit: 4, total: 12 });
    expect(store.getState().wall.milestoneStatus["4"].isUnlocked).toBe(true);
    expect(store.getRecentEvents()[0].type).toBe("milestone");

    for (const gift of chapter!.gifts.slice(4, 12)) {
      store.sendGift(gift.giftId, gift.tier === "high" ? "moon-boss" : "fish-fan");
    }

    const state = store.getState();
    expect(store.getCurrentProgress()).toEqual({ lit: 12, total: 12 });
    expect(state.wall.isCompleted).toBe(true);
    expect(state.streamer.completedChapterIds).toContain("rose-salon");
    expect(state.streamer.certificates[0].chapterId).toBe("rose-salon");
    expect(state.streamer.souvenirsToGive).toHaveLength(chapter!.souvenirs.length);
  });

  test("帝王套在通关后会激活大满贯，伴手礼可亲赠给赞助人", () => {
    const store = createActivityStore(createInitialDemoState(), { persist: false });
    store.completeChapter();
    store.sendEmperorSet("moon-boss");

    expect(store.getState().wall.isGrandSlam).toBe(true);
    expect(store.getState().streamer.hallPassCount).toBe(1);

    const souvenir = store.getState().streamer.souvenirsToGive[0];
    store.grantSouvenir(souvenir.souvenirId, "moon-boss");

    const sponsor = store.getState().users.find((user) => user.id === "moon-boss");
    expect(sponsor?.receivedSouvenirs[0].sourceCopy).toContain("由主播 桃桃 于《玫瑰沙龙会客厅主人》通关后亲赠");
  });
});
