/**
 * Minimal LCS line diff used by the version timeline ("对比当前版本").
 *
 * Files are small (< 1000 lines), so a straightforward dynamic-programming
 * LCS is fine; oversized inputs fall back to a whole-file replace so the UI
 * can never freeze on pathological projects.
 */

export interface DiffLine {
  type: "same" | "add" | "del";
  text: string;
  oldLine?: number;
  newLine?: number;
}

export interface DiffSummary {
  added: number;
  removed: number;
}

const MAX_CELLS = 4_000_000;

export function diffLines(oldText: string, newText: string): DiffLine[] {
  const before = oldText.split("\n");
  const after = newText.split("\n");

  if (before.length * after.length > MAX_CELLS) {
    return [
      ...before.map<DiffLine>((text, i) => ({ type: "del", text, oldLine: i + 1 })),
      ...after.map<DiffLine>((text, i) => ({ type: "add", text, newLine: i + 1 })),
    ];
  }

  // dp[i][j] = LCS length of before[i:] and after[j:]
  const rows = before.length + 1;
  const cols = after.length + 1;
  const dp: Uint32Array[] = Array.from({ length: rows }, () => new Uint32Array(cols));
  for (let i = before.length - 1; i >= 0; i -= 1) {
    for (let j = after.length - 1; j >= 0; j -= 1) {
      dp[i][j] =
        before[i] === after[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < before.length && j < after.length) {
    if (before[i] === after[j]) {
      out.push({ type: "same", text: before[i], oldLine: i + 1, newLine: j + 1 });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ type: "del", text: before[i], oldLine: i + 1 });
      i += 1;
    } else {
      out.push({ type: "add", text: after[j], newLine: j + 1 });
      j += 1;
    }
  }
  while (i < before.length) {
    out.push({ type: "del", text: before[i], oldLine: i + 1 });
    i += 1;
  }
  while (j < after.length) {
    out.push({ type: "add", text: after[j], newLine: j + 1 });
    j += 1;
  }
  return out;
}

export function diffSummary(lines: DiffLine[]): DiffSummary {
  let added = 0;
  let removed = 0;
  for (const line of lines) {
    if (line.type === "add") added += 1;
    else if (line.type === "del") removed += 1;
  }
  return { added, removed };
}

/** Collapse long unchanged runs into a single context marker. */
export function collapseContext(lines: DiffLine[], context = 2): DiffLine[] {
  const keep = new Set<number>();
  lines.forEach((line, index) => {
    if (line.type === "same") return;
    for (let k = index - context; k <= index + context; k += 1) {
      if (k >= 0 && k < lines.length) keep.add(k);
    }
  });
  const out: DiffLine[] = [];
  let skipped = 0;
  const flush = () => {
    if (skipped > 0) {
      out.push({ type: "same", text: `⋯ ${skipped} 行未变` });
      skipped = 0;
    }
  };
  lines.forEach((line, index) => {
    if (line.type === "same" && !keep.has(index)) {
      skipped += 1;
      return;
    }
    flush();
    out.push(line);
  });
  flush();
  return out;
}
