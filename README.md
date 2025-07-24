# Docker UV Template for GPU-accelerated Python Projects

NVIDIA GPU対応のPython開発環境を、[uv](https://github.com/astral-sh/uv)パッケージマネージャを使って素早く構築するためのDockerテンプレートです。機械学習や深層学習のプロジェクトに最適化されています。

## 特徴

- NVIDIA CUDA 12.4 & cuDNN ベース
- [uv](https://github.com/astral-sh/uv) パッケージマネージャ採用（Pythonパッケージ管理の高速化）
- PyTorch, TensorFlow, CatBoost, XGBoostなどの主要ML/DLライブラリをGPU対応で事前設定
- Jupyter Lab環境を含む開発環境
- シンプルなディレクトリ構造で柔軟なカスタマイズが可能

## 前提条件

- [Docker](https://www.docker.com/) と [Docker Compose](https://docs.docker.com/compose/)
- [NVIDIA Container Toolkit](https://github.com/NVIDIA/nvidia-docker)

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/docker-uv-template.git
cd docker-uv-template
```

### 2. 環境変数の設定

`.env.example`を`.env`にコピーして必要に応じて編集します：

```bash
cp .env.example .env
# 必要に応じて.envを編集（プロキシ設定など）
```

### 3. Dockerイメージのビルドと起動

```bash
# イメージをビルドしてコンテナを起動（バックグラウンド実行）
docker compose up -d

# コンテナ内のシェルにアクセス
docker compose exec app bash
```

### 4. Jupyter Labの起動

コンテナ内で以下のコマンドを実行します：

```bash
jupyter lab --ip=0.0.0.0 --port=8888 --no-browser --allow-root
```

表示されるURLをブラウザで開くとJupyter Labにアクセスできます。

## ディレクトリ構造

```
.
├── Dockerfile            # Docker設定ファイル
├── README.md             # このファイル
├── docker-compose.yml    # Docker Compose設定
├── notebooks/            # Jupyter Notebookファイル用
│   ├── README.md
│   └── check_gpu.ipynb   # GPU動作確認用Notebook
├── pyproject.toml        # Pythonプロジェクト設定
├── src/                  # ソースコード
│   ├── README.md
│   └── check_gpu.py      # GPU動作確認用スクリプト
├── inputs/               # 入力データ用
│   └── README.md
├── outputs/              # 出力データ用
│   └── README.md
├── uv.lock               # uv依存関係ロックファイル
└── Makefile              # 便利なコマンド集
```

## GPU確認方法

このテンプレートには、GPU環境が正しく構成されているかを確認するためのスクリプトが含まれています。

### 1. Pythonスクリプトによる確認

```bash
# コンテナ内で実行
python src/check_gpu.py
```

このスクリプトは以下のライブラリのGPU対応状況を確認します：
- PyTorch
- TensorFlow
- CatBoost
- XGBoost

### 2. Jupyter Notebookによる確認

Jupyter Lab環境で`notebooks/check_gpu.ipynb`を開き、実行することでより詳細な情報を視覚的に確認できます。

```bash
# コンテナ内でJupyter Labを起動
jupyter lab --ip=0.0.0.0 --port=8888 --no-browser --allow-root
```

## パッケージの追加方法

コンテナ内で`uv`コマンドを使用してパッケージを追加します：

```bash
# パッケージ追加
uv add package_name

# 特定のバージョンを指定して追加
uv add package_name==1.0.0

# 開発依存関係として追加
uv add --dev package_name

# PyTorchのようにインデックスURLが必要な場合
uv add torch --index-url https://download.pytorch.org/whl/cu124
```

依存関係をインストール（pyproject.tomlから）：
```bash
# 依存関係をインストール
uv sync
```

## コンテナ内でのMakefileの使用方法

このプロジェクトにはMakefileが含まれており、コンテナ内で以下のコマンドを使用できます：

```bash
# 利用可能なコマンド一覧を表示
make help

# lintの実行
make lint

# フォーマットの実行
make format

# 一時ファイル、キャッシュの削除
make clean

# GPU利用可能性の確認
make gpu-check
```

### 使用上の注意点

- VSCodeでコンテナを開いて作業する場合、ターミナルから上記のコマンドを実行できます
- `make` コマンドは `/work` ディレクトリから実行してください

## コード品質管理

このテンプレートには[ruff](https://github.com/charliermarsh/ruff)が導入されており、lintとフォーマットに利用できます。

`make` コマンドを使わずに直接 `ruff` コマンドを実行することも可能です：

```bash
# lintの実行
ruff check .

# フォーマットの実行
ruff format .
```

## カスタマイズ

このテンプレートは様々なプロジェクトタイプや好みに合わせてカスタマイズできます：

- `pyproject.toml`: 依存パッケージの追加・削除
- `Dockerfile`: 必要なシステムパッケージの追加
- `docker-compose.yml`: ボリュームマウントやポート設定の調整

## ライセンス

[MIT](LICENSE)