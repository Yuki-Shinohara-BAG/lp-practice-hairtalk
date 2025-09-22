// ==== 設定（必要に応じて変更） ====
const SHEET_NAME = "Sheet1";        // 保存先シート名
const ALLOW_ORIGIN = "https://yourusername.github.io"; // 本番は自サイトに限定（学習用は "*" でも可）

// 共通: CORSヘッダー
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOW_ORIGIN,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

// プレフライト（OPTIONS）
function doOptions() {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(corsHeaders());
}

// 本処理（POST）
function doPost(e) {
  try {
    const headers = corsHeaders();

    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: "ng", reason: "no_body" }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }

    const body = JSON.parse(e.postData.contents || "{}");
    const rawEmail = (body.email || "").trim();
    const honeypot = (body.company || "").trim(); // ある場合

    // honeypot: 値が入っていたら bot とみなす
    if (honeypot) {
      return ContentService.createTextOutput(JSON.stringify({ status: "ng", reason: "bot" }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }

    // 簡易メール判定
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rawEmail);
    if (!emailOk) {
      return ContentService.createTextOutput(JSON.stringify({ status: "ng", reason: "invalid_email" }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }

    // 保存
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSheet();
    sheet.appendRow([new Date(), rawEmail]);

    return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ng", reason: "server_error" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(corsHeaders());
  }
}