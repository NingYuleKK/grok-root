import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createRoomState, inspectObject } from "../src/room-state.js";

describe("room state", () => {
  it("marks an object as discovered and records an observation", () => {
    const state = createRoomState();

    const next = inspectObject(state, "lamp");

    assert.equal(next.objects.lamp.discovered, true);
    assert.equal(next.observations.at(-1).objectId, "lamp");
    assert.match(next.observations.at(-1).text, /lamp/i);
  });
});
