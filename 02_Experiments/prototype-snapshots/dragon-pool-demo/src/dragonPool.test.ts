import { describe, expect, it } from "vitest";
import { applyGiftToPool, getDragonStage } from "./dragonPool";

describe("dragon pool rules", () => {
  it("adds gift energy without triggering reveal before threshold", () => {
    const result = applyGiftToPool({ energy: 55, threshold: 100 }, 15);

    expect(result.energy).toBe(70);
    expect(result.reveals).toBe(0);
  });

  it("triggers reveal at threshold and preserves overflow energy", () => {
    const result = applyGiftToPool({ energy: 85, threshold: 100 }, 40);

    expect(result.energy).toBe(25);
    expect(result.reveals).toBe(1);
  });

  it("maps progress into rising room stages", () => {
    expect(getDragonStage(8, 100).label).toBe("龙池初醒");
    expect(getDragonStage(45, 100).label).toBe("龙气升温");
    expect(getDragonStage(78, 100).label).toBe("龙影将现");
    expect(getDragonStage(93, 100).label).toBe("龙门开启");
  });
});
