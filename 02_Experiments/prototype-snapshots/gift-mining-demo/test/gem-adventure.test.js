import test from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  applyThemeGift,
  digWithTool,
  redeemReward,
} from "../src/gem-adventure.js";

test("one matching 100-diamond gift grants one copper pickaxe", () => {
  const state = createInitialState();
  const result = applyThemeGift(state, {
    diamondValue: 100,
    direction: "send",
    giftName: "礼物A",
  });

  assert.equal(result.tools.copper, 1);
  assert.equal(result.timeline[0].body, "送出礼物A，获得铜锄 x1");
});

test("one matching 300-diamond gift grants one silver pickaxe", () => {
  const state = applyThemeGift(createInitialState(), {
    diamondValue: 300,
    direction: "receive",
    giftName: "礼物B",
  });

  assert.equal(state.tools.silver, 1);
  assert.equal(state.timeline[0].body, "收到礼物B，获得银锄 x1");
});

test("king set or grand slam grants a diamond pickaxe", () => {
  const state = applyThemeGift(createInitialState(), {
    diamondValue: "kingSet",
    direction: "send",
  });
  const next = applyThemeGift(state, {
    diamondValue: "grandSlam",
    direction: "receive",
  });

  assert.equal(next.tools.diamond, 2);
  assert.equal(next.timeline[0].title, "金刚锄入账");
});

test("digging consumes the matching pickaxe and creates the matching souvenir", () => {
  const withTool = {
    ...createInitialState(),
    tools: { copper: 0, silver: 1, gold: 0, diamond: 0 },
  };

  const result = digWithTool(withTool, "silver");

  assert.equal(result.tools.silver, 0);
  assert.equal(result.souvenirs.pearl, 1);
  assert.equal(result.lastDig?.souvenir, "pearl");
});

test("digging increments dig count for repeatable animation triggers", () => {
  const withTools = {
    ...createInitialState(),
    tools: { copper: 2, silver: 0, gold: 0, diamond: 0 },
  };

  const first = digWithTool(withTools, "copper");
  const second = digWithTool(first, "copper");

  assert.equal(first.digCount, 1);
  assert.equal(second.digCount, 2);
});

test("redeeming a reward consumes required souvenirs", () => {
  const withSouvenirs = {
    ...createInitialState(),
    souvenirs: { crystal: 3, pearl: 2, gold: 1, diamond: 0 },
  };

  const result = redeemReward(withSouvenirs, "jewelryA");

  assert.equal(result.souvenirs.crystal, 1);
  assert.equal(result.souvenirs.pearl, 1);
  assert.equal(result.redeemed.jewelryA, 1);
});

test("cannot redeem when souvenirs are insufficient", () => {
  const state = createInitialState();

  assert.throws(() => redeemReward(state, "cpRide"), /纪念品不足/);
});
