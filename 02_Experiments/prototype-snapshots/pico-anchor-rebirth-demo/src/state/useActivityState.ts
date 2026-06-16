import { useSyncExternalStore } from "react";
import { activityStore } from "./activityStore";

export function useActivityState() {
  return useSyncExternalStore(activityStore.subscribe, activityStore.getState, activityStore.getState);
}
