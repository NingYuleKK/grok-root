import assert from "node:assert/strict";
import test from "node:test";

import {
  clamp,
  createSceneState,
  updateRotationFromDrag,
} from "./sacred-cube.mjs";

test("clamp keeps interaction values inside a safe visual range", () => {
  assert.equal(clamp(-2, 0, 1), 0);
  assert.equal(clamp(0.42, 0, 1), 0.42);
  assert.equal(clamp(3, 0, 1), 1);
});

test("createSceneState maps devotion intensity to visual rhythm", () => {
  assert.deepEqual(createSceneState(0), {
    intensity: 0,
    glowOpacity: 0.16,
    orbitSpeed: 34,
    breathScale: 1,
  });

  assert.deepEqual(createSceneState(0.75), {
    intensity: 0.75,
    glowOpacity: 0.61,
    orbitSpeed: 17.5,
    breathScale: 1.075,
  });
});

test("updateRotationFromDrag converts pointer movement into bounded cube rotation", () => {
  assert.deepEqual(
    updateRotationFromDrag({ x: 0, y: 0 }, { x: 120, y: -40 }, { rx: -12, ry: 28 }),
    { rx: -20, ry: 52 },
  );

  assert.deepEqual(
    updateRotationFromDrag({ x: 0, y: 0 }, { x: 2000, y: 2000 }, { rx: 0, ry: 0 }),
    { rx: 65, ry: 160 },
  );
});
