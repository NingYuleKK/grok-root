import type { ActivityState, Chapter, GiftTier } from "../types/activity";
import { getChapterMaterials } from "../generated/materials/manifest";
import { GiftTile } from "./GiftTile";

const tierLabels: Record<GiftTier, string> = {
  low: "低档位礼物",
  mid: "中档位礼物",
  high: "高档位礼物",
};

export function GiftWall({ chapter, state }: { chapter: Chapter; state: ActivityState }) {
  const assets = getChapterMaterials(chapter.chapterId);

  return (
    <section className="panel">
      <div className="section-title">
        <p>礼物墙</p>
        <strong>{state.wall.litGiftIds.length}/12</strong>
      </div>
      {(["low", "mid", "high"] as GiftTier[]).map((tier) => (
        <div className="gift-section" key={tier}>
          <h3>{tierLabels[tier]}</h3>
          <div className="gift-grid">
            {chapter.gifts
              .filter((gift) => gift.tier === tier)
              .map((gift) => (
                <GiftTile key={gift.giftId} gift={gift} icon={assets.gifts[gift.giftId]} progress={state.wall.giftProgress[gift.giftId]} />
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
