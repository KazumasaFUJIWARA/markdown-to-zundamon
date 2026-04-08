---
name: markdown-to-zundamon-authoring
description: >-
  markdown-to-zundamon 用の Markdown を書くときの構成・frontmatter・スライド／セリフ／章のルール。台本作成・教材化・解説動画の原稿を書くときに読む。前処理・レンダリングの実行手順は markdown-to-zundamon-compile または markdown-to-zundamon-wsl-direct。
---

# markdown-to-zundamon 作成ガイド（Markdown 原稿）

## このスキルの正本

- **`skills/markdown-to-zundamon-authoring/`** が正本。`.cursor/skills/markdown-to-zundamon-authoring` は symlink。
- 型・既定値の一次情報は **`src/types.ts`**（`ManifestConfigSchema` / `CharacterSchema`）。詳細な例は **`README.md`**。

## いつ読むか

- 新規の解説動画・スライド付き台本の **Markdown を起こす・レビューする** とき。
- **実行**（`npm run preprocess` 等）だけなら **`markdown-to-zundamon-compile`** または **`markdown-to-zundamon-wsl-direct`** を先に使う。

## プロジェクト名と出力

- **プロジェクト名**＝入力 Markdown の **ファイル名（拡張子なし）**。`slides/intro.md` なら `intro`。
- 前処理後: `<public ルート>/projects/<プロジェクト名>/manifest.json` ほか（既定ではリポの `public`）。
- レンダ後: 既定は `out/<プロジェクト名>.mp4`。**`ZUNDAMON_PUBLIC_DIR`** / **`ZUNDAMON_OUTPUT`** で別パスにできる（README）。

## Frontmatter（必須・任意）

- **`characters` は必須**（1 人以上）。各要素は少なくとも **`name`** と **`speakerId`**。
- **よく使う任意項目**（省略時はスキーマ既定）: `fps`, `width`, `height`, `slideTransitionMs`, `speechGapMs`, `paragraphGapMs`, `fontFamily`, `subtitleFontFamily`, `slideFontFamily`, `codeHighlightTheme`, `chapterTitlePosition`, `bgm`。
- **キャラ 1 人**のときは **`[キャラ名]` タグ省略可**（そのキャラが既定話者）。
- **キャラ 2 人**かつ 2 人目に `position` 未指定なら、前処理で **`left`**  が補われる（README 参照）。
- **`characters[].name`** はディレクトリ名と一致させ、**`characters/<name>/default.png`** を置く。口パク用に **`default_active1.png`** など任意。
- レイアウト系の主なキー（`CharacterSchema`）: `position`（`left` | `right`）, `flip`, `color`, `overflowY`, `overflowX`, `height`, `activeImages`（通常は前処理がファイルから埋める）。

```yaml
---
characters:
  - name: ずんだもん
    speakerId: 3
    position: right
    color: "#55B02E"
---
```

**BGM**: `bgm.src` は Markdown 基準またはリポジトリルート基準で解決。前処理で `public/projects/<プロジェクト名>/bgm/` にコピーされる。

## 本文のブロック単位（最重要）

パーサは Markdown を **ブロックの列**として扱う。種類ごとに動画への映射が決まる。

| ブロック | 動画での扱い |
|----------|----------------|
| **見出し**（`#` … `######`） | **チャプター**（タイトル表示。直前にトランジション用ポーズが入ることあり） |
| **引用**（`>` で始まる blockquote） | **スライド**（中身は Markdown のまま表示。画像はローカル・URL 可で前処理が取り込み） |
| **上記以外**（段落・リスト等） | **音声セリフ**に分解（下記） |

## セリフ行のルール

- 音声用のテキストは **`toString` したあと改行で分割され、空行以外の各行が 1 セリフ**。
- 行頭の **`[キャラ名]`** で話者切替。`characters` に無い名前は警告のうえ既定に戻る。**タグなし行は直前の話者を継承**。
- 行全体が **`[pause: 500ms]`** または **`[pause: 1s]`** 形式なら **無音ポーズ**（`ms` / `s`）。
- **`<ruby>漢字<rt>よみ</rt></ruby>`** は、字幕は漢字側、読み上げは `rt` 側（README 図と同じ）。

## 構成のコツ

- **スライド**: 箇条書き・図・式の「見せたい塊」を `>` にまとめる。説明はその外の行で喋らせ、**スライドとセリフを交互に**すると視聴しやすい。
- **章**: `##` / `###` で区切るとチャプタータイトルとタイムスタンプ生成（`chapters.txt`）に使われる。
- **間**: セリフだけだと `speechGapMs` / `paragraphGapMs` が自動挿入。強調の間は **`[pause: …]`**。
- **VOICEVOX**: 1 セリフが長すぎると品質やタイミングが重くなりがち。**意味の区切りで行を分ける**。
- **画像パス**: Markdown ファイルからの相対パス。blockquote 外の画像挙動に迷う場合は、まずスライド内に置く。

## 実行との分界

| 作業 | 参照スキル |
|------|------------|
| 原稿・frontmatter・記法 | **本スキル**（＋ README） |
| WSL → PowerShell で npm | **markdown-to-zundamon-compile** |
| WSL 直接＋ `VOICEVOX_BASE` | **markdown-to-zundamon-wsl-direct** |
| エンジン待受・IP・フォワード | **voicevox-engine-wsl**（グローバル） |

## 解消しないとき（GitHub Issue）

本スキル・**`README.md`**・**`src/types.ts`** に沿っているつもりなのに **前処理／レンダが落ちる・manifest がおかしい** など、**ツール側の不具合やドキュメント不整合**が疑われるときは、**GitHub に Issue を起票**する。**固有情報はマスク**する。

- リポジトリルートで **`gh issue create`**（認証済みの `gh`）。起票先を変えるときは **`--repo <OWNER>/<REPO>`**。
- 本文に **再現手順**（使った Markdown の最小片）、**期待と実際**、**どの実行スキル経路か**（compile / wsl-direct）を書く。
- テンプレや `gh` の細部は **github-agent-issue**（任意）を参照。

## 依存スキル

- **markdown-to-zundamon-compile** / **markdown-to-zundamon-wsl-direct**: 前処理・プレビュー・レンダリング。
- **voicevox-engine-wsl**（任意）: WSL から Windows 上 VOICEVOX への接続・疎通。
- **github-agent-issue**（任意）: `gh issue create` の作法・認証。
