export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value)));
}

export function round(value, places = 3) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function createSceneState(intensityInput) {
  const intensity = clamp(Number(intensityInput), 0, 1);

  return {
    intensity: round(intensity),
    glowOpacity: round(0.16 + intensity * 0.6),
    orbitSpeed: round(34 - intensity * 22),
    breathScale: round(1 + intensity * 0.1),
  };
}

export function updateRotationFromDrag(start, current, rotation) {
  const dx = current.x - start.x;
  const dy = current.y - start.y;

  return {
    rx: round(clamp(rotation.rx + dy * 0.2, -65, 65)),
    ry: round(clamp(rotation.ry + dx * 0.2, -160, 160)),
  };
}

function setSceneState(root, state) {
  root.style.setProperty("--glow-opacity", String(state.glowOpacity));
  root.style.setProperty("--orbit-speed", `${state.orbitSpeed}s`);
  root.style.setProperty("--breath-scale", String(state.breathScale));
  root.style.setProperty("--intensity", String(state.intensity));
}

function drawSky(canvas, state) {
  const context = canvas.getContext("2d");
  const pixelRatio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * pixelRatio);
  canvas.height = Math.floor(rect.height * pixelRatio);
  context.scale(pixelRatio, pixelRatio);
  context.clearRect(0, 0, rect.width, rect.height);

  const gradient = context.createRadialGradient(
    rect.width * 0.5,
    rect.height * 0.52,
    20,
    rect.width * 0.5,
    rect.height * 0.48,
    Math.max(rect.width, rect.height) * 0.72,
  );
  gradient.addColorStop(0, `rgba(197, 168, 95, ${0.12 + state.intensity * 0.22})`);
  gradient.addColorStop(0.42, "rgba(28, 30, 38, 0.64)");
  gradient.addColorStop(1, "rgba(3, 5, 10, 0.96)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, rect.width, rect.height);

  const count = Math.floor(80 + state.intensity * 90);
  for (let index = 0; index < count; index += 1) {
    const x = (Math.sin(index * 97.13) * 0.5 + 0.5) * rect.width;
    const y = (Math.cos(index * 43.71) * 0.5 + 0.5) * rect.height;
    const radius = 0.35 + ((index * 17) % 8) / 10;
    const alpha = 0.18 + (((index * 13) % 10) / 10) * (0.24 + state.intensity * 0.28);
    context.beginPath();
    context.fillStyle = `rgba(244, 224, 177, ${alpha})`;
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
}

export function initSacredCube() {
  const root = document.querySelector("[data-sacred-cube]");
  if (!root) return;

  const cube = root.querySelector("[data-cube]");
  const intensity = root.querySelector("[data-intensity]");
  const canvas = root.querySelector("[data-sky]");
  const orbitToggle = root.querySelector("[data-orbit-toggle]");
  const veilToggle = root.querySelector("[data-veil-toggle]");
  const resetButton = root.querySelector("[data-reset]");

  let rotation = { rx: -18, ry: 33 };
  let dragStart = null;
  let dragBase = null;

  const renderRotation = () => {
    cube.style.transform = `rotateX(${rotation.rx}deg) rotateY(${rotation.ry}deg)`;
  };

  const renderState = () => {
    const state = createSceneState(Number(intensity.value) / 100);
    setSceneState(root, state);
    drawSky(canvas, state);
  };

  const stopDrag = () => {
    dragStart = null;
    dragBase = null;
    root.classList.remove("is-dragging");
  };

  intensity.addEventListener("input", renderState);
  orbitToggle.addEventListener("click", () => {
    const isPaused = root.classList.toggle("orbit-paused");
    orbitToggle.setAttribute("aria-pressed", String(!isPaused));
  });
  veilToggle.addEventListener("click", () => {
    const isVisible = root.classList.toggle("veil-visible");
    veilToggle.setAttribute("aria-pressed", String(isVisible));
  });
  resetButton.addEventListener("click", () => {
    rotation = { rx: -18, ry: 33 };
    intensity.value = "58";
    root.classList.remove("orbit-paused", "veil-visible");
    orbitToggle.setAttribute("aria-pressed", "true");
    veilToggle.setAttribute("aria-pressed", "false");
    renderRotation();
    renderState();
  });

  root.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, input")) return;
    root.setPointerCapture(event.pointerId);
    dragStart = { x: event.clientX, y: event.clientY };
    dragBase = { ...rotation };
    root.classList.add("is-dragging");
  });

  root.addEventListener("pointermove", (event) => {
    if (!dragStart || !dragBase) return;
    rotation = updateRotationFromDrag(dragStart, { x: event.clientX, y: event.clientY }, dragBase);
    renderRotation();
  });

  root.addEventListener("pointerup", stopDrag);
  root.addEventListener("pointercancel", stopDrag);
  window.addEventListener("resize", renderState);

  renderRotation();
  renderState();
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", initSacredCube);
}
