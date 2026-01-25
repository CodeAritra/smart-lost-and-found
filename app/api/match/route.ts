import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  const { email, score, itemid } = await req.json()
  // Guard clauses
  if (!email || !itemid || score < 75) {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 }
    )
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Smart Lost & Found" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Possible match found for your lost item",
    text: `We found a possible match for your item.
Visit this link to verify:
https://aritradhank.xyz/verify-ownership/${itemid}`,
    html: `
    <p>We found a <strong>possible match</strong> for an item you reported.</p>

    <p>
      <a
        href="https://aritradhank.xyz/verify-ownership/${itemid}"
        style="
          display:inline-block;
          padding:10px 16px;
          background:#2563eb;
          color:#ffffff;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Verify ownership
      </a>
    </p>

    <p style="color:#6b7280;font-size:12px">
      If this does not look correct, you can safely ignore this email.
    </p>
  `,
  })

  return NextResponse.json({ success: true })
}
