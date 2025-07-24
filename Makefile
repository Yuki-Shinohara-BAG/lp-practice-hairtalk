.PHONY: help lint format clean gpu-check

# デフォルトターゲット
help:
	@echo "利用可能なコマンド:"
	@echo "  make lint      : ruffを使用してコードをリント"
	@echo "  make format    : ruffを使用してコードをフォーマット"
	@echo "  make clean     : 一時ファイル、キャッシュを削除"
	@echo "  make gpu-check : GPU利用可能性をチェック"

# コード品質
lint:
	ruff check .

format:
	ruff format .

# クリーンアップ
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name "*.eggs" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.pyd" -delete
	find . -type f -name ".coverage" -delete
	find . -type d -name "htmlcov" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".coverage" -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -exec rm -rf {} +

# GPU確認
gpu-check:
	python src/check_gpu.py