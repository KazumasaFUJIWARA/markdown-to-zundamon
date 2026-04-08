import { Config } from "@remotion/cli/config";
import * as path from "path";

Config.setVideoImageFormat("jpeg");

// Remotion bundles this file with esbuild and eval()s it; __dirname is NOT the project root.
// During eval, @remotion/cli chdirs to the Remotion root — use process.cwd() here.
const repoRoot = process.cwd();
const publicDir =
  process.env.ZUNDAMON_PUBLIC_DIR !== undefined &&
  process.env.ZUNDAMON_PUBLIC_DIR !== ""
    ? path.isAbsolute(process.env.ZUNDAMON_PUBLIC_DIR)
      ? process.env.ZUNDAMON_PUBLIC_DIR
      : path.resolve(repoRoot, process.env.ZUNDAMON_PUBLIC_DIR)
    : path.join(repoRoot, "public");
Config.setPublicDir(publicDir);
