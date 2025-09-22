/** ========= CONFIG =========
 *  必要に応じて以下を書き換えてください
 *  - SPREADSHEET_ID: 保存先スプレッドシートID
 *  - SHEET_NAME:     追記先シート名（なければ自動作成）
 */
const SPREADSHEET_ID = '1nxLc2OQWN269HCjr2lUbPu9QXnstShkamfXIJwFYzs0';
const SHEET_NAME = 'Leads';

/** ========= ENTRYPOINT =========
 *  フロントからのPOST（application/x-www-form-urlencoded or multipart/form-data）
 *  を「シンプルリクエスト」で受け取り、e.parameter から値を取得します。
 */
function doPost(e) {
  try {
    if (!e || !e.parameter) {
      return json({ status: 'ng', reason: 'no_parameters' }, 400);
    }

    // --- 受信パラメータ（フロント側は email, company を送信）---
    const email = (e.parameter.email || '').trim();
    const company = (e.parameter.company || '').trim();

    // --- バリデーション ---
    if (!email) {
      return json({ status: 'ng', reason: 'missing_email' }, 400);
    }
    if (!isValidEmail(email)) {
      return json({ status: 'ng', reason: 'invalid_email' }, 400);
    }

    // --- 付加情報（任意）---
    // UAやリファラがあればログのヒントに
    const userAgent = (e.parameter.ua || '') || getUA_(e);
    const referer = (e.parameter.referer || '') || getReferer_(e);

    // --- スプレッドシートへ保存 ---
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss, SHEET_NAME, [
      'timestamp', 'email'
    ]);

    sheet.appendRow([
      new Date(),      // timestamp
      email
    ]);

    // --- レスポンス ---
    return json({ status: 'ok' }, 200);

  } catch (err) {
    console.error(err);
    return json({ status: 'ng', reason: 'server_error' }, 500);
  }
}

/** ========= HELPERS ========= */

// JSONレスポンスを返す（GASでは任意ヘッダは基本付与不可。JSONのMIMEのみ設定）
function json(obj, _statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// シートがなければ作る＆ヘッダ行をセット
function getOrCreateSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const isHeaderSet = firstRow.some(v => v && String(v).trim() !== '');
  if (!isHeaderSet) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return sheet;
}

// ざっくりなメールチェック
function isValidEmail(s) {
  // RFCに厳密ではないが実用的な簡易判定
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// UA/Referer は e.parameter に無ければ Header から（無いことも多い）
function getUA_(e) {
  try {
    return (e && e.postData && e.postData.type) ? '' : (e && e.headers && e.headers['User-Agent']) || '';
  } catch (_) { return ''; }
}
function getReferer_(e) {
  try {
    return (e && e.headers && (e.headers.Referer || e.headers.referer)) || '';
  } catch (_) { return ''; }
}
