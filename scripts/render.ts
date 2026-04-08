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

const projectName = process.argv[2];
if (!projectName) {
  console.error("Usage: npm run render -- <project-name>");
  console.error("Example: npm run render -- example");
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

const outFile = resolveRenderOutput(projectName);
const props = JSON.stringify({ projectName });

console.log(`Rendering "${projectName}" → ${outFile}`);

const outArg = path.isAbsolute(outFile)
  ? outFile
  : path.relative(REPO_ROOT, outFile) || ".";

const result = spawnSync(
  "npx",
  ["remotion", "render", "ZundamonVideo", "--props", props, outArg],
  {
    stdio: "inherit",
    cwd: REPO_ROOT,
  }
);

process.exit(result.status ?? 1);
