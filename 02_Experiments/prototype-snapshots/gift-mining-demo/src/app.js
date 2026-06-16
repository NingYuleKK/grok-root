import {
  applyThemeGift,
  createInitialState,
  digWithTool,
  redeemReward,
  rewardConfig,
  toolConfig,
} from "./gem-adventure.js";

let state = createInitialState();
let activeTab = "tools";
let flash = null;

const giftGroups = [
  {
    tool: "copper",
    price: 100,
    rule: "收/送任意 1 个铜锄主题礼物",
    gifts: [
      { name: "礼物A", visual: "鹿角杯", accent: "leaf" },
      { name: "礼物B", visual: "星矿灯", accent: "amber" },
      { name: "礼物C", visual: "探险旗", accent: "coral" },
    ],
  },
  {
    tool: "silver",
    price: 300,
    rule: "收/送任意 1 个银锄主题礼物",
    gifts: [
      { name: "礼物A", visual: "月贝", accent: "mist" },
      { name: "礼物B", visual: "银铃", accent: "blue" },
      { name: "礼物C", visual: "珍珠盒", accent: "pearl" },
    ],
  },
  {
    tool: "gold",
    price: 1000,
    rule: "收/送任意 1 个金锄主题礼物",
    gifts: [
      { name: "礼物A", visual: "金罗盘", accent: "gold" },
      { name: "礼物B", visual: "王冠灯", accent: "sun" },
      { name: "礼物C", visual: "宝藏箱", accent: "bronze" },
    ],
  },
  {
    tool: "diamond",
    price: "special",
    rule: "送出帝王套或完成每轮大满贯",
    gifts: [
      { name: "帝王套", visual: "王座", accent: "royal", value: "kingSet" },
      { name: "大满贯", visual: "满贯杯", accent: "aqua", value: "grandSlam" },
    ],
  },
];

const souvenirMeta = {
  crystal: { label: "水晶", className: "crystal" },
  pearl: { label: "珍珠", className: "pearl" },
  gold: { label: "黄金", className: "gold" },
  diamond: { label: "钻石", className: "diamond" },
};

const burstPieces = [
  [0, -62],
  [34, -50],
  [62, -18],
  [72, 14],
  [48, 48],
  [16, 64],
  [-18, 62],
  [-54, 42],
  [-72, 10],
  [-60, -24],
  [-32, -52],
  [22, -70],
];

function setFlash(message, kind = "ok") {
  flash = { message, kind };
  render();
  window.clearTimeout(setFlash.timer);
  setFlash.timer = window.setTimeout(() => {
    flash = null;
    render();
  }, 1500);
}

function safeAction(action) {
  try {
    state = action(state);
    render();
  } catch (error) {
    setFlash(error.message, "warn");
  }
}

function formatRequires(requires) {
  return Object.entries(requires)
    .map(([key, amount]) => `${souvenirMeta[key].label}x${amount}`)
    .join(" + ");
}

function renderToolTab() {
  return `
    <section class="tab-panel" aria-label="获得锄头">
      <div class="activity-rule">
        <span>获得锄头</span>
        <strong>每收/送一次指定礼物，即获得对应锄头一把</strong>
      </div>

      <div class="section-head">
        <h2>礼物清单</h2>
        <span>缩略图为原型占位</span>
      </div>

      <div class="tool-group-list">
        ${giftGroups
          .map(
            (group) => `
              <article class="tool-group-card">
                <header class="tool-group-head">
                  <div class="tool-title">
                    <span class="tool-badge ${group.tool}">${toolConfig[group.tool].label.slice(0, 1)}</span>
                    <div>
                      <strong>${toolConfig[group.tool].label}</strong>
                      <small>${group.rule}</small>
                    </div>
                  </div>
                  <em>x${state.tools[group.tool]}</em>
                </header>
                <div class="gift-thumb-grid">
                  ${group.gifts
                    .map(
                      (gift) => `
                        <article class="gift-thumb-card">
                          <div class="gift-thumb ${gift.accent}">
                            <i>${gift.visual.slice(0, 1)}</i>
                            <span>${gift.visual}</span>
                          </div>
                          <div class="gift-thumb-copy">
                            <strong>${gift.name}</strong>
                            <span>${group.price === "special" ? "特殊条件" : `${group.price}钻`}</span>
                          </div>
                          <div class="gift-actions">
                            <button data-action="gift" data-value="${gift.value ?? group.price}" data-name="${gift.name}" data-direction="send">送</button>
                            <button data-action="gift" data-value="${gift.value ?? group.price}" data-name="${gift.name}" data-direction="receive">收</button>
                          </div>
                        </article>
                      `,
                    )
                    .join("")}
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderMineTab() {
  const hasDig = Boolean(state.lastDig);
  const activeTool = state.lastDig?.tool ?? "copper";
  const activeSouvenir = state.lastDig?.souvenir ?? "crystal";

  return `
    <section class="tab-panel" aria-label="挖矿纪念品">
      <div class="mine-stage ${hasDig ? "is-digging" : ""}" data-dig-count="${state.digCount ?? 0}">
        ${
          hasDig
            ? `
              <div class="dig-hammer ${activeTool}" aria-hidden="true">
                <span></span>
              </div>
              <div class="dig-burst ${activeSouvenir}" aria-hidden="true">
                ${burstPieces
                  .map(
                    ([x, y], index) =>
                      `<i style="--piece-index: ${index}; --spark-x: ${x}px; --spark-y: ${y}px"></i>`,
                  )
                  .join("")}
              </div>
              <div class="dig-callout" aria-live="polite">
                <strong>挖挖挖</strong>
                <span>+1 ${souvenirMeta[activeSouvenir].label}</span>
              </div>
            `
            : ""
        }
        <div class="mine-vein" aria-hidden="true">
          ${Object.entries(toolConfig)
            .map(
              ([tool, config], index) => `
                <button class="ore-node ${tool} ${state.tools[tool] > 0 ? "ready" : ""} ${state.lastDig?.tool === tool ? "hit" : ""}" style="--node-index: ${index}" data-action="dig" data-tool="${tool}">
                  <span>${config.oreLabel}</span>
                </button>
              `,
            )
            .join("")}
        </div>
        <div class="mine-copy">
          <span>矿脉</span>
          <strong>${state.lastDig ? `刚挖出${souvenirMeta[state.lastDig.souvenir].label}` : "等待开采"}</strong>
        </div>
      </div>

      <div class="inventory-strip">
        ${Object.entries(toolConfig)
          .map(
            ([tool, config]) => `
              <button class="inventory-item" data-action="dig" data-tool="${tool}">
                <span class="tool-swatch ${tool}"></span>
                <strong>${config.label}</strong>
                <em>x${state.tools[tool]}</em>
              </button>
            `,
          )
          .join("")}
      </div>

      <div class="section-head">
        <h2>纪念品</h2>
        <span>用于兑换活动奖励</span>
      </div>

      <div class="souvenir-grid">
        ${Object.entries(souvenirMeta)
          .map(
            ([id, item]) => `
              <div class="souvenir ${item.className}">
                <span></span>
                <strong>${item.label}</strong>
                <em>x${state.souvenirs[id]}</em>
              </div>
            `,
          )
          .join("")}
      </div>

      <div class="section-head">
        <h2>兑换</h2>
        <span>座驾与首饰礼物</span>
      </div>

      <div class="reward-list">
        ${Object.entries(rewardConfig)
          .map(
            ([id, reward]) => `
              <article class="reward-row">
                <div>
                  <strong>${reward.label}</strong>
                  <span>${reward.note}</span>
                  <small>${formatRequires(reward.requires)}</small>
                </div>
                <button data-action="redeem" data-reward="${id}">兑</button>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderTimeline() {
  const items =
    state.timeline.length > 0
      ? state.timeline
      : [{ id: "empty", title: "活动开启", body: "3-5 宝石大冒险" }];

  return `
    <section class="timeline" aria-label="事件流">
      ${items
        .map(
          (item) => `
            <p>
              <strong>${item.title}</strong>
              <span>${item.body}</span>
            </p>
          `,
        )
        .join("")}
    </section>
  `;
}

function render() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="phone-shell">
      <header class="hero">
        <div class="hero-visual" aria-hidden="true">
          <div class="gem-piece gem-a"></div>
          <div class="gem-piece gem-b"></div>
          <div class="gem-piece gem-c"></div>
        </div>
        <div class="hero-copy">
          <span>3-5</span>
          <h1>礼物探险季<br />宝石大冒险</h1>
          <p>主题礼物产锄头，开采矿脉兑纪念奖励</p>
        </div>
      </header>

      <nav class="tabs" aria-label="活动分区">
        <button class="${activeTab === "tools" ? "active" : ""}" data-tab="tools">获得锄头</button>
        <button class="${activeTab === "mine" ? "active" : ""}" data-tab="mine">挖矿纪念品</button>
      </nav>

      ${activeTab === "tools" ? renderToolTab() : renderMineTab()}

      <section class="summary-bar" aria-label="当前库存">
        <span>锄头 ${Object.values(state.tools).reduce((sum, value) => sum + value, 0)}</span>
        <span>纪念品 ${Object.values(state.souvenirs).reduce((sum, value) => sum + value, 0)}</span>
        <span>兑换 ${Object.values(state.redeemed).reduce((sum, value) => sum + value, 0)}</span>
      </section>

      ${renderTimeline()}

      ${flash ? `<div class="toast ${flash.kind}">${flash.message}</div>` : ""}
    </div>
  `;
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  if (target.dataset.tab) {
    activeTab = target.dataset.tab;
    render();
    return;
  }

  if (target.dataset.action === "gift") {
    const rawValue = target.dataset.value;
    const parsedValue = Number(rawValue);
    const value = Number.isNaN(parsedValue) ? rawValue : parsedValue;
    safeAction((current) =>
      applyThemeGift(current, {
        diamondValue: value,
        direction: target.dataset.direction,
        giftName: target.dataset.name,
      }),
    );
    return;
  }

  if (target.dataset.action === "dig") {
    safeAction((current) => digWithTool(current, target.dataset.tool));
    return;
  }

  if (target.dataset.action === "redeem") {
    safeAction((current) => redeemReward(current, target.dataset.reward));
  }
});

render();
