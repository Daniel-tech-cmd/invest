// One shared, styled email shell — the old app copy-pasted ~150 lines of
// inline HTML/CSS into every route that sent an email. This renders the same
// visual language (Rubik font, green GoldGroveco header, transaction-row
// card) from a single place instead.
export function renderNotificationEmail({ heading, greeting, message, badgeText, badgeColor = "#065f46", badgeBg = "#d1fae5", rows = [], noteText, ctaText, ctaUrl }) {
  const rowsHtml = rows
    .map(
      ([label, value, highlight]) => `
        <div class="transaction-row">
          <span class="transaction-label">${label}</span>
          <span class="transaction-value${highlight ? " amount-highlight" : ""}">${value}</span>
        </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${heading} - GoldGroveco</title>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Rubik', Arial, sans-serif; background-color: #f3f4f6; line-height: 1.6; }
      .email-wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 20px; }
      .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; }
      .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center; }
      .logo { font-size: 28px; font-weight: 800; color: #ffffff; }
      .content { padding: 40px 30px; }
      .greeting { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 20px; }
      .message { font-size: 16px; color: #4b5563; margin-bottom: 25px; }
      .badge { display: inline-flex; align-items: center; background-color: ${badgeBg}; color: ${badgeColor}; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 25px; }
      .transaction-card { background: #f9fafb; border-left: 4px solid #22c55e; border-radius: 8px; padding: 25px; margin: 25px 0; }
      .transaction-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
      .transaction-row:last-child { border-bottom: none; }
      .transaction-label { font-size: 14px; color: #6b7280; }
      .transaction-value { font-size: 14px; color: #111827; font-weight: 600; text-align: right; }
      .amount-highlight { font-size: 20px; color: #22c55e; }
      .note-box { background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px 20px; border-radius: 6px; margin: 20px 0; font-size: 14px; color: #1e40af; }
      .cta-button { display: block; width: fit-content; margin: 10px 0 25px; padding: 14px 28px; color: #ffffff !important; text-decoration: none; background-color: #22c55e; border-radius: 8px; font-weight: 600; font-size: 15px; }
      .cta-link { word-break: break-all; color: #22c55e; font-size: 12px; margin-bottom: 20px; }
      .footer { background-color: #111827; padding: 30px; text-align: center; }
      .footer-content { color: #9ca3af; font-size: 14px; }
      .copyright { color: #6b7280; font-size: 12px; margin-top: 15px; }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-container">
        <div class="header"><div class="logo">GoldGroveco.</div></div>
        <div class="content">
          <div class="greeting">Hello ${greeting},</div>
          ${badgeText ? `<div class="badge">${badgeText}</div>` : ""}
          <p class="message">${message}</p>
          ${ctaUrl ? `<a href="${ctaUrl}" class="cta-button">${ctaText || "Continue"}</a><p class="cta-link">Or paste this link into your browser: ${ctaUrl}</p>` : ""}
          ${rows.length ? `<div class="transaction-card">${rowsHtml}</div>` : ""}
          ${noteText ? `<div class="note-box"><strong>Note:</strong> ${noteText}</div>` : ""}
        </div>
        <div class="footer">
          <div class="footer-content"><strong style="color:#ffffff;">GoldGroveco</strong><br />support@goldgroveco.com</div>
          <div class="copyright">&copy; ${new Date().getFullYear()} GoldGroveco. All rights reserved.</div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}
