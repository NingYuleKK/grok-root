import type { Gift, GiftProgress } from "../types/activity";

type Props = {
  gift: Gift;
  icon: string;
  progress: GiftProgress;
};

export function GiftTile({ gift, icon, progress }: Props) {
  return (
    <article className={`gift-tile ${progress.isLit ? "lit" : ""} ${progress.justLitAt ? "pulse" : ""}`}>
      <img src={icon} alt={gift.giftName} />
      <h4>{gift.giftName}</h4>
      <div className="gift-meta">
        <span>{gift.tier === "low" ? "低档位" : gift.tier === "mid" ? "中档位" : "高档位"}</span>
        <span>{progress.isLit ? "已点亮" : "待点亮"}</span>
      </div>
      <p>{progress.count} 次贡献</p>
      <small>{progress.lastSenderName ?? "等待来客"}</small>
    </article>
  );
}
