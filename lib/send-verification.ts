import { createVerificationToken } from "@/lib/customer-auth";

/**
 * Hands a verification link to GoHighLevel to mail.
 *
 * Armoda has no transactional mail of its own; GoHighLevel already sends
 * every other customer email through a webhook per message type, so this
 * follows that shape. The workflow behind GHL_VERIFY_WEBHOOK_URL has to be
 * built in GoHighLevel: it receives `verify_url` and mails it.
 *
 * Never throws. A verification mail that fails must not fail the
 * registration that triggered it, the same rule meta-capi.ts follows. When
 * the URL is unset nothing is sent, and the address stays unconfirmed until
 * an admin confirms it by hand.
 */
export async function sendVerificationEmail(input: {
  customerId: number;
  email: string;
  name?: string | null;
  siteUrl: string;
}): Promise<{ sent: boolean }> {
  const webhook = process.env.GHL_VERIFY_WEBHOOK_URL;
  if (!webhook) {
    console.warn("GHL_VERIFY_WEBHOOK_URL not set - no verification email sent");
    return { sent: false };
  }

  try {
    const token = await createVerificationToken(input.customerId, input.email);
    const verifyUrl = `${input.siteUrl.replace(/\/$/, "")}/api/account/verify?token=${encodeURIComponent(token)}`;

    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "account_verification",
        email: input.email,
        first_name: input.name?.split(" ")[0] ?? null,
        verify_url: verifyUrl,
        expires_in_days: 7,
      }),
    });
    return { sent: true };
  } catch (err) {
    console.error("Failed to send verification email:", err);
    return { sent: false };
  }
}
