import './styles.css';

const app = document.querySelector('#app');

const labs = [
  {
    id: 'switch',
    eyebrow: 'Layer 01',
    title: '0 / 1 as Stable Physical States',
    short: '开关',
    question: '为什么芯片愿意用 0 和 1？',
    insight: '0 和 1 不是神秘符号，而是工程上容易区分、容易恢复、抗噪声的两个稳定区间。'
  },
  {
    id: 'logic',
    eyebrow: 'Layer 02',
    title: 'Logic Gates Compose Rules',
    short: '逻辑门',
    question: '几个开关怎样变成规则？',
    insight: '逻辑门把输入状态映射成输出状态；NAND 足够特殊，因为它可以拼出 NOT、AND、OR，进而拼出任意布尔逻辑。'
  },
  {
    id: 'silicon',
    eyebrow: 'Layer 03',
    title: 'CMOS, Clock Edges, and Latches',
    short: '芯片底层',
    question: '逻辑门在芯片里怎样变成可计时、可保存的状态？',
    insight: 'CMOS 负责把电压翻译成可靠逻辑，时钟边沿负责规定“何时保存”，flip-flop 把瞬时信号变成下一拍可用的状态。'
  },
  {
    id: 'adder',
    eyebrow: 'Layer 04',
    title: 'Circuits Compute and Remember',
    short: '加法器',
    question: '逻辑门怎样变成算术和存储？',
    insight: '加法器展示组合逻辑，寄存器展示状态记忆；计算机需要这两种东西一起工作。'
  },
  {
    id: 'cpu',
    eyebrow: 'Layer 05',
    title: 'Instructions Make a Universal Machine',
    short: '迷你 CPU',
    question: '电路怎样变成“会运行程序”的机器？',
    insight: '通用计算来自同一套硬件可以读取不同指令；程序把数据和操作都编码成 0/1，CPU 循环执行。'
  },
  {
    id: 'learning',
    eyebrow: 'Layer 06',
    title: 'Learning Loops Produce Capability',
    short: '智能涌现',
    question: '0/1 怎样支撑智能涌现？',
    insight: '智能不是某个 bit 自己出现，而是大量可保存状态、可计算变换、反馈更新在规模和数据上闭环后出现稳定能力。'
  }
];

const program = [
  { op: 'LOAD', arg: 12, bits: '0001 1100', text: 'ACC <- RAM[12]' },
  { op: 'ADD', arg: 13, bits: '0010 1101', text: 'ACC <- ACC + RAM[13]' },
  { op: 'STORE', arg: 14, bits: '0011 1110', text: 'RAM[14] <- ACC' },
  { op: 'OUT', arg: 14, bits: '0100 1110', text: 'emit RAM[14]' },
  { op: 'HALT', arg: 0, bits: '1111 0000', text: 'stop clock' }
];

const points = [
  { x: 0.12, y: 0.18, label: 0 },
  { x: 0.22, y: 0.45, label: 0 },
  { x: 0.36, y: 0.2, label: 0 },
  { x: 0.46, y: 0.4, label: 0 },
  { x: 0.52, y: 0.72, label: 1 },
  { x: 0.68, y: 0.55, label: 1 },
  { x: 0.78, y: 0.82, label: 1 },
  { x: 0.9, y: 0.64, label: 1 }
];

const siliconModes = [
  { id: 'cmos', label: 'CMOS' },
  { id: 'clock', label: 'Clock' },
  { id: 'flipflop', label: 'Flip-flop' },
  { id: 'nand', label: 'NAND -> HA' }
];

const nandSteps = [
  {
    title: 'Step 0: inputs enter the NAND network',
    body: 'A 和 B 先进入第一个 NAND。这里还没有加法，只是在准备同时做 sum 和 carry。'
  },
  {
    title: 'Step 1: n1 = NAND(A, B)',
    body: 'n1 是最关键的中间信号：它既参与 XOR，也能被反相成 carry。'
  },
  {
    title: 'Step 2: build two guarded branches',
    body: 'n2 = NAND(A, n1)，n3 = NAND(B, n1)。这两条支路会在 A/B 不同时保持激活。'
  },
  {
    title: 'Step 3: sum = NAND(n2, n3)',
    body: '第四个 NAND 把两条支路合成 XOR，所以 half adder 的 sum 完成。'
  },
  {
    title: 'Step 4: carry = NAND(n1, n1)',
    body: '把 n1 接到 NAND 的两个输入，相当于 NOT(n1)，也就是 A AND B。'
  }
];

const state = {
  activeLab: 'switch',
  physical: {
    voltage: 0.72,
    noise: 0.12
  },
  logic: {
    gate: 'NAND',
    a: 1,
    b: 0
  },
  adder: {
    a: 1,
    b: 1,
    carryIn: 0,
    register: [0, 0],
    lastSaved: false
  },
  silicon: {
    mode: 'cmos',
    input: 0,
    clock: 0,
    edge: 'ready',
    d: 1,
    q: 0,
    a: 1,
    b: 1,
    nandStep: 0
  },
  cpu: {
    pc: 0,
    acc: 0,
    ram: { 12: 3, 13: 4, 14: 0 },
    output: null,
    halted: false,
    ticks: 0,
    running: false,
    phase: 'Ready'
  },
  learning: {
    w1: 0.6,
    w2: -0.45,
    bias: -0.08,
    rate: 0.22,
    cursor: 0,
    epoch: 0,
    mistakes: 0
  }
};

let cpuTimer = null;

render();

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;

  const action = target.dataset.action;

  if (action === 'select-lab') {
    state.activeLab = target.dataset.lab;
    stopCpu();
  }

  if (action === 'set-gate') {
    state.logic.gate = target.dataset.gate;
  }

  if (action === 'toggle-logic-bit') {
    state.logic[target.dataset.bit] = 1 - state.logic[target.dataset.bit];
  }

  if (action === 'toggle-adder-bit') {
    state.adder[target.dataset.bit] = 1 - state.adder[target.dataset.bit];
    state.adder.lastSaved = false;
  }

  if (action === 'set-silicon-mode') {
    state.silicon.mode = target.dataset.mode;
  }

  if (action === 'toggle-cmos-input') {
    state.silicon.input = 1 - state.silicon.input;
  }

  if (action === 'toggle-clock') {
    const nextClock = 1 - state.silicon.clock;
    state.silicon.edge = state.silicon.clock === 0 && nextClock === 1 ? 'rising edge' : 'falling edge';
    state.silicon.clock = nextClock;
  }

  if (action === 'toggle-d') {
    state.silicon.d = 1 - state.silicon.d;
  }

  if (action === 'tick-flipflop') {
    const nextClock = 1 - state.silicon.clock;
    const rising = state.silicon.clock === 0 && nextClock === 1;
    state.silicon.edge = rising ? 'rising edge: Q sampled D' : 'falling edge: Q holds';
    state.silicon.clock = nextClock;
    if (rising) state.silicon.q = state.silicon.d;
  }

  if (action === 'toggle-silicon-bit') {
    state.silicon[target.dataset.bit] = 1 - state.silicon[target.dataset.bit];
  }

  if (action === 'nand-next') {
    state.silicon.nandStep = Math.min(nandSteps.length - 1, state.silicon.nandStep + 1);
  }

  if (action === 'nand-prev') {
    state.silicon.nandStep = Math.max(0, state.silicon.nandStep - 1);
  }

  if (action === 'save-register') {
    const result = fullAdder(state.adder.a, state.adder.b, state.adder.carryIn);
    state.adder.register = [result.carry, result.sum];
    state.adder.lastSaved = true;
  }

  if (action === 'cpu-step') {
    stopCpu();
    stepCpu();
  }

  if (action === 'cpu-reset') {
    resetCpu();
  }

  if (action === 'cpu-run') {
    if (state.cpu.running) stopCpu();
    else runCpu();
  }

  if (action === 'train-one') {
    trainOnePoint();
  }

  if (action === 'train-epoch') {
    for (let i = 0; i < points.length; i += 1) trainOnePoint(false);
    state.learning.epoch += 1;
  }

  if (action === 'reset-learning') {
    Object.assign(state.learning, {
      w1: 0.6,
      w2: -0.45,
      bias: -0.08,
      rate: 0.22,
      cursor: 0,
      epoch: 0,
      mistakes: 0
    });
  }

  render();
});

app.addEventListener('input', (event) => {
  if (event.target.id === 'voltage') state.physical.voltage = Number(event.target.value);
  if (event.target.id === 'noise') state.physical.noise = Number(event.target.value);
  if (event.target.id === 'learn-rate') state.learning.rate = Number(event.target.value);
  if (event.target.id === 'weight-one') state.learning.w1 = Number(event.target.value);
  if (event.target.id === 'weight-two') state.learning.w2 = Number(event.target.value);
  if (event.target.id === 'bias') state.learning.bias = Number(event.target.value);
  render();
});

function render() {
  const active = labs.find((lab) => lab.id === state.activeLab);

  app.innerHTML = `
    <main class="app-shell">
      <aside class="rail" aria-label="学习层级导航">
        <div class="brand-block">
          <span class="brand-mark">01</span>
          <div>
            <p class="overline">Bits to Mind</p>
            <h1>从 0/1 到通用计算与智能涌现</h1>
          </div>
        </div>
        <nav class="lab-nav">
          ${labs
            .map(
              (lab, index) => `
                <button class="nav-item ${lab.id === state.activeLab ? 'active' : ''}" data-action="select-lab" data-lab="${lab.id}">
                  <span>${String(index + 1).padStart(2, '0')}</span>
                  <strong>${lab.short}</strong>
                </button>
              `
            )
            .join('')}
        </nav>
        <section class="throughline">
          <p class="overline">throughline</p>
          <p>稳定状态 -> 逻辑规则 -> CMOS 与时钟 -> 算术与存储 -> 指令循环 -> 学习反馈</p>
        </section>
      </aside>

      <section class="workbench" aria-label="交互实验台">
        <header class="bench-header">
          <div>
            <p class="overline">${active.eyebrow}</p>
            <h2>${active.title}</h2>
          </div>
          <p>${active.question}</p>
        </header>

        ${renderLab(active.id)}

        <footer class="insight-strip">
          <span>关键洞察</span>
          <strong>${active.insight}</strong>
        </footer>
      </section>
    </main>
  `;
}

function renderLab(labId) {
  if (labId === 'switch') return renderSwitchLab();
  if (labId === 'logic') return renderLogicLab();
  if (labId === 'silicon') return renderSiliconLab();
  if (labId === 'adder') return renderAdderLab();
  if (labId === 'cpu') return renderCpuLab();
  return renderLearningLab();
}

function renderSwitchLab() {
  const { voltage, noise } = state.physical;
  const threshold = 0.5;
  const bit = voltage >= threshold ? 1 : 0;
  const noisyLow = Math.max(0, voltage - noise);
  const noisyHigh = Math.min(1, voltage + noise);
  const stable = noisyLow >= threshold || noisyHigh < threshold;
  const x = 70 + voltage * 300;
  const gateOpen = bit === 1;

  return `
    <div class="lab-grid two">
      <section class="visual-panel silicon-panel">
        <svg class="circuit-svg" viewBox="0 0 720 440" role="img" aria-label="晶体管开关模型">
          <rect x="34" y="34" width="652" height="372" rx="18" class="chip-bg" />
          <path d="M94 270 H260" class="wire ${gateOpen ? 'hot' : ''}" />
          <path d="M460 270 H626" class="wire ${gateOpen ? 'hot' : ''}" />
          <rect x="280" y="214" width="160" height="112" rx="12" class="transistor-body" />
          <path d="M360 96 V214" class="gate-wire ${gateOpen ? 'hot' : ''}" />
          <rect x="320" y="196" width="80" height="18" rx="4" class="gate-plate ${gateOpen ? 'on' : ''}" />
          <rect x="306" y="248" width="108" height="44" rx="8" class="channel ${gateOpen ? 'on' : ''}" />
          <circle cx="94" cy="270" r="18" class="terminal source" />
          <circle cx="626" cy="270" r="28" class="lamp ${gateOpen ? 'on' : ''}" />
          <text x="94" y="326" text-anchor="middle" class="svg-label">source</text>
          <text x="626" y="326" text-anchor="middle" class="svg-label">output ${bit}</text>
          <text x="360" y="78" text-anchor="middle" class="svg-label">gate voltage</text>
          <g class="pulse-row ${gateOpen ? 'on' : ''}">
            ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${145 + i * 86}" cy="270" r="7" />`).join('')}
          </g>
          <line x1="70" y1="380" x2="370" y2="380" class="axis" />
          <line x1="220" y1="360" x2="220" y2="398" class="threshold" />
          <rect x="${70 + noisyLow * 300}" y="365" width="${Math.max(6, (noisyHigh - noisyLow) * 300)}" height="30" rx="5" class="noise-band ${stable ? 'stable' : 'unstable'}" />
          <circle cx="${x}" cy="380" r="12" class="voltage-dot ${bit ? 'one' : 'zero'}" />
          <text x="70" y="420" class="svg-note">0 zone</text>
          <text x="370" y="420" text-anchor="end" class="svg-note">1 zone</text>
        </svg>
      </section>

      <section class="control-panel">
        <div class="readout-big ${bit ? 'one' : 'zero'}">
          <span>interpreted bit</span>
          <strong>${bit}</strong>
        </div>
        <label class="range-row" for="voltage">
          <span>输入电压</span>
          <strong>${voltage.toFixed(2)} V</strong>
        </label>
        <input id="voltage" type="range" min="0" max="1" step="0.01" value="${voltage}" />
        <label class="range-row" for="noise">
          <span>噪声范围</span>
          <strong>+/- ${noise.toFixed(2)}</strong>
        </label>
        <input id="noise" type="range" min="0" max="0.32" step="0.01" value="${noise}" />
        <div class="status-stack">
          <div>
            <span>阈值</span>
            <strong>${threshold.toFixed(2)}：低于它当 0，高于它当 1</strong>
          </div>
          <div>
            <span>抗噪声</span>
            <strong>${stable ? '当前噪声不会跨过阈值，状态稳定' : '噪声跨过阈值，芯片会难以判断'}</strong>
          </div>
          <div>
            <span>芯片直觉</span>
            <strong>工程上先制造两个可靠状态，再用它们编码一切。</strong>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderLogicLab() {
  const { gate, a, b } = state.logic;
  const out = gateOutput(gate, a, b);
  const rows = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
  ];

  return `
    <div class="lab-grid two">
      <section class="visual-panel">
        <svg class="logic-svg" viewBox="0 0 720 440" role="img" aria-label="逻辑门交互电路">
          <rect x="34" y="34" width="652" height="372" rx="18" class="paper-bg" />
          <path d="M100 156 H255" class="wire ${a ? 'hot' : ''}" />
          <path d="M100 284 H255" class="wire ${b ? 'hot' : ''}" />
          <path d="M450 220 H620" class="wire ${out ? 'hot' : ''}" />
          <circle cx="100" cy="156" r="24" class="bit-node ${a ? 'one' : 'zero'}" />
          <circle cx="100" cy="284" r="24" class="bit-node ${b ? 'one' : 'zero'}" />
          <text x="100" y="162" text-anchor="middle" class="bit-text">${a}</text>
          <text x="100" y="290" text-anchor="middle" class="bit-text">${b}</text>
          ${gateShape(gate)}
          <circle cx="620" cy="220" r="34" class="bit-node ${out ? 'one' : 'zero'}" />
          <text x="620" y="229" text-anchor="middle" class="output-text">${out}</text>
          <text x="318" y="382" class="svg-caption">输入状态经过 ${gate} 规则，得到确定输出。</text>
        </svg>
      </section>

      <section class="control-panel">
        <div class="segmented">
          ${['NAND', 'AND', 'OR', 'XOR'].map((item) => `<button class="${gate === item ? 'active' : ''}" data-action="set-gate" data-gate="${item}">${item}</button>`).join('')}
        </div>
        <div class="bit-controls">
          ${bitButton('A', a, 'toggle-logic-bit', 'a')}
          ${bitButton('B', b, 'toggle-logic-bit', 'b')}
        </div>
        <table class="truth-table">
          <thead><tr><th>A</th><th>B</th><th>${gate}</th></tr></thead>
          <tbody>
            ${rows
              .map(([ra, rb]) => {
                const selected = ra === a && rb === b;
                return `<tr class="${selected ? 'selected' : ''}"><td>${ra}</td><td>${rb}</td><td>${gateOutput(gate, ra, rb)}</td></tr>`;
              })
              .join('')}
          </tbody>
        </table>
        <div class="nand-proof">
          <p class="overline">NAND universality</p>
          <div><span>NOT A</span><strong>NAND(A, A)</strong></div>
          <div><span>A AND B</span><strong>NOT(NAND(A, B))</strong></div>
          <div><span>A OR B</span><strong>NAND(NOT A, NOT B)</strong></div>
        </div>
      </section>
    </div>
  `;
}

function renderSiliconLab() {
  const silicon = state.silicon;
  const currentMode = siliconModes.find((mode) => mode.id === silicon.mode);

  return `
    <div class="lab-grid two">
      <section class="visual-panel">
        ${renderSiliconVisual()}
      </section>

      <section class="control-panel">
        <div class="segmented silicon-tabs">
          ${siliconModes.map((mode) => `<button class="${silicon.mode === mode.id ? 'active' : ''}" data-action="set-silicon-mode" data-mode="${mode.id}">${mode.label}</button>`).join('')}
        </div>
        <div class="equation-card">
          <span>current model</span>
          <strong>${currentMode.label}</strong>
          <p>${siliconModeCopy(silicon.mode)}</p>
        </div>
        ${renderSiliconControls()}
      </section>
    </div>
  `;
}

function renderSiliconVisual() {
  if (state.silicon.mode === 'clock') return renderClockVisual();
  if (state.silicon.mode === 'flipflop') return renderFlipFlopVisual();
  if (state.silicon.mode === 'nand') return renderNandHalfAdderVisual();
  return renderCmosVisual();
}

function renderSiliconControls() {
  const s = state.silicon;

  if (s.mode === 'clock') {
    return `
      <div class="cpu-registers">
        <div><span>clock</span><strong>${s.clock}</strong></div>
        <div><span>edge</span><strong>${s.edge}</strong></div>
        <div><span>rule</span><strong>sample on rise</strong></div>
      </div>
      <button class="primary-action" data-action="toggle-clock">Toggle clock</button>
      <div class="status-stack">
        <div><span>为什么需要时钟</span><strong>组合逻辑会不断传播变化，时钟把系统切成一拍一拍的稳定观察点。</strong></div>
        <div><span>边沿</span><strong>真正触发保存的不是“高电平持续期间”，而是 0 -> 1 这一下。</strong></div>
      </div>
    `;
  }

  if (s.mode === 'flipflop') {
    return `
      <div class="bit-controls">
        ${bitButton('D input', s.d, 'toggle-d', 'd')}
        ${bitButton('Q saved', s.q, 'noop', 'q')}
      </div>
      <div class="cpu-registers">
        <div><span>clock</span><strong>${s.clock}</strong></div>
        <div><span>last edge</span><strong>${s.edge}</strong></div>
        <div><span>output</span><strong>Q=${s.q}</strong></div>
      </div>
      <button class="primary-action" data-action="tick-flipflop">Clock edge</button>
      <div class="status-stack">
        <div><span>D flip-flop</span><strong>上升沿到来时，Q 复制 D；其他时候 Q 保持。</strong></div>
        <div><span>芯片直觉</span><strong>寄存器就是许多 flip-flop 并排保存多个 bit。</strong></div>
      </div>
    `;
  }

  if (s.mode === 'nand') {
    const values = nandHalfAdderValues(s.a, s.b);
    const step = nandSteps[s.nandStep];
    return `
      <div class="bit-controls">
        ${bitButton('A', s.a, 'toggle-silicon-bit', 'a')}
        ${bitButton('B', s.b, 'toggle-silicon-bit', 'b')}
      </div>
      <div class="button-pair">
        <button data-action="nand-prev">Prev</button>
        <button class="primary-action" data-action="nand-next">Next</button>
        <button data-action="select-lab" data-lab="adder">Full adder</button>
      </div>
      <div class="equation-card">
        <span>${step.title}</span>
        <strong>sum=${values.sum}, carry=${values.carry}</strong>
        <p>${step.body}</p>
      </div>
      <div class="status-stack">
        <div><span>只用 NAND</span><strong>5 个 NAND 就能拼出 half adder：sum 是 XOR，carry 是 AND。</strong></div>
      </div>
    `;
  }

  const output = 1 - s.input;
  return `
    <div class="bit-controls">
      ${bitButton('Input A', s.input, 'toggle-cmos-input', 'input')}
      ${bitButton('Output Y', output, 'noop', 'output')}
    </div>
    <button class="primary-action" data-action="toggle-cmos-input">Toggle input</button>
    <div class="status-stack">
      <div><span>PMOS</span><strong>${s.input ? 'OFF：输入高时，上拉断开' : 'ON：输入低时，把输出拉到 VDD'}</strong></div>
      <div><span>NMOS</span><strong>${s.input ? 'ON：输入高时，把输出拉到 GND' : 'OFF：输入低时，下拉断开'}</strong></div>
      <div><span>反相器</span><strong>CMOS inverter 是 NOT 门，也是很多复杂门电路的基础单元。</strong></div>
    </div>
  `;
}

function siliconModeCopy(mode) {
  if (mode === 'clock') return '时钟不是“电变快了”，而是给所有状态保存规定统一节拍。';
  if (mode === 'flipflop') return 'flip-flop 把 D 输入在上升沿拷贝到 Q，之后保持，直到下一次采样。';
  if (mode === 'nand') return 'NAND 网络展示“通用性”不是口号：同一种门可以逐步拼出加法器。';
  return 'CMOS 用互补的 PMOS/NMOS 做反相：一个拉高、一个拉低，输出稳定落到 0 或 1。';
}

function renderCmosVisual() {
  const s = state.silicon;
  const output = 1 - s.input;
  const pOn = s.input === 0;
  const nOn = s.input === 1;

  return `
    <svg class="silicon-svg" viewBox="0 0 760 500" role="img" aria-label="CMOS 反相器">
      <rect x="34" y="34" width="692" height="432" rx="18" class="chip-bg" />
      <text x="76" y="84" class="silicon-title">CMOS inverter</text>
      <path d="M382 92 V140" class="power-line ${pOn ? 'hot' : ''}" />
      <text x="406" y="104" class="svg-note">VDD</text>
      <path d="M382 360 V416" class="ground-line ${nOn ? 'hot' : ''}" />
      <text x="406" y="416" class="svg-note">GND</text>
      <rect x="278" y="142" width="208" height="86" rx="14" class="mos ${pOn ? 'on' : ''}" />
      <rect x="278" y="274" width="208" height="86" rx="14" class="mos ${nOn ? 'on' : ''}" />
      <text x="382" y="192" text-anchor="middle" class="block-title">PMOS ${pOn ? 'ON' : 'OFF'}</text>
      <text x="382" y="324" text-anchor="middle" class="block-title">NMOS ${nOn ? 'ON' : 'OFF'}</text>
      <path d="M144 251 H278" class="wire ${s.input ? 'hot' : ''}" />
      <path d="M486 251 H622" class="wire ${output ? 'hot' : ''}" />
      <path d="M382 228 V274" class="wire ${output ? 'hot' : nOn ? 'ground-hot' : ''}" />
      <circle cx="144" cy="251" r="31" class="bit-node ${s.input ? 'one' : 'zero'}" />
      <circle cx="622" cy="251" r="35" class="bit-node ${output ? 'one' : 'zero'}" />
      <text x="144" y="260" text-anchor="middle" class="output-text">${s.input}</text>
      <text x="622" y="261" text-anchor="middle" class="output-text">${output}</text>
      <text x="144" y="306" text-anchor="middle" class="svg-label">input A</text>
      <text x="622" y="310" text-anchor="middle" class="svg-label">output Y</text>
      <text x="76" y="438" class="svg-caption">A=${s.input} -> Y=NOT(A)=${output}</text>
    </svg>
  `;
}

function renderClockVisual() {
  const s = state.silicon;
  const high = s.clock === 1;
  const markerX = high ? 514 : 386;

  return `
    <svg class="silicon-svg" viewBox="0 0 760 500" role="img" aria-label="时钟边沿">
      <rect x="34" y="34" width="692" height="432" rx="18" class="paper-bg" />
      <text x="76" y="84" class="silicon-title">clock edge</text>
      <path d="M92 330 H170 V170 H290 V330 H410 V170 H530 V330 H650" class="wave-line" />
      <path d="M92 330 H170 V170 H290 V330 H410 V170 H530 V330 H650" class="wave-line active" stroke-dasharray="${high ? '438 999' : '318 999'}" />
      <line x1="${markerX}" y1="128" x2="${markerX}" y2="374" class="edge-marker ${high ? 'rise' : 'fall'}" />
      <circle cx="${markerX}" cy="${high ? 170 : 330}" r="17" class="voltage-dot ${high ? 'one' : 'zero'}" />
      <text x="${markerX}" y="112" text-anchor="middle" class="svg-label">${s.edge}</text>
      <rect x="124" y="398" width="514" height="42" rx="8" class="register-box saved" />
      <text x="381" y="425" text-anchor="middle" class="register-text">所有寄存器约定在 clock edge 同步观察输入</text>
    </svg>
  `;
}

function renderFlipFlopVisual() {
  const s = state.silicon;

  return `
    <svg class="silicon-svg" viewBox="0 0 760 500" role="img" aria-label="D flip-flop">
      <rect x="34" y="34" width="692" height="432" rx="18" class="paper-bg" />
      <text x="76" y="84" class="silicon-title">D flip-flop</text>
      <path d="M96 190 H260" class="wire ${s.d ? 'hot' : ''}" />
      <path d="M96 314 H260" class="wire ${s.clock ? 'hot' : ''}" />
      <rect x="260" y="132" width="238" height="240" rx="18" class="alu-box" />
      <path d="M260 294 L296 314 L260 334 Z" class="clock-notch" />
      <text x="378" y="198" text-anchor="middle" class="alu-title">sample D</text>
      <text x="378" y="248" text-anchor="middle" class="alu-formula">only on rising edge</text>
      <text x="378" y="304" text-anchor="middle" class="alu-title">Q = ${s.q}</text>
      <path d="M498 246 H650" class="wire ${s.q ? 'hot' : ''}" />
      <circle cx="96" cy="190" r="30" class="bit-node ${s.d ? 'one' : 'zero'}" />
      <circle cx="96" cy="314" r="30" class="bit-node ${s.clock ? 'one' : 'zero'}" />
      <circle cx="650" cy="246" r="34" class="bit-node ${s.q ? 'one' : 'zero'}" />
      <text x="96" y="199" text-anchor="middle" class="output-text">${s.d}</text>
      <text x="96" y="323" text-anchor="middle" class="output-text">${s.clock}</text>
      <text x="650" y="256" text-anchor="middle" class="output-text">${s.q}</text>
      <text x="96" y="145" text-anchor="middle" class="svg-label">D</text>
      <text x="96" y="372" text-anchor="middle" class="svg-label">clock</text>
      <text x="650" y="304" text-anchor="middle" class="svg-label">Q</text>
      <text x="76" y="438" class="svg-caption">${s.edge}</text>
    </svg>
  `;
}

function renderNandHalfAdderVisual() {
  const s = state.silicon;
  const v = nandHalfAdderValues(s.a, s.b);
  const step = s.nandStep;
  const hot = (minStep) => step >= minStep;

  return `
    <svg class="silicon-svg" viewBox="0 0 820 520" role="img" aria-label="NAND 拼半加器">
      <rect x="34" y="34" width="752" height="452" rx="18" class="paper-bg" />
      <text x="76" y="84" class="silicon-title">half adder from NAND</text>
      ${nandNode(118, 170, 'A', s.a, true)}
      ${nandNode(118, 330, 'B', s.b, true)}
      ${nandGateBox(280, 220, 'n1', v.n1, hot(1))}
      ${nandGateBox(450, 140, 'n2', v.n2, hot(2))}
      ${nandGateBox(450, 300, 'n3', v.n3, hot(2))}
      ${nandGateBox(610, 220, 'sum', v.sum, hot(3))}
      ${nandGateBox(610, 390, 'carry', v.carry, hot(4))}
      <path d="M148 170 C210 170 206 220 280 220" class="wire ${hot(0) && s.a ? 'hot' : ''}" />
      <path d="M148 330 C210 330 206 260 280 260" class="wire ${hot(0) && s.b ? 'hot' : ''}" />
      <path d="M360 240 C400 240 400 160 450 160" class="wire ${hot(1) && v.n1 ? 'hot' : ''}" />
      <path d="M148 170 C330 170 330 120 450 120" class="wire ${hot(2) && s.a ? 'hot' : ''}" />
      <path d="M360 240 C400 240 400 320 450 320" class="wire ${hot(1) && v.n1 ? 'hot' : ''}" />
      <path d="M148 330 C330 330 330 280 450 280" class="wire ${hot(2) && s.b ? 'hot' : ''}" />
      <path d="M530 160 C570 160 570 220 610 220" class="wire ${hot(2) && v.n2 ? 'hot' : ''}" />
      <path d="M530 320 C570 320 570 260 610 260" class="wire ${hot(2) && v.n3 ? 'hot' : ''}" />
      <path d="M360 240 C500 240 510 390 610 390" class="wire ${hot(4) && v.n1 ? 'hot' : ''}" />
      <path d="M360 240 C500 240 510 430 610 430" class="wire ${hot(4) && v.n1 ? 'hot' : ''}" />
      <text x="76" y="462" class="svg-caption">${nandSteps[step].title}</text>
    </svg>
  `;
}

function nandNode(x, y, label, value) {
  return `
    <circle cx="${x}" cy="${y}" r="30" class="bit-node ${value ? 'one' : 'zero'}" />
    <text x="${x}" y="${y + 9}" text-anchor="middle" class="output-text">${value}</text>
    <text x="${x}" y="${y - 48}" text-anchor="middle" class="svg-label">${label}</text>
  `;
}

function nandGateBox(x, y, label, value, active) {
  return `
    <g class="${active ? 'active-nand' : ''}">
      <rect x="${x}" y="${y - 38}" width="80" height="76" rx="12" class="nand-box ${active ? 'active' : ''}" />
      <text x="${x + 40}" y="${y - 7}" text-anchor="middle" class="svg-note">NAND</text>
      <text x="${x + 40}" y="${y + 24}" text-anchor="middle" class="block-bits">${label}:${active ? value : '-'}</text>
    </g>
  `;
}

function nandHalfAdderValues(a, b) {
  const n1 = Number(!(a & b));
  const n2 = Number(!(a & n1));
  const n3 = Number(!(b & n1));
  const sum = Number(!(n2 & n3));
  const carry = Number(!(n1 & n1));
  return { n1, n2, n3, sum, carry };
}

function renderAdderLab() {
  const { a, b, carryIn, register, lastSaved } = state.adder;
  const result = fullAdder(a, b, carryIn);
  const decimal = a + b + carryIn;

  return `
    <div class="lab-grid two">
      <section class="visual-panel">
        <svg class="adder-svg" viewBox="0 0 760 460" role="img" aria-label="全加器和寄存器">
          <rect x="34" y="34" width="692" height="392" rx="18" class="paper-bg" />
          ${inputRail(108, 'A', a)}
          ${inputRail(208, 'B', b)}
          ${inputRail(308, 'Cin', carryIn)}
          <rect x="280" y="116" width="205" height="220" rx="18" class="alu-box" />
          <text x="382" y="168" text-anchor="middle" class="alu-title">Full Adder</text>
          <text x="382" y="212" text-anchor="middle" class="alu-formula">sum = A XOR B XOR Cin</text>
          <text x="382" y="252" text-anchor="middle" class="alu-formula">carry = majority(A, B, Cin)</text>
          <path d="M485 188 H632" class="wire ${result.sum ? 'hot' : ''}" />
          <path d="M485 264 H632" class="wire ${result.carry ? 'hot' : ''}" />
          <circle cx="652" cy="188" r="30" class="bit-node ${result.sum ? 'one' : 'zero'}" />
          <circle cx="652" cy="264" r="30" class="bit-node ${result.carry ? 'one' : 'zero'}" />
          <text x="652" y="197" text-anchor="middle" class="output-text">${result.sum}</text>
          <text x="652" y="273" text-anchor="middle" class="output-text">${result.carry}</text>
          <text x="652" y="145" text-anchor="middle" class="svg-label">sum</text>
          <text x="652" y="322" text-anchor="middle" class="svg-label">carry</text>
          <rect x="286" y="362" width="194" height="44" rx="10" class="register-box ${lastSaved ? 'saved' : ''}" />
          <text x="382" y="390" text-anchor="middle" class="register-text">register: ${register.join('')}</text>
        </svg>
      </section>

      <section class="control-panel">
        <div class="bit-controls three">
          ${bitButton('A', a, 'toggle-adder-bit', 'a')}
          ${bitButton('B', b, 'toggle-adder-bit', 'b')}
          ${bitButton('Carry in', carryIn, 'toggle-adder-bit', 'carryIn')}
        </div>
        <div class="equation-card">
          <span>decimal view</span>
          <strong>${a} + ${b} + ${carryIn} = ${decimal}</strong>
          <p>二进制输出是 carry=${result.carry}, sum=${result.sum}，也就是 ${result.carry}${result.sum}。</p>
        </div>
        <button class="primary-action" data-action="save-register">把输出锁存到寄存器</button>
        <div class="status-stack">
          <div><span>组合逻辑</span><strong>输入一变，sum/carry 立刻跟着变。</strong></div>
          <div><span>时序逻辑</span><strong>点击锁存，寄存器保存这一刻的输出。</strong></div>
          <div><span>芯片直觉</span><strong>计算 = 变换；记忆 = 在时钟边沿保存状态。</strong></div>
        </div>
      </section>
    </div>
  `;
}

function renderCpuLab() {
  const cpu = state.cpu;
  const instruction = program[Math.min(cpu.pc, program.length - 1)];
  const ramCells = [12, 13, 14];

  return `
    <div class="lab-grid two cpu-layout">
      <section class="visual-panel">
        <svg class="cpu-svg" viewBox="0 0 780 480" role="img" aria-label="迷你 CPU 数据通路">
          <rect x="34" y="34" width="712" height="412" rx="18" class="chip-bg" />
          <rect x="92" y="92" width="180" height="110" rx="14" class="cpu-block ${cpu.phase === 'Fetch' ? 'active' : ''}" />
          <text x="182" y="134" text-anchor="middle" class="block-title">Instruction Memory</text>
          <text x="182" y="170" text-anchor="middle" class="block-bits">${instruction.bits}</text>
          <rect x="326" y="92" width="130" height="110" rx="14" class="cpu-block ${cpu.phase === 'Decode' ? 'active' : ''}" />
          <text x="391" y="134" text-anchor="middle" class="block-title">Decoder</text>
          <text x="391" y="170" text-anchor="middle" class="block-bits">${instruction.op}</text>
          <rect x="510" y="92" width="150" height="110" rx="14" class="cpu-block ${cpu.phase === 'Execute' ? 'active' : ''}" />
          <text x="585" y="134" text-anchor="middle" class="block-title">ALU</text>
          <text x="585" y="170" text-anchor="middle" class="block-bits">ACC ${toBinary(cpu.acc, 4)}</text>
          <path d="M272 147 H326" class="wire hot" />
          <path d="M456 147 H510" class="wire hot" />
          <path d="M585 202 V286 H486" class="wire ${cpu.phase === 'Execute' ? 'hot' : ''}" />
          <rect x="112" y="286" width="374" height="106" rx="14" class="memory-block" />
          <text x="146" y="326" class="block-title">RAM</text>
          ${ramCells
            .map((addr, index) => `
              <g transform="translate(${236 + index * 78} 320)">
                <rect x="0" y="0" width="56" height="42" rx="8" class="ram-cell ${instruction.arg === addr ? 'active' : ''}" />
                <text x="28" y="-8" text-anchor="middle" class="svg-note">${addr}</text>
                <text x="28" y="27" text-anchor="middle" class="block-bits">${toBinary(cpu.ram[addr], 4)}</text>
              </g>
            `)
            .join('')}
          <rect x="546" y="296" width="116" height="86" rx="14" class="output-block ${cpu.output !== null ? 'active' : ''}" />
          <text x="604" y="331" text-anchor="middle" class="block-title">Output</text>
          <text x="604" y="362" text-anchor="middle" class="block-bits">${cpu.output === null ? '----' : cpu.output}</text>
          <text x="92" y="428" class="svg-caption">PC=${cpu.pc} | tick=${cpu.ticks} | ${cpu.phase}</text>
        </svg>
      </section>

      <section class="control-panel">
        <div class="cpu-registers">
          <div><span>PC</span><strong>${cpu.pc}</strong></div>
          <div><span>ACC</span><strong>${cpu.acc}</strong></div>
          <div><span>OUT</span><strong>${cpu.output === null ? '-' : cpu.output}</strong></div>
        </div>
        <div class="button-pair">
          <button class="primary-action" data-action="cpu-step" ${cpu.halted ? 'disabled' : ''}>Step</button>
          <button data-action="cpu-run" ${cpu.halted ? 'disabled' : ''}>${cpu.running ? 'Pause' : 'Run'}</button>
          <button data-action="cpu-reset">Reset</button>
        </div>
        <ol class="program-list">
          ${program
            .map(
              (item, index) => `
                <li class="${index === cpu.pc && !cpu.halted ? 'active' : ''}">
                  <code>${item.bits}</code>
                  <span>${item.op} ${item.op === 'HALT' ? '' : item.arg}</span>
                  <small>${item.text}</small>
                </li>
              `
            )
            .join('')}
        </ol>
      </section>
    </div>
  `;
}

function renderLearningLab() {
  const l = state.learning;
  const current = points[l.cursor % points.length];
  const prediction = predict(current.x, current.y);
  const accuracy = points.filter((point) => predict(point.x, point.y) === point.label).length;
  const line = decisionLine();

  return `
    <div class="lab-grid two">
      <section class="visual-panel">
        <svg class="learn-svg" viewBox="0 0 720 480" role="img" aria-label="感知机学习分类边界">
          <rect x="34" y="34" width="652" height="412" rx="18" class="paper-bg" />
          <g transform="translate(110 66)">
            <rect x="0" y="0" width="440" height="340" rx="12" class="plot-bg" />
            ${[0.25, 0.5, 0.75].map((t) => `<line x1="${t * 440}" y1="0" x2="${t * 440}" y2="340" class="grid-line" /><line x1="0" y1="${t * 340}" x2="440" y2="${t * 340}" class="grid-line" />`).join('')}
            <line x1="${line.x1}" y1="${line.y1}" x2="${line.x2}" y2="${line.y2}" class="decision-line" />
            ${points
              .map((point, index) => {
                const px = point.x * 440;
                const py = 340 - point.y * 340;
                const correct = predict(point.x, point.y) === point.label;
                return `
                  <circle cx="${px}" cy="${py}" r="${index === l.cursor % points.length ? 14 : 11}" class="sample-point label-${point.label} ${correct ? 'correct' : 'wrong'}" />
                  <text x="${px}" y="${py + 5}" text-anchor="middle" class="sample-text">${point.label}</text>
                `;
              })
              .join('')}
            <text x="0" y="374" class="svg-caption">x feature</text>
            <text x="-42" y="18" class="svg-caption">y feature</text>
          </g>
          <g transform="translate(590 120)">
            <circle cx="0" cy="0" r="34" class="neuron" />
            <text x="0" y="6" text-anchor="middle" class="neuron-text">Σ</text>
            <path d="M-96 -44 H-36" class="wire hot" />
            <path d="M-96 44 H-36" class="wire hot" />
            <path d="M34 0 H84" class="wire ${prediction ? 'hot' : ''}" />
            <text x="-106" y="-50" text-anchor="end" class="svg-note">w1 ${l.w1.toFixed(2)}</text>
            <text x="-106" y="50" text-anchor="end" class="svg-note">w2 ${l.w2.toFixed(2)}</text>
            <text x="92" y="6" class="block-bits">${prediction}</text>
          </g>
        </svg>
      </section>

      <section class="control-panel">
        <div class="cpu-registers">
          <div><span>accuracy</span><strong>${accuracy}/${points.length}</strong></div>
          <div><span>epoch</span><strong>${l.epoch}</strong></div>
          <div><span>mistakes</span><strong>${l.mistakes}</strong></div>
        </div>
        <div class="button-pair">
          <button class="primary-action" data-action="train-one">Train one</button>
          <button data-action="train-epoch">Train epoch</button>
          <button data-action="reset-learning">Reset</button>
        </div>
        ${weightSlider('weight-one', 'w1', l.w1, -2, 2)}
        ${weightSlider('weight-two', 'w2', l.w2, -2, 2)}
        ${weightSlider('bias', 'bias', l.bias, -1.5, 1.5)}
        <label class="range-row" for="learn-rate">
          <span>learning rate</span>
          <strong>${l.rate.toFixed(2)}</strong>
        </label>
        <input id="learn-rate" type="range" min="0.02" max="0.6" step="0.02" value="${l.rate}" />
        <div class="equation-card">
          <span>current sample</span>
          <strong>target ${current.label}, prediction ${prediction}</strong>
          <p>错误时，权重会朝着能减少下次错误的方向移动。学习就是状态被反馈持续修正。</p>
        </div>
      </section>
    </div>
  `;
}

function bitButton(label, value, action, bit) {
  return `
    <button class="bit-toggle ${value ? 'one' : 'zero'}" data-action="${action}" data-bit="${bit}">
      <span>${label}</span>
      <strong>${value}</strong>
    </button>
  `;
}

function weightSlider(id, label, value, min, max) {
  return `
    <label class="range-row" for="${id}">
      <span>${label}</span>
      <strong>${value.toFixed(2)}</strong>
    </label>
    <input id="${id}" type="range" min="${min}" max="${max}" step="0.01" value="${value}" />
  `;
}

function gateOutput(gate, a, b) {
  if (gate === 'AND') return a & b;
  if (gate === 'OR') return a | b;
  if (gate === 'XOR') return a ^ b;
  return Number(!(a & b));
}

function gateShape(gate) {
  const bubble = gate === 'NAND' ? '<circle cx="456" cy="220" r="14" class="gate-bubble" />' : '';
  const label = gate === 'NAND' ? 'AND + NOT' : gate;
  return `
    <path d="M258 116 H338 C428 116 458 168 458 220 C458 272 428 324 338 324 H258 Z" class="gate-body" />
    ${bubble}
    <text x="344" y="228" text-anchor="middle" class="gate-label">${label}</text>
  `;
}

function fullAdder(a, b, carryIn) {
  const sum = a ^ b ^ carryIn;
  const carry = (a & b) | (a & carryIn) | (b & carryIn);
  return { sum, carry };
}

function inputRail(y, label, value) {
  return `
    <path d="M96 ${y} H280" class="wire ${value ? 'hot' : ''}" />
    <circle cx="96" cy="${y}" r="26" class="bit-node ${value ? 'one' : 'zero'}" />
    <text x="96" y="${y + 8}" text-anchor="middle" class="bit-text">${value}</text>
    <text x="58" y="${y + 6}" text-anchor="end" class="svg-label">${label}</text>
  `;
}

function stepCpu() {
  const cpu = state.cpu;
  if (cpu.halted) return;

  const instruction = program[cpu.pc];
  cpu.phase = 'Fetch';

  if (instruction.op === 'LOAD') {
    cpu.acc = cpu.ram[instruction.arg];
    cpu.phase = 'Execute';
  }
  if (instruction.op === 'ADD') {
    cpu.acc += cpu.ram[instruction.arg];
    cpu.phase = 'Execute';
  }
  if (instruction.op === 'STORE') {
    cpu.ram[instruction.arg] = cpu.acc;
    cpu.phase = 'Execute';
  }
  if (instruction.op === 'OUT') {
    cpu.output = cpu.ram[instruction.arg];
    cpu.phase = 'Execute';
  }
  if (instruction.op === 'HALT') {
    cpu.halted = true;
    cpu.running = false;
    cpu.phase = 'Halted';
  }

  cpu.ticks += 1;
  if (!cpu.halted) cpu.pc += 1;
  if (cpu.pc >= program.length) cpu.halted = true;
}

function runCpu() {
  state.cpu.running = true;
  cpuTimer = window.setInterval(() => {
    stepCpu();
    render();
    if (state.cpu.halted) stopCpu();
  }, 820);
}

function stopCpu() {
  state.cpu.running = false;
  if (cpuTimer) window.clearInterval(cpuTimer);
  cpuTimer = null;
}

function resetCpu() {
  stopCpu();
  Object.assign(state.cpu, {
    pc: 0,
    acc: 0,
    ram: { 12: 3, 13: 4, 14: 0 },
    output: null,
    halted: false,
    ticks: 0,
    running: false,
    phase: 'Ready'
  });
}

function toBinary(value, width) {
  return Math.max(0, value).toString(2).padStart(width, '0').slice(-width);
}

function predict(x, y) {
  return state.learning.w1 * x + state.learning.w2 * y + state.learning.bias >= 0 ? 1 : 0;
}

function trainOnePoint(countEpoch = true) {
  const l = state.learning;
  const point = points[l.cursor % points.length];
  const prediction = predict(point.x, point.y);
  const error = point.label - prediction;

  if (error !== 0) {
    l.w1 += l.rate * error * point.x;
    l.w2 += l.rate * error * point.y;
    l.bias += l.rate * error;
    l.mistakes += 1;
  }

  l.cursor = (l.cursor + 1) % points.length;
  if (countEpoch && l.cursor === 0) l.epoch += 1;
}

function decisionLine() {
  const { w1, w2, bias } = state.learning;
  const yAt = (x) => -(w1 * x + bias) / (w2 || 0.001);
  const p1 = { x: 0, y: yAt(0) };
  const p2 = { x: 1, y: yAt(1) };
  return {
    x1: p1.x * 440,
    y1: 340 - p1.y * 340,
    x2: p2.x * 440,
    y2: 340 - p2.y * 340
  };
}

window.__bitsToMindDebug = {
  state,
  labs,
  stepCpu,
  trainOnePoint,
  predict,
  gateOutput,
  fullAdder
};
