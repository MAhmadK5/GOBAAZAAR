import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { emails, subject, headline, message, ctaText, ctaLink } = await request.json();

    if (!emails || emails.length === 0) {
      return NextResponse.json({ error: "No recipients found." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Replace line breaks with HTML <br/> tags for the email body
    const formattedMessage = message.replace(/\n/g, '<br/>');

    // Luxury CARTIO Email Template
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; padding: 40px 20px; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #09090b; text-align: center;">
          
          <h1 style="font-size: 28px; font-weight: 900; letter-spacing: 6px; margin: 0; text-transform: uppercase; color: #ffffff;">CARTIO</h1>
          <p style="font-size: 10px; font-weight: bold; letter-spacing: 2px; color: #c084fc; text-transform: uppercase; margin-top: 5px;">Exclusive VIP Update</p>
          
          <div style="height: 1px; background-color: #27272a; margin: 40px 0;"></div>

          <h2 style="font-size: 24px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">
            ${headline}
          </h2>

          <p style="font-size: 15px; font-weight: 300; text-align: center; line-height: 1.8; color: #a1a1aa; margin-bottom: 40px;">
            ${formattedMessage}
          </p>

          ${ctaText && ctaLink ? `
            <a href="${ctaLink}" style="display: inline-block; background-color: #ffffff; color: #000000; padding: 18px 36px; font-size: 12px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; text-decoration: none; border-radius: 4px;">
              ${ctaText}
            </a>
          ` : ''}

          <div style="height: 1px; background-color: #27272a; margin: 40px 0;"></div>

          <p style="font-size: 10px; color: #52525b; letter-spacing: 1px; text-transform: uppercase; margin-top: 30px;">
            You are receiving this because you are a valued CARTIO client.
            <br/><br/>
            © ${new Date().getFullYear()} CARTIO. All rights reserved.
          </p>

        </div>
      </div>
    `;

    const mailOptions = {
      from: `"CARTIO VIP" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send to yourself
      bcc: emails, // Blind copy all customers (they won't see each other's emails)
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, count: emails.length });

  } catch (error: any) {
    console.error("Broadcast Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}