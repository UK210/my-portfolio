# 🎯 Google AdSense 連携手順ガイド

このガイドでは、テニスゲームにGoogle AdSenseを連携して収益化する手順を説明します。

## 📋 目次
1. [Google AdSenseアカウントの作成](#1-google-adsenseアカウントの作成)
2. [サイトの登録](#2-サイトの登録)
3. [広告コードの取得](#3-広告コードの取得)
4. [ゲームへの広告実装](#4-ゲームへの広告実装)
5. [広告の確認とテスト](#5-広告の確認とテスト)
6. [収益化のヒント](#6-収益化のヒント)

---

## 1. Google AdSenseアカウントの作成

### ステップ 1.1: AdSenseサイトにアクセス
1. [Google AdSense](https://www.google.com/adsense/) にアクセス
2. 「ご利用開始」ボタンをクリック
3. Googleアカウントでログイン

### ステップ 1.2: 必要情報の入力
- **ウェブサイトのURL**: ゲームを公開するURL（例: https://yourusername.github.io/tennis-game/）
- **メールアドレス**: 連絡先メール
- **国/地域**: 日本
- **利用規約への同意**: チェックボックスにチェック

### ステップ 1.3: 支払い情報の設定
- 氏名・住所
- 電話番号
- 銀行口座情報（後で設定可能）

---

## 2. サイトの登録

### ステップ 2.1: ゲームの公開
まず、ゲームをWeb上に公開する必要があります。

**推奨方法: GitHub Pages（無料）**

```bash
# 1. GitHubリポジトリを作成
# 2. ゲームファイルをpush
git add .
git commit -m "Add tennis game with AdSense"
git push origin main

# 3. GitHub Pagesを有効化
# Settings > Pages > Source > main branch > Save
```

公開後のURL: `https://あなたのユーザー名.github.io/リポジトリ名/game/tennis_game/tennis.html`

### ステップ 2.2: AdSenseにサイトを追加
1. AdSenseダッシュボードで「サイト」タブをクリック
2. 「サイトを追加」をクリック
3. ゲームのURLを入力

---

## 3. 広告コードの取得

### ステップ 3.1: AdSenseコード（ヘッダー）の取得
1. AdSenseダッシュボード > 「広告」 > 「サマリー」
2. 「コードを取得」をクリック
3. 以下のようなコードが表示されます：

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
```

### ステップ 3.2: 広告ユニットの作成

#### 上部バナー広告（横長）
1. 「広告」 > 「広告ユニットごと」 > 「ディスプレイ広告」
2. 設定:
   - **広告ユニット名**: `テニスゲーム_トップバナー`
   - **広告サイズ**: `レスポンシブ` または `横長バナー (728x90)`
3. 「作成」をクリック
4. 広告コードをコピー

#### サイドバー広告（縦長）
1. 新しい広告ユニットを作成
2. 設定:
   - **広告ユニット名**: `テニスゲーム_サイドバー`
   - **広告サイズ**: `縦長タワー (160x600)`
3. 「作成」をクリック
4. 広告コードをコピー

#### 下部バナー広告
1. 新しい広告ユニットを作成
2. 設定:
   - **広告ユニット名**: `テニスゲーム_フッター`
   - **広告サイズ**: `レスポンシブ`
3. 「作成」をクリック

#### ゲームオーバー画面広告（正方形）
1. 新しい広告ユニットを作成
2. 設定:
   - **広告ユニット名**: `テニスゲーム_ゲームオーバー`
   - **広告サイズ**: `レクタングル (336x280)`
3. 「作成」をクリック

---

## 4. ゲームへの広告実装

### ステップ 4.1: ヘッダーコードの追加

`tennis.html` の `<head>` 内にある以下のコメント部分を編集：

```html
<!-- 変更前 -->
<!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script> -->

<!-- 変更後（実際の番号に置き換え） -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
```

### ステップ 4.2: 各広告ユニットのコード置き換え

HTMLファイル内の全ての `data-ad-client` と `data-ad-slot` を実際の値に置き換えます。

#### 例: 上部バナー広告
```html
<!-- 変更前 -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="YYYYYYYYYY"
     data-ad-format="horizontal"
     data-full-width-responsive="true"></ins>

<!-- 変更後 -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1234567890123456"
     data-ad-slot="9876543210"
     data-ad-format="horizontal"
     data-full-width-responsive="true"></ins>
```

**置き換える箇所:**
- `ca-pub-XXXXXXXXXXXXXXXX` → あなたのパブリッシャーID
- `YYYYYYYYYY` → トップバナー広告のスロットID
- `ZZZZZZZZZZ` → サイドバー広告のスロットID
- `AAAAAAAAAA` → ゲームオーバー広告のスロットID
- `BBBBBBBBBB` → フッター広告のスロットID

### ステップ 4.3: 広告初期化スクリプトの有効化

`tennis.html` の最後にある以下のコメントを解除：

```html
<!-- 変更前 -->
<script>
  // AdSense広告を読み込む（実際のコードが設定された後に有効化）
  // (adsbygoogle = window.adsbygoogle || []).push({});
</script>

<!-- 変更後 -->
<script>
  // AdSense広告を読み込む
  (adsbygoogle = window.adsbygoogle || []).push({});
  (adsbygoogle = window.adsbygoogle || []).push({});
  (adsbygoogle = window.adsbygoogle || []).push({});
  (adsbygoogle = window.adsbygoogle || []).push({});
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

各 `push({})` は各広告ユニットに対応します（5箇所の広告）。

---

## 5. 広告の確認とテスト

### ステップ 5.1: ローカルテスト
1. ファイルを保存
2. ブラウザで `tennis.html` を開く
3. 広告スペースが表示されることを確認

⚠️ **注意**: ローカル（file://）では広告は表示されません。実際のWebサーバーで公開する必要があります。

### ステップ 5.2: 公開後の確認
1. GitHub Pagesなどにファイルをアップロード
2. 公開URLにアクセス
3. 広告が表示されるまで待つ（最大48時間）

### ステップ 5.3: AdSenseダッシュボードで確認
1. AdSenseにログイン
2. 「サイト」タブで承認ステータスを確認
3. 広告が配信されているか確認

---

## 6. 収益化のヒント

### 📈 収益を最大化する方法

#### 6.1 トラフィックを増やす
- **SEO対策**: タイトル、メタディスクリプションを最適化済み
- **SNS共有**: Twitter、Reddit、ゲームフォーラムで共有
- **ゲームポータルサイト**: itch.io、Newgroundsなどに掲載

#### 6.2 広告配置の最適化
現在の広告配置：
- ✅ ページ上部（視認性高）
- ✅ ゲーム両サイド（邪魔にならない）
- ✅ ゲームオーバー画面（クリック率高）
- ✅ ページ下部（スクロール後）

#### 6.3 ユーザー体験の維持
- ゲームプレイを邪魔しない配置
- モバイルでは広告を最小限に（レスポンシブ対応済み）
- 広告が多すぎないように（現在5箇所）

#### 6.4 追加の収益源
1. **アフィリエイト**:
   - ゲーム関連商品のリンクを追加
   - おすすめゲーミングデバイス紹介

2. **寄付・サポート**:
   - Ko-fiボタン追加
   - 「開発を支援」リンク

3. **プレミアム機能**（将来的）:
   - 広告除去オプション（¥500）
   - 追加ステージ（¥300）
   - カスタムスキン（¥100-300）

### 📊 期待される収益（目安）

| 訪問者数/月 | クリック率 | 推定収益/月 |
|------------|-----------|-----------|
| 1,000      | 1-2%      | ¥100-500  |
| 10,000     | 1-2%      | ¥1,000-5,000 |
| 100,000    | 1-2%      | ¥10,000-50,000 |

※ クリック単価（CPC）は通常 ¥10-100

---

## ❗ よくある問題と解決策

### 問題1: 広告が表示されない
**原因**:
- サイトがまだ承認されていない（最大48時間）
- AdBlockerが有効
- コードの設定ミス

**解決策**:
1. AdSenseダッシュボードで承認状況を確認
2. ブラウザの広告ブロッカーを無効化
3. コンソール（F12）でエラーをチェック

### 問題2: 「AdSenseコードが見つかりません」
**原因**: ヘッダーコードが正しく配置されていない

**解決策**: `<head>` 内にAdSenseスクリプトがあることを確認

### 問題3: 収益が少ない
**原因**: トラフィックが少ない、クリック率が低い

**解決策**:
- SEO改善
- SNSでのプロモーション
- ゲームの面白さを向上

---

## 📚 参考リンク

- [Google AdSense ヘルプセンター](https://support.google.com/adsense/)
- [AdSenseポリシー](https://support.google.com/adsense/answer/48182)
- [GitHub Pages ドキュメント](https://docs.github.com/ja/pages)

---

## ✅ チェックリスト

実装前に確認：

- [ ] AdSenseアカウント作成完了
- [ ] ゲームをWeb上に公開
- [ ] サイトをAdSenseに登録
- [ ] パブリッシャーIDを取得
- [ ] 広告ユニット（5つ）を作成
- [ ] HTMLファイルに広告コードを設定
- [ ] 広告初期化スクリプトを有効化
- [ ] 公開URLで広告が表示されることを確認
- [ ] AdSenseダッシュボードで収益を確認

---

## 🎉 完了後

広告設定が完了したら：
1. 🚀 ゲームをSNSで共有
2. 📊 AdSenseダッシュボードで毎日収益を確認
3. 🎮 次のマネタイズ手法（アフィリエイト、課金）を検討

**収益化成功を祈ります！** 🎯💰

