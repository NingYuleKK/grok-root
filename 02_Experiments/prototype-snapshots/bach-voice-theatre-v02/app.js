const $ = (id) => document.getElementById(id);
const canvas = $("stage");
const ctx = canvas.getContext("2d");
const octoLayer = $("octoLayer");
const keyButtons = [...document.querySelectorAll(".laneKey")];

const COLORS = {
  gold: "#e8c268",
  goldSoft: "#f5da91",
  violet: "#6558f4",
  violetSoft: "#9b91ff",
  paper: "#efe7d4",
  miss: "#e96a8d",
};

const MODES = {
  play: {
    label: "PLAY",
    perfect: 0.075,
    good: 0.15,
    fall: 1.8,
    score: true,
    ranks: true,
    judge: true,
    autoPlayer: false,
  },
  follow: {
    label: "FOLLOW",
    perfect: 0.12,
    good: 0.28,
    fall: 2.15,
    score: true,
    ranks: false,
    judge: true,
    autoPlayer: false,
  },
  listen: {
    label: "LISTEN",
    perfect: 0.2,
    good: 0.4,
    fall: 2.1,
    score: false,
    ranks: false,
    judge: false,
    autoPlayer: true,
  },
};

const state = {
  piece: "fugue",
  mode: "play",
  voice: 1,
  playing: false,
  chart: null,
  audio: null,
  master: null,
  startAt: 0,
  wallStartAt: 0,
  evIdx: 0,
  noteIdx: 0,
  autoIdx: 0,
  raf: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  counts: { p: 0, g: 0, m: 0 },
  latency: Number(localStorage.getItem("bvt.latency") || 0),
  W: 0,
  H: 0,
  DPR: 1,
  laneW: 0,
  laneX: [0, 0, 0, 0],
  hitY: 0,
  octos: [],
  echoes: [],
  particles: [],
  goldFired: false,
  sectionState: "",
  calibrating: false,
};

window.BVT = state;

function midi(n) {
  const pc = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  let semi = pc[n[0]];
  let i = 1;
  if (n[1] === "b") {
    semi -= 1;
    i += 1;
  }
  if (n[1] === "#") {
    semi += 1;
    i += 1;
  }
  return 12 * (Number(n[i]) + 1) + semi;
}

const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);
const laneOf = (m, lo, hi) => Math.min(3, Math.floor(((m - lo) / (hi - lo + 0.001)) * 4));
const noteEvent = ([beat, note, dur, motif = "line"]) => ({ beat, m: midi(note), note, dur, motif });
const E = (items) => items.map(noteEvent);
const shift = (events, db, ds, motif) =>
  events.map((e) => ({ ...e, beat: e.beat + db, m: e.m + ds, motif: motif || e.motif }));

function initAudio() {
  if (state.audio) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  state.audio = new AudioCtx();
  state.master = state.audio.createGain();
  state.master.gain.value = 0.42;
  const comp = state.audio.createDynamicsCompressor();
  const verb = state.audio.createDelay();
  const fb = state.audio.createGain();
  const wet = state.audio.createGain();
  verb.delayTime.value = 0.045;
  fb.gain.value = 0.18;
  wet.gain.value = 0.12;
  verb.connect(fb);
  fb.connect(verb);
  verb.connect(wet);
  state.master.connect(comp);
  state.master.connect(verb);
  wet.connect(comp);
  comp.connect(state.audio.destination);
}

function pluckMidi(m, t, vel = 0.9, dur = 0.38) {
  if (!state.audio) return;
  const f = freq(m);
  const o1 = state.audio.createOscillator();
  const o2 = state.audio.createOscillator();
  const g = state.audio.createGain();
  const g2 = state.audio.createGain();
  const lp = state.audio.createBiquadFilter();
  o1.type = "sawtooth";
  o2.type = "square";
  o1.frequency.value = f;
  o2.frequency.value = f * 2;
  g2.gain.value = 0.23;
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(Math.min(6800, f * 6), t);
  lp.frequency.exponentialRampToValueAtTime(Math.max(460, f * 1.45), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vel * 0.28, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0004, t + dur);
  o1.connect(g);
  o2.connect(g2);
  g2.connect(g);
  g.connect(lp);
  lp.connect(state.master);
  o1.start(t);
  o2.start(t);
  o1.stop(t + dur + 0.05);
  o2.stop(t + dur + 0.05);
}

function tick(t) {
  pluckMidi(midi("G4"), t, 0.35, 0.12);
}

function gameNow() {
  if (state.audio && state.audio.state === "running") return state.audio.currentTime - state.startAt;
  return performance.now() / 1000 - state.wallStartAt;
}

function resize() {
  const r = canvas.getBoundingClientRect();
  state.DPR = Math.min(2, window.devicePixelRatio || 1);
  state.W = r.width;
  state.H = r.height;
  canvas.width = state.W * state.DPR;
  canvas.height = state.H * state.DPR;
  ctx.setTransform(state.DPR, 0, 0, state.DPR, 0, 0);
  state.laneW = state.W / 4;
  state.laneX = [0, 1, 2, 3].map((i) => state.laneW * (i + 0.5));
  state.hitY = state.H - 92;
}

window.addEventListener("resize", resize);

const PRELUDE_MEASURES = [
  [["C5", "Eb5", "D5"], ["C3", "G3", "F3"]],
  [["C5", "F5", "Eb5"], ["C3", "Ab3", "G3"]],
  [["B4", "F5", "Eb5"], ["B2", "G3", "F3"]],
  [["C5", "Eb5", "D5"], ["C3", "G3", "F3"]],
  [["Ab4", "C5", "Bb4"], ["Ab2", "Eb3", "Db3"]],
  [["F4", "Ab4", "G4"], ["F2", "C3", "Bb2"]],
  [["B4", "D5", "C5"], ["G2", "D3", "C3"]],
  [["C5", "Eb5", "D5"], ["C3", "G3", "F3"]],
  [["Bb4", "Eb5", "D5"], ["Eb3", "Bb3", "Ab3"]],
  [["Ab4", "C5", "Bb4"], ["Ab2", "Eb3", "Db3"]],
  [["Ab4", "D5", "C5"], ["D3", "Ab3", "G3"]],
  [["B4", "F5", "Eb5"], ["G2", "D3", "C3"]],
  [["C5", "Eb5", "D5"], ["C3", "G3", "F3"]],
  [["C5", "F5", "Eb5"], ["F2", "C3", "Bb2"]],
  [["B4", "D5", "C5"], ["G2", "D3", "C3"]],
  [["C5", "Eb5", "D5"], ["C3", "G3", "F3"]],
];

function patNote(pattern, step) {
  return pattern[[0, 1, 2, 1][step % 4]];
}

function buildPrelude() {
  const bpm = 76;
  const beat = 60 / bpm;
  const six = beat / 4;
  const meas = beat * 4;
  const right = [];
  const left = [];
  const events = [];
  const notes = [];
  const auto = [];

  PRELUDE_MEASURES.forEach((m, mi) => {
    for (let s = 0; s < 16; s += 1) {
      const t = mi * meas + s * six;
      const rh = midi(patNote(m[0], s));
      const lh = midi(patNote(m[1], s));
      const motif = mi < 4 ? "opening contour" : mi < 8 ? "off-beat answer" : "eighth pulse";
      right.push({ t, m: rh, dur: 0.36, motif, measure: mi + 1 });
      left.push({ t, m: lh, dur: 0.46, motif: "ground pattern", measure: mi + 1 });
      events.push({ t, m: rh, dur: 0.36, vel: s % 4 === 0 ? 0.95 : 0.7, voice: 0 });
      events.push({ t, m: lh, dur: 0.46, vel: s % 4 === 0 ? 0.78 : 0.54, voice: 2 });
    }
  });

  const tA = PRELUDE_MEASURES.length * meas;
  const prestoSix = six / 1.55;
  const presto = [
    "G5", "F5", "Eb5", "D5", "Eb5", "D5", "C5", "B4",
    "C5", "B4", "Ab4", "G4", "Ab4", "G4", "F4", "Eb4",
    "F4", "Eb4", "D4", "C4", "B3", "C4", "D4", "B3",
    "C4", "D4", "Eb4", "C4", "D4", "B3", "G3", "G3",
  ];
  presto.forEach((n, i) => {
    const t = tA + i * prestoSix;
    const m = midi(n);
    events.push({ t, m, dur: 0.28, vel: 0.95, voice: 1, motif: "presto turbulence" });
    if (i % 4 === 0) auto.push({ t, voice: 0, m, motif: "presto turbulence" });
  });
  events.push({ t: tA, m: midi("C3"), dur: 0.8, vel: 0.9, voice: 2 });
  events.push({ t: tA + 16 * prestoSix, m: midi("Ab2"), dur: 0.8, vel: 0.85, voice: 2 });
  events.push({ t: tA + 28 * prestoSix, m: midi("G2"), dur: 1.6, vel: 0.95, voice: 2 });

  const prestoStart = tA;
  const prestoEnd = tA + 32 * prestoSix;
  const adagioStart = prestoEnd;
  const arp0 = prestoEnd + 1.1;
  [["G3", 0], ["B3", 0.55], ["D4", 1.05], ["F4", 1.5], ["Ab4", 1.95]].forEach(([n, dt]) => {
    events.push({ t: arp0 + dt, m: midi(n), dur: 1.5, vel: 0.55, voice: 1, motif: "adagio cadenza" });
  });

  const starT = arp0 + 3.35;
  const allegroStart = starT + 0.45;
  const allegro = ["C4", "Eb4", "G4", "C5", "Eb5", "G5", "Eb5", "C5", "G4", "C5", "Eb5", "C5", "G4", "Eb4", "C4", "G3"];
  allegro.forEach((n, i) => {
    const t = allegroStart + i * six;
    const m = midi(n);
    events.push({ t, m, dur: 0.34, vel: 0.9, voice: 0, motif: "allegro return" });
    if (i % 4 === 0) auto.push({ t, voice: 0, m, motif: "allegro return" });
  });
  events.push({ t: allegroStart, m: midi("C3"), dur: 1.4, vel: 0.9, voice: 2 });
  events.push({ t: allegroStart + 8 * six, m: midi("C3"), dur: 1.2, vel: 0.8, voice: 2 });

  let tr = allegroStart + 16 * six;
  [["D4", 1.15], ["B3", 1.4], ["G3", 1.7]].forEach(([n, factor]) => {
    events.push({ t: tr, m: midi(n), dur: 0.5, vel: 0.85, voice: 0, motif: "cadential ritard" });
    tr += six * factor;
  });

  const picardyAt = tr + 0.1;
  ["C3", "G3", "C4", "E4", "G4", "C5"].forEach((n, i) => {
    events.push({ t: picardyAt + i * 0.05, m: midi(n), dur: 3.2, vel: 0.95, voice: -1, motif: "tierce de Picardie" });
  });

  PRELUDE_MEASURES.forEach((m, mi) => {
    const steps = mi < 4 ? [0, 4, 8, 12] : mi < 8 ? [0, 4, 6, 8, 12, 14] : [0, 2, 4, 6, 8, 10, 12, 14];
    steps.forEach((s) => {
      const t = mi * meas + s * six;
      notes.push({ t, m: midi(patNote(m[0], s)), measure: mi + 1, motif: mi < 4 ? "opening contour" : mi < 8 ? "off-beat answer" : "eighth pulse" });
    });
  });
  notes.push({ t: starT, m: midi("C5"), measure: 17, motif: "adagio star note", star: true, fall: 3.4 });

  return normalizeChart({
    id: "prelude",
    title: "BWV 847 · Præludium",
    subtitle: "C 小调前奏曲 · 戏剧性结尾",
    bpm,
    beat,
    defaultVoice: 0,
    playableVoices: [
      { id: 0, name: "Right hand", cn: "右手水流", desc: "moto perpetuo · 推荐", color: "#9b91ff", row: 0.46 },
    ],
    theatreVoices: [
      { id: 0, name: "Right hand", cn: "右手水流", desc: "你照看的水面线", color: "#9b91ff", row: 0.48, events: right },
      { id: 1, name: "Cadenza", cn: "华彩", desc: "Presto 与 Adagio 的演出线", color: "#e8c268", row: 0.34, events: presto.map((n, i) => ({ t: tA + i * prestoSix, m: midi(n), dur: 0.28, motif: "presto turbulence", measure: 17 })) },
      { id: 2, name: "Ground", cn: "低音地基", desc: "托住和声的幽灵线", color: "#5ba8d6", row: 0.62, events: left },
    ],
    events,
    notes,
    auto,
    sections: [
      { id: "presto", from: prestoStart, to: prestoEnd, big: "PRESTO", small: "松手 · 只看" },
      { id: "adagio", from: adagioStart, to: starT + 0.2, big: "ADAGIO", small: "寂静里 只有一个音" },
    ],
    subjectEntries: [],
    picardyAt,
    endTime: picardyAt + 4.8,
    receipt: {
      work: "BWV 847 Præludium",
      observation: "最后的 E natural 把 C 小调的终止翻成 C 大调，皮卡迪三度在金光里打开。",
      role: "你照看右手水流；Presto 段由 Vox 自己跳，Adagio 只留一颗星音给你。",
    },
  });
}

const C_MAJOR_CHORDS = [
  ["C3", "E3", "G3", "C4", "E4"],
  ["C3", "D3", "A3", "D4", "F4"],
  ["B2", "D3", "G3", "D4", "F4"],
  ["C3", "E3", "G3", "C4", "E4"],
  ["C3", "E3", "A3", "C4", "E4"],
  ["C3", "D3", "F#3", "A3", "D4"],
  ["B2", "D3", "G3", "B3", "D4"],
  ["C3", "E3", "G3", "C4", "E4"],
  ["A2", "E3", "A3", "C4", "E4"],
  ["D3", "F3", "A3", "D4", "F4"],
  ["G2", "D3", "G3", "B3", "F4"],
  ["C3", "E3", "G3", "C4", "E4"],
  ["F2", "C3", "F3", "A3", "C4"],
  ["F#2", "C3", "D3", "A3", "C4"],
  ["G2", "B2", "D3", "G3", "B3"],
  ["G2", "C3", "E3", "G3", "C4"],
  ["A2", "C3", "E3", "A3", "C4"],
  ["D2", "A2", "D3", "F3", "C4"],
  ["G2", "B2", "D3", "F3", "B3"],
  ["C3", "E3", "G3", "C4", "E4"],
  ["E2", "G2", "C3", "E3", "G3"],
  ["F2", "A2", "C3", "F3", "A3"],
  ["G2", "B2", "D3", "G3", "B3"],
  ["C2", "G2", "C3", "E3", "C4"],
];

function buildCmajorGate() {
  const bpm = 72;
  const beat = 60 / bpm;
  const step = beat / 2;
  const pattern = [0, 1, 2, 3, 4, 2, 3, 4];
  const events = [];
  const notes = [];
  const shimmer = [];
  const breath = [];
  const ground = [];
  const auto = [];

  C_MAJOR_CHORDS.forEach((chord, ci) => {
    const start = ci * beat * 2;
    const motif = ci < 8 ? "opening breath" : ci < 16 ? "passing light" : "homeward cadence";
    pattern.forEach((idx, pi) => {
      const t = start + pi * step;
      const m = midi(chord[idx]);
      const voice = idx === 0 ? 2 : idx >= 3 ? 0 : 1;
      const vel = pi === 0 ? 0.82 : idx >= 3 ? 0.62 : 0.54;
      events.push({ t, m, dur: 0.5, vel, voice, motif });
      if (voice === 0) shimmer.push({ t, m, dur: 0.5, motif, measure: ci + 1 });
      else if (voice === 1) breath.push({ t, m, dur: 0.5, motif, measure: ci + 1 });
      else ground.push({ t, m, dur: 0.65, motif: "grounded bass", measure: ci + 1 });
      if (pi === 0 || pi === 4) {
        notes.push({ t, m: midi(chord[Math.min(4, idx + 2)]), measure: ci + 1, motif });
      }
    });
    if (ci % 2 === 0) {
      auto.push({ t: start, voice: 0, m: midi(chord[4]), motif });
      auto.push({ t: start + beat, voice: 1, m: midi(chord[2]), motif });
    }
  });

  const cadenceAt = C_MAJOR_CHORDS.length * beat * 2 + 0.6;
  [["C3", 0], ["G3", 0.18], ["C4", 0.36], ["E4", 0.54], ["G4", 0.72], ["C5", 0.9]].forEach(([n, dt], i) => {
    events.push({ t: cadenceAt + dt, m: midi(n), dur: 3.2 - i * 0.12, vel: 0.86, voice: -1, motif: "open C major" });
  });
  notes.push({ t: cadenceAt + 0.9, m: midi("C5"), measure: 25, motif: "arrival breath", star: true, fall: 3.6 });

  return normalizeChart({
    id: "cmajor",
    title: "BWV 846 · Porta",
    subtitle: "C 大调前奏曲 · 呼吸之门",
    bpm,
    beat,
    defaultVoice: 0,
    playableVoices: [
      { id: 0, name: "Breath line", cn: "呼吸线", desc: "分解和弦的上行光", color: "#f5da91", row: 0.47 },
    ],
    theatreVoices: [
      { id: 0, name: "Breath line", cn: "呼吸线", desc: "你照看的上行光", color: "#f5da91", row: 0.46, events: shimmer.concat(notes.filter((n) => n.star)) },
      { id: 1, name: "Inner pulse", cn: "内声部", desc: "和声里层的微光", color: "#9b91ff", row: 0.36, events: breath },
      { id: 2, name: "Ground", cn: "低音地面", desc: "每一次呼吸的地面", color: "#5ba8d6", row: 0.64, events: ground },
    ],
    events,
    notes,
    auto,
    sections: [
      { id: "inhale", from: 0, to: beat * 16, big: "INHALE", small: "光向上走" },
      { id: "exhale", from: beat * 16, to: beat * 32, big: "EXHALE", small: "和声回落" },
      { id: "home", from: beat * 32, to: cadenceAt + 1.2, big: "HOME", small: "C 大调打开" },
    ],
    subjectEntries: [
      { voice: 0, from: 0, to: beat * 8, label: "Breath · 呼吸" },
      { voice: 2, from: beat * 32, to: cadenceAt + 1.2, label: "Ground · 地面" },
    ],
    picardyAt: cadenceAt + 0.9,
    endTime: cadenceAt + 5.4,
    receipt: {
      work: "BWV 846 Præludium",
      observation: "C 大调前奏曲几乎不靠旋律戏剧推进，而靠分解和弦把注意力一层层放平。",
      role: "你照看一条呼吸线；另外两只幽灵章鱼托住内声部和低音地面。",
    },
  });
}

const SUBJ = E([
  [0.5, "C5", 0.25, "subject"], [0.75, "B4", 0.25, "subject"], [1, "C5", 0.5, "subject"], [1.5, "G4", 0.5, "subject"],
  [2, "Ab4", 0.5, "subject"], [2.5, "C5", 0.25, "subject"], [2.75, "B4", 0.25, "subject"], [3, "C5", 0.5, "subject"],
  [3.5, "D5", 0.5, "subject"], [4, "G4", 0.5, "subject"], [4.5, "C5", 0.25, "subject"], [4.75, "B4", 0.25, "subject"],
  [5, "C5", 0.5, "subject"], [5.5, "D5", 0.5, "subject"],
]);
const ANSW = E([
  [0.5, "G5", 0.25, "tonal answer"], [0.75, "F#5", 0.25, "tonal answer"], [1, "G5", 0.5, "tonal answer"], [1.5, "C5", 0.5, "tonal answer"],
  [2, "Eb5", 0.5, "tonal answer"], [2.5, "G5", 0.25, "tonal answer"], [2.75, "F#5", 0.25, "tonal answer"], [3, "G5", 0.5, "tonal answer"],
  [3.5, "A5", 0.5, "tonal answer"], [4, "D5", 0.5, "tonal answer"], [4.5, "G5", 0.25, "tonal answer"], [4.75, "F#5", 0.25, "tonal answer"],
  [5, "G5", 0.5, "tonal answer"], [5.5, "A5", 0.5, "tonal answer"],
]);

function buildFugue() {
  const beat = 60 / 80;
  const totalBeats = 48;
  const rit = totalBeats - 1;
  const warp = (b) => (b <= rit ? b * beat : (rit + (b - rit) * (1 + 0.4 * (b - rit))) * beat);
  const sop = [
    ...shift(ANSW, 8, 0),
    ...E([[14, "G5", .5, "episode"], [14.5, "F5", .5, "episode"], [15, "Eb5", .5, "episode"], [15.5, "D5", .5, "episode"],
      [16, "G5", .5, "episode"], [16.5, "F5", .5, "episode"], [17, "Eb5", .5, "episode"], [17.5, "D5", .5, "episode"],
      [18, "F5", .5, "episode"], [18.5, "Eb5", .5, "episode"], [19, "D5", .5, "episode"], [19.5, "C5", .5, "episode"],
      [20, "Eb5", .5, "episode"], [20.5, "D5", .5, "episode"], [21, "C5", .5, "episode"], [21.5, "Bb4", .5, "episode"],
      [22, "D5", .5, "episode"], [22.5, "C5", .5, "episode"], [23, "B4", .5, "episode"], [23.5, "C5", .5, "episode"],
      [24, "Eb5", 1, "episode"], [25, "D5", 1, "episode"], [26, "C5", 1, "episode"], [27, "B4", 1, "episode"], [28, "C5", 1, "episode"],
      [29, "D5", 1, "episode"], [30, "Eb5", .5, "episode"], [30.5, "D5", .5, "episode"], [31, "C5", 1, "episode"],
      [32, "C5", .5, "sequence"], [32.5, "D5", .5, "sequence"], [33, "Eb5", .5, "sequence"], [33.5, "F5", .5, "sequence"],
      [34, "D5", .5, "sequence"], [34.5, "Eb5", .5, "sequence"], [35, "F5", .5, "sequence"], [35.5, "G5", .5, "sequence"],
      [36, "Eb5", .5, "sequence"], [36.5, "F5", .5, "sequence"], [37, "G5", .5, "sequence"], [37.5, "Ab5", .5, "sequence"],
      [38, "F5", .5, "cadence"], [38.5, "Eb5", .5, "cadence"], [39, "D5", 1, "cadence"]]),
    ...shift(SUBJ, 40, 0, "final subject"),
    ...E([[46, "C5", .5, "cadence"], [46.5, "B4", .5, "cadence"], [47, "C5", 1, "cadence"]]),
  ];
  const alto = [
    ...SUBJ,
    ...E([[6, "G4", .5, "countersubject"], [6.5, "F4", .5, "countersubject"], [7, "Eb4", .5, "countersubject"], [7.5, "D4", .5, "countersubject"],
      [8, "Bb4", .5, "countersubject"], [8.5, "A4", .5, "countersubject"], [9, "Bb4", .5, "countersubject"], [9.5, "G4", .5, "countersubject"],
      [10, "C5", .5, "episode"], [10.5, "Bb4", .5, "episode"], [11, "A4", .5, "episode"], [11.5, "G4", .5, "episode"],
      [12, "F#4", .5, "episode"], [12.5, "G4", .5, "episode"], [13, "A4", .5, "episode"], [13.5, "Bb4", .5, "episode"],
      [14, "A4", .5, "episode"], [14.5, "G4", .5, "episode"], [15, "F#4", .5, "episode"], [15.5, "G4", .5, "episode"],
      [16, "Bb4", 1, "episode"], [17, "A4", 1, "episode"], [18, "G4", 1, "episode"], [19, "F4", 1, "episode"], [20, "G4", 1, "episode"],
      [21, "Ab4", 1, "episode"], [22, "F4", 1, "episode"], [23, "G4", 1, "episode"], [24, "G4", 2, "pedal"], [26, "F4", 2, "pedal"],
      [28, "G4", 2, "pedal"], [30, "F4", 1, "episode"], [31, "Eb4", 1, "episode"], [32, "G4", 1, "sequence"], [33, "Ab4", 1, "sequence"],
      [34, "Bb4", 1, "sequence"], [35, "C5", 1, "sequence"], [36, "Ab4", 1, "sequence"], [37, "Bb4", 1, "sequence"], [38, "Ab4", 1, "cadence"],
      [39, "G4", 1, "cadence"], [40, "Eb4", 1, "cadence"], [41, "D4", 1, "cadence"], [42, "Eb4", 1, "cadence"], [43, "F4", 1, "cadence"],
      [44, "Eb4", 1, "cadence"], [45, "D4", 1, "cadence"], [46, "D4", 1, "cadence"], [47, "E4", 1, "picardy third"]]),
  ];
  const bass = [
    ...shift(SUBJ, 24, -24, "subject"),
    ...E([[30, "F2", 1, "ground"], [31, "G2", 1, "ground"], [32, "C3", 1, "ground"], [33, "Bb2", 1, "ground"],
      [34, "Ab2", 1, "ground"], [35, "G2", 1, "ground"], [36, "Ab2", 1, "ground"], [37, "F2", 1, "ground"], [38, "G2", 2, "ground"],
      [40, "G2", 1, "pedal"], [41, "G3", 1, "pedal"], [42, "G2", 1, "pedal"], [43, "G3", 1, "pedal"], [44, "G2", 1, "pedal"],
      [45, "F2", 1, "cadence"], [46, "G2", 1, "cadence"], [47, "C3", 1, "cadence"]]),
  ];
  const voices = [sop, alto, bass];
  const events = [];
  voices.forEach((voice, vi) => {
    voice.forEach((e) => events.push({ t: warp(e.beat), m: e.m, dur: Math.max(0.3, e.dur * beat * 1.15), vel: vi === 2 ? 0.84 : 0.8, voice: vi, motif: e.motif }));
  });
  const picardyAt = warp(totalBeats);
  ["C3", "G3", "C4", "E4", "G4", "C5"].forEach((n, i) => {
    events.push({ t: picardyAt + i * 0.05, m: midi(n), dur: 3.4, vel: 0.95, voice: -1, motif: "tierce de Picardie" });
  });

  const theatreVoices = [
    { id: 0, name: "Soprano", cn: "高声部", desc: "答题者 · 第二个进入", color: "#b49cff", row: 0.30, events: sop.map((e) => ({ t: warp(e.beat), m: e.m, dur: e.dur * beat, motif: e.motif, measure: Math.floor(e.beat / 4) + 1 })) },
    { id: 1, name: "Alto", cn: "中声部", desc: "开口者 · 主题首唱", color: "#6558f4", row: 0.46, events: alto.map((e) => ({ t: warp(e.beat), m: e.m, dur: e.dur * beat, motif: e.motif, measure: Math.floor(e.beat / 4) + 1 })) },
    { id: 2, name: "Bass", cn: "低声部", desc: "地基 · 最后进入", color: "#5ba8d6", row: 0.62, events: bass.map((e) => ({ t: warp(e.beat), m: e.m, dur: e.dur * beat, motif: e.motif, measure: Math.floor(e.beat / 4) + 1 })) },
  ];

  return normalizeChart({
    id: "fugue",
    title: "BWV 847 · Fuga a 3",
    subtitle: "C 小调赋格 · 三声章鱼",
    bpm: 80,
    beat,
    defaultVoice: 1,
    playableVoices: theatreVoices,
    theatreVoices,
    events,
    notes: theatreVoices[state.voice].events.map((e) => ({ ...e })),
    auto: [],
    sections: [],
    subjectEntries: [
      { voice: 1, from: warp(0), to: warp(6), label: "Subject · 主题" },
      { voice: 0, from: warp(8), to: warp(14), label: "Answer · 应答" },
      { voice: 2, from: warp(24), to: warp(30), label: "Subject · 主题" },
      { voice: 0, from: warp(40), to: warp(46), label: "Final Subject" },
    ],
    picardyAt,
    endTime: picardyAt + 4.8,
    receipt: {
      work: "BWV 847 Fuga a 3",
      observation: "皮卡迪三度的 E natural 写在 Alto 线里：如果你选中声部，最后那束光由你唱出来。",
      role: "你只照看一个声部；另外两只幽灵章鱼托住对位，让主题在水里交接。",
    },
  });
}

function normalizeChart(chart) {
  const voiceForNotes = chart.playableVoices.find((v) => v.id === state.voice) || chart.playableVoices[0];
  const noteMs = chart.notes.map((n) => n.m);
  const lo = Math.min(...noteMs);
  const hi = Math.max(...noteMs);
  chart.notes = chart.notes.map((n, i) => ({
    ...n,
    idx: i,
    lane: laneOf(n.m, lo, hi),
    state: 0,
    voice: voiceForNotes.id,
    fall: n.fall || MODES[state.mode].fall,
  }));
  chart.theatreVoices = chart.theatreVoices.map((v) => {
    const ms = v.events.map((e) => e.m);
    const vlo = Math.min(...ms);
    const vhi = Math.max(...ms);
    return {
      ...v,
      lo: vlo,
      hi: vhi,
      cursor: 0,
      events: v.events.map((e) => ({ ...e, lane: laneOf(e.m, vlo, vhi) })),
    };
  });
  chart.events.sort((a, b) => a.t - b.t);
  chart.auto.sort((a, b) => a.t - b.t);
  return chart;
}

const PIECES = {
  prelude: buildPrelude,
  fugue: buildFugue,
  cmajor: buildCmajorGate,
};

function octoSVG(color, ghost = false) {
  const tent = ghost ? "rgba(239,231,212,.36)" : color;
  const head = color;
  const wave = ghost ? "rgba(239,231,212,.58)" : COLORS.goldSoft;
  return `
    <svg viewBox="0 0 100 100" width="86" height="86" aria-hidden="true">
      <g fill="${tent}">
        <path d="M30 62 Q22 78 12 82 Q24 80 33 70 Z"></path>
        <path d="M38 66 Q34 82 26 90 Q40 84 44 72 Z"></path>
        <path d="M50 68 Q50 84 46 93 Q56 86 55 72 Z"></path>
        <path d="M62 66 Q66 82 74 90 Q60 84 56 72 Z"></path>
        <path d="M70 62 Q78 78 88 82 Q76 80 67 70 Z"></path>
      </g>
      <path d="M50 12 C28 12 18 30 18 46 C18 60 30 70 50 70 C70 70 82 60 82 46 C82 30 72 12 50 12 Z" fill="${head}"></path>
      <g fill="none" stroke="${wave}" stroke-width="2" opacity=".84">
        <circle cx="50" cy="40" r="7"></circle>
        <circle cx="50" cy="40" r="14" opacity=".52"></circle>
        <circle cx="50" cy="40" r="21" opacity=".28"></circle>
      </g>
      <circle cx="38" cy="52" r="5.5" fill="#efe7d4"></circle>
      <circle cx="62" cy="52" r="5.5" fill="#efe7d4"></circle>
      <circle cx="39.5" cy="52.5" r="2.6" fill="#0b0a1a"></circle>
      <circle cx="63.5" cy="52.5" r="2.6" fill="#0b0a1a"></circle>
      <path d="M44 61 Q50 65 56 61" stroke="#0b0a1a" stroke-width="2" fill="none" stroke-linecap="round"></path>
    </svg>`;
}

function makeOctos() {
  octoLayer.innerHTML = "";
  state.octos = [];
  state.echoes = [];
  state.chart.theatreVoices.forEach((voice) => {
    const isPlayer = voice.id === selectedVoiceId();
    const el = document.createElement("div");
    el.className = `octo ${isPlayer ? "player" : "ghost"}`;
    el.innerHTML = octoSVG(voice.color, !isPlayer);
    octoLayer.appendChild(el);
    const label = document.createElement("div");
    label.className = "subjectLabel";
    label.textContent = "Subject";
    octoLayer.appendChild(label);
    const startLane = voice.id === 0 ? 3 : voice.id === 1 ? 1 : 0;
    state.octos.push({
      id: voice.id,
      el,
      label,
      x: state.laneX[startLane],
      tx: state.laneX[startLane],
      jump: 1,
      voice,
      isPlayer,
      size: isPlayer ? 86 : 66,
      autoCursor: 0,
    });
  });
  const player = state.octos.find((o) => o.isPlayer) || state.octos[0];
  for (let i = 0; i < 4; i += 1) {
    const el = document.createElement("div");
    el.className = "octo echo";
    el.innerHTML = octoSVG(player.voice.color, true);
    octoLayer.appendChild(el);
    state.echoes.push({ el, t: 1, x: 0 });
  }
}

function selectedVoiceId() {
  if (state.piece !== "fugue") return 0;
  return state.voice;
}

function voiceY(o) {
  if (o.isPlayer) return state.hitY + 15;
  return state.H * o.voice.row;
}

function jumpOcto(voiceId, lane) {
  const o = state.octos.find((item) => item.id === voiceId);
  if (!o) return;
  o.tx = state.laneX[lane];
  o.jump = 0;
}

function drawOctos(now) {
  for (const o of state.octos) {
    const shouldAuto = MODES[state.mode].autoPlayer || !o.isPlayer;
    if (shouldAuto) {
      while (o.autoCursor < o.voice.events.length && o.voice.events[o.autoCursor].t <= now) {
        const e = o.voice.events[o.autoCursor];
        jumpOcto(o.id, e.lane);
        o.autoCursor += 1;
      }
    }
    o.x += (o.tx - o.x) * 0.25;
    o.jump = Math.min(1, o.jump + 1 / 26);
    const arc = Math.sin(o.jump * Math.PI) * (o.isPlayer ? -42 : -25);
    const squash = o.jump < 0.18 ? 1 - (o.jump / 0.18) * 0.16 : o.jump > 0.85 ? 0.94 + ((o.jump - 0.85) / 0.15) * 0.06 : 1;
    const bob = Math.sin(now * 2.35 + o.id * 1.6) * 3;
    const y = voiceY(o) + arc + bob;
    const scale = o.isPlayer ? 1 : 0.78;
    o.el.style.transform = `translate(${o.x - 43}px, ${y}px) scale(${scale * (2 - squash)}, ${scale * squash})`;
    o.label.style.transform = `translate(${o.x - 48}px, ${y - 18}px)`;
    const subject = activeSubject(now, o.id);
    o.el.classList.toggle("subject", !!subject);
    o.label.classList.toggle("on", !!subject);
    if (subject) o.label.textContent = subject.label;
  }
}

function activeSubject(now, voiceId) {
  return state.chart.subjectEntries.find((entry) => entry.voice === voiceId && now >= entry.from && now <= entry.to);
}

function echoCatch(lane) {
  const echo = state.echoes.find((e) => e.t >= 1);
  if (!echo) return;
  echo.t = 0;
  echo.x = state.laneX[lane];
}

function drawEchoes() {
  for (const e of state.echoes) {
    if (e.t >= 1) {
      e.el.style.opacity = 0;
      continue;
    }
    e.t = Math.min(1, e.t + 1 / 42);
    const arc = Math.sin(e.t * Math.PI) * -46;
    e.el.style.opacity = Math.sin(e.t * Math.PI) * 0.5;
    e.el.style.transform = `translate(${e.x - 43}px, ${state.hitY + 14 + arc}px)`;
  }
}

function setCombo() {
  $("comboN").textContent = state.combo;
  $("combo").style.opacity = state.combo >= 2 && MODES[state.mode].score ? 1 : 0;
}

function showJudge(text, color) {
  if (!MODES[state.mode].judge) return;
  const el = $("judge");
  el.textContent = text;
  el.style.color = color;
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "judgePop .55s ease-out forwards";
}

function setSection(now) {
  const active = state.chart.sections.find((s) => now >= s.from && now < s.to);
  const id = active ? active.id : "";
  if (id === state.sectionState) return;
  state.sectionState = id;
  const cue = $("sectionCue");
  if (!active) {
    cue.style.opacity = 0;
    return;
  }
  $("sectionBig").textContent = active.big;
  $("sectionSmall").textContent = active.small;
  cue.style.opacity = 1;
}

function burst(x, y, gold = false) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 10; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const sp = 60 + Math.random() * 120;
    state.particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, life: 1, gold });
  }
}

function risingLight() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 54; i += 1) {
    state.particles.push({
      x: Math.random() * state.W,
      y: state.H * 0.34 + Math.random() * state.H * 0.66,
      vx: (Math.random() - 0.5) * 14,
      vy: -(22 + Math.random() * 46),
      life: 1 + Math.random() * 1.6,
      fade: 1 / 170,
      float: true,
      gold: true,
    });
  }
}

function press(lane) {
  if (!state.playing || MODES[state.mode].autoPlayer) return;
  keyButtons[lane].classList.add("on");
  setTimeout(() => keyButtons[lane].classList.remove("on"), 110);
  jumpOcto(selectedVoiceId(), lane);
  const now = gameNow() - state.latency;
  let best = null;
  let bestDelta = Infinity;
  for (const n of state.chart.notes) {
    if (n.state || n.lane !== lane) continue;
    const d = Math.abs(n.t - now);
    if (d < bestDelta) {
      bestDelta = d;
      best = n;
    }
  }
  if (!best) return;
  const perfect = best.star ? 0.11 : MODES[state.mode].perfect;
  const good = best.star ? 0.24 : MODES[state.mode].good;
  if (bestDelta > good) return;
  best.state = bestDelta <= perfect ? 1 : 2;
  if (best.star) {
    pluckMidi(midi("C5"), state.audio.currentTime, 1, 2.7);
    pluckMidi(midi("C4"), state.audio.currentTime, 0.72, 2.7);
  }
  if (best.state === 1) {
    state.score += best.star ? 500 : 100;
    state.counts.p += 1;
    showJudge(best.star ? "★ PERFECT" : "PERFECT", COLORS.gold);
    burst(state.laneX[lane], state.hitY, true);
  } else {
    state.score += best.star ? 280 : 60;
    state.counts.g += 1;
    showJudge(best.star ? "★ GOOD" : "GOOD", COLORS.violetSoft);
  }
  state.combo += 1;
  state.maxCombo = Math.max(state.maxCombo, state.combo);
  $("score").textContent = MODES[state.mode].score ? state.score : "—";
  setCombo();
}

function drawLanes() {
  for (let i = 0; i < 4; i += 1) {
    ctx.fillStyle = i % 2 ? "rgba(101,88,244,.045)" : "rgba(101,88,244,.085)";
    ctx.fillRect(i * state.laneW, 0, state.laneW, state.H);
  }
  ctx.strokeStyle = "rgba(155,145,255,.12)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * state.laneW, 0);
    ctx.lineTo(i * state.laneW, state.H);
    ctx.stroke();
  }
  const grad = ctx.createLinearGradient(0, state.hitY - 2, 0, state.hitY + 2);
  grad.addColorStop(0, "rgba(232,194,104,0)");
  grad.addColorStop(0.5, "rgba(232,194,104,.95)");
  grad.addColorStop(1, "rgba(232,194,104,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, state.hitY - 4, state.W, 8);
  ctx.fillStyle = "rgba(232,194,104,.12)";
  ctx.fillRect(0, state.hitY - 14, state.W, 28);
}

function drawTopology(now) {
  const windowPast = 0.45;
  const windowFuture = Math.max(2.4, MODES[state.mode].fall + 0.3);
  for (const voice of state.chart.theatreVoices) {
    const isPlayer = voice.id === selectedVoiceId();
    const subj = activeSubject(now, voice.id);
    const visible = voice.events.filter((e) => e.t >= now - windowPast && e.t <= now + windowFuture);
    if (visible.length < 2) continue;
    ctx.beginPath();
    visible.forEach((e, idx) => {
      const x = state.laneX[e.lane];
      const y = state.hitY - ((e.t - now) / windowFuture) * (state.hitY + 26);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = subj ? "rgba(232,194,104,.72)" : isPlayer ? "rgba(232,194,104,.34)" : "rgba(239,231,212,.13)";
    ctx.lineWidth = subj ? 2.2 : isPlayer ? 1.7 : 1.1;
    ctx.shadowColor = subj ? COLORS.gold : "transparent";
    ctx.shadowBlur = subj ? 14 : 0;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function drawNotes(now) {
  for (const n of state.chart.notes) {
    if (n.state) continue;
    if (MODES[state.mode].autoPlayer && n.t <= now) {
      n.state = 4;
      jumpOcto(selectedVoiceId(), n.lane);
      continue;
    }
    const good = n.star ? 0.24 : MODES[state.mode].good;
    if (n.t - now < -good) {
      n.state = 3;
      state.counts.m += 1;
      state.combo = 0;
      setCombo();
      showJudge(state.mode === "follow" ? "DRIFT" : "MISS", COLORS.miss);
      echoCatch(n.lane);
      if (n.star) pluckMidi(midi("C5"), state.audio.currentTime + 0.02, 0.85, 2.6);
      continue;
    }
    const fall = n.fall || MODES[state.mode].fall;
    const dt = n.t - now;
    if (dt > fall + 0.1) continue;
    const y = state.hitY - (dt / fall) * (state.hitY + 42);
    const x = state.laneX[n.lane];
    const near = Math.max(0, 1 - Math.abs(dt) / 0.42);
    if (n.star) {
      const pulse = 1 + Math.sin(now * 5) * 0.08;
      const r = (22 + near * 5) * pulse;
      ctx.beginPath();
      ctx.fillStyle = "rgba(232,194,104,.96)";
      ctx.shadowColor = COLORS.gold;
      ctx.shadowBlur = 28 + near * 24;
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r, y);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x - r, y);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(11,10,26,.88)";
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    const r = 13 + near * 3;
    ctx.beginPath();
    ctx.fillStyle = `rgba(155,145,255,${0.78 + near * 0.2})`;
    ctx.shadowColor = COLORS.violetSoft;
    ctx.shadowBlur = 10 + near * 18;
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r, y);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(239,231,212,.92)";
    ctx.beginPath();
    ctx.arc(x, y, 3.1, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawParticles() {
  for (const p of state.particles) {
    p.life -= p.fade || 1 / 55;
    p.x += p.vx / 60;
    p.y += p.vy / 60;
    if (!p.float) p.vy += 140 / 60;
    if (p.life <= 0) continue;
    const a = Math.min(1, p.life);
    ctx.fillStyle = p.gold ? `rgba(232,194,104,${a})` : `rgba(155,145,255,${a})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.4 * a + 1, 0, Math.PI * 2);
    ctx.fill();
  }
  state.particles = state.particles.filter((p) => p.life > 0);
}

function drawPicardy(now) {
  if (now < state.chart.picardyAt) return;
  if (!state.goldFired) {
    state.goldFired = true;
    risingLight();
    for (const o of state.octos) {
      o.el.classList.add("gold");
      o.el.classList.remove("ghost");
      o.el.classList.add("player");
      const offset = o.id === selectedVoiceId() ? 0 : o.id < selectedVoiceId() ? -110 : 110;
      o.tx = state.W / 2 + offset;
      o.jump = 0;
    }
  }
  const g = now - state.chart.picardyAt;
  const a = g < 0.35 ? (g / 0.35) * 0.45 : Math.max(0, 0.45 - ((g - 0.35) / 3.4) * 0.45);
  if (a <= 0) return;
  const rad = ctx.createRadialGradient(state.W / 2, state.hitY, 30, state.W / 2, state.hitY, Math.max(state.W, state.H));
  rad.addColorStop(0, `rgba(232,194,104,${a})`);
  rad.addColorStop(0.55, `rgba(232,194,104,${a * 0.35})`);
  rad.addColorStop(1, "rgba(232,194,104,0)");
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, state.W, state.H);
}

function frame() {
  if (!state.playing) return;
  const now = gameNow();
  document.body.dataset.bvtNow = now.toFixed(3);
  document.body.dataset.bvtEnd = state.chart.endTime.toFixed(3);
  document.body.dataset.bvtAudio = state.audio.state;
  while (state.audio.state === "running" && state.evIdx < state.chart.events.length && state.chart.events[state.evIdx].t < now + 0.16) {
    const e = state.chart.events[state.evIdx];
    pluckMidi(e.m, state.startAt + e.t, e.vel, e.dur);
    state.evIdx += 1;
  }
  while (state.autoIdx < state.chart.auto.length && state.chart.auto[state.autoIdx].t <= now) {
    const e = state.chart.auto[state.autoIdx];
    const voice = state.chart.theatreVoices.find((v) => v.id === e.voice);
    const lane = voice ? laneOf(e.m, voice.lo, voice.hi) : 1;
    jumpOcto(e.voice, lane);
    state.autoIdx += 1;
  }
  setSection(now);
  ctx.clearRect(0, 0, state.W, state.H);
  drawLanes();
  drawTopology(now);
  drawNotes(now);
  drawParticles();
  drawPicardy(now);
  drawOctos(now);
  drawEchoes();
  if (now > state.chart.endTime) {
    finish();
    return;
  }
  state.raf = requestAnimationFrame(frame);
}

function buildCurrentChart() {
  if (state.piece !== "fugue") state.voice = 0;
  return PIECES[state.piece]();
}

function start() {
  initAudio();
  state.audio.resume();
  resize();
  state.chart = buildCurrentChart();
  state.evIdx = 0;
  state.autoIdx = 0;
  state.score = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.counts = { p: 0, g: 0, m: 0 };
  state.particles = [];
  state.goldFired = false;
  state.sectionState = "";
  state.playing = true;
  document.body.dataset.bvtPlaying = "true";
  $("score").textContent = MODES[state.mode].score ? "0" : "—";
  setCombo();
  makeOctos();
  updateHeader();
  const countBeats = 4;
  const t0 = state.audio.currentTime + 0.25;
  state.startAt = t0 + countBeats * state.chart.beat;
  state.wallStartAt = performance.now() / 1000 + 0.25 + countBeats * state.chart.beat;
  for (let b = 0; b < countBeats; b += 1) tick(t0 + b * state.chart.beat);
  runCountdown(state.chart.beat);
  cancelAnimationFrame(state.raf);
  state.raf = requestAnimationFrame(frame);
}

function runCountdown(beat) {
  const cd = $("countdown");
  const num = $("countNum");
  cd.style.display = "flex";
  ["3", "2", "1", "♪"].forEach((s, i) => {
    setTimeout(() => {
      num.textContent = s;
      num.style.animation = "none";
      void num.offsetWidth;
      num.style.animation = `countBeat ${beat}s linear forwards`;
    }, 250 + i * beat * 1000);
  });
  setTimeout(() => {
    cd.style.display = "none";
  }, 250 + 4 * beat * 1000);
}

function finish() {
  state.playing = false;
  document.body.dataset.bvtPlaying = "false";
  cancelAnimationFrame(state.raf);
  $("sectionCue").style.opacity = 0;
  showTicket();
}

function showTicket() {
  const chart = state.chart;
  const mode = MODES[state.mode];
  const total = chart.notes.length || 1;
  const acc = Math.round(((state.counts.p * 100 + state.counts.g * 60 + (mode.autoPlayer ? total * 100 : 0)) / (total * 100)) * 100);
  const rank = mode.ranks ? (acc >= 92 ? "S" : acc >= 80 ? "A" : acc >= 62 ? "B" : acc >= 40 ? "C" : "D") : "Complete";
  const voice = chart.playableVoices.find((v) => v.id === selectedVoiceId()) || chart.playableVoices[0];
  const analysis = analyzeRun(chart);
  $("ticketTitle").textContent = `${chart.receipt.work} · ${voice.name}`;
  const rows = [
    ["Mode", mode.label],
    ["Voice", `${voice.cn || voice.name}`],
    ["Perfect / Good / Miss", mode.autoPlayer ? "聆听完成" : `${state.counts.p} / ${state.counts.g} / ${state.counts.m}`],
    ["Max Combo", mode.autoPlayer ? "—" : state.maxCombo],
    ["Accuracy", mode.autoPlayer ? "—" : `${acc}%`],
    ["Stable", analysis.stable],
    ["Drift", analysis.drift],
    ["Result", rank],
  ];
  $("ticketGrid").innerHTML = rows.map(([k, v]) => `<span>${k}</span><strong>${v}</strong>`).join("");
  $("ticketLine").textContent = ticketLine(rank, state.mode, chart.id, voice.name);
  $("ticketObservation").textContent = chart.id === "fugue" && voice.name === "Alto"
    ? "音乐观察：你选的是 Alto，最后把小调翻成大调的 E natural 就在你的声部里。"
    : `音乐观察：${chart.receipt.observation}`;
  $("ticket").classList.remove("hidden");
}

function analyzeRun(chart) {
  if (MODES[state.mode].autoPlayer) return { stable: "全曲聆听", drift: "无判定" };
  const byMeasure = new Map();
  chart.notes.forEach((n) => {
    const measure = n.measure || Math.floor(n.t / (chart.beat * 4)) + 1;
    if (!byMeasure.has(measure)) byMeasure.set(measure, { p: 0, g: 0, m: 0, motifs: new Map() });
    const item = byMeasure.get(measure);
    if (n.state === 1) item.p += 1;
    else if (n.state === 2) item.g += 1;
    else if (n.state === 3) item.m += 1;
    item.motifs.set(n.motif, (item.motifs.get(n.motif) || 0) + (n.state === 3 ? 2 : n.state === 2 ? 1 : 0));
  });
  let best = null;
  let worst = null;
  for (const [measure, s] of byMeasure.entries()) {
    const total = s.p + s.g + s.m || 1;
    const quality = (s.p * 2 + s.g - s.m * 1.5) / total;
    if (!best || quality > best.quality) best = { measure, quality };
    if (!worst || quality < worst.quality) worst = { measure, quality, motifs: s.motifs };
  }
  let driftMotif = "终止前线条";
  if (worst && worst.motifs.size) {
    driftMotif = [...worst.motifs.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }
  return {
    stable: best ? `第 ${best.measure} 小节附近` : "开头段",
    drift: worst ? `第 ${worst.measure} 小节 · ${driftMotif}` : "无明显漂移",
  };
}

function ticketLine(rank, mode, piece, voice) {
  if (mode === "listen") return "Vox 自己跳完了整首，今天你只需要在水里看见复调。";
  if (mode === "follow") return "这遍不是比赛，是跟随。音符从指尖滑走的地方，幽灵已经轻轻补上。";
  if (piece === "fugue") {
    return {
      S: `你刚才不是在打音符，是在主持 ${voice} 的一场三百年对话。`,
      A: "主题每次经过时你都基本接住了，手已经开始认得这条线。",
      B: "三个声部里站稳一个，已经是对位法的入门礼。",
      C: "赋格本来就是迷宫，今天先让幽灵带路。",
      D: "没关系，音乐没有断，只是你暂时松开了它。",
    }[rank];
  }
  if (piece === "cmajor") {
    return {
      S: "你把 C 大调的呼吸线照看到最后，像一盏灯没有晃。",
      A: "这条线已经很稳了，和声每次落地你都在场。",
      B: "呼吸大体跟住了；下一遍可以把注意力放在每次上行的起点。",
      C: "C 大调不催人，它只是让你重新慢下来。",
      D: "没关系，今天只要听见一层光往上走，就已经够了。",
    }[rank];
  }
  return {
    S: "你把 C 小调水流一直照看到金光打开，触键很干净。",
    A: "水流大体接住了，Adagio 那颗星音已经开始有呼吸。",
    B: "已经很巴洛克了；下一遍可以只听终止前的放慢。",
    C: "平均律第一遍都这样，C 小调原谅我们。",
    D: "没关系，Vox 跳它的，你听你的，音乐不会怪人。",
  }[rank];
}

function updateHeader() {
  const chart = state.chart || buildCurrentChart();
  const titles = {
    fugue: "选一条声部，剩下的交给幽灵。",
    prelude: "水流、寂静、星音，最后让光进来。",
    cmajor: "把 C 大调当成一扇会呼吸的门。",
  };
  $("pieceTitle").textContent = titles[state.piece];
  $("modeBadge").textContent = MODES[state.mode].label;
  $("compassText").textContent = chart.receipt.role;
  $("latencyRead").textContent = `${Math.round(state.latency * 1000)} ms`;
}

function renderVoicePick() {
  const chart = buildCurrentChart();
  const block = $("voiceBlock");
  if (state.piece !== "fugue") {
    block.style.display = "none";
    state.voice = 0;
    return;
  }
  block.style.display = "grid";
  $("voicePick").innerHTML = chart.playableVoices.map((v) => `
    <button class="voiceCard ${v.id === state.voice ? "active" : ""}" data-voice="${v.id}">
      <span class="voiceDot" style="background:${v.color}"></span>
      <span><span class="voiceName">${v.name} · ${v.cn}</span><span class="voiceDesc">${v.desc}</span></span>
    </button>
  `).join("");
  document.querySelectorAll(".voiceCard").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.voice = Number(btn.dataset.voice);
      renderVoicePick();
      state.chart = buildCurrentChart();
      updateHeader();
    });
  });
}

document.querySelectorAll("#piecePick button").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.piece = btn.dataset.piece;
    document.querySelectorAll("#piecePick button").forEach((b) => b.classList.toggle("active", b === btn));
    renderVoicePick();
    state.chart = buildCurrentChart();
    updateHeader();
  });
});

document.querySelectorAll("#modePick button").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.mode = btn.dataset.mode;
    document.querySelectorAll("#modePick button").forEach((b) => b.classList.toggle("active", b === btn));
    state.chart = buildCurrentChart();
    updateHeader();
  });
});

$("startBtn").addEventListener("click", start);
$("againBtn").addEventListener("click", () => {
  $("ticket").classList.add("hidden");
  start();
});
$("closeTicket").addEventListener("click", () => $("ticket").classList.add("hidden"));

keyButtons.forEach((button, lane) => {
  button.addEventListener("pointerdown", (ev) => {
    ev.preventDefault();
    press(lane);
  });
});

window.addEventListener("keydown", (ev) => {
  if (state.calibrating) return;
  if (ev.repeat) return;
  const lane = { d: 0, f: 1, j: 2, k: 3 }[ev.key.toLowerCase()];
  if (lane === undefined) return;
  keyButtons[lane].classList.add("on");
  press(lane);
});

window.addEventListener("keyup", (ev) => {
  const lane = { d: 0, f: 1, j: 2, k: 3 }[ev.key.toLowerCase()];
  if (lane !== undefined) keyButtons[lane].classList.remove("on");
});

$("stageWrap").addEventListener("pointerdown", (ev) => {
  if (ev.target.closest && ev.target.closest("#keys")) return;
  if (!state.playing || MODES[state.mode].autoPlayer) return;
  const r = $("stageWrap").getBoundingClientRect();
  const lane = Math.max(0, Math.min(3, Math.floor(((ev.clientX - r.left) / r.width) * 4)));
  press(lane);
});

$("calibrateBtn").addEventListener("click", () => {
  $("calibration").classList.remove("hidden");
});
$("closeCal").addEventListener("click", () => {
  state.calibrating = false;
  $("calibration").classList.add("hidden");
});

$("runCal").addEventListener("click", runCalibration);

function runCalibration() {
  initAudio();
  state.audio.resume();
  state.calibrating = true;
  const samples = [];
  let expected = 0;
  let step = 0;
  $("calStatus").textContent = "准备...";
  const handler = () => {
    if (!state.calibrating || !expected) return;
    const delta = state.audio.currentTime - expected;
    samples.push(delta);
    $("calStatus").textContent = `第 ${samples.length}/4 次：${Math.round(delta * 1000)} ms`;
    expected = 0;
    if (samples.length >= 4) {
      window.removeEventListener("keydown", handler, true);
      window.removeEventListener("pointerdown", handler, true);
      const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
      state.latency = Math.max(-0.05, Math.min(0.45, avg));
      localStorage.setItem("bvt.latency", String(state.latency));
      $("calStatus").textContent = `已保存：${Math.round(state.latency * 1000)} ms`;
      $("latencyRead").textContent = `${Math.round(state.latency * 1000)} ms`;
      state.calibrating = false;
    }
  };
  window.addEventListener("keydown", handler, true);
  window.addEventListener("pointerdown", handler, true);
  const schedule = () => {
    if (!state.calibrating || step >= 4) return;
    expected = state.audio.currentTime + 0.45;
    setTimeout(() => {
      tick(state.audio.currentTime + 0.01);
      const pulse = $("calPulse");
      pulse.classList.remove("on");
      void pulse.offsetWidth;
      pulse.classList.add("on");
      $("calStatus").textContent = "按任意键";
    }, 450);
    step += 1;
    setTimeout(schedule, 1450);
  };
  schedule();
}

resize();
renderVoicePick();
state.chart = buildCurrentChart();
updateHeader();
