# ====================== 1. ベースイメージ ======================
ARG CUDA_TAG=12.4.1-cudnn-runtime-ubuntu22.04
FROM nvidia/cuda:${CUDA_TAG}

# プロキシ設定を.envファイルから読み込む
ARG http_proxy
ARG https_proxy
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ARG no_proxy

ENV http_proxy=${http_proxy}
ENV https_proxy=${https_proxy}
ENV HTTP_PROXY=${HTTP_PROXY}
ENV HTTPS_PROXY=${HTTPS_PROXY}
ENV NO_PROXY=${NO_PROXY}
ENV no_proxy=${no_proxy}

# ====================== 2. 環境変数 & 基本ツール =================
ENV DEBIAN_FRONTEND=noninteractive \
    TZ=Asia/Tokyo \
    PYTHONUNBUFFERED=1 \
    UV_CACHE_DIR=/root/.cache/uv \
    PATH="$HOME/.local/bin:$PATH"

# --------- 会社プロキシ証明書がある場合のみ有効化 ----------
COPY cert_TrustCA_pa.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates

# ----- ❶ パッケージ更新 ＋ 基本パッケージインストール -----
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
        tzdata ca-certificates curl git \
        python3 python3-venv python3-distutils

# ---------- uv インストール ----------
RUN curl -Ls https://astral.sh/uv/install.sh | sh \
 && ~/.local/bin/uv --version

# PATHを更新（uvのパスを明示的に追加）
ENV PATH="/root/.local/bin:$PATH"

# ====================== 4. アプリセットアップ ===================
WORKDIR /work
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-cache
COPY . .

# CMD ["python3", "src/sample.py"]