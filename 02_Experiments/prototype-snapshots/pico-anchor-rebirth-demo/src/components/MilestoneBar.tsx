import type { ActivityState } from "../types/activity";

export function MilestoneBar({ state }: { state: ActivityState }) {
  return (
    <section className="panel milestone-panel">
      <div className="section-title">
        <p>里程碑奖励</p>
        <strong>{state.wall.isGrandSlam ? "大满贯" : state.wall.isCompleted ? "已通关" : "进行中"}</strong>
      </div>
      <div className="milestones">
        {Object.values(state.wall.milestoneStatus).map((milestone) => (
          <div className={`milestone ${milestone.isUnlocked ? "unlocked" : ""}`} key={milestone.milestoneId}>
            <b>{milestone.title}</b>
            <span>{milestone.reward}</span>
          </div>
        ))}
        <div className={`milestone ${state.wall.isGrandSlam ? "unlocked" : ""}`}>
          <b>帝王套</b>
          <span>获得大满贯通行证</span>
        </div>
      </div>
    </section>
  );
}
