export function createInitialState() {
  return {
    tools: { copper: 0, silver: 0, gold: 0, diamond: 0 },
    souvenirs: { crystal: 0, pearl: 0, gold: 0, diamond: 0 },
    redeemed: {},
    timeline: [],
    lastDig: null,
    digCount: 0,
  };
}

const giftToolMap = {
  100: "copper",
  300: "silver",
  1000: "gold",
};

export const toolConfig = {
  copper: {
    label: "铜锄",
    souvenir: "crystal",
    color: "#b76d3f",
    oreLabel: "水晶",
  },
  silver: {
    label: "银锄",
    souvenir: "pearl",
    color: "#8fa3b8",
    oreLabel: "珍珠",
  },
  gold: {
    label: "金锄",
    souvenir: "gold",
    color: "#d7a531",
    oreLabel: "黄金",
  },
  diamond: {
    label: "金刚锄",
    souvenir: "diamond",
    color: "#49abc1",
    oreLabel: "钻石",
  },
};

export const rewardConfig = {
  bubble: {
    label: "发言气泡",
    note: "水晶兑换，适合作为低门槛回收",
    requires: { crystal: 2 },
  },
  smallRide: {
    label: "小座驾",
    note: "珍珠兑换，房间可见的小炫耀",
    requires: { pearl: 2 },
  },
  grandRide: {
    label: "大座驾",
    note: "黄金兑换，适合榜一/房主目标",
    requires: { gold: 2 },
  },
  cpRide: {
    label: "对话 CP 座驾",
    note: "钻石兑换，强 CP 关系牌面奖励",
    requires: { diamond: 1 },
  },
  jewelryA: {
    label: "首饰礼物 A",
    note: "低价但牌面高，组合兑换",
    requires: { crystal: 2, pearl: 1 },
  },
  jewelryB: {
    label: "首饰礼物 B",
    note: "组合兑换，给送礼双方制造纪念",
    requires: { pearl: 1, gold: 1 },
  },
  jewelryC: {
    label: "首饰礼物 C",
    note: "高光组合款，适合活动收尾",
    requires: { crystal: 1, gold: 1, diamond: 1 },
  },
};

function cloneState(state) {
  return {
    ...state,
    tools: { ...state.tools },
    souvenirs: { ...state.souvenirs },
    redeemed: { ...state.redeemed },
    timeline: [...state.timeline],
    lastDig: state.lastDig ? { ...state.lastDig } : null,
    digCount: state.digCount ?? 0,
  };
}

function pushTimeline(state, title, body) {
  return {
    ...state,
    timeline: [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title,
        body,
      },
      ...state.timeline,
    ].slice(0, 8),
  };
}

export function applyThemeGift(state, gift) {
  const next = cloneState(state);

  if (gift.diamondValue === "grandSlam" || gift.diamondValue === "kingSet") {
    next.tools.diamond += 1;
    const source = gift.diamondValue === "kingSet" ? "帝王套" : "每轮大满贯";
    return pushTimeline(
      next,
      "金刚锄入账",
      `${gift.direction === "receive" ? "收到" : "送出"}${source}，获得金刚锄 x1`,
    );
  }

  const tool = giftToolMap[gift.diamondValue];
  if (!tool) {
    throw new Error("不支持的主题礼物档位");
  }

  const giftName = gift.giftName ?? `${gift.diamondValue}钻主题礼物`;
  next.tools[tool] += 1;

  return pushTimeline(
    next,
    `${toolConfig[tool].label}入账`,
    `${gift.direction === "receive" ? "收到" : "送出"}${giftName}，获得${toolConfig[tool].label} x1`,
  );
}

export function digWithTool(state, tool) {
  if (!toolConfig[tool]) {
    throw new Error("未知锄头");
  }

  if (state.tools[tool] <= 0) {
    throw new Error("锄头不足");
  }

  const next = cloneState(state);
  const souvenir = toolConfig[tool].souvenir;
  next.tools[tool] -= 1;
  next.souvenirs[souvenir] += 1;
  next.lastDig = { tool, souvenir };
  next.digCount += 1;

  return pushTimeline(
    next,
    `挖出${toolConfig[tool].oreLabel}`,
    `消耗${toolConfig[tool].label} x1，获得${toolConfig[tool].oreLabel} x1`,
  );
}

export function redeemReward(state, rewardId) {
  const reward = rewardConfig[rewardId];

  if (!reward) {
    throw new Error("未知奖励");
  }

  for (const [souvenir, amount] of Object.entries(reward.requires)) {
    if ((state.souvenirs[souvenir] ?? 0) < amount) {
      throw new Error("纪念品不足");
    }
  }

  const next = cloneState(state);
  for (const [souvenir, amount] of Object.entries(reward.requires)) {
    next.souvenirs[souvenir] -= amount;
  }
  next.redeemed[rewardId] = (next.redeemed[rewardId] ?? 0) + 1;

  return pushTimeline(next, "兑换成功", `获得${reward.label} x1`);
}
