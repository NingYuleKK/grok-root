import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PNG } from 'pngjs';
import { chromium } from 'playwright-core';

const baseUrl = process.env.VISUAL_URL || 'http://127.0.0.1:5173/';
const outDir = resolve('artifacts');
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--disable-gpu', '--no-sandbox']
});

const checks = [
  { name: 'desktop', width: 1366, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];

for (const check of checks) {
  const page = await browser.newPage({ viewport: { width: check.width, height: check.height } });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /开关/ }).waitFor({ state: 'visible' });

  const fullPath = resolve(outDir, `${check.name}-page.png`);
  await page.screenshot({ path: fullPath, fullPage: false });

  await page.getByRole('button', { name: /逻辑门/ }).click();
  await page.getByRole('button', { name: 'XOR' }).click();
  await page.locator('[data-action="toggle-logic-bit"][data-bit="a"]').click();
  const xorText = await page.locator('.truth-table tr.selected td').last().innerText();

  await page.locator('[data-action="select-lab"][data-lab="silicon"]').click();
  await page.getByRole('button', { name: /Toggle input/ }).click();
  const cmosText = await page.locator('.silicon-svg').evaluate((node) => node.textContent);
  await page.locator('[data-action="set-silicon-mode"][data-mode="clock"]').click();
  await page.getByRole('button', { name: /Toggle clock/ }).click();
  const clockText = await page.locator('.cpu-registers div').nth(1).innerText();
  await page.locator('[data-action="set-silicon-mode"][data-mode="flipflop"]').click();
  await page.locator('[data-action="toggle-d"]').click();
  await page.getByRole('button', { name: /Clock edge/ }).click();
  const flipText = await page.locator('.cpu-registers div').last().innerText();
  await page.locator('[data-action="set-silicon-mode"][data-mode="nand"]').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  const siliconPath = resolve(outDir, `${check.name}-silicon.png`);
  await page.locator('.silicon-svg').screenshot({ path: siliconPath });
  const nandText = await page.locator('.equation-card').nth(1).innerText();

  await page.getByRole('button', { name: /加法器/ }).click();
  await page.getByRole('button', { name: /把输出锁存到寄存器/ }).click();
  const registerText = await page.locator('.register-text').evaluate((node) => node.textContent);

  await page.getByRole('button', { name: /迷你 CPU/ }).click();
  await page.getByRole('button', { name: 'Step' }).click();
  await page.getByRole('button', { name: 'Step' }).click();
  const accText = await page.locator('.cpu-registers div').nth(1).innerText();

  await page.getByRole('button', { name: /智能涌现/ }).click();
  await page.getByRole('button', { name: /Train one/ }).click();
  await page.locator('.learn-svg').waitFor({ state: 'visible' });
  const learningPath = resolve(outDir, `${check.name}-learning.png`);
  await page.locator('.learn-svg').screenshot({ path: learningPath });
  const accuracyText = await page.locator('.cpu-registers div').first().innerText();

  const stats = analyzePng(learningPath);
  const titleText = await page.locator('h1').innerText();
  const activeHeading = await page.locator('.bench-header h2').innerText();

  const result = {
    viewport: check,
    titleText,
    activeHeading,
    xorText,
    cmosText,
    clockText,
    flipText,
    nandText,
    registerText,
    accText,
    accuracyText,
    image: stats
  };
  writeFileSync(resolve(outDir, `${check.name}-result.json`), `${JSON.stringify(result, null, 2)}\n`);

  if (!titleText.includes('从 0/1')) {
    throw new Error(`${check.name}: app title did not render`);
  }
  if (!activeHeading.includes('Learning')) {
    throw new Error(`${check.name}: lab navigation failed`);
  }
  if (!['0', '1'].includes(xorText.trim())) {
    throw new Error(`${check.name}: logic interaction failed`);
  }
  if (!cmosText.includes('CMOS inverter') || !clockText.toLowerCase().includes('edge')) {
    throw new Error(`${check.name}: CMOS/clock interaction failed`);
  }
  if (!flipText.includes('Q=') || !nandText.includes('sum=')) {
    throw new Error(`${check.name}: flip-flop/NAND interaction failed`);
  }
  if (!registerText.includes('register')) {
    throw new Error(`${check.name}: register save did not render`);
  }
  if (!accText.includes('ACC')) {
    throw new Error(`${check.name}: CPU step did not update registers`);
  }
  if (!accuracyText.toLowerCase().includes('accuracy')) {
    throw new Error(`${check.name}: learning panel did not render`);
  }
  if (stats.nonBackgroundRatio < 0.035 || stats.uniqueColorBuckets < 24) {
    throw new Error(`${check.name}: visual output appears blank or too flat: ${JSON.stringify(stats)}`);
  }

  await page.close();
}

await browser.close();
console.log(`visual checks passed; artifacts in ${outDir}`);

function analyzePng(path) {
  const png = PNG.sync.read(readFileSync(path));
  let nonBackground = 0;
  const buckets = new Set();

  for (let y = 0; y < png.height; y += 2) {
    for (let x = 0; x < png.width; x += 2) {
      const index = (png.width * y + x) << 2;
      const r = png.data[index];
      const g = png.data[index + 1];
      const b = png.data[index + 2];
      if (Math.abs(r - 255) + Math.abs(g - 249) + Math.abs(b - 234) > 34) nonBackground += 1;
      buckets.add(`${r >> 4},${g >> 4},${b >> 4}`);
    }
  }

  const sampled = Math.ceil(png.width / 2) * Math.ceil(png.height / 2);
  return {
    width: png.width,
    height: png.height,
    nonBackgroundRatio: Number((nonBackground / sampled).toFixed(4)),
    uniqueColorBuckets: buckets.size
  };
}
