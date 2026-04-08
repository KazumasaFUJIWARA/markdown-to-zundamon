import { Config } from "@remotion/cli/config";
import * as path from "path";

Config.setVideoImageFormat("jpeg");

const repoRoot = path.resolve(__dirname);
const publicDir =
  process.env.ZUNDAMON_PUBLIC_DIR !== undefined &&
  process.env.ZUNDAMON_PUBLIC_DIR !== ""
    ? path.isAbsolute(process.env.ZUNDAMON_PUBLIC_DIR)
      ? process.env.ZUNDAMON_PUBLIC_DIR
      : path.resolve(repoRoot, process.env.ZUNDAMON_PUBLIC_DIR)
    : path.join(repoRoot, "public");
Config.setPublicDir(publicDir);
