# 🛍️ アフィリエイト設定ガイド

テニスゲームにアフィリエイトリンクを設定して、追加収益を得る方法を説明します。

## 📋 目次
1. [アフィリエイトサービスの選択](#1-アフィリエイトサービスの選択)
2. [Amazonアソシエイトの登録手順](#2-amazonアソシエイトの登録手順)
3. [商品リンクの取得方法](#3-商品リンクの取得方法)
4. [HTMLへのリンク設定](#4-htmlへのリンク設定)
5. [収益最大化のコツ](#5-収益最大化のコツ)

---

## 1. アフィリエイトサービスの選択

### 🇯🇵 日本のおすすめアフィリエイトサービス

#### 1位: Amazonアソシエイト（最推奨）
- **特徴**: 商品数が圧倒的、信頼性が高い
- **報酬率**: 2-10%（商品カテゴリーによる）
- **最低支払額**: 500円（Amazonギフト券）
- **登録**: https://affiliate.amazon.co.jp/

**メリット**:
- ✅ 誰でも知っている安心感
- ✅ 商品が豊富
- ✅ リンク作成が簡単
- ✅ すぐに始められる

#### 2位: 楽天アフィリエイト
- **特徴**: 日本のユーザーに人気
- **報酬率**: 2-4%
- **最低支払額**: 3,000円
- **登録**: https://affiliate.rakuten.co.jp/

#### 3位: Yahoo!ショッピング アフィリエイト
- **特徴**: PayPay連携で需要増
- **報酬率**: 1-50%（商品による）
- **登録**: バリューコマース経由

#### 4位: A8.net（総合ASP）
- **特徴**: 日本最大級のASP
- **報酬率**: 案件による
- **最低支払額**: 1,000円
- **登録**: https://www.a8.net/

---

## 2. Amazonアソシエイトの登録手順

### Step 1: アカウント作成

1. https://affiliate.amazon.co.jp/ にアクセス
2. 「無料アカウント作成」をクリック
3. Amazonアカウントでログイン（持っていない場合は作成）

### Step 2: 必要情報の入力

#### 2-1. アカウント情報
- 氏名
- 住所
- 電話番号

#### 2-2. ウェブサイト情報
- **ウェブサイトURL**: 
  ```
  https://UK210.github.io/my-portfolio/game/tennis_game/tennis.html
  ```
- **ウェブサイトの説明**: 
  ```
  無料で遊べるブラウザゲーム。テニスをテーマにしたブロック崩しゲームで、
  ゲーム好きなユーザーに向けてゲーム関連商品を紹介しています。
  ```
- **トピック**: ゲーム、エンターテイメント

#### 2-3. トラフィックと収益化
- **月間訪問者数**: 現在の予想（正直に記入）
- **主な収益化方法**: アフィリエイト、広告
- **ウェブサイトの作成方法**: 自分で作成

### Step 3: 審査

- 申請後、数日で審査結果が届きます
- **承認条件**:
  - オリジナルコンテンツがある
  - 一定のアクセスがある（目安：月100-500PV）
  - 利用規約に違反していない

### Step 4: アソシエイトIDの確認

承認されたら、アソシエイトIDが発行されます。
- 形式: `あなたのID-22`
- 例: `uk210game-22`

---

## 3. 商品リンクの取得方法

### 方法1: サイトストライプを使う（最も簡単）

1. Amazonアソシエイトにログイン
2. 通常のAmazon.co.jpにアクセス
3. 上部に「サイトストライプ」バーが表示される
4. 紹介したい商品ページを開く
5. サイトストライプの「テキスト」をクリック
6. 短縮URLをコピー
   ```
   例: https://amzn.to/3xXxXxX
   ```

### 方法2: 商品リンク作成ツール

1. アソシエイトセンターにログイン
2. 「商品リンク」→「商品リンク作成」
3. 商品名やASINを入力して検索
4. 「リンク作成」をクリック
5. HTMLコードまたはURLをコピー

### 方法3: PA-APIを使う（上級者向け）

Product Advertising APIを使って自動で商品情報を取得。

---

## 4. HTMLへのリンク設定

### 現在のHTMLコード（プレースホルダー）

```html
<a href="#" class="affiliate-button" target="_blank" rel="nofollow noopener">
  Amazonで見る
</a>
```

### 実際のリンクに置き換え

#### 例1: ゲーミングマウス

**取得したリンク**:
```
https://amzn.to/3AbCdEf
```

**HTMLを更新**:
```html
<a href="https://amzn.to/3AbCdEf" class="affiliate-button" target="_blank" rel="nofollow noopener">
  Amazonで見る
</a>
```

### 🎯 全6商品のリンクを設定

`tennis.html` を開いて、以下の箇所を編集：

#### 商品1: ゲーミングマウス（138行目付近）
```html
<!-- 変更前 -->
<a href="#" class="affiliate-button" target="_blank" rel="nofollow noopener">
  Amazonで見る
</a>

<!-- 変更後 -->
<a href="https://amzn.to/YOUR_MOUSE_LINK" class="affiliate-button" target="_blank" rel="nofollow noopener">
  Amazonで見る
</a>
```

#### 商品2: ゲーミングキーボード（156行目付近）
```html
<a href="https://amzn.to/YOUR_KEYBOARD_LINK" class="affiliate-button" target="_blank" rel="nofollow noopener">
  Amazonで見る
</a>
```

#### 商品3: マリオテニス エース（169行目付近）
```html
<a href="https://amzn.to/YOUR_TENNIS_GAME_LINK" class="affiliate-button" target="_blank" rel="nofollow noopener">
  Amazonで見る
</a>
```

#### 商品4: ゲーム開発入門書（182行目付近）
```html
<a href="https://amzn.to/YOUR_BOOK_LINK" class="affiliate-button" target="_blank" rel="nofollow noopener">
  Amazonで見る
</a>
```

#### 商品5: ゲーミングモニター（196行目付近）
```html
<a href="https://amzn.to/YOUR_MONITOR_LINK" class="affiliate-button" target="_blank" rel="nofollow noopener">
  Amazonで見る
</a>
```

#### 商品6: Nintendo Switch本体（208行目付近）
```html
<a href="https://amzn.to/YOUR_SWITCH_LINK" class="affiliate-button" target="_blank" rel="nofollow noopener">
  Amazonで見る
</a>
```

---

## 5. 収益最大化のコツ

### 📊 効果的な商品選定

#### ✅ クリック率が高い商品
1. **ゲーミングマウス** - ゲーマーの必需品
2. **人気ゲームソフト** - 具体的なタイトル
3. **手頃な価格帯** - ¥2,000-¥10,000が購入されやすい

#### ❌ 避けるべき商品
- 高額すぎる商品（¥100,000以上）
- ゲームと無関係な商品
- 在庫切れが多い商品

### 🎯 クリック率を上げる工夫

#### 1. 魅力的な説明文
```html
<!-- 悪い例 -->
<p class="affiliate-desc">ゲーミングマウス</p>

<!-- 良い例 -->
<p class="affiliate-desc">
  高精度センサー搭載で正確な操作が可能。反応速度が格段にアップ！
  ゲームのスコアアップに最適です。
</p>
```

#### 2. 実際の商品画像を使う

プレースホルダーの絵文字を実際の商品画像に変更：

```html
<!-- 変更前 -->
<div class="affiliate-image-placeholder">
  <span class="affiliate-icon">🖱️</span>
</div>

<!-- 変更後 -->
<div class="affiliate-image-placeholder">
  <img src="商品画像URL" alt="ゲーミングマウス" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
</div>
```

※ Amazonの画像利用規約を確認してください

#### 3. 期間限定やセール情報

```html
<div class="affiliate-price">
  <span style="text-decoration: line-through; color:#888;">¥8,000</span>
  ¥5,980 <span style="color:#ff4444; font-size:14px;">20%OFF</span>
</div>
```

### 📈 効果測定

#### Amazonアソシエイトレポート
- **クリック数**: どの商品がクリックされているか
- **コンバージョン率**: 何%の人が購入しているか
- **収益**: 商品ごとの収益

#### Google Analyticsと連携
```html
<!-- クリック追跡用のコード例 -->
<a href="https://amzn.to/YOUR_LINK" 
   onclick="gtag('event', 'click', {'event_category': 'affiliate', 'event_label': 'gaming_mouse'});"
   class="affiliate-button" target="_blank" rel="nofollow noopener">
  Amazonで見る
</a>
```

---

## 💰 期待される収益

### 報酬率（Amazonアソシエイト）

| カテゴリー | 報酬率 |
|----------|-------|
| ゲーム&ゲーム機 | 2% |
| PC・周辺機器 | 2% |
| 本 | 3% |
| ファッション | 3-10% |

### 収益シミュレーション

**前提条件**:
- 月間訪問者: 10,000人
- アフィリエイトクリック率: 3%（300クリック）
- 購入率: 5%（15購入）
- 平均単価: ¥5,000
- 報酬率: 2%

**計算**:
```
15購入 × ¥5,000 × 2% = ¥1,500/月
```

**訪問者数別の収益目安**:

| 月間訪問者 | 推定収益/月 |
|-----------|-----------|
| 1,000     | ¥150      |
| 10,000    | ¥1,500    |
| 100,000   | ¥15,000   |

---

## ⚠️ 注意事項とルール

### Amazonアソシエイト規約

#### ✅ OK
- オリジナルコンテンツでの紹介
- 正直なレビュー・説明
- 適切な開示（「当サイトはアソシエイト参加者です」）

#### ❌ NG
- 価格の明示（変動するため）
- 「最安値」「最高」などの断言
- メールでのリンク送信
- クリック誘導のための虚偽情報
- 自己購入による報酬獲得

### 必須の開示文

HTMLに既に含まれています：
```html
<p class="affiliate-disclaimer">
  ※ 価格は参考価格です。最新の価格は各リンク先でご確認ください。<br>
  ※ 当サイトはAmazonアソシエイト・プログラムの参加者です。
</p>
```

---

## 🚀 クイックスタートチェックリスト

実装前の確認：

- [ ] Amazonアソシエイトに登録完了
- [ ] アソシエイトIDを取得
- [ ] 6つの商品のアフィリエイトリンクを取得
- [ ] `tennis.html` の全6箇所のリンクを更新
- [ ] 商品説明と価格を最新情報に更新
- [ ] GitHubにpush
- [ ] 実際にリンクをクリックしてテスト
- [ ] アソシエイトレポートで計測開始

---

## 📚 参考リンク

- [Amazonアソシエイト公式](https://affiliate.amazon.co.jp/)
- [アソシエイト・プログラム運営規約](https://affiliate.amazon.co.jp/help/operating/agreement)
- [リンク作成ガイド](https://affiliate.amazon.co.jp/help/node/topic/GP38PJ6EUR6PFBEC)

---

## 🎯 次のステップ

アフィリエイト設定後:

1. ✅ **複数のアフィリエイトサービスを併用**
   - Amazon + 楽天 でカバー率アップ
   
2. ✅ **商品を定期的に更新**
   - セール情報
   - 新商品の追加
   
3. ✅ **A/Bテスト**
   - 商品配置を変えて効果測定
   - 説明文を改善

4. ✅ **レビュー記事を追加**
   - 実際に使った商品のレビュー
   - より詳細な紹介ページ

**収益化成功を祈ります！** 🎮💰

