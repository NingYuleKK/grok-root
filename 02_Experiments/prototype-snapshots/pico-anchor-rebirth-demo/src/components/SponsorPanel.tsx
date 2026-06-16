import type { ActivityState } from "../types/activity";

export function SponsorPanel({ state }: { state: ActivityState }) {
  const ranking = state.wall.sponsorRanking.length > 0 ? state.wall.sponsorRanking : [];
  const chief = ranking[0];
  const finalizer = state.users.find((user) => user.id === state.wall.finalizerId);

  return (
    <section className="panel sponsor-panel">
      <div className="section-title">
        <p>关系署名</p>
        <strong>赞助人席位</strong>
      </div>
      <div className="sponsor-signatures">
        <div>
          <span>首席赞助人</span>
          <b>{chief?.nickname ?? "待署名"}</b>
        </div>
        <div>
          <span>终局点亮人</span>
          <b>{finalizer?.nickname ?? "待点亮"}</b>
        </div>
        <div>
          <span>陪跑守护人</span>
          <b>{ranking[1]?.nickname ?? "小鱼粉丝"}</b>
        </div>
        <div>
          <span>入席宾客</span>
          <b>{Math.max(state.contributions.length, state.wall.litGiftIds.length)} 位</b>
        </div>
      </div>
      <div className="ranking-list">
        {ranking.slice(0, 4).map((item, index) => (
          <p key={item.userId}>
            <span>TOP {index + 1}</span>
            <b>{item.nickname}</b>
            <em>{item.diamondValue} 钻</em>
          </p>
        ))}
      </div>
    </section>
  );
}
