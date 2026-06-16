import { NavBar } from "../components/NavBar";
import { getChapterMaterials } from "../generated/materials/manifest";
import { useActivityState } from "../state/useActivityState";

export function SponsorProfilePage() {
  const state = useActivityState();
  const sponsor = state.users.find((user) => user.id === "moon-boss")!;
  const assets = getChapterMaterials(state.streamer.currentChapterId);

  return (
    <main className="app-shell">
      <NavBar />
      <section className="profile-head sponsor-head">
        <div className="streamer-avatar boss-avatar">{sponsor.avatar}</div>
        <div>
          <p className="eyebrow">老板个人页</p>
          <h1>{sponsor.nickname}</h1>
          <p>本关身份：首席赞助人</p>
          <div className="hero-metrics">
            <span>名片皮肤：玫瑰沙龙首席赞助人名片</span>
            <span>座驾：玫瑰马车座驾，1 天体验</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <p>赞助人名片</p>
          <strong>关系资产</strong>
        </div>
        <img className="wide-art" src={assets.shareCard} alt="玫瑰沙龙首席赞助人名片" />
      </section>

      <section className="panel">
        <div className="section-title">
          <p>收到的主播亲赠伴手礼</p>
          <strong>{sponsor.receivedSouvenirs.length} 件</strong>
        </div>
        <div className="souvenir-list">
          {sponsor.receivedSouvenirs.length === 0 ? (
            <p className="empty-copy">通关后由主播发放伴手礼，这里会展示来源说明。</p>
          ) : (
            sponsor.receivedSouvenirs.map((souvenir) => (
              <article key={`${souvenir.souvenirId}-${souvenir.grantedAt}`}>
                <h3>{souvenir.souvenirName}</h3>
                <p>{souvenir.sourceCopy}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
