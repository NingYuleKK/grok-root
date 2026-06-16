import { useMemo, useState } from "react";
import { applyGiftToPool, getDragonStage } from "./dragonPool";

type Gift = {
  name: string;
  dragonEnergy: number;
  sender: string;
  tone: string;
};

type ChatMessage = {
  id: number;
  kind: "gift" | "system" | "reveal";
  text: string;
};

type RevealEvent = {
  id: number;
  type: "sugar" | "banner" | "float" | "dragon";
  title: string;
  body: string;
};

const threshold = 100;

const gifts: Gift[] = [
  { name: "小糖果", dragonEnergy: 5, sender: "老板青柚", tone: "甜蜜" },
  { name: "金玫瑰", dragonEnergy: 15, sender: "老板阿川", tone: "升温" },
  { name: "CP祝福", dragonEnergy: 25, sender: "Litch", tone: "合力" },
  { name: "老板点火", dragonEnergy: 40, sender: "老板山海", tone: "高燃" },
];

const relationships = [
  { userA: "老板阿川", userB: "主播小鹿", type: "CP" },
  { userA: "老板青山", userB: "主播眠眠", type: "挚友" },
  { userA: "Litch", userB: "Root", type: "CP" },
];

const revealEvents: Omit<RevealEvent, "id">[] = [
  {
    type: "sugar",
    title: "龙池撒糖",
    body: "全房间掉落甜蜜糖果",
  },
  {
    type: "banner",
    title: "龙影现世",
    body: "本房间进入高燃时刻",
  },
  {
    type: "float",
    title: "轻飘屏",
    body: "老板阿川点亮龙池，今晚龙影降临",
  },
  {
    type: "dragon",
    title: "龙门开启",
    body: "龙影穿过房间，全员见证显影",
  },
];

const initialMessages: ChatMessage[] = [
  { id: 1, kind: "system", text: "遇音阁 · 龙池试炼夜已开启" },
  { id: 2, kind: "system", text: "房间目标：一起把龙池点亮" },
  { id: 3, kind: "gift", text: "主播小鹿：今晚龙影会不会来，就看大家了" },
];

const roomUsers = ["阿川", "青山", "Litch", "Root", "眠眠", "山海", "青柚", "小鹿"];

function App() {
  const [energy, setEnergy] = useState(0);
  const [heat, setHeat] = useState(12860);
  const [online, setOnline] = useState(286);
  const [lightUps, setLightUps] = useState(0);
  const [messages, setMessages] = useState(initialMessages);
  const [activeReveal, setActiveReveal] = useState<RevealEvent | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  const stage = getDragonStage(energy, threshold);
  const progress = Math.min(100, Math.round((energy / threshold) * 100));
  const missingEnergy = threshold - energy;

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${(index * 17) % 100}%`,
        delay: `${(index % 9) * 0.11}s`,
        duration: `${1.8 + (index % 5) * 0.18}s`,
      })),
    [],
  );

  function pushMessage(kind: ChatMessage["kind"], text: string) {
    setMessages((current) => [{ id: Date.now() + Math.random(), kind, text }, ...current].slice(0, 10));
  }

  function pickRelationship() {
    return relationships[Math.floor(Math.random() * relationships.length)];
  }

  function triggerReveal(nextLightUps: number) {
    const reveal = revealEvents[Math.floor(Math.random() * revealEvents.length)];
    const event = { ...reveal, id: Date.now() };
    setActiveReveal(event);
    setLightUps(nextLightUps);
    setHeat((current) => current + 980 + Math.floor(Math.random() * 320));
    setOnline((current) => current + 4 + Math.floor(Math.random() * 8));
    pushMessage("reveal", `第 ${nextLightUps} 次点亮：${event.title}！${event.body}`);
    setTimeout(() => setActiveReveal(null), 2600);
  }

  function sendGift(gift: Gift) {
    const result = applyGiftToPool({ energy, threshold }, gift.dragonEnergy);
    setEnergy(result.energy);
    setPulseKey((current) => current + 1);
    setHeat((current) => current + gift.dragonEnergy * 18);
    setOnline((current) => current + (gift.dragonEnergy >= 25 ? 1 : 0));

    if (gift.name === "CP祝福") {
      const relation = pickRelationship();
      pushMessage(
        "gift",
        `${relation.userA} 与 ${relation.userB} 的 ${relation.type} 祝福为龙池注入 +${gift.dragonEnergy} 龙气`,
      );
    } else {
      pushMessage("gift", `${gift.sender}送出${gift.name}，龙气 +${gift.dragonEnergy}`);
    }

    if (result.reveals > 0) {
      triggerReveal(lightUps + result.reveals);
    } else if (threshold - result.energy <= 20) {
      pushMessage("system", `全房间还差 ${threshold - result.energy} 龙气，龙影已经压到门口`);
    }
  }

  return (
    <main className={`app-shell tension-${stage.tension}`}>
      <section className="room-stage" aria-label="语音房间">
        <div className="ambient-orbit" />
        <header className="room-header">
          <div>
            <p className="eyebrow">Pico 语音房互动原型</p>
            <h1>遇音阁 · 龙池试炼夜</h1>
          </div>
          <div className="room-stats" aria-label="房间数据">
            <span>{online} 在线</span>
            <span>{heat.toLocaleString()} 热度</span>
          </div>
        </header>

        <div className="content-grid">
          <section className="host-panel">
            <div className="host-aura" />
            <div className="host-avatar">鹿</div>
            <div>
              <p className="panel-label">当前麦位</p>
              <h2>主播小鹿</h2>
              <p>夜场治愈局 · 甜蜜撒糖中</p>
            </div>
            <div className="boss-row" aria-label="当前在场用户">
              {roomUsers.map((user) => (
                <div className="boss-avatar" title={user} key={user}>
                  {user.slice(0, 1)}
                </div>
              ))}
            </div>
          </section>

          <section className="dragon-card" aria-label="龙池进度">
            <div className="dragon-visual" aria-hidden="true">
              <div className="moon" />
              <div className="dragon-shadow">龍</div>
              <div className="pool-glow" />
            </div>

            <div className="pool-copy">
              <p className="panel-label">房间龙池</p>
              <h2>{stage.label}</h2>
              <p>{stage.hint}</p>
            </div>

            <div className="energy-readout">
              <strong>{energy}</strong>
              <span>/ {threshold} 龙气</span>
            </div>

            <div className="progress-shell" data-pulse={pulseKey}>
              <div className="progress-bar" style={{ width: `${progress}%` }} />
              <div className="progress-sheen" />
            </div>

            <div className="pool-footer">
              <span>距离下一次显影还差 {missingEnergy} 龙气</span>
              <span>第 {lightUps} 次点亮</span>
            </div>
          </section>

          <section className="chat-panel" aria-label="公屏消息">
            <div className="section-title">
              <h2>公屏</h2>
              <span>共同点亮记录</span>
            </div>
            <div className="chat-list">
              {messages.map((message) => (
                <p className={`chat-line ${message.kind}`} key={message.id}>
                  {message.text}
                </p>
              ))}
            </div>
          </section>

          <section className="gift-panel" aria-label="礼物按钮">
            <div className="section-title">
              <h2>送礼注入龙气</h2>
              <span>只模拟互动，不含支付</span>
            </div>
            <div className="gift-grid">
              {gifts.map((gift) => (
                <button className="gift-button" type="button" onClick={() => sendGift(gift)} key={gift.name}>
                  <span className="gift-tone">{gift.tone}</span>
                  <strong>{gift.name}</strong>
                  <span>+{gift.dragonEnergy} 龙气</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {activeReveal && (
          <aside className={`reveal-event ${activeReveal.type}`} aria-live="polite">
            <div className="reveal-beam" />
            <p>第 {lightUps} 次点亮</p>
            <h2>{activeReveal.title}</h2>
            <span>{activeReveal.body}</span>
          </aside>
        )}

        {activeReveal && (
          <div className="particle-layer" aria-hidden="true">
            {particles.map((particle) => (
              <span
                key={particle.id}
                style={{
                  left: particle.left,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
