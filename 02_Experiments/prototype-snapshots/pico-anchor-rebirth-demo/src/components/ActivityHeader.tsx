import type { ActivityState, Chapter } from "../types/activity";
import { getChapterMaterials } from "../generated/materials/manifest";

type Props = {
  state: ActivityState;
  chapter: Chapter;
};

export function ActivityHeader({ state, chapter }: Props) {
  const assets = getChapterMaterials(chapter.chapterId);
  const progress = `${state.wall.litGiftIds.length}/${chapter.wallSize}`;

  return (
    <section className="live-hero">
      <div className="streamer-avatar-wrap">
        <img className="avatar-frame-img" src={assets.avatarFrame} alt={chapter.avatarFrameName} />
        <div className="streamer-avatar">{state.streamer.avatar}</div>
      </div>
      <div className="live-hero-info">
        <p className="eyebrow">当前章节</p>
        <h1>{state.streamer.nickname}</h1>
        <strong>{chapter.identityTitle}</strong>
        <p>{chapter.identityTagline}</p>
        <div className="hero-metrics">
          <span>通关进度 {progress}</span>
          <span>倒计时 3 天 12 小时</span>
        </div>
      </div>
    </section>
  );
}
