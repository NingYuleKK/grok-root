import { describe, expect, test } from "vitest";
import { chapters } from "../data/chapters";
import { materialManifest } from "../generated/materials/manifest";

describe("material manifest", () => {
  test("物料库覆盖 9 个章节并提供 demo 所需资产路径", () => {
    expect(chapters).toHaveLength(9);

    for (const chapter of chapters) {
      const assets = materialManifest.chapters[chapter.chapterId];
      expect(assets.poster).toMatch(/poster\.svg$/);
      expect(assets.identityCard).toMatch(/identity-card\.svg$/);
      expect(assets.certificate).toMatch(/certificate\.svg$/);
      expect(assets.avatarFrame).toMatch(/avatar-frame\.svg$/);
      expect(assets.shareCard).toMatch(/share-card\.svg$/);
      expect(assets.banner).toMatch(/banner\.svg$/);
      expect(Object.keys(assets.gifts)).toHaveLength(12);
      expect(Object.keys(assets.souvenirs).length).toBeGreaterThanOrEqual(3);
      expect(assets.emperorSet).toMatch(/emperor-set\.svg$/);
    }
  });
});
