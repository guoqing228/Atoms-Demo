// throwaway verification — analyze debug phase frames
import { PNG } from "pngjs";
import { readFileSync, existsSync } from "node:fs";

const DIR = "shots/.debug";
const phases = ["home", "generating", "built", "code", "versions", "preview"];

function load(name) {
  const path = `${DIR}/${name}.png`;
  if (!existsSync(path)) return null;
  const png = PNG.sync.read(readFileSync(path));
  return { png, path };
}

function regionStats(png, x0, x1) {
  let sum = 0, sumSq = 0, n = 0;
  const colors = new Set();
  for (let y = 0; y < png.height; y += 4) {
    for (let x = x0; x < x1; x += 4) {
      const i = (y * png.width + x) * 4;
      const l = 0.299 * png.data[i] + 0.587 * png.data[i + 1] + 0.114 * png.data[i + 2];
      sum += l; sumSq += l * l; n++;
      colors.add(((png.data[i] >> 4) << 8) | ((png.data[i + 1] >> 4) << 4) | (png.data[i + 2] >> 4));
    }
  }
  const mean = sum / n;
  return { mean: Math.round(mean * 10) / 10, std: Math.round(Math.sqrt(sumSq / n - mean * mean) * 10) / 10, colors: colors.size };
}

function thumb(png, tw = 12, th = 8) {
  const out = [];
  for (let ty = 0; ty < th; ty++) {
    for (let tx = 0; tx < tw; tx++) {
      let sum = 0, n = 0;
      const x0 = Math.floor((tx * png.width) / tw), x1 = Math.floor(((tx + 1) * png.width) / tw);
      const y0 = Math.floor((ty * png.height) / th), y1 = Math.floor(((ty + 1) * png.height) / th);
      for (let y = y0; y < y1; y += 3) for (let x = x0; x < x1; x += 3) {
        const i = (y * png.width + x) * 4;
        sum += 0.299 * png.data[i] + 0.587 * png.data[i + 1] + 0.114 * png.data[i + 2];
        n++;
      }
      out.push(sum / n);
    }
  }
  return out;
}

const refs = ["01-home", "02-generating", "03-result", "04-code", "06-versions"];
const refThumbs = new Map();
for (const r of refs) {
  const p = `shots/${r}.png`;
  if (existsSync(p)) refThumbs.set(r, thumb(PNG.sync.read(readFileSync(p))));
}
function dist(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return Math.round((s / a.length) * 10) / 10;
}

console.log("phase         dims        left(rail)             chat                   right(preview)         closest-ref");
for (const phase of phases) {
  const f = load(phase);
  if (!f) { console.log(phase, "MISSING"); continue; }
  const { png } = f;
  const rail = regionStats(png, 0, 250);
  const chat = regionStats(png, 252, 670);
  const right = regionStats(png, 672, png.width);
  const t = thumb(png);
  let best = null;
  for (const [name, rt] of refThumbs) {
    const d = dist(t, rt);
    if (!best || d < best.d) best = { name, d };
  }
  console.log(
    phase.padEnd(13),
    `${png.width}x${png.height}`.padEnd(12),
    `mean=${rail.mean} std=${rail.std}`.padEnd(22),
    `mean=${chat.mean} std=${chat.std}`.padEnd(23),
    `mean=${right.mean} std=${right.std}`.padEnd(23),
    best ? `${best.name} d=${best.d}` : "-",
  );
}

function assert(name, cond, detail) {
  console.log(`${cond ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
  if (!cond) process.exitCode = 1;
}

const home = load("home"), gen = load("generating"), built = load("built"), code = load("code"), versions = load("versions"), preview = load("preview");
if (home && gen && built && code && versions && preview) {
  const codeRight = regionStats(code.png, 672, code.png.width);
  const versionsRight = regionStats(versions.png, 672, versions.png.width);
  const builtRight = regionStats(built.png, 672, built.png.width);
  const homeRight = regionStats(home.png, 672, home.png.width);
  const genRight = regionStats(gen.png, 672, gen.png.width);

  assert("code tab 右侧是深色代码面板", codeRight.mean < 110, `right mean=${codeRight.mean}`);
  assert("versions 右侧是亮色版本时间线", versionsRight.mean > 200, `right mean=${versionsRight.mean}`);
  assert("built 右侧是亮色应用预览", builtRight.mean > 200, `right mean=${builtRight.mean}`);
  assert("home 右侧没有代码面板", homeRight.mean > 200, `right mean=${homeRight.mean}`);
  assert("生成中右侧不是空白（骨架屏有内容）", genRight.std > 5, `right std=${genRight.std}`);
  assert("home 与 built 画面不同", dist(thumb(home.png), thumb(built.png)) > 3, `d=${dist(thumb(home.png), thumb(built.png))}`);
  assert("built 与 preview（回到预览）都含应用预览", Math.abs(builtRight.mean - regionStats(preview.png, 672, preview.png.width).mean) < 25, `built=${builtRight.mean}`);
  assert("生成中与 built 的右侧区域不同", Math.abs(genRight.mean - builtRight.mean) > 3 || Math.abs(genRight.std - builtRight.std) > 5, `gen=${genRight.mean}/${genRight.std} built=${builtRight.mean}/${builtRight.std}`);
}
