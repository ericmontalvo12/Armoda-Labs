"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("siteAuthenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/site-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        localStorage.setItem("siteAuthenticated", "true");
        setIsAuthenticated(true);
        setError(false);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Image
              src="/logo-new.png"
              alt="Rock Mountain Performance"
              width={200}
              height={60}
              className="mx-auto h-12 w-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Under Maintenance</h1>
            <p className="text-gray-600 text-sm">
              We&apos;re making some updates. Enter the password to access the site.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter password"
                className={`w-full px-4 py-3 rounded-lg border ${
                  error ? "border-red-500" : "border-gray-200"
                } bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d94ff] focus:border-transparent transition-all text-center`}
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm text-center mt-2">
                  Incorrect password
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg bg-[#2d94ff] text-white font-semibold hover:bg-[#1a7ee6] transition-colors"
            >
              Enter Site
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            We&apos;ll be back shortly. Thank you for your patience.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
