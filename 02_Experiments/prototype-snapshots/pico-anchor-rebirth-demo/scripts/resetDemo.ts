import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const token = new Date().toISOString().replace(/[:.]/g, "-");
const target = resolve(process.cwd(), "src/generated/resetToken.ts");

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `export const DEMO_RESET_TOKEN = ${JSON.stringify(token)};\n`);

console.log(`Demo reset token refreshed: ${token}`);
console.log("Reload the browser tab to start from the initial demo state.");
