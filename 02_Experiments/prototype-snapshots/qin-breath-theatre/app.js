const $ = (id) => document.getElementById(id);

const canvas = $("stage");
const ctx = canvas.getContext("2d");
const stringButtons = [...document.querySelectorAll("#stringKeys button")];

const HAN_STRINGS = ["一", "二", "三", "四", "五", "六", "七"];
const HUI_MARKS = [13, 12, 10, 9, 8, 7.6, 7, 6.4, 6, 5, 4, 3, 2];
const HUI_NAMES = {
  13: "十三",
  12: "十二",
  10: "十",
  10.8: "十徽八",
  9: "九",
  8: "八",
  7.6: "七六",
  7: "七",
  6.4: "六四",
  6: "六",
  5: "五",
  4: "四",
  3: "三",
  2: "二",
};

const COLORS = {
  paper: "#efe7d2",
  mist: "#9fb9bc",
  jade: "#68b19b",
  cinnabar: "#c65f46",
  gold: "#d6b461",
  ink: "#101417",
};

const MODES = {
  follow: { label: "随", auto: false, score: true, window: 0.64 },
  listen: { label: "听", auto: true, score: false, window: 0.7 },
  pu: { label: "谱", auto: false, score: true, window: 0.68 },
};

const pieces = {
  xianweng: {
    title: "仙翁操",
    subtitle: "仙 翁 得道",
    duration: 36,
    followWindow: 0.86,
    tuning: [196, 220, 261.63, 293.66, 329.63, 392, 440],
    cues: [
      cue(1.6, "san", 6, 7.6, "仙", "散七", ["右手", "散音", "七弦", "仙"], "仙", "熟悉的第一声，按住半息再松"),
      cue(3.9, "an", 3, 9, "翁", "按九四", ["左按", "九徽", "四弦", "翁"], "翁", "同一个音色换到按音"),
      cue(6.3, "san", 6, 7.6, "仙", "散七", ["右手", "散音", "七弦", "仙"], "仙", "再听一遍开弦"),
      cue(8.6, "an", 3, 9, "翁", "按九四", ["左按", "九徽", "四弦", "翁"], "翁", "不要追，等它落下"),
      cue(11.1, "san", 5, 7.6, "得", "散六", ["右手", "散音", "六弦", "得"], "得道", "两个字当一口气"),
      cue(13.3, "an", 2, 9, "道", "按九三", ["左按", "九徽", "三弦", "道"], "道", "这一声稍稍收住"),
      cue(16.0, "san", 6, 7.6, "仙", "散七", ["右手", "散音", "七弦", "仙"], "仙", "回到开头的仙"),
      cue(18.2, "an", 3, 9, "翁", "按九四", ["左按", "九徽", "四弦", "翁"], "翁", "听开弦和按音的和"),
      cue(21.0, "slide", 3, 9, "陈", "九四绰至七六", ["四弦", "九徽", "至七六", "绰"], "陈抟", "这一下像名字拐了个弯"),
      cue(23.8, "san", 4, 7.6, "得", "散五", ["右手", "散音", "五弦", "得"], "得道", "别急着补下一声"),
      cue(26.2, "an", 1, 10, "仙", "按十二", ["左按", "十徽", "二弦", "仙"], "仙", "第二段换一个落点"),
      cue(28.6, "an", 2, 10.8, "翁", "按十徽八三", ["左按", "十徽八", "三弦", "翁"], "翁", "听见按音的颜色"),
      cue(31.4, "san", 6, 7.6, "仙", "散七", ["右手", "散音", "七弦", "仙"], "仙", "回到最熟的入口"),
      cue(33.8, "an", 3, 9, "翁", "按九四", ["左按", "九徽", "四弦", "翁"], "翁", "最后一声留白"),
    ],
  },
  enterMountain: {
    title: "一弦入山",
    subtitle: "散 泛 按 走",
    duration: 22,
    tuning: [196, 220, 261.63, 293.66, 329.63, 392, 440],
    cues: [
      cue(1.4, "san", 0, 7.6, "拨", "散一", ["右手", "散音", "一弦", "候"], "拨一弦", "等一息，松开让它自己响"),
      cue(4.2, "fan", 3, 7, "清", "泛七四", ["轻触", "七徽", "四弦", "清"], "听见泛音", "系统替你轻触七徽"),
      cue(7.2, "an", 2, 7.6, "按", "按七六三", ["左按", "七六", "三弦", "稳"], "落到三弦", "手不必多，气要落"),
      cue(10.0, "slide", 2, 7.6, "走", "上七六至六四", ["三弦", "七六", "至六四", "余"], "让音走远", "松开后听滑音走完"),
      cue(13.4, "san", 4, 7.6, "开", "散五", ["右手", "散音", "五弦", "开"], "拨五弦", "别急着补第二声"),
      cue(16.4, "slide", 3, 7, "吟", "按七四吟", ["四弦", "七徽", "微动", "息"], "轻轻一回", "像把余音扶住"),
      cue(19.2, "fan", 0, 7, "归", "泛七一", ["轻触", "七徽", "一弦", "归"], "收回一弦", "这一声留在弦外"),
    ],
  },
  clearNight: {
    title: "良宵影",
    subtitle: "轻句 慢收",
    duration: 24,
    tuning: [196, 220, 261.63, 293.66, 329.63, 392, 440],
    cues: [
      cue(1.2, "fan", 4, 7, "月", "泛七五", ["轻触", "七徽", "五弦", "月"], "听见月色", "第一声只要清"),
      cue(4.1, "san", 2, 7.6, "远", "散三", ["右手", "散音", "三弦", "远"], "拨三弦", "声音出去，人留住"),
      cue(7.0, "slide", 2, 8, "缓", "下八至九", ["三弦", "八徽", "至九", "缓"], "向远处滑", "让线条慢一点"),
      cue(10.8, "san", 5, 7.6, "明", "散六", ["右手", "散音", "六弦", "明"], "拨六弦", "这一声更亮"),
      cue(14.0, "an", 3, 6.4, "定", "按六四四", ["左按", "六四", "四弦", "定"], "落到四弦", "不要追，先定住"),
      cue(17.6, "slide", 3, 6.4, "温", "六四猱", ["四弦", "六四", "小回", "温"], "轻轻回旋", "余音里有一点温"),
      cue(21.0, "fan", 1, 7, "收", "泛七二", ["轻触", "七徽", "二弦", "收"], "收回二弦", "最后不要补"),
    ],
  },
};

function cue(t, action, string, hui, glyph, pu, parts, plain, breath) {
  return { t, action, string, hui, glyph, pu, parts, plain, breath, hit: false, quality: null };
}

const state = {
  piece: "xianweng",
  mode: "follow",
  playing: false,
  audio: null,
  master: null,
  startAt: 0,
  wallStart: 0,
  raf: 0,
  W: 0,
  H: 0,
  DPR: 1,
  selectedString: 0,
  leftHui: 7.6,
  targetHui: 7.6,
  handX: 0,
  stringY: [],
  huiX: new Map(),
  ripples: [],
  notes: [],
  trail: [],
  dragging: false,
  lastActionAt: -10,
  qi: 86,
  counts: { clear: 0, stable: 0, rough: 0, floating: 0, deep: 0, broken: 0 },
  recent: [],
  autoplayIndex: 0,
  ended: false,
  spaceDownAt: null,
  lastBreathHold: 0,
};

window.QBT = state;

function initAudio() {
  if (state.audio) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  state.audio = new AudioCtx();
  state.master = state.audio.createGain();
  state.master.gain.value = 0.72;

  const delay = state.audio.createDelay();
  const fb = state.audio.createGain();
  const wet = state.audio.createGain();
  const comp = state.audio.createDynamicsCompressor();

  delay.delayTime.value = 0.18;
  fb.gain.value = 0.22;
  wet.gain.value = 0.18;
  delay.connect(fb);
  fb.connect(delay);
  delay.connect(wet);
  state.master.connect(delay);
  state.master.connect(comp);
  wet.connect(comp);
  comp.connect(state.audio.destination);
}

function now() {
  if (state.audio && state.audio.state === "running") return state.audio.currentTime - state.startAt;
  return performance.now() / 1000 - state.wallStart;
}

function qinFreq(stringIndex, hui = 7.6, type = "san") {
  const base = pieces[state.piece].tuning[stringIndex];
  if (type === "fan") return base * 2;
  if (type === "an" || type === "slide") {
    const offset = (7.6 - hui) * 0.11;
    return base * Math.pow(2, offset);
  }
  return base;
}

function pluck(stringIndex, hui = state.leftHui, type = "san", velocity = 0.84) {
  initAudio();
  if (state.audio.state === "suspended") state.audio.resume();
  const t = state.audio.currentTime + 0.006;
  const f = qinFreq(stringIndex, hui, type);
  const dur = type === "fan" ? 2.1 : type === "slide" ? 3.3 : 2.6;

  const body = state.audio.createOscillator();
  const shine = state.audio.createOscillator();
  const breath = state.audio.createBufferSource();
  const noise = state.audio.createBuffer(1, state.audio.sampleRate * 0.16, state.audio.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  breath.buffer = noise;

  const g = state.audio.createGain();
  const ng = state.audio.createGain();
  const lp = state.audio.createBiquadFilter();
  const pan = state.audio.createStereoPanner();
  body.type = "triangle";
  shine.type = "sine";
  body.frequency.setValueAtTime(f, t);
  shine.frequency.setValueAtTime(type === "fan" ? f * 2.01 : f * 1.505, t);
  shine.detune.setValueAtTime(type === "fan" ? 4 : -7, t);
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(type === "fan" ? 5200 : 2400, t);
  lp.frequency.exponentialRampToValueAtTime(type === "fan" ? 1800 : 620, t + dur);
  pan.pan.value = (stringIndex - 3) / 5;

  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(velocity * (type === "fan" ? 0.18 : 0.28), t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
  ng.gain.setValueAtTime(velocity * 0.06, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

  body.connect(g);
  shine.connect(g);
  breath.connect(ng);
  ng.connect(lp);
  g.connect(lp);
  lp.connect(pan);
  pan.connect(state.master);

  body.start(t);
  shine.start(t);
  breath.start(t);
  body.stop(t + dur + 0.05);
  shine.stop(t + dur + 0.05);
  breath.stop(t + 0.2);

  state.ripples.push({ stringIndex, hui, type, born: performance.now(), life: dur * 1000 });
  state.notes.push({ stringIndex, hui, type, born: performance.now(), life: dur * 1000 });
}

function bendSlide(fromHui, toHui, stringIndex) {
  initAudio();
  const t = state.audio.currentTime + 0.006;
  const f1 = qinFreq(stringIndex, fromHui, "slide");
  const f2 = qinFreq(stringIndex, toHui, "slide");
  const osc = state.audio.createOscillator();
  const g = state.audio.createGain();
  const lp = state.audio.createBiquadFilter();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(f1, t);
  osc.frequency.exponentialRampToValueAtTime(f2, t + 1.1);
  osc.frequency.linearRampToValueAtTime(f2 * 0.998, t + 1.75);
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(2100, t);
  lp.frequency.exponentialRampToValueAtTime(560, t + 2.4);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.24, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0006, t + 2.55);
  osc.connect(g);
  g.connect(lp);
  lp.connect(state.master);
  osc.start(t);
  osc.stop(t + 2.7);
  state.targetHui = toHui;
  state.trail.push({ stringIndex, fromHui, toHui, born: performance.now(), life: 1800 });
}

function resize() {
  const r = canvas.getBoundingClientRect();
  state.DPR = Math.min(2, window.devicePixelRatio || 1);
  state.W = r.width;
  state.H = r.height;
  canvas.width = Math.max(1, state.W * state.DPR);
  canvas.height = Math.max(1, state.H * state.DPR);
  ctx.setTransform(state.DPR, 0, 0, state.DPR, 0, 0);
  mapQin();
  draw();
}

function mapQin() {
  const left = state.W * 0.09;
  const right = state.W * 0.92;
  state.huiX.clear();
  HUI_MARKS.forEach((hui, i) => {
    const ratio = i / (HUI_MARKS.length - 1);
    state.huiX.set(hui, right - ratio * (right - left));
  });
  const top = state.H * 0.48;
  const gap = Math.min(28, state.H * 0.048);
  state.stringY = Array.from({ length: 7 }, (_, i) => top + (i - 3) * gap);
  state.handX = huiToX(state.leftHui);
}

function huiToX(hui) {
  const marks = [...state.huiX.keys()].sort((a, b) => a - b);
  let nearest = marks[0];
  for (const mark of marks) {
    if (Math.abs(mark - hui) < Math.abs(nearest - hui)) nearest = mark;
  }
  if (state.huiX.has(hui)) return state.huiX.get(hui);
  const lower = marks.filter((m) => m <= hui).at(-1) ?? marks[0];
  const upper = marks.find((m) => m >= hui) ?? marks.at(-1);
  const x1 = state.huiX.get(lower);
  const x2 = state.huiX.get(upper);
  if (lower === upper) return x1;
  return x1 + ((hui - lower) / (upper - lower)) * (x2 - x1);
}

function xToHui(x) {
  let best = HUI_MARKS[0];
  for (const hui of HUI_MARKS) {
    if (Math.abs(huiToX(hui) - x) < Math.abs(huiToX(best) - x)) best = hui;
  }
  return best;
}

function draw() {
  ctx.clearRect(0, 0, state.W, state.H);
  drawMountains();
  drawQinBody();
  drawCues();
  drawStrings();
  drawHand();
  drawInk();
}

function drawMountains() {
  const t = state.playing ? now() : 0;
  ctx.save();
  ctx.fillStyle = "rgba(159,185,188,0.06)";
  for (let layer = 0; layer < 3; layer += 1) {
    ctx.beginPath();
    const base = state.H * (0.22 + layer * 0.08);
    ctx.moveTo(0, base + 120);
    for (let x = -30; x <= state.W + 30; x += 80) {
      const y = base + Math.sin(x * 0.012 + t * 0.16 + layer) * 26 + Math.cos(x * 0.02 + layer) * 18;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(state.W, state.H);
    ctx.lineTo(0, state.H);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawQinBody() {
  const x = state.W * 0.07;
  const y = state.H * 0.38;
  const w = state.W * 0.87;
  const h = state.H * 0.28;
  const r = Math.min(30, h * 0.18);
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, "#3a201b");
  grad.addColorStop(0.38, "#70422e");
  grad.addColorStop(0.68, "#291a18");
  grad.addColorStop(1, "#8a5138");
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 16;
  roundPath(x, y, w, h, r);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.clip();
  for (let i = 0; i < 24; i += 1) {
    ctx.strokeStyle = `rgba(239,231,210,${0.025 + (i % 4) * 0.01})`;
    ctx.beginPath();
    const yy = y + (i / 24) * h + Math.sin(i) * 5;
    ctx.moveTo(x + 20, yy);
    ctx.bezierCurveTo(x + w * 0.3, yy - 22, x + w * 0.66, yy + 20, x + w - 24, yy - 6);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(214,180,97,0.8)";
  HUI_MARKS.forEach((hui, i) => {
    const hx = state.huiX.get(hui);
    const radius = i === 6 ? 4.1 : 3.1;
    ctx.beginPath();
    ctx.arc(hx, y + h * 0.19, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawStrings() {
  const left = state.W * 0.105;
  const right = state.W * 0.895;
  const t = performance.now();
  state.stringY.forEach((y, i) => {
    const active = i === state.selectedString;
    const pulse = state.ripples.some((r) => r.stringIndex === i && t - r.born < r.life);
    ctx.strokeStyle = active ? "rgba(239,231,210,0.92)" : "rgba(239,231,210,0.54)";
    ctx.lineWidth = active ? 1.8 : 1.1;
    ctx.beginPath();
    for (let x = left; x <= right; x += 18) {
      const wave = pulse ? Math.sin((x + t * 0.42) * 0.08) * 1.8 : 0;
      if (x === left) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  });
}

function drawCues() {
  if (!state.playing) return;
  const t = now();
  const chart = pieces[state.piece].cues;
  chart.forEach((c) => {
    const dt = c.t - t;
    if (dt < -1.0 || dt > 4.2) return;
    const y = state.stringY[c.string];
    const x = huiToX(c.hui) - dt * 95;
    const alpha = Math.max(0, Math.min(1, 1 - Math.abs(dt) / 4.2));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = c.hit ? "rgba(104,177,155,0.8)" : "rgba(214,180,97,0.88)";
    ctx.fillStyle = c.hit ? "rgba(104,177,155,0.28)" : "rgba(214,180,97,0.2)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(x, y, c.action === "slide" ? 17 : 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (c.action === "slide") {
      const to = slideTarget(c);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(huiToX(to) - dt * 95, y - 8);
      ctx.stroke();
    }
    ctx.fillStyle = COLORS.paper;
    ctx.font = "18px ui-serif, Songti SC, serif";
    ctx.textAlign = "center";
    ctx.fillText(c.glyph, x, y - 24);
    ctx.restore();
  });
}

function drawHand() {
  const x = state.handX + (huiToX(state.targetHui) - state.handX) * 0.08;
  state.handX = x;
  const y = state.stringY[state.selectedString] || state.H * 0.5;
  ctx.save();
  ctx.strokeStyle = "rgba(104,177,155,0.84)";
  ctx.fillStyle = "rgba(104,177,155,0.22)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y - 28);
  ctx.lineTo(x, y + 28);
  ctx.strokeStyle = "rgba(104,177,155,0.4)";
  ctx.stroke();
  ctx.restore();
}

function drawInk() {
  const t = performance.now();
  state.notes = state.notes.filter((n) => t - n.born < n.life);
  state.trail = state.trail.filter((n) => t - n.born < n.life);
  ctx.save();
  state.notes.forEach((n) => {
    const p = (t - n.born) / n.life;
    const x = huiToX(n.hui);
    const y = state.stringY[n.stringIndex];
    ctx.globalAlpha = (1 - p) * 0.48;
    ctx.strokeStyle = n.type === "fan" ? COLORS.gold : COLORS.mist;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 28 + p * 96, 0, Math.PI * 2);
    ctx.stroke();
  });
  state.trail.forEach((tr) => {
    const p = (t - tr.born) / tr.life;
    const y = state.stringY[tr.stringIndex];
    const x1 = huiToX(tr.fromHui);
    const x2 = huiToX(tr.toHui);
    ctx.globalAlpha = (1 - p) * 0.7;
    ctx.strokeStyle = COLORS.jade;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.bezierCurveTo((x1 + x2) / 2, y - 34, (x1 + x2) / 2, y + 18, x2, y - 2);
    ctx.stroke();
  });
  ctx.restore();
  state.ripples = state.ripples.filter((r) => t - r.born < r.life);
}

function roundPath(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function loop() {
  if (state.playing) {
    const t = now();
    const piece = pieces[state.piece];
    updateCuePanel(t);
    if (MODES[state.mode].auto) runAutoplay(t);
    updateQi(t);
    if (t > piece.duration && !state.ended) finish();
  }
  draw();
  state.raf = requestAnimationFrame(loop);
}

function updateCuePanel(t) {
  const cues = pieces[state.piece].cues;
  const next = cues.find((c) => !c.hit && c.t > t - 0.85) || cues[cues.length - 1];
  if (state.mode !== "pu") primeCue(next);
  $("cueGlyph").textContent = state.mode === "pu" ? next.glyph : breathGlyph(next);
  $("cueTitle").textContent = state.mode === "pu" ? next.pu : next.plain;
  $("cueSub").textContent = state.mode === "pu"
    ? `${HAN_STRINGS[next.string]}弦 · ${HUI_NAMES[next.hui] || next.hui}徽`
    : next.breath;
  $("puGlyph").textContent = next.pu;
  $("puBreakdown").innerHTML = next.parts.map((p) => `<span>${p}</span>`).join("");
}

function breathGlyph(cueItem) {
  if (!state.playing) return "候";
  return cueItem.action === "fan" ? "清" : cueItem.action === "slide" ? "余" : cueItem.glyph;
}

function primeCue(cueItem) {
  state.selectedString = cueItem.string;
  state.leftHui = cueItem.hui;
  state.targetHui = cueItem.hui;
  updateHandReads();
}

function runAutoplay(t) {
  const cues = pieces[state.piece].cues;
  while (state.autoplayIndex < cues.length && t >= cues[state.autoplayIndex].t) {
    const c = cues[state.autoplayIndex];
    performCue(c, true);
    c.hit = true;
    c.quality = "清";
    state.autoplayIndex += 1;
  }
}

function performCue(c, auto = false) {
  state.selectedString = c.string;
  state.leftHui = c.hui;
  state.targetHui = c.hui;
  updateHandReads();
  if (c.action === "slide") {
    const to = slideTarget(c);
    pluck(c.string, c.hui, "slide", auto ? 0.66 : 0.82);
    bendSlide(c.hui, to, c.string);
    state.leftHui = to;
    state.targetHui = to;
  } else {
    pluck(c.string, c.hui, c.action, auto ? 0.6 : 0.86);
  }
}

function slideTarget(c) {
  if (c.pu.includes("七六")) return 7.6;
  if (c.pu.includes("六四")) return 6.4;
  if (c.pu.includes("至九")) return 9;
  return c.hui + 0.4;
}

function updateQi(t) {
  const meter = $("breathMeter").firstElementChild;
  const decay = state.recent.filter((x) => t - x < 2.8).length;
  if (decay > 3) state.qi = Math.max(0, state.qi - 0.08 * decay);
  else state.qi = Math.min(100, state.qi + 0.018);
  meter.style.transform = `scaleX(${Math.max(0.05, state.qi / 100)})`;
  meter.style.opacity = `${0.35 + state.qi / 155}`;
  $("stillRead").textContent = state.qi > 82 ? "静" : state.qi > 54 ? "行" : "躁";
}

function userAction(action) {
  if (!state.playing) return;
  const t = now();
  state.recent.push(t);
  state.recent = state.recent.slice(-8);
  state.lastActionAt = t;
  if (state.mode === "follow") {
    const best = findBestCue(t, MODES[state.mode].window);
    if (best) performCue(best, false);
    else pluck(state.selectedString, state.leftHui, "san", 0.54);
    judgeAction("breath", t);
    updateHandReads();
    return;
  }
  if (action === "slide") {
    const target = state.leftHui <= 7 ? 7.6 : 6.4;
    bendSlide(state.leftHui, target, state.selectedString);
    state.leftHui = target;
    state.targetHui = target;
  } else {
    pluck(state.selectedString, state.leftHui, action);
  }
  judgeAction(action, t);
  updateHandReads();
}

function judgeAction(action, t) {
  if (!MODES[state.mode].score) return;
  const win = state.mode === "follow" ? pieces[state.piece].followWindow || MODES[state.mode].window : MODES[state.mode].window;
  const best = findBestCue(t, win);
  if (!best) {
    state.counts.broken += 1;
    state.qi = Math.max(0, state.qi - 9);
    flashJudge("断气");
    return;
  }

  const timeDrift = Math.abs(best.t - t);
  const stringOk = state.mode === "follow" || best.string === state.selectedString;
  const actionOk = state.mode === "follow" || best.action === action || (best.action === "an" && action === "san");
  const huiDrift = state.mode === "follow" ? 0 : Math.abs(best.hui - state.leftHui);
  const hold = state.lastBreathHold;
  let quality = "涩";
  if (state.mode === "follow") {
    if (timeDrift < win * 0.35 && hold >= 0.16 && hold <= 1.15 && state.qi > 52) quality = "清";
    else if (timeDrift < win * 0.78 && hold > 1.15) quality = "沉";
    else if (timeDrift < win * 0.66 && hold < 0.16) quality = "浮";
    else if (timeDrift < win * 0.82) quality = "稳";
  } else if (timeDrift < win * 0.36 && stringOk && actionOk && huiDrift <= 0.7 && state.qi > 52) quality = "清";
  else if (timeDrift < win * 0.72 && stringOk && actionOk) quality = "稳";

  best.hit = true;
  best.quality = quality;
  if (quality === "清") {
    state.counts.clear += 1;
    state.qi = Math.min(100, state.qi + 5);
  } else if (quality === "稳") {
    state.counts.stable += 1;
    state.qi = Math.min(100, state.qi + 1.5);
  } else if (quality === "浮") {
    state.counts.floating += 1;
    state.qi = Math.max(0, state.qi - 2.5);
  } else if (quality === "沉") {
    state.counts.deep += 1;
    state.qi = Math.min(100, state.qi + 0.5);
  } else {
    state.counts.rough += 1;
    state.qi = Math.max(0, state.qi - 4);
  }
  flashJudge(quality);
}

function findBestCue(t, win) {
  const cues = pieces[state.piece].cues;
  let best = null;
  for (const c of cues) {
    const dt = Math.abs(c.t - t);
    if (!c.hit && dt <= win && (!best || dt < Math.abs(best.t - t))) best = c;
  }
  return best;
}

function flashJudge(text) {
  const el = $("judge");
  el.textContent = text;
  el.classList.remove("show");
  void el.offsetWidth;
  el.classList.add("show");
}

function start() {
  initAudio();
  if (state.audio.state === "suspended") state.audio.resume();
  $("startBtn").blur();
  resetChart();
  $("countdown").textContent = "三";
  setTimeout(() => ($("countdown").textContent = "二"), 520);
  setTimeout(() => ($("countdown").textContent = "一"), 1040);
  setTimeout(() => {
    $("countdown").textContent = "";
    state.playing = true;
    state.ended = false;
    document.body.classList.add("playing");
    state.startAt = state.audio.currentTime;
    state.wallStart = performance.now() / 1000;
    $("startBtn").textContent = "收弦";
  }, 1560);
}

function stop() {
  state.playing = false;
  document.body.classList.remove("playing");
  $("startBtn").textContent = "入弦";
  $("countdown").textContent = "";
}

function resetChart() {
  pieces[state.piece].cues.forEach((c) => {
    c.hit = false;
    c.quality = null;
  });
  state.autoplayIndex = 0;
  state.qi = 86;
  state.counts = { clear: 0, stable: 0, rough: 0, floating: 0, deep: 0, broken: 0 };
  state.recent = [];
  state.spaceDownAt = null;
  state.lastBreathHold = 0;
  state.selectedString = 0;
  state.leftHui = 7.6;
  state.targetHui = 7.6;
  updateHandReads();
}

function finish() {
  state.ended = true;
  stop();
  const cues = pieces[state.piece].cues;
  const missed = cues.filter((c) => !c.hit).length;
  state.counts.broken += missed;
  const calm = Math.round(state.qi);
  $("ticketTitle").textContent = pieces[state.piece].title;
  $("ticketGrid").innerHTML = [
    ["清", state.counts.clear],
    ["稳", state.counts.stable],
    ["涩", state.counts.rough],
    ["浮", state.counts.floating],
    ["沉", state.counts.deep],
    ["气", `${calm}%`],
  ].map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join("");
  const line = calm > 78
    ? "余音有停处，走手没有抢在声音前面。"
    : calm > 48
      ? "句子已经成形；下一遍让滑音再慢半息。"
      : "手上很热闹，弦外的空白还可以多留一点。";
  $("ticketLine").textContent = line;
  $("ticket").classList.remove("hidden");
}

function updateHandReads() {
  $("stringRead").textContent = HAN_STRINGS[state.selectedString];
  $("huiRead").textContent = HUI_NAMES[state.leftHui] || String(state.leftHui);
  stringButtons.forEach((btn, i) => btn.classList.toggle("active", i === state.selectedString));
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll("#modePick button").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
  document.body.dataset.mode = mode;
  if (!state.playing) resetChart();
  updateCuePanel(state.playing ? now() : -1);
}

function setPiece(piece) {
  state.piece = piece;
  document.querySelectorAll("#piecePick button").forEach((b) => b.classList.toggle("active", b.dataset.piece === piece));
  resetChart();
  updateCuePanel(-1);
}

stringButtons.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    if (state.mode !== "pu") return;
    state.selectedString = i;
    updateHandReads();
    userAction("san");
  });
});

$("startBtn").addEventListener("click", () => {
  $("startBtn").blur();
  if (state.playing) stop();
  else start();
});

$("againBtn").addEventListener("click", () => {
  $("ticket").classList.add("hidden");
  start();
});

$("closeTicket").addEventListener("click", () => $("ticket").classList.add("hidden"));

document.querySelectorAll("#modePick button").forEach((btn) => {
  btn.addEventListener("click", () => setMode(btn.dataset.mode));
});

document.querySelectorAll("#piecePick button").forEach((btn) => {
  btn.addEventListener("click", () => setPiece(btn.dataset.piece));
});

canvas.addEventListener("pointerdown", (ev) => {
  if (state.mode !== "pu") {
    state.dragging = true;
    canvas.setPointerCapture(ev.pointerId);
    state.spaceDownAt = state.playing ? now() : null;
    return;
  }
  const r = canvas.getBoundingClientRect();
  const x = ev.clientX - r.left;
  const y = ev.clientY - r.top;
  const nearestString = state.stringY.reduce((best, sy, i) => (Math.abs(sy - y) < Math.abs(state.stringY[best] - y) ? i : best), 0);
  state.selectedString = nearestString;
  state.leftHui = xToHui(x);
  state.targetHui = state.leftHui;
  state.dragging = true;
  canvas.setPointerCapture(ev.pointerId);
  updateHandReads();
  userAction(ev.shiftKey ? "fan" : "san");
});

canvas.addEventListener("pointermove", (ev) => {
  if (!state.dragging || state.mode !== "pu") return;
  const r = canvas.getBoundingClientRect();
  const x = ev.clientX - r.left;
  const next = xToHui(x);
  if (Math.abs(next - state.leftHui) >= 0.6) {
    const from = state.leftHui;
    state.leftHui = next;
    state.targetHui = next;
    state.trail.push({ stringIndex: state.selectedString, fromHui: from, toHui: next, born: performance.now(), life: 980 });
    judgeAction("slide", now());
    updateHandReads();
  }
});

canvas.addEventListener("pointerup", (ev) => {
  if (state.mode !== "pu" && state.spaceDownAt !== null) {
    state.lastBreathHold = Math.max(0, now() - state.spaceDownAt);
    state.spaceDownAt = null;
    userAction("breath");
  }
  state.dragging = false;
  try {
    canvas.releasePointerCapture(ev.pointerId);
  } catch (_) {
    // The pointer may have been released by the browser already.
  }
});

window.addEventListener("keydown", (ev) => {
  const n = Number(ev.key);
  if (n >= 1 && n <= 7 && state.mode === "pu") {
    state.selectedString = n - 1;
    updateHandReads();
  } else if (ev.key === " ") {
    ev.preventDefault();
    if (state.mode === "follow") {
      if (!ev.repeat && state.spaceDownAt === null) state.spaceDownAt = state.playing ? now() : null;
    } else {
      userAction("san");
    }
  } else if (ev.key.toLowerCase() === "h" && state.mode === "pu") {
    userAction("fan");
  } else if ((ev.key === "ArrowLeft" || ev.key === "ArrowRight") && state.mode === "pu") {
    ev.preventDefault();
    const marks = HUI_MARKS.slice().sort((a, b) => a - b);
    const idx = Math.max(0, marks.findIndex((h) => h === state.leftHui));
    const dir = ev.key === "ArrowLeft" ? -1 : 1;
    const next = marks[Math.max(0, Math.min(marks.length - 1, idx + dir))] || 7.6;
    bendSlide(state.leftHui, next, state.selectedString);
    state.leftHui = next;
    state.targetHui = next;
    judgeAction("slide", now());
    updateHandReads();
  } else if (ev.key === "Enter") {
    if (state.playing) stop();
    else start();
  }
});

window.addEventListener("keyup", (ev) => {
  if (ev.key !== " " || state.mode !== "follow") return;
  ev.preventDefault();
  if (state.spaceDownAt === null) return;
  state.lastBreathHold = Math.max(0, now() - state.spaceDownAt);
  state.spaceDownAt = null;
  userAction("breath");
});

window.addEventListener("resize", resize);

resize();
resetChart();
setMode(state.mode);
updateCuePanel(-1);
loop();
