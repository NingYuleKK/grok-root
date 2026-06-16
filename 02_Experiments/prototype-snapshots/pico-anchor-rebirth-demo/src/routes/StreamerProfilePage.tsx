import { useState } from "react";
import { CertificateCard } from "../components/CertificateCard";
import { NavBar } from "../components/NavBar";
import { chapters, defaultChapterId } from "../data/chapters";
import { getChapterMaterials } from "../generated/materials/manifest";
import { useActivityState } from "../state/useActivityState";

export function StreamerProfilePage() {
  const state = useActivityState();
  const current = chapters.find((chapter) => chapter.chapterId === defaultChapterId)!;
  const assets = getChapterMaterials(current.chapterId);
  const [preview, setPreview] = useState<string | null>(null);
  const completed = state.streamer.completedChapterIds.includes(current.chapterId);

  return (
    <main className="app-shell">
      <NavBar />
      <section className="profile-head">
        <div className="streamer-avatar-wrap">
          {completed && <img className="avatar-frame-img" src={assets.avatarFrame} alt="当前头像框" />}
          <div className="streamer-avatar">{state.streamer.avatar}</div>
        </div>
        <div>
          <p className="eyebrow">主播个人页</p>
          <h1>{state.streamer.nickname}</h1>
          <p>{current.identityTitle}</p>
          <div className="hero-metrics">
            <span>通关次数 {state.streamer.completedChapterIds.length}</span>
            <span>殿堂通行证 {state.streamer.hallPassCount}</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <p>时代主播图鉴</p>
          <strong>重生通关档案</strong>
        </div>
        <div className="archive-grid">
          {state.streamer.archiveCards.map((card) => {
            const chapter = chapters.find((item) => item.chapterId === card.chapterId)!;
            const chapterAssets = getChapterMaterials(chapter.chapterId);
            const isCurrent = chapter.chapterId === current.chapterId;
            return (
              <article className={`archive-card ${card.status !== "未开始" ? "active" : ""}`} key={card.chapterId}>
                <img src={chapterAssets.identityCard} alt={chapter.identityTitle} />
                <h3>{chapter.chapterName}</h3>
                <span>{card.status}</span>
                {isCurrent && <p>当前进度 {state.wall.litGiftIds.length}/12</p>}
                {card.completedAt && <p>首席赞助人：{state.users.find((user) => user.id === card.chiefSponsorId)?.nickname ?? "待记录"}</p>}
                {card.completedAt && <p>已发放伴手礼 {card.grantedSouvenirCount} 份</p>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <p>证书墙</p>
          <strong>{state.streamer.certificates.length} 张</strong>
        </div>
        <div className="certificate-row">
          {state.streamer.certificates.length === 0 ? (
            <p className="empty-copy">通关后这里会沉淀证书。</p>
          ) : (
            state.streamer.certificates.map((cert) => {
              const chapter = chapters.find((item) => item.chapterId === cert.chapterId)!;
              return <CertificateCard key={cert.grantedAt} chapter={chapter} onClick={() => setPreview(getChapterMaterials(chapter.chapterId).certificate)} />;
            })
          )}
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <p>头像框和装扮</p>
          <strong>{completed ? "已解锁" : "未解锁"}</strong>
        </div>
        <img className="wide-art" src={assets.avatarFrame} alt={current.avatarFrameName} />
      </section>

      <section className="panel">
        <div className="section-title">
          <p>分享海报</p>
          <strong>当前章节</strong>
        </div>
        <div className="share-assets">
          <img src={assets.poster} alt="分享海报" />
          <img src={assets.shareCard} alt="分享卡" />
        </div>
        <button onClick={() => alert("已生成朋友圈分享图，demo 中不实际保存。")}>模拟保存海报</button>
      </section>

      {preview && (
        <div className="modal-backdrop" onClick={() => setPreview(null)}>
          <img className="certificate-preview" src={preview} alt="证书大图" />
        </div>
      )}
    </main>
  );
}
