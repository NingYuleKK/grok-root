import { rmSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { chapters } from "../src/data/chapters";
import { themeTokens } from "../src/data/themeTokens";

type SvgSize = { width: number; height: number };

const materialRoot = resolve(process.cwd(), "public/generated/materials");
const manifestPath = resolve(process.cwd(), "src/generated/materials/manifest.ts");
const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, Noto Sans CJK SC, sans-serif";

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function write(path: string, content: string) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function svg(size: SvgSize, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size.width} ${size.height}" width="${size.width}" height="${size.height}">
<defs>
  <filter id="softGlow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
${body}
</svg>
`;
}

function text(x: number, y: number, copy: string, size: number, color: string, weight = 700, anchor = "middle") {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${fontStack}" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(copy)}</text>`;
}

function wrappedText(x: number, y: number, copy: string, size: number, color: string, max = 13) {
  const chunks = copy.match(new RegExp(`.{1,${max}}`, "g")) ?? [copy];
  return chunks
    .slice(0, 3)
    .map((chunk, index) => text(x, y + index * (size + 8), chunk, size, color, 600))
    .join("\n");
}

function bg(theme: (typeof themeTokens)[keyof typeof themeTokens], width: number, height: number) {
  return `<rect width="${width}" height="${height}" rx="34" fill="#12060B"/>
<circle cx="${width * 0.5}" cy="${height * 0.18}" r="${width * 0.44}" fill="${theme.secondaryColor}" opacity="0.32"/>
<circle cx="${width * 0.78}" cy="${height * 0.28}" r="${width * 0.22}" fill="${theme.accentColor}" opacity="0.24"/>
<rect x="18" y="18" width="${width - 36}" height="${height - 36}" rx="28" fill="none" stroke="${theme.accentColor}" stroke-width="3" opacity="0.92"/>`;
}

function motif(cx: number, cy: number, color: string, accent: string, scale = 1) {
  return `<g transform="translate(${cx} ${cy}) scale(${scale})" filter="url(#softGlow)">
  <path d="M0 -44 C26 -26 42 -4 30 22 C18 48 -18 48 -30 22 C-42 -4 -26 -26 0 -44Z" fill="${color}" opacity="0.92"/>
  <circle cx="0" cy="2" r="18" fill="${accent}" opacity="0.86"/>
  <path d="M-42 34 C-16 24 16 24 42 34" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>
</g>`;
}

function renderPoster(chapterId: string) {
  const chapter = chapters.find((item) => item.chapterId === chapterId)!;
  const theme = themeTokens[chapterId as keyof typeof themeTokens];
  return svg(
    { width: 720, height: 1080 },
    `${bg(theme, 720, 1080)}
${motif(360, 320, theme.secondaryColor, theme.accentColor, 3.2)}
${text(360, 118, "主播大作战", 34, theme.primaryColor)}
${wrappedText(360, 188, chapter.posterTitle, 54, theme.primaryColor, 9)}
${wrappedText(360, 720, chapter.posterSubtitle, 30, "#FFF7EC", 15)}
${text(360, 940, chapter.identityTitle, 42, theme.accentColor)}
${text(360, 1000, "重生之我在 PICO 当主播", 28, "#FFF7EC")}`,
  );
}

function renderCard(chapterId: string, kind: "identity-card" | "certificate" | "share-card" | "banner") {
  const chapter = chapters.find((item) => item.chapterId === chapterId)!;
  const theme = themeTokens[chapterId as keyof typeof themeTokens];
  const sizes = {
    "identity-card": { width: 720, height: 420 },
    certificate: { width: 900, height: 620 },
    "share-card": { width: 900, height: 506 },
    banner: { width: 900, height: 300 },
  } as const;
  const size = sizes[kind];
  const title =
    kind === "certificate"
      ? chapter.certificateTitle
      : kind === "share-card"
        ? chapter.shareCopy
        : kind === "banner"
          ? chapter.chapterName
          : chapter.identityTitle;
  const copy = kind === "certificate" ? chapter.certificateCopy : chapter.identityTagline;

  return svg(
    size,
    `${bg(theme, size.width, size.height)}
${motif(size.width * 0.82, size.height * 0.5, theme.secondaryColor, theme.accentColor, kind === "banner" ? 1.2 : 1.8)}
${text(size.width * 0.08, 76, "PICO 主播身份档案", 24, theme.accentColor, 700, "start")}
${wrappedText(size.width * 0.08, size.height * 0.4, title, kind === "banner" ? 38 : 44, theme.primaryColor, 12).replaceAll('text-anchor="middle"', 'text-anchor="start"')}
${wrappedText(size.width * 0.08, size.height * 0.68, copy, 24, "#FFF7EC", 20).replaceAll('text-anchor="middle"', 'text-anchor="start"')}`,
  );
}

function renderAvatarFrame(chapterId: string) {
  const chapter = chapters.find((item) => item.chapterId === chapterId)!;
  const theme = themeTokens[chapterId as keyof typeof themeTokens];
  return svg(
    { width: 420, height: 420 },
    `<rect width="420" height="420" rx="92" fill="none"/>
<circle cx="210" cy="210" r="170" fill="none" stroke="${theme.accentColor}" stroke-width="24"/>
<circle cx="210" cy="210" r="135" fill="none" stroke="${theme.secondaryColor}" stroke-width="10"/>
${motif(210, 70, theme.secondaryColor, theme.accentColor, 1.1)}
${text(210, 372, chapter.avatarFrameName, 26, theme.primaryColor)}`,
  );
}

function renderIcon(chapterId: string, label: string, tier: string, index: number) {
  const theme = themeTokens[chapterId as keyof typeof themeTokens];
  const tierColor = tier === "high" ? theme.accentColor : tier === "mid" ? theme.secondaryColor : theme.primaryColor;
  return svg(
    { width: 240, height: 240 },
    `<rect x="10" y="10" width="220" height="220" rx="42" fill="#12060B" stroke="${tierColor}" stroke-width="5"/>
${motif(120, 92, tierColor, theme.accentColor, 1.05)}
${text(120, 178, label, 24, "#FFF7EC")}
${text(120, 210, `${tier.toUpperCase()} ${String(index).padStart(2, "0")}`, 16, theme.accentColor)}`,
  );
}

function manifestAsset(base: string, chapterId: string) {
  const chapter = chapters.find((item) => item.chapterId === chapterId)!;
  return `    ${JSON.stringify(chapterId)}: {
      poster: ${JSON.stringify(`${base}/poster.svg`)},
      identityCard: ${JSON.stringify(`${base}/identity-card.svg`)},
      certificate: ${JSON.stringify(`${base}/certificate.svg`)},
      avatarFrame: ${JSON.stringify(`${base}/avatar-frame.svg`)},
      shareCard: ${JSON.stringify(`${base}/share-card.svg`)},
      banner: ${JSON.stringify(`${base}/banner.svg`)},
      gifts: {
${chapter.gifts.map((gift) => `        ${JSON.stringify(gift.giftId)}: ${JSON.stringify(`${base}/gifts/${gift.giftId}.svg`)},`).join("\n")}
      },
      emperorSet: ${JSON.stringify(`${base}/gifts/emperor-set.svg`)},
      souvenirs: {
${chapter.souvenirs.map((souvenir) => `        ${JSON.stringify(souvenir.souvenirId)}: ${JSON.stringify(`${base}/souvenirs/${souvenir.souvenirId}.svg`)},`).join("\n")}
      },
    },`;
}

function validate(paths: string[]) {
  for (const path of paths) {
    if (!existsSync(path)) throw new Error(`Missing generated file: ${path}`);
  }
  if (chapters.length !== 9) throw new Error("Expected 9 chapters.");
}

rmSync(materialRoot, { recursive: true, force: true });

const written: string[] = [];
for (const chapter of chapters) {
  const baseDir = resolve(materialRoot, chapter.chapterId);
  const writeSvg = (relative: string, content: string) => {
    const target = resolve(baseDir, relative);
    write(target, content);
    written.push(target);
  };

  writeSvg("poster.svg", renderPoster(chapter.chapterId));
  writeSvg("identity-card.svg", renderCard(chapter.chapterId, "identity-card"));
  writeSvg("certificate.svg", renderCard(chapter.chapterId, "certificate"));
  writeSvg("avatar-frame.svg", renderAvatarFrame(chapter.chapterId));
  writeSvg("share-card.svg", renderCard(chapter.chapterId, "share-card"));
  writeSvg("banner.svg", renderCard(chapter.chapterId, "banner"));
  chapter.gifts.forEach((gift, index) => writeSvg(`gifts/${gift.giftId}.svg`, renderIcon(chapter.chapterId, gift.giftName, gift.tier, index + 1)));
  writeSvg("gifts/emperor-set.svg", renderIcon(chapter.chapterId, chapter.emperorSet.name, "emperor", 99));
  chapter.souvenirs.forEach((souvenir, index) => writeSvg(`souvenirs/${souvenir.souvenirId}.svg`, renderIcon(chapter.chapterId, souvenir.name, "souvenir", index + 1)));
}

validate(written);

const manifest = `export type ChapterMaterialPaths = {
  poster: string;
  identityCard: string;
  certificate: string;
  avatarFrame: string;
  shareCard: string;
  banner: string;
  gifts: Record<string, string>;
  emperorSet: string;
  souvenirs: Record<string, string>;
};

export const materialManifest: { chapters: Record<string, ChapterMaterialPaths> } = {
  chapters: {
${chapters.map((chapter) => manifestAsset(`/generated/materials/${chapter.chapterId}`, chapter.chapterId)).join("\n")}
  },
};

export function getChapterMaterials(chapterId: string) {
  return materialManifest.chapters[chapterId as keyof typeof materialManifest.chapters];
}
`;

write(manifestPath, manifest);
console.log(`Generated ${written.length} SVG assets for ${chapters.length} chapters.`);
console.log(`Updated ${manifestPath}.`);
