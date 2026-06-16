import { navigate } from "../App";
import type { ActivityState, Chapter } from "../types/activity";

type Props = {
  state: ActivityState;
  chapter: Chapter;
  onSouvenir: () => void;
  onClose: () => void;
};

export function CompletionModal({ state, chapter, onSouvenir, onClose }: Props) {
  const chief = state.wall.sponsorRanking[0]?.nickname ?? "月色老板";
  const finalizer = state.users.find((user) => user.id === state.wall.finalizerId)?.nickname ?? "终局点亮人";

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <section className="modal-card">
        <p className="eyebrow">通关仪式</p>
        <h2>桃桃的玫瑰沙龙全席点亮</h2>
        <ul className="ceremony-list">
          <li>主播获封：{chapter.identityTitle}</li>
          <li>首席赞助人：{chief}</li>
          <li>终局点亮人：{finalizer}</li>
          <li>获得证书：{chapter.certificateTitle}</li>
          <li>获得头像框：{chapter.avatarFrameName}</li>
          <li>获得伴手礼发放权：{chapter.souvenirs.length} 份</li>
        </ul>
        <div className="modal-actions">
          <button className="primary" onClick={onSouvenir}>前往发放伴手礼</button>
          <button onClick={() => navigate("/profile/streamer")}>查看主播个人页</button>
          <button onClick={onClose}>留在直播间</button>
        </div>
      </section>
    </div>
  );
}
