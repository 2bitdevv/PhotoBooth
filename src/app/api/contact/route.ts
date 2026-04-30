import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;
    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const subject = body.subject?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json({ error: "Please fill out all required fields." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const smtpUser = process.env.SMTP_USER ?? "dev2bit912@gmail.com";
    const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, "").trim();
    const receiver = process.env.CONTACT_RECEIVER_EMAIL ?? "dev2bit912@gmail.com";

    if (!smtpPass) {
      // Graceful fallback in environments without SMTP credentials.
      console.info("[contact] SMTP_PASS missing; accepted submission without sending email.", {
        firstName,
        lastName,
        email,
        subject,
      });
      return NextResponse.json({ ok: true, queued: false });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"PhotoBoot Contact" <${smtpUser}>`,
      to: receiver,
      replyTo: email,
      subject: `[PhotoBoot Contact] ${subject}`,
      text: [
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const authFailed =
      message.toLowerCase().includes("invalid login") ||
      message.toLowerCase().includes("auth") ||
      message.toLowerCase().includes("username and password not accepted");

    if (authFailed) {
      return NextResponse.json(
        {
          error:
            "Gmail login failed. Please use a Google App Password in SMTP_PASS (not your normal Gmail password).",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: message || "Could not send message. Please try again." },
      { status: 500 }
    );
  }
}
