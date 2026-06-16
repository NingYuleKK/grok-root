import type { ActivityState } from "../types/activity";

export function DebugPanel({ state }: { state: ActivityState }) {
  return (
    <details className="debug-panel">
      <summary>演示状态</summary>
      <pre>{JSON.stringify({ progress: state.wall.litGiftIds.length, completed: state.wall.isCompleted, grandSlam: state.wall.isGrandSlam }, null, 2)}</pre>
    </details>
  );
}
