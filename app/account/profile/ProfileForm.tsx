"use client";

import { useState } from "react";

const label =
  "mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-text-muted";
const field =
  "h-12 w-full rounded-control border border-border bg-surface px-4 text-text-primary outline-none transition-colors focus:border-gold";

export function ProfileForm({
  email,
  name,
  organization,
  role,
}: {
  email: string;
  name: string;
  organization: string;
  role: string;
}) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("saving");
    setError("");
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();

    try {
      const res = await fetch("/api/account/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"),
          organization: get("organization"),
          role: get("role"),
          currentPassword: get("currentPassword"),
          newPassword: get("newPassword"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save that.");
        setState("idle");
        return;
      }
      setState("saved");
    } catch {
      setError("Could not save that.");
      setState("idle");
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-8">
      <section className="rounded-[20px] border border-border bg-surface p-6">
        <h2 className="font-heading text-lg font-extrabold text-text-primary">
          Your details
        </h2>

        <div className="mt-5 space-y-5">
          <div>
            <span className={label}>Email address</span>
            <p className="flex h-12 items-center rounded-control border border-border bg-surface-elevated px-4 text-text-secondary">
              {email}
            </p>
            {/* Orders and store credit are filed under this address, so
                retyping it would hand over whatever is filed under the new
                one. Changing it is a support request. */}
            <p className="mt-2 text-xs text-text-muted">
              Your orders and store credit are filed under this address, so we
              change it by hand. Contact us if it needs to change.
            </p>
          </div>

          <label className="block">
            <span className={label}>Full name</span>
            <input name="name" defaultValue={name} className={field} />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Organization</span>
              <input
                name="organization"
                defaultValue={organization}
                className={field}
              />
            </label>
            <label className="block">
              <span className={label}>Role</span>
              <input name="role" defaultValue={role} className={field} />
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-[20px] border border-border bg-surface p-6">
        <h2 className="font-heading text-lg font-extrabold text-text-primary">
          Change password
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Leave these blank to keep your current password.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Current password</span>
            <input
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              className={field}
            />
          </label>
          <label className="block">
            <span className={label}>New password</span>
            <input
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={10}
              className={field}
            />
          </label>
        </div>
        <p className="mt-3 text-xs text-text-muted">
          At least 10 characters.
        </p>
      </section>

      {error && <p className="text-sm text-danger">{error}</p>}
      {state === "saved" && (
        <p className="text-sm text-success">Saved.</p>
      )}

      <button
        type="submit"
        disabled={state === "saving"}
        className="h-12 rounded-full bg-primary px-8 font-heading text-base font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        {state === "saving" ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
