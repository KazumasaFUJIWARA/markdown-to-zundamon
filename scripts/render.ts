import { spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const REPO_ROOT = path.resolve(__dirname, "..");

function resolvePublicRoot(): string {
  const raw = process.env.ZUNDAMON_PUBLIC_DIR;
  if (raw === undefined || raw === "") {
    return path.join(REPO_ROOT, "public");
  }
  return path.isAbsolute(raw) ? raw : path.resolve(REPO_ROOT, raw);
}

function resolveRenderOutput(projectName: string): string {
  const raw = process.env.ZUNDAMON_OUTPUT;
  if (raw === undefined || raw === "") {
    const outDir = path.join(REPO_ROOT, "out");
    fs.mkdirSync(outDir, { recursive: true });
    return path.join(outDir, `${projectName}.mp4`);
  }
  const resolved = path.isAbsolute(raw) ? raw : path.resolve(REPO_ROOT, raw);
  if (resolved.toLowerCase().endsWith(".mp4")) {
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    return resolved;
  }
  fs.mkdirSync(resolved, { recursive: true });
  return path.join(resolved, `${projectName}.mp4`);
}

/** 第3引数で .mp4 を渡した場合は最優先（ソース横など任意パスへ出力） */
function resolveFinalOutput(projectName: string): string {
  const cliArg = process.argv[3];
  if (cliArg !== undefined && cliArg.toLowerCase().endsWith(".mp4")) {
    const out = path.isAbsolute(cliArg) ? cliArg : path.resolve(REPO_ROOT, cliArg);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    return out;
  }
  return resolveRenderOutput(projectName);
}

const projectName = process.argv[2];
if (!projectName) {
  console.error("Usage: npm run render -- <project-name> [output.mp4]");
  console.error("Example: npm run render -- example");
  console.error(
    "Example (next to script): npm run render -- calculus-2026 /path/to/calculus-2026.mp4"
  );
  process.exit(1);
}

const publicRoot = resolvePublicRoot();
const manifestPath = path.join(
  publicRoot,
  "projects",
  projectName,
  "manifest.json"
);
if (!fs.existsSync(manifestPath)) {
  console.error(`Error: manifest not found at ${manifestPath}`);
  console.error(`Run first: npm run preprocess -- <your-markdown-file.md>`);
  process.exit(1);
}

const outFile = resolveFinalOutput(projectName);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const propsObj = { projectName, manifest };
const propsFile = path.join(REPO_ROOT, "out", `.render-props-${projectName}.json`);
fs.mkdirSync(path.dirname(propsFile), { recursive: true });
fs.writeFileSync(propsFile, JSON.stringify(propsObj), "utf8");

console.log(`Rendering "${projectName}" → ${outFile}`);

const outArg = path.isAbsolute(outFile)
  ? outFile
  : path.relative(REPO_ROOT, outFile) || ".";

// --props=ファイル で渡す（CLI の JSON エスケープ問題と fetch/staticFile 404 を回避）
const propsArg = `--props=${propsFile.replace(/\\/g, "/")}`;

const result = spawnSync(
  "npx",
  ["remotion", "render", "ZundamonVideo", propsArg, outArg],
  {
    stdio: "inherit",
    cwd: REPO_ROOT,
  }
);

process.exit(result.status ?? 1);
