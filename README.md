# HairTalk Translator Landing Page (Learning Project)

このリポジトリは、**Webマーケティング学習プロジェクト**の一環として作成された、
美容院向け通訳サービス「HairTalk Translator」の擬似ランディングページ (LP) を
[GitHub Pages](https://pages.github.com/) 上で公開するためのプロジェクトです。

本プロジェクトはあくまで**学習目的**であり、実際のサービス提供や顧客獲得を目的としたものではありません。

---

## 特徴

* **GitHub Pages** による無料の静的ホスティング
* **シンプルなHTML/CSS** で構成されたランディングページ
* ページ内フォーム（メールアドレス入力）を **JavaScript + Google Apps Script** で処理
* フォーム送信後に **ダミー資料（PDF）** をダウンロード可能
* **GA4 + GTM** を利用したイベント計測

  * CTAクリック
  * フォーム送信
  * PDFダウンロード
* 「作成 → 計測 → 改善」の学習サイクルを実践

---

## 前提条件

* GitHub アカウント
* 基本的な Git 操作
* Google アカウント（Apps Script & スプレッドシート利用）
* GA4 & GTM アカウント（計測を行う場合）

---

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/hairtalk-landing.git
cd hairtalk-landing
```

### 2. ローカルでの表示確認

開発中にローカルでページを確認したい場合は、ブラウザで `index.html` を直接開くのではなく、  
簡易Webサーバーを立てる必要があります（相対パスやフォーム送信処理が正常に動作しない場合があるため）。

#### 推奨方法: VSCode Live Server 拡張

1. VSCode の拡張機能から **Live Server** をインストール  
2. `index.html` を右クリックして「Open with Live Server」を選択  
3. 自動的にブラウザが開き、`http://127.0.0.1:5500` などのURLで確認できます

### 3. GitHub Pages 公開設定

1. GitHubリポジトリ → **Settings → Pages**
2. **Branch: main / root** を選択
3. 数分後、`https://yourusername.github.io/hairtalk-landing/` で公開

---

## フォーム処理の仕組み

* **index.html** に埋め込まれたフォームを **JavaScript (fetch)** で送信
* 送信先は **Google Apps Script (Webアプリ)**
* Apps Script が **スプレッドシートに保存** → JSONレスポンスで成功/失敗を返す
* 成功時はサンクス画面を表示し、**PDFダウンロード**への導線を提示

---

## Google Apps Script 設定手順

1. Google スプレッドシートを作成（例：`hairtalk_leads`）
2. 拡張機能 → Apps Script を開く
3. `Code.gs` にフォーム受け口スクリプトを貼り付け
4. **新しいデプロイ → 種類：ウェブアプリ → 全員アクセス可** で公開
5. 発行されたURLを `assets/main.js` 内の `GAS_ENDPOINT` に設定

---

## ディレクトリ構造

```
.
├── index.html          # LP本体（ヒーロー/説明/CTA/フォーム/注意書き）
├── assets/
│   ├── styles.css      # スタイルシート
│   └── main.js         # フォーム送信処理・GA4イベント送信
├── downloads/
│   └── sample.pdf      # ダミー資料（学習用と明記）
├── README.md           # このファイル
├── LICENSE             # 任意（MITなど）
└── CNAME               # 任意（独自ドメイン利用時）
```

---

## GA4 / GTM 計測イベント

* `cta_click` : CTAボタン押下
* `form_submit` : フォーム送信成功
* `file_download` : PDFリンククリック

> GTMで「リンククリック」や「カスタムイベント」を設定し、GA4に送信します。

---

## 学習フロー

1. LP作成・公開
2. GA4 + GTM で計測設定
3. 知人アクセス等でテストデータ収集
4. CVR（コンバージョン率）の初期測定
5. CTA文言や配置を変更 → ABテスト実施
6. 改善サイクルを繰り返し、効果を比較

---

## 注意事項

* 本LPは **学習目的** であり、商用利用は想定していません
* フォームで取得したメールアドレスは学習目的に限定して扱います
* ページ内およびPDFに「学習用である」ことを明記してください
* 個人情報の保存期間・削除方法を README またはページ内に記載すると安心です