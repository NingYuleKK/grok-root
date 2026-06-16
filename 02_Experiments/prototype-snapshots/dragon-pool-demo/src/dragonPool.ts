export type PoolState = {
  energy: number;
  threshold: number;
};

export type PoolResult = PoolState & {
  reveals: number;
};

export type DragonStage = {
  label: string;
  hint: string;
  tension: "calm" | "warm" | "near" | "critical";
};

export function applyGiftToPool(state: PoolState, giftEnergy: number): PoolResult {
  const totalEnergy = state.energy + giftEnergy;
  const reveals = Math.floor(totalEnergy / state.threshold);

  return {
    ...state,
    energy: totalEnergy % state.threshold,
    reveals,
  };
}

export function getDragonStage(energy: number, threshold: number): DragonStage {
  const progress = threshold > 0 ? energy / threshold : 0;

  if (progress >= 0.9) {
    return {
      label: "龙门开启",
      hint: "再来一点，龙门即将开启",
      tension: "critical",
    };
  }

  if (progress >= 0.7) {
    return {
      label: "龙影将现",
      hint: "龙影已经靠近",
      tension: "near",
    };
  }

  if (progress >= 0.35) {
    return {
      label: "龙气升温",
      hint: "龙气正在翻涌",
      tension: "warm",
    };
  }

  return {
    label: "龙池初醒",
    hint: "龙气在池底慢慢聚起",
    tension: "calm",
  };
}
