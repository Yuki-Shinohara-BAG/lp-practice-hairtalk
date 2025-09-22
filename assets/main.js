// グローバル変数
const GAS_ENDPOINT = 'https://script.google.com/macros/s/your-gas-script-id-here/exec'; // Google Apps Script Webアプリの公開URL（ダミー）

// DOM要素の取得
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formSection = document.getElementById('form-section');
    const thanksSection = document.getElementById('thanks-section');
    const ctaButtons = document.querySelectorAll('.cta-button');
    const downloadLink = document.getElementById('download-link');

    // CTAボタンのイベント設定
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // GA4イベントトラッキング（実装されている場合）
            trackEvent('cta_click', {
                button_id: this.id,
                button_text: this.textContent
            });
        });
    });

    // フォーム送信処理
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 送信ボタンを非活性化
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = '送信中...';

            // フォームデータの取得
            const formData = new FormData(this);
            const data = {};
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Honeypotチェック - botによる自動送信を検出
            if (data.company && data.company.trim() !== '') {
                console.log('Honeypot検出: Bot送信の可能性あり');
                // エラーメッセージ表示
                alert('エラーが発生しました。お手数ですが、後ほど再度お試しください。');
                submitButton.disabled = false;
                submitButton.textContent = '資料をダウンロード';
                return; // 送信処理を中止
            }

            // Google Apps Scriptに送信
            fetch(GAS_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
                // mode は既定 (cors) を使用
            })
            .then(async (response) => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const json = await response.json();
                if (json.status === 'ok') {
                    showThanksScreen();
                    // GA4イベントトラッキング（実装されている場合）
                    trackEvent('form_submit', {
                        form_id: 'contact-form'
                    });
                } else {
                    throw new Error(json.reason || 'submit_failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('送信に失敗しました。お手数ですが時間をおいて再度お試しください。');
                submitButton.disabled = false;
                submitButton.textContent = '資料をダウンロード';
            });
        });
    }

    // ダウンロードリンクのイベント設定
    if (downloadLink) {
        downloadLink.addEventListener('click', function() {
            // GA4イベントトラッキング（実装されている場合）
            trackEvent('file_download', {
                file_name: 'sample.pdf'
            });
        });
    }

    // サンクス画面表示関数
    function showThanksScreen() {
        formSection.classList.add('hidden');
        thanksSection.classList.remove('hidden');

        // スクロール位置調整
        thanksSection.scrollIntoView({ behavior: 'smooth' });
    }

    // GA4イベントトラッキング関数（GTM経由）
    function trackEvent(eventName, eventParams) {
        // dataLayerが定義されている場合のみ実行
        if (window.dataLayer) {
            window.dataLayer.push({
                event: eventName,
                ...eventParams
            });
            console.log(`Event tracked: ${eventName}`, eventParams);
        }
    }
});