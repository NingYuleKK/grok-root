import { useEffect, useState } from "react";
import { ActivityHeader } from "../components/ActivityHeader";
import { CompletionModal } from "../components/CompletionModal";
import { DebugPanel } from "../components/DebugPanel";
import { FlyBanner } from "../components/FlyBanner";
import { GiftWall } from "../components/GiftWall";
import { MilestoneBar } from "../components/MilestoneBar";
import { NavBar } from "../components/NavBar";
import { SouvenirGrantModal } from "../components/SouvenirGrantModal";
import { SponsorPanel } from "../components/SponsorPanel";
import { chapters, defaultChapterId } from "../data/chapters";
import { activityStore } from "../state/activityStore";
import { useActivityState } from "../state/useActivityState";
import type { GiftTier } from "../types/activity";

const chapter = chapters.find((item) => item.chapterId === defaultChapterId)!;

function lightTo(target: number) {
  let progress = activityStore.getCurrentProgress().lit;
  for (const gift of chapter.gifts) {
    if (progress >= target) break;
    if (!activityStore.getState().wall.giftProgress[gift.giftId].isLit) {
      const sender = gift.tier === "high" ? "moon-boss" : gift.tier === "mid" ? "fish-fan" : "passer-light";
      activityStore.sendGift(gift.giftId, sender);
      progress += 1;
    }
  }
}

export function RoomPage() {
  const state = useActivityState();
  const [showCompletion, setShowCompletion] = useState(false);
  const [showSouvenir, setShowSouvenir] = useState(false);

  useEffect(() => {
    if (state.wall.isCompleted) setShowCompletion(true);
  }, [state.wall.isCompleted]);

  const sendByTier = (tier: GiftTier, senderId: string) => activityStore.sendRandomGiftByTier(tier, senderId);

  return (
    <main className="app-shell room-shell">
      <NavBar />
      <ActivityHeader state={state} chapter={chapter} />
      <FlyBanner events={state.wall.recentEvents} />

      <section className="panel operation-panel">
        <div className="section-title">
          <p>送礼操作面板</p>
          <strong>mock 支付</strong>
        </div>
        <div className="button-grid">
          <button onClick={() => sendByTier("low", "passer-light")}>普通用户送低档礼物</button>
          <button onClick={() => sendByTier("mid", "fish-fan")}>粉丝送中档礼物</button>
          <button onClick={() => sendByTier("high", "moon-boss")}>老板送高档礼物</button>
          <button className="primary" onClick={() => activityStore.sendEmperorSet("moon-boss")}>月色老板送玫瑰王座加冕套</button>
          <button onClick={() => lightTo(4)}>一键点亮到 4/12</button>
          <button onClick={() => lightTo(8)}>一键点亮到 8/12</button>
          <button className="primary" onClick={() => activityStore.completeChapter()}>一键通关</button>
          <button onClick={() => activityStore.resetChapter()}>重置本关</button>
        </div>
      </section>

      <MilestoneBar state={state} />
      <GiftWall chapter={chapter} state={state} />
      <SponsorPanel state={state} />
      <DebugPanel state={state} />

      {showCompletion && state.wall.isCompleted && (
        <CompletionModal
          state={state}
          chapter={chapter}
          onSouvenir={() => {
            setShowCompletion(false);
            setShowSouvenir(true);
          }}
          onClose={() => setShowCompletion(false)}
        />
      )}
      {showSouvenir && <SouvenirGrantModal state={state} onClose={() => setShowSouvenir(false)} />}
    </main>
  );
}
