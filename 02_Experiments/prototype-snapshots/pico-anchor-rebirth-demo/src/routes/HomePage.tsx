import { navigate } from "../App";
import { ChapterCard } from "../components/ChapterCard";
import { NavBar } from "../components/NavBar";
import { chapters, defaultChapterId } from "../data/chapters";
import { getChapterMaterials } from "../generated/materials/manifest";
import { useActivityState } from "../state/useActivityState";

export function HomePage() {
  const state = useActivityState();
  const current = chapters.find((chapter) => chapter.chapterId === defaultChapterId)!;
  const assets = getChapterMaterials(defaultChapterId);

  return (
    <main className="app-shell">
      <NavBar />
      <section className="home-hero">
        <img src={assets.poster} alt="玫瑰沙龙活动海报" />
        <div className="home-copy">
          <p className="eyebrow">主播身份闯关剧场</p>
          <h1>主播大作战：重生之我在 PICO 当主播</h1>
          <p>帮主播完成重生身份任务，点亮礼物墙，解锁时代主播档案。</p>
          <div className="home-actions">
            <button className="primary" onClick={() => navigate("/room")}>进入直播间 demo</button>
            <button onClick={() => navigate("/materials")}>查看物料库</button>
            <button onClick={() => navigate("/profile/streamer")}>查看主播个人页</button>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <p>当前主播</p>
          <strong>{state.streamer.nickname}</strong>
        </div>
        <div className="profile-strip">
          <div className="streamer-avatar small">{state.streamer.avatar}</div>
          <div>
            <h2>{current.chapterName}</h2>
            <p>{current.shortStory}</p>
          </div>
        </div>
      </section>

      <section className="chapter-grid-section">
        <div className="section-title">
          <p>9 个重生章节</p>
          <strong>默认突出玫瑰沙龙</strong>
        </div>
        <div className="chapter-grid">
          {chapters.map((chapter) => (
            <ChapterCard key={chapter.chapterId} chapter={chapter} active={chapter.chapterId === defaultChapterId} />
          ))}
        </div>
      </section>
    </main>
  );
}
