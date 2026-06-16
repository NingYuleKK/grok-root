import { createRoomState, inspectObject } from "./room-state.js";

const room = document.querySelector("[data-room]");
const observationText = document.querySelector("[data-observation]");
const log = document.querySelector("[data-log]");
const resetButton = document.querySelector("[data-reset]");

let state = createRoomState();

function render() {
  for (const [id, object] of Object.entries(state.objects)) {
    const element = room.querySelector(`[data-object="${id}"]`);
    const status = element.querySelector("[data-status]");

    element.dataset.discovered = String(object.discovered);
    element.setAttribute(
      "aria-pressed",
      object.discovered ? "true" : "false"
    );
    status.textContent = object.discovered ? object.activeLabel : object.idleLabel;
  }

  const latest = state.observations.at(-1);
  observationText.textContent = latest.text;
  log.replaceChildren(
    ...state.observations
      .slice()
      .reverse()
      .map((entry) => {
        const item = document.createElement("li");
        item.textContent = entry.text;
        return item;
      })
  );
}

room.addEventListener("click", (event) => {
  const object = event.target.closest("[data-object]");

  if (!object) {
    return;
  }

  state = inspectObject(state, object.dataset.object);
  render();
});

resetButton.addEventListener("click", () => {
  state = createRoomState();
  render();
});

render();
