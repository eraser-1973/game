import { spawn } from "node:child_process";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { chromium } from "playwright";

const port = 4173;
const url = `http://127.0.0.1:${port}`;
const serverCommand = process.platform === "win32" ? "cmd.exe" : "npm";
const serverArgs =
  process.platform === "win32"
    ? ["/d", "/s", "/c", "npm.cmd", "run", "dev", "--", "--port", String(port)]
    : ["run", "dev", "--", "--port", String(port)];
const server = spawn(serverCommand, serverArgs, {
  cwd: process.cwd(),
  shell: false,
  stdio: "pipe",
});
let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

let browser;

try {
  await waitForServer(url, 20_000, () => serverOutput);
  browser = await chromium.launch(resolveBrowserLaunchOptions());
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("Failed to load resource")) {
      errors.push(message.text());
    }
  });

  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("canvas");
  await page.waitForTimeout(600);

  const canvasStats = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return { width: 0, height: 0, coloredPixels: 0 };
    const sample = document.createElement("canvas");
    sample.width = 160;
    sample.height = 90;
    const context = sample.getContext("2d", { willReadFrequently: true });
    if (!context) return { width: canvas.width, height: canvas.height, coloredPixels: 0 };
    context.drawImage(canvas, 0, 0, sample.width, sample.height);
    const pixels = context.getImageData(0, 0, sample.width, sample.height).data;
    let coloredPixels = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index] + pixels[index + 1] + pixels[index + 2] > 20) {
        coloredPixels += 1;
      }
    }
    return { width: canvas.width, height: canvas.height, coloredPixels };
  });

  if (errors.length > 0) {
    throw new Error(`Browser console errors: ${errors.join(" | ")}`);
  }
  if (canvasStats.width < 300 || canvasStats.height < 200) {
    throw new Error(`Canvas is too small: ${canvasStats.width}x${canvasStats.height}`);
  }
  if (canvasStats.coloredPixels < 500) {
    throw new Error(`Canvas appears blank: ${JSON.stringify(canvasStats)}`);
  }

  console.log(`Browser smoke passed: ${canvasStats.width}x${canvasStats.height}, ${canvasStats.coloredPixels} colored sample pixels`);
} finally {
  if (browser) {
    await browser.close();
  }
  stopServer(server);
}

function resolveBrowserLaunchOptions() {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  const executablePath = candidates.find((candidate) => existsSync(candidate));
  return executablePath ? { executablePath } : {};
}

function stopServer(childProcess) {
  if (childProcess.killed) return;
  if (process.platform === "win32" && childProcess.pid) {
    try {
      execFileSync("taskkill.exe", ["/pid", String(childProcess.pid), "/t", "/f"], {
        stdio: "ignore",
      });
      return;
    } catch {
      childProcess.kill();
      return;
    }
  }
  childProcess.kill();
}

async function waitForServer(targetUrl, timeoutMs, getServerOutput) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(targetUrl);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw new Error(`Timed out waiting for ${targetUrl}\n${getServerOutput()}`);
}
