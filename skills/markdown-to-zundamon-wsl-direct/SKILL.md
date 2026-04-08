---
name: markdown-to-zundamon-wsl-direct
description: >-
  WSL から直接 VOICEVOX（Windows 側）へ接続して markdown-to-zundamon を前処理・レンダリングする手順。VOICEVOX を --host 0.0.0.0 で起動する必要がある。characters ディレクトリの立ち絵を前提とする。
depends_on:
  - voicevox-engine-wsl
---

# markdown-to-zundamon (WSL 直接接続)

## このスキルの正本

- リポジトリの **`skills/markdown-to-zundamon-wsl-direct/`** が正本。`.cursor/skills/markdown-to-zundamon-wsl-direct` は symlink。
- エンジン側の起動・ポートフォワード・疎通の詳細は **voicevox-engine-wsl**（upstream）に委ね、本スキルは **本リポジトリの preprocess / render** に限定する。

## 目的

WSL 側で `npm run preprocess` / `npm run render` を実行し、
Windows で起動した VOICEVOX に直接接続して音声生成・動画生成を行う。

**別案**: WSL の `127.0.0.1:50021` へ届くよう socat 等でフォワードする構成にすると、`VOICEVOX_BASE` を `http://127.0.0.1:50021` にできる。その手順は **voicevox-engine-wsl** の「方式 A」を参照。

## 出力先（任意）

- **`ZUNDAMON_PUBLIC_DIR`** / **`ZUNDAMON_OUTPUT`**: リポジトリの `README.md` 環境変数表と同じ。WSL から `npm run` する前後でも値を揃える。

## 前提

- Windows 側で VOICEVOX を **`--host 0.0.0.0`** で起動している（LAN インターフェースで待ち受け、WSL から到達できるようにする）
- WSL から Windows ホストへ届く IP が分かっている（下記「Windows ホスト IP の確認」）
- キャラ画像が `characters/<キャラ名>/default.png` にある

## 1. VOICEVOX の起動（Windows 側）

```powershell
powershell.exe -NoExit -Command "& '%LocalAppData%\Programs\VOICEVOX\vv-engine\run.exe' --host 0.0.0.0"
```

※ インストール先が異なる場合は `run.exe` のパスを置き換える。

## Windows ホスト IP の確認（WSL）

**推奨（upstream 準拠）**:

```bash
ip route | awk '/default/ {print $3; exit}'
```

デフォルトゲートウェイ（多くの環境で Windows ホスト）を返す。うまくいかない場合のみ、次を試す:

```bash
grep nameserver /etc/resolv.conf | awk '{print $2}'
```

（環境によっては `nameserver` が期待と異なる値になることがある。）

## 2. WSL 側で実行

`<REPO_ROOT>` を本リポジトリのルートに置き換え、`<VOICEVOX_HOST>` を上記で得た IP に置き換える。

```bash
cd <REPO_ROOT>

# 前処理（Markdown → 音声生成 → manifest.json）
VOICEVOX_BASE=http://<VOICEVOX_HOST>:50021 npm run preprocess -- demo/calculus-2026.md

# プレビュー（任意）
npm run studio -- calculus-2026

# レンダリング（MP4 出力）
npm run render -- calculus-2026
```

## 立ち絵ルール

- `characters/<キャラ名>/default.png` が必須
- 任意: `default_active1.png`, `default_active2.png`（口パク）
- Markdown frontmatter の `characters[].name` はディレクトリ名と一致させる

## よくある失敗と対処

- `VOICEVOX に接続できません`
  - VOICEVOX を `--host 0.0.0.0` で起動しているか確認
  - `VOICEVOX_BASE` の IP を `ip route | awk '/default/ {print $3; exit}'` で再確認
  - フォワード構成なら **voicevox-engine-wsl** で `curl http://127.0.0.1:50021/version` を確認

- IP が変わる（WSL 再作成・ネットワーク変更後など）
  - 上記コマンドで再取得する

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
（実行したコマンド、VOICEVOX_BASE の有無。IP は伏せてもよい）

## 期待したこと

## 実際

## 環境
- 経路: WSL 直接 + VOICEVOX_BASE（本スキル）
- OS / WSL ディストリ
- Node の版（分かれば）
EOF
)"
```

テンプレ・`gh` の注意はグローバルの **github-agent-issue** スキルも参照してよい。

## 依存スキル

- **markdown-to-zundamon-authoring**: 台本・frontmatter・記法（実行前に原稿が用意できているか確認するとき）。
- **voicevox-engine-wsl**: `run.exe --host 0.0.0.0`、socat / ポートフォワード、`curl` 疎通、`HOST_IP` の扱い（upstream）。
- **markdown-to-zundamon-compile**: Windows 側 PowerShell で `npm` を実行する経路。
- **github-agent-issue**（任意）: `gh issue create` の作法・認証。
- **skill-authoring-repo-pattern**（任意）: スキル正本・symlink 運用。
