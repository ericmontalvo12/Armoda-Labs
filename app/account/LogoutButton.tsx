"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/account/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
      className="text-sm font-heading font-bold text-text-secondary transition-colors hover:text-gold"
    >
      Sign out
    </button>
  );
}
