import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 200;
const MAX_SUBJECT = 300;
const MAX_MESSAGE = 5000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.trim().length > MAX_NAME) {
      return NextResponse.json({ error: "Name is too long" }, { status: 400 });
    }
    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    }
    if (typeof subject !== "string" || subject.trim().length > MAX_SUBJECT) {
      return NextResponse.json({ error: "Subject is too long" }, { status: 400 });
    }
    if (typeof message !== "string" || message.trim().length > MAX_MESSAGE) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 });
    }

    console.log("Contact form submission:", {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim().slice(0, 100) + "...",
    });

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
