import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestName, guestPhone, startDate, endDate, total } = body;

    const message = `New Sitter Request!\nGuest: ${guestName}\nPhone: ${guestPhone}\nDates: ${startDate} to ${endDate}\nTotal: $${total}`;

    // 1. Send Email Notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'tianyixia55@gmail.com',
      subject: `New Sitter Request from ${guestName}`,
      text: message,
    });

    // 2. Send WeChat Notification (WxPusher)
    const wxToken = process.env.WXPUSHER_APP_TOKEN;
    const wxUid = process.env.WXPUSHER_UID;

    if (wxToken && wxUid && !wxToken.includes('REPLACE')) {
      await fetch("https://wxpusher.zjiecode.com/api/send/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appToken: wxToken,
          content: message.replace(/\n/g, '<br/>'), // WxPusher supports HTML
          contentType: 2, // 1 for text, 2 for html, 3 for markdown
          uids: [wxUid],
        }),
      });
      console.log("[WXPUSHER] WeChat notification sent.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}