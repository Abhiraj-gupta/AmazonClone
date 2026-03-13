const nodemailer = require("nodemailer");

// Use Ethereal (free test SMTP) so emails work without real credentials.
// In production, replace with real SMTP config via env vars.
let _transporter = null;

async function getTransporter() {
  if (_transporter) return _transporter;

  if (process.env.SMTP_HOST) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: (process.env.SMTP_SECURE ?? "false") === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Ethereal test account — emails are captured at https://ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    _transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`📧 Ethereal email account: ${testAccount.user}`);
  }

  return _transporter;
}

async function sendOrderConfirmation({ to, orderId, totalAmount, items }) {
  try {
    const transporter = await getTransporter();

    const itemRows = items
      .map(
        (i) =>
          `<tr>
            <td style="padding:8px;border-bottom:1px solid #eee">${i.product_name ?? `Product #${i.product_id}`}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${Number(i.unit_price).toLocaleString("en-IN")}</td>
          </tr>`
      )
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#232F3E;padding:20px;text-align:center">
          <span style="color:white;font-size:24px;font-weight:bold">amazon.in</span>
        </div>
        <div style="padding:20px;background:#fff">
          <h2 style="color:#0F1111">Order Confirmed! 🎉</h2>
          <p>Thank you for your order. Your order <strong>#${orderId}</strong> has been placed successfully.</p>
          
          <table style="width:100%;border-collapse:collapse;margin:20px 0">
            <thead>
              <tr style="background:#F0F0F0">
                <th style="padding:8px;text-align:left">Product</th>
                <th style="padding:8px;text-align:center">Qty</th>
                <th style="padding:8px;text-align:right">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>
          
          <div style="text-align:right;font-size:18px;font-weight:bold;color:#B12704;margin-top:10px">
            Total: ₹${Number(totalAmount).toLocaleString("en-IN")}
          </div>
          
          <p style="margin-top:20px;color:#565959;font-size:14px">
            Your order will be delivered to your shipping address. You can track your order in the Orders section.
          </p>
          
          <div style="margin-top:20px;padding:15px;background:#FFF8E7;border:1px solid #FFD814;border-radius:8px">
            <p style="margin:0;color:#0F1111;font-size:14px">
              <strong>FREE delivery</strong> on your order!
            </p>
          </div>
        </div>
        <div style="background:#F0F0F0;padding:15px;text-align:center;color:#565959;font-size:12px">
          © ${new Date().getFullYear()} Amazon Clone. This is a demo project.
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Amazon.in" <noreply@amazon.in>',
      to,
      subject: `Order Confirmed - #${orderId} | Amazon.in`,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`📧 Preview email: ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (err) {
    console.error("Failed to send order email:", err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendOrderConfirmation };
