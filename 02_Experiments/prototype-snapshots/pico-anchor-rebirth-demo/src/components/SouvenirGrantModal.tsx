import { useState } from "react";
import type { ActivityState } from "../types/activity";
import { activityStore } from "../state/activityStore";

type Props = {
  state: ActivityState;
  onClose: () => void;
};

export function SouvenirGrantModal({ state, onClose }: Props) {
  const [souvenirId, setSouvenirId] = useState(state.streamer.souvenirsToGive[0]?.souvenirId ?? "");
  const [receiverId, setReceiverId] = useState("moon-boss");

  const grant = () => {
    if (!souvenirId) return;
    activityStore.grantSouvenir(souvenirId, receiverId);
    const next = activityStore.getState().streamer.souvenirsToGive[0]?.souvenirId ?? "";
    setSouvenirId(next);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <section className="modal-card">
        <p className="eyebrow">伴手礼回赠</p>
        <h2>把通关伴手礼亲赠给赞助人</h2>
        {state.streamer.souvenirsToGive.length === 0 ? (
          <p className="empty-copy">本关伴手礼已经发放完毕。</p>
        ) : (
          <div className="form-stack">
            <label>
              可赠送伴手礼
              <select value={souvenirId} onChange={(event) => setSouvenirId(event.target.value)}>
                {state.streamer.souvenirsToGive.map((souvenir) => (
                  <option key={souvenir.souvenirId} value={souvenir.souvenirId}>{souvenir.souvenirName}</option>
                ))}
              </select>
            </label>
            <label>
              接收人
              <select value={receiverId} onChange={(event) => setReceiverId(event.target.value)}>
                {state.users.map((user) => (
                  <option key={user.id} value={user.id}>{user.nickname}</option>
                ))}
              </select>
            </label>
            <p>{state.streamer.souvenirsToGive.find((item) => item.souvenirId === souvenirId)?.sourceCopy}</p>
          </div>
        )}
        <div className="modal-actions">
          <button className="primary" disabled={!souvenirId} onClick={grant}>赠送</button>
          <button onClick={onClose}>完成</button>
        </div>
      </section>
    </div>
  );
}
