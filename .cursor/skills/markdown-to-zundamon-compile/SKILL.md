---
name: markdown-to-zundamon-compile
description: WSL から PowerShell 経由で markdown-to-zundamon を前処理・レンダリングする手順を提供する。VOICEVOX を Windows 側で使う場合に利用する。characters ディレクトリの立ち絵を前提とする。
---

# markdown-to-zundamon compile (WSL -> PowerShell)

## 目的

WSL から Windows の PowerShell を呼び出して `markdown-to-zundamon` を実行し、
VOICEVOX（Windows 側起動）を利用して前処理・レンダリングを行う。
立ち絵はこのリポジトリの `characters/` を使う。

## 前提

- Windows 側で VOICEVOX が `localhost:50021` で起動している
- Windows 側のプロジェクトパスが環境変数で指定されている
  - 例: PowerShell プロファイルなどで  
    ` $env:MARKDOWN_TO_ZUNDAMON = "D:\github\markdown-to-zundamon" `
- WSL 側から `powershell.exe` が使える
- キャラ画像が `characters/<キャラ名>/default.png` にある

## 立ち絵ルール

- 立ち絵は必ずリポジトリの `characters/` を参照する
- 最低限必要: `characters/<キャラ名>/default.png`
- 任意: `default_active1.png`, `default_active2.png`（口パク）
- Markdown frontmatter の `characters[].name` はディレクトリ名と一致させる

## 実行フロー

1. Markdown を用意（例: `demo/complex-analysis-2026.md`）
2. WSL から PowerShell 経由で前処理を実行
3. WSL から PowerShell 経由でレンダリングを実行
4. `out/<project>.mp4` を確認

## コマンド（WSLで実行）

### 推奨: 環境変数でパスを共有する

PowerShell 側で一度だけ、次のように設定しておく:

```powershell
$env:MARKDOWN_TO_ZUNDAMON = "D:\github\markdown-to-zundamon"
```

そのうえで、WSL からは次のように呼び出す:

```bash
# 1) 前処理
powershell.exe -NoProfile -Command "cd $env:MARKDOWN_TO_ZUNDAMON; npm run preprocess -- demo/complex-analysis-2026.md"

# 2) レンダリング
powershell.exe -NoProfile -Command "cd $env:MARKDOWN_TO_ZUNDAMON; npm run render -- complex-analysis-2026"
```

### 直接パス指定したい場合（例）

従来どおり、フルパスを直書きすることもできる:

```bash
powershell.exe -NoProfile -Command "cd 'C:\Users\kfuji\Documents\github\markdown-to-zundamon'; npm run preprocess -- demo/complex-analysis-2026.md"
powershell.exe -NoProfile -Command "cd 'C:\Users\kfuji\Documents\github\markdown-to-zundamon'; npm run render -- complex-analysis-2026"
```

## よくある失敗と対処

- `VOICEVOX に接続できません`
  - VOICEVOX を Windows で起動してから再実行
  - WSL 直実行ではなく PowerShell 経由で実行する

- `npm error EACCES` / `ENOTEMPTY`
  - Windows 側で `node_modules` を削除して `npm install` を再実行
  - 可能ならエディタや同期ソフトによるロックを解除

- `Cannot find module ...`
  - 依存欠損なので Windows 側で `npm install` をやり直す

## 期待する出力

- 前処理: `public/projects/<project>/manifest.json`
- 動画: `out/<project>.mp4`
