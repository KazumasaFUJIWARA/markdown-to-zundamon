---
name: markdown-to-zundamon-compile
description: >-
  WSL から PowerShell 経由で markdown-to-zundamon を前処理・レンダリングする手順。実行は Windows 側（PowerShell）で行う。VOICEVOX は localhost で起動。WSL 直接接続を使う場合は markdown-to-zundamon-wsl-direct を参照。characters ディレクトリの立ち絵を前提とする。
---

# markdown-to-zundamon compile (WSL -> PowerShell)

## このスキルの正本

- リポジトリの **`skills/markdown-to-zundamon-compile/`** が正本。Cursor が読む `.cursor/skills/markdown-to-zundamon-compile` はここへの symlink。
- グローバルに載せる場合は `~/.cursor/skills/markdown-to-zundamon-compile` を本ディレクトリへ symlink（コピーで二重管理しない）。

## 目的

WSL から Windows の PowerShell を呼び出して `markdown-to-zundamon` を実行し、
VOICEVOX（Windows 側起動）を利用して前処理・レンダリングを行う。
**実行自体は Windows 側**で行うため、VOICEVOX は通常の `localhost:50021` でよい。

WSL 側で Node を直接動かし VOICEVOX に繋ぐ場合は **`markdown-to-zundamon-wsl-direct`** を参照すること。

## 出力先（任意）

- **`ZUNDAMON_PUBLIC_DIR`**: `public` ルート（`projects/`・`characters/` の親）。前処理とレンダで同じ値にする。未設定時はリポジトリの `public`。
- **`ZUNDAMON_OUTPUT`**: レンダの MP4。`.mp4` で終わればそのファイル、そうでなければディレクトリとみなして `<プロジェクト名>.mp4` を配置。詳細は README の環境変数表。

## 前提

- Windows 側で VOICEVOX が `localhost:50021` で起動している（通常起動で可、`--host 0.0.0.0` は不要）
- Windows 側のプロジェクトパスが環境変数で指定されている  
  例: PowerShell プロファイルなどで  
  `$env:MARKDOWN_TO_ZUNDAMON = "<WINDOWS上のリポジトリパス>"`
- WSL 側から `powershell.exe` が使える
- キャラ画像が `characters/<キャラ名>/default.png` にある

## 立ち絵ルール

- 立ち絵は必ずリポジトリの `characters/` を参照する
- 最低限必要: `characters/<キャラ名>/default.png`
- 任意: `default_active1.png`, `default_active2.png`（口パク）
- Markdown frontmatter の `characters[].name` はディレクトリ名と一致させる

## 実行フロー

1. Markdown を用意（例: `demo/<作業用のmd>`）
2. WSL から PowerShell 経由で前処理を実行
3. WSL から PowerShell 経由でレンダリングを実行
4. `out/<project>.mp4` を確認

## コマンド（WSLで実行）

### 推奨: 環境変数でパスを共有する

PowerShell 側で一度だけ、次のように設定しておく:

```powershell
$env:MARKDOWN_TO_ZUNDAMON = "<WINDOWS上のリポジトリパス>"
```

そのうえで、WSL からは次のように呼び出す（`<markdownパス>` と `<project>` は実例に置き換え）:

```bash
# 1) 前処理
powershell.exe -NoProfile -Command "cd $env:MARKDOWN_TO_ZUNDAMON; npm run preprocess -- <markdownパス>"

# 2) レンダリング
powershell.exe -NoProfile -Command "cd $env:MARKDOWN_TO_ZUNDAMON; npm run render -- <project>"
```

### 直接パス指定したい場合

`cd '<WINDOWS上のリポジトリパス>'` を PowerShell の `-Command` 内に直書きしてもよい。

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

## 解消しないとき（GitHub Issue）

本スキルと **`README.md`** の手順どおりに試しても **再現する不具合・エラー** のときは、**GitHub に Issue を起票**する。ログや本文に **ユーザー名・トークン・機密パスを書かない**（マスクする）。

1. リポジトリのルートに `cd` する（`gh` は認証済みであること）。
2. 次で起票する（既定で現在の `git remote` のリポジトリ向け）。**フォークで Issue を投げ先に分ける場合**は `gh issue create --repo <OWNER>/<REPO>` を使う。

```bash
gh issue create --title "簡潔な一行要約" --body "$(cat <<'EOF'
## 再現手順
（実行したコマンド。パスは伏せてよい）

## 期待したこと

## 実際

## 環境
- 経路: WSL → PowerShell（本スキル）
- OS / WSL ディストリ
- Node の版（分かれば）
EOF
)"
```

テンプレ・`gh` の注意はグローバルの **github-agent-issue** スキルも参照してよい。

## 依存スキル

- **markdown-to-zundamon-authoring**: 台本・frontmatter・スライド／セリフの書き方。
- **markdown-to-zundamon-wsl-direct**: WSL で直接 `npm run` する経路・`VOICEVOX_BASE`。
- **github-agent-issue**（任意）: `gh issue create` の作法・認証。
- **skill-authoring-repo-pattern**（任意）: スキル正本・symlink 運用。グローバルは `~/.cursor/skills/skill-authoring-repo-pattern/` 等を参照。
