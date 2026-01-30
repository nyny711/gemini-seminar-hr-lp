import { ENV } from "./_core/env";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  if (!ENV.sendgridApiKey || !ENV.sendgridFromEmail) {
    console.error("SendGrid API key or from email is not configured");
    return false;
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ENV.sendgridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject,
          },
        ],
        from: { email: ENV.sendgridFromEmail },
        content: [
          {
            type: "text/html",
            value: html,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SendGrid API error:", response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export function generateConfirmationEmail(data: {
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  challenge?: string | null;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0891b2 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0891b2; }
    .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>セミナー申し込み完了</h1>
    </div>
    <div class="content">
      <p>${data.name} 様</p>
      <p>この度は「営業のためのGemini活用セミナー」にお申し込みいただき、誠にありがとうございます。</p>
      
      <div class="info-box">
        <h3>お申し込み内容</h3>
        <p><strong>会社名:</strong> ${data.company}</p>
        <p><strong>お名前:</strong> ${data.name}</p>
        <p><strong>役職:</strong> ${data.position}</p>
        <p><strong>メールアドレス:</strong> ${data.email}</p>
        <p><strong>電話番号:</strong> ${data.phone}</p>
        ${data.challenge ? `<p><strong>課題:</strong> ${data.challenge}</p>` : ''}
      </div>
      
      <p>セミナー開催日が近づきましたら、改めてご連絡させていただきます。</p>
      <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
      
      <div class="footer">
        <p>anyenv株式会社</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateAdminNotificationEmail(data: {
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  challenge?: string | null;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e293b; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .label { font-weight: bold; color: #475569; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>新規セミナー申し込み通知</h2>
    </div>
    <div class="content">
      <p>新しいセミナー申し込みがありました。</p>
      
      <div class="info-box">
        <p><span class="label">会社名:</span> ${data.company}</p>
        <p><span class="label">お名前:</span> ${data.name}</p>
        <p><span class="label">役職:</span> ${data.position}</p>
        <p><span class="label">メールアドレス:</span> ${data.email}</p>
        <p><span class="label">電話番号:</span> ${data.phone}</p>
        ${data.challenge ? `<p><span class="label">課題:</span> ${data.challenge}</p>` : ''}
      </div>
      
      <p>申し込み日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
