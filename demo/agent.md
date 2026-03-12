# 動画作成フロー（agent用メモ）

## 前提条件

- Node.js
- VOICEVOX が `localhost:50021` で起動していること（前処理時のみ）

## 実行手順

```bash
# 1. 前処理: Markdown解析 + VOICEVOX音声生成
npm run preprocess -- demo/<ファイル名>.md

# 2. プレビュー（任意）
npm run studio -- <プロジェクト名>

# 3. レンダリング → out/<プロジェクト名>.mp4
npm run render -- <プロジェクト名>
```

- **プロジェクト名**: Markdownファイル名（拡張子なし）。例: `demo/rdx.md` → `rdx`
- 前処理で `public/projects/<プロジェクト名>/manifest.json` が生成される

## Markdownの書き方

### 基本構造

```yaml
---
characters:
  - name: キャラ名
    speakerId: 3        # VOICEVOX話者ID
    position: right     # left | right
    color: "#55B02E"    # 字幕の色
---
```

### コンテンツ

| 記法 | 役割 |
|------|------|
| `> # 見出し` (blockquote) | スライド表示 |
| 通常テキスト | キャラが喋る（VOICEVOX音声） |
| `[キャラ名] テキスト` | 話者を指定（複数キャラ時） |
| `[pause: 500ms]` | 無音ポーズ |
| `<ruby>表示<rt>よみ</rt></ruby>` | 表示と読みを分離 |

### キャラクターオプション

| オプション | 説明 | デフォルト |
|-----------|------|-----------|
| `overflowY` | 画面下にはみ出す割合 (0-1) | 0.4 |
| `overflowX` | 横にはみ出す割合 (0-1) | 0.1 |
| `flip` | 左右反転 | false |
| `bottomOffset` | 上方向オフセット（px） | 0 |

### キャラクター画像

`characters/<キャラ名>/` に配置:

- `default.png` … 必須（通常時）
- `default_active1.png` … 口パク用（任意）
- `default_active2.png` … 口パク用（任意）

## 例: demo/rdx.md

```markdown
---
characters:
  - name: ろんくん
    speakerId: 3
    position: right
    color: "#55B02E"
    bottomOffset: 80
  - name: ろんちゃん
    speakerId: 2
    flip: true
    color: "#b4456e"
    overflowY: 0.6
    bottomOffset: 80
---

> ## rdx: 龍谷DXチームの紹介
>
> - 妥当神エクセル
> - word撲滅すべし

[ろんくん] rdxは学生の不便さをdxで解決しようとする、学生主体の団体です。
[ろんちゃん] Steam commonsで活動しています。
```

## 再生成

**重要**: `rdx.md` などの Markdown を編集しても、動画には自動反映されない。  
必ず前処理を再実行して `manifest.json` を更新してから、レンダリングする。

```bash
npm run preprocess -- demo/rdx.md
npm run render -- rdx
```
