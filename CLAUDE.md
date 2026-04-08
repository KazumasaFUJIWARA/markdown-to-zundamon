# markdown-to-zundamon

Markdownからずんだもん解説動画を生成するプロジェクト。Remotionベース。

## 前提条件

- Node.js
- VOICEVOX が `localhost:50021` で起動していること（前処理時）

任意: `ZUNDAMON_PUBLIC_DIR` で `public` 相当のディレクトリを指定、`ZUNDAMON_OUTPUT` でレンダ結果の MP4 パスまたは出力ディレクトリを指定（`README.md` 参照）。

## ビルド・実行手順

```bash
# 1. 前処理: Markdown解析 + VOICEVOX音声生成 → public/projects/<project>/manifest.json
npm run preprocess -- example/my-video.md

# 2. プレビュー
npm run studio -- my-video

# 3. レンダリング → out/<project>.mp4
npm run render -- my-video
```

複数の動画を扱う場合はそれぞれ前処理→レンダリングを実行:

```bash
npm run preprocess -- projects/intro.md
npm run render -- intro

npm run preprocess -- projects/chapter1.md
npm run render -- chapter1
```

## アーキテクチャ

2フェーズ構成:
1. **前処理** (`scripts/preprocess.ts`): Markdown → VOICEVOX音声生成 → JSONマニフェスト
2. **動画生成** (`src/`): マニフェストを読み込み、Remotionで音声・字幕・スライド・キャラ画像を合成

- blockquote → スライド表示
- それ以外のテキスト → ずんだもんが喋る（VOICEVOX）

## ファイル構成

- `scripts/preprocess.ts` - 前処理スクリプト
- `scripts/studio.ts` - Remotion Studio 起動ヘルパースクリプト
- `scripts/render.ts` - レンダリングヘルパースクリプト
- `src/index.ts` - Remotion registerRoot
- `src/Root.tsx` - Composition登録（calculateMetadata で動的マニフェスト読み込み）
- `src/Composition.tsx` - メイン合成コンポーネント
- `src/components/` - UI コンポーネント群
- `src/types.ts` - 型定義
- `public/projects/<project>/manifest.json` - 前処理出力（生成物）
- `public/projects/<project>/audio/` - 生成された音声ファイル（生成物）
- `public/projects/<project>/images/` - スライド用画像（生成物）
- `public/characters/<キャラ名>/default.png` ほか - 前処理でコピーされた立ち絵（生成物）
- `characters/` - キャラクター画像（ソース）
- `out/<project>.mp4` - レンダリング出力（生成物）

## コーディング規約

- TypeScript strict
- Remotion のコンポーネント規約に従う
