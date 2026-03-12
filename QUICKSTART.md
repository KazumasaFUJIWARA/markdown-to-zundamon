# クイックスタート（重要部分）

WSL から PowerShell 経由でコンパイルする際の要点を直下にまとめる。

---

## 立ち絵（characters/）— こちらを優先

- **配置**: `characters/<キャラ名>/`
- **必須**: `default.png`
- **任意**: `default_active1.png`, `default_active2.png`（口パク）
- **ルール**: Markdown frontmatter の `characters[].name` はディレクトリ名と一致させる

---

## WSL → PowerShell コンパイル

### 前提

- VOICEVOX が Windows で `localhost:50021` 起動
- プロジェクトパス（Windows）: `C:\Users\kfuji\Documents\github\markdown-to-zundamon`

### コマンド（WSL で実行）

```bash
# 1) 前処理
powershell.exe -NoProfile -Command "cd 'C:\Users\kfuji\Documents\github\markdown-to-zundamon'; npm run preprocess -- demo/<ファイル>.md"

# 2) レンダリング
powershell.exe -NoProfile -Command "cd 'C:\Users\kfuji\Documents\github\markdown-to-zundamon'; npm run render -- <プロジェクト名>"
```

### 例

```bash
powershell.exe -NoProfile -Command "cd 'C:\Users\kfuji\Documents\github\markdown-to-zundamon'; npm run preprocess -- demo/complex-analysis-2026.md"
powershell.exe -NoProfile -Command "cd 'C:\Users\kfuji\Documents\github\markdown-to-zundamon'; npm run render -- complex-analysis-2026"
```

---

## よくある失敗と対処

| 現象 | 対処 |
|------|------|
| `VOICEVOX に接続できません` | VOICEVOX を Windows で起動。WSL 直実行ではなく PowerShell 経由で実行 |
| `npm error EACCES` / `ENOTEMPTY` | Windows 側で `node_modules` 削除 → `npm install` |
| `Cannot find module ...` | Windows 側で `npm install` をやり直す |

---

## 出力

- 前処理: `public/projects/<project>/manifest.json`
- 動画: `out/<project>.mp4`
