import { Suspense } from "react";
import type { Metadata } from "next";
import { GateForm } from "./GateForm";

export const metadata: Metadata = {
  title: "Armoda Labs",
  robots: { index: false, follow: false, nocache: true },
};

export default function EnterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Armoda Labs
        </p>
        <h1 className="mt-4 text-center text-2xl font-semibold text-text-primary">
          This site is not yet open
        </h1>
        <p className="mt-3 text-center text-sm text-text-secondary">
          Enter the access password to continue.
        </p>
        {/* GateForm reads the `next` search param, which has no value at
            build time, so it needs a boundary to prerender. */}
        <Suspense fallback={<div className="mt-8 h-12" />}>
          <GateForm />
        </Suspense>
      </div>
    </main>
  );
}
