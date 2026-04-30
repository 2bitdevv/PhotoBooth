import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ReviewPayload = {
  rating?: number;
  comment?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ReviewPayload;
    const rating = Number(body.rating);
    const comment = (body.comment ?? "").trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    const smtpUser = process.env.SMTP_USER ?? "dev2bit912@gmail.com";
    const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, "").trim();
    const receiver = process.env.CONTACT_RECEIVER_EMAIL ?? "dev2bit912@gmail.com";

    if (!smtpPass) {
      // Graceful fallback in environments without SMTP credentials.
      console.info("[review] SMTP_PASS missing; accepted review without sending email.", {
        rating,
        hasComment: Boolean(comment),
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
      from: `"PhotoBoot Reviews" <${smtpUser}>`,
      to: receiver,
      subject: `[PhotoBoot Review] ${rating} star`,
      text: `Rating: ${rating}/5\n\nComment:\n${comment || "-"}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>New PhotoBoot Review</h2>
          <p><strong>Rating:</strong> ${rating}/5</p>
          <p><strong>Comment:</strong></p>
          <p style="white-space: pre-wrap;">${comment || "-"}</p>
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
      { error: message || "Could not submit review. Please try again." },
      { status: 500 }
    );
  }
}
