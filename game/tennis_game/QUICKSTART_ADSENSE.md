# 🚀 AdSense クイックスタートガイド（5分で設定）

最速でAdSenseを始めるための簡易ガイドです。

## ⚡ 3ステップで完了

### Step 1: AdSenseに登録（所要時間: 5分）
1. https://www.google.com/adsense/ にアクセス
2. Googleアカウントでログイン
3. サイトURL、住所、銀行情報を入力

### Step 2: ゲームを公開（所要時間: 3分）
```bash
# GitHub Pagesで無料公開
git add .
git commit -m "Add AdSense to tennis game"
git push origin main

# GitHub Settings > Pages > Source を main に設定
```

公開URL: `https://あなたのユーザー名.github.io/リポジトリ名/game/tennis_game/tennis.html`

### Step 3: コードを貼り付け（所要時間: 2分）

#### 3-1. パブリッシャーIDをコピー
AdSenseダッシュボード > アカウント設定 > `ca-pub-1234567890123456`

#### 3-2. HTMLファイルを編集
`tennis.html` を開いて以下を置き換え：

```html
<!-- 1. <head>内のコメントを解除 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-あなたのID"
     crossorigin="anonymous"></script>

<!-- 2. 全ての広告コードのIDを置き換え -->
<!-- 変更前 -->
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
data-ad-slot="YYYYYYYYYY"

<!-- 変更後 -->
data-ad-client="ca-pub-1234567890123456"  ← あなたのID
data-ad-slot="9876543210"  ← 広告ユニットのスロットID
```

#### 3-3. 広告ユニットを作成
AdSense > 広告 > 広告ユニットごと > ディスプレイ広告

**5つの広告ユニットを作成:**
1. **トップバナー** (レスポンシブ) → スロットIDをコピー → `YYYYYYYYYY` を置き換え
2. **サイドバー** (160x600) → スロットIDをコピー → `ZZZZZZZZZZ` を置き換え  
3. **ゲームオーバー** (336x280) → スロットIDをコピー → `AAAAAAAAAA` を置き換え
4. **フッター** (レスポンシブ) → スロットIDをコピー → `BBBBBBBBBB` を置き換え
5. **右サイドバー** (160x600) → 同じスロットIDを使用可

#### 3-4. 初期化スクリプトを有効化
`tennis.html` の最後（`</body>` の前）:

```html
<!-- コメントを解除して有効化 -->
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
  (adsbygoogle = window.adsbygoogle || []).push({});
  (adsbygoogle = window.adsbygoogle || []).push({});
  (adsbygoogle = window.adsbygoogle || []).push({});
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### Step 4: アップロードして完了！
```bash
git add .
git commit -m "Configure AdSense codes"
git push origin main
```

24-48時間後に広告が表示され始めます 🎉

---

## 📝 置き換え一覧表

あなたのIDをメモして一括置き換え:

| プレースホルダー | 実際の値 | 場所 |
|----------------|---------|-----|
| `ca-pub-XXXXXXXXXXXXXXXX` | `ca-pub-あなたのID` | 全ての広告コード |
| `YYYYYYYYYY` | トップバナーのスロットID | 上部広告 |
| `ZZZZZZZZZZ` | サイドバーのスロットID | 左右サイドバー |
| `AAAAAAAAAA` | レクタングルのスロットID | ゲームオーバー画面 |
| `BBBBBBBBBB` | フッターのスロットID | 下部広告 |

---

## ✅ 完了チェック

- [ ] AdSenseアカウント登録完了
- [ ] ゲームをGitHub Pagesで公開
- [ ] パブリッシャーIDを取得
- [ ] 5つの広告ユニットを作成
- [ ] HTMLの `ca-pub-XXXX` を全て置き換え
- [ ] 各広告のスロットIDを設定
- [ ] 初期化スクリプトのコメント解除
- [ ] GitHubにpush

---

## 🔍 トラブルシューティング

**Q: 広告が表示されない**  
A: 最大48時間待つ必要があります。AdSenseダッシュボードで承認状況を確認。

**Q: エラーが出る**  
A: ブラウザのコンソール（F12）を開いてエラーメッセージを確認。パブリッシャーIDが正しいか確認。

**Q: 広告の数は適切？**  
A: 5箇所は適切です。多すぎるとペナルティ、少なすぎると収益減。

---

## 📊 次のステップ

広告設定後にやること:
1. ✅ Google Analyticsを追加（アクセス解析）
2. ✅ SNSでゲームを共有（トラフィック増加）
3. ✅ アフィリエイトリンク追加（追加収益）
4. ✅ プレミアム機能を実装（課金システム）

**詳細な手順は `ADSENSE_SETUP.md` を参照してください。**

---

💡 **ヒント**: 最初の数週間は収益が少ないですが、トラフィックが増えれば安定した収入源になります！

