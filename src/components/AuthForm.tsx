"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(isSignup ? "/api/auth/signup" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isSignup && { name: formData.get("name") }),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const result: { error?: string; details?: string[] } = await response.json();

      if (!response.ok) {
        throw new Error(
          result.details?.join(" ") ||
          result.error ||
          `Unable to ${isSignup ? "sign up" : "log in"}. Please try again.`
        );
      }

      router.replace(isSignup ? "/login" : "/dashboard");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Unable to ${isSignup ? "sign up" : "log in"}. Please try again.`);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#d6e6d4] text-[#202a24]">
      <header className="flex h-[76px] items-center justify-between bg-[#fbfcf9] px-5 sm:px-10">
        <Link className="font-[var(--font-geist-sans)] text-xl font-bold" href="/">JobTrack</Link>
        <Link className="text-sm font-medium text-[#42624c] hover:text-[#205640]" href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Log in" : "Create account"}
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <section className="w-full max-w-[420px] rounded-[8px] border border-[#c7d9c5] bg-[#fbfcf9] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#557061]">JobTrack</p>
          <h1 className="mt-3 font-[var(--font-geist-sans)] text-2xl font-semibold">{isSignup ? "Create your account" : "Welcome back"}</h1>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="block text-sm font-medium text-[#455249]">
                Name
                <input autoComplete="name" className="mt-1.5 min-h-11 w-full rounded-[6px] border border-[#c7d9c5] bg-white px-3 text-sm outline-none focus:border-[#205640]" name="name" required />
              </label>
            )}
            <label className="block text-sm font-medium text-[#455249]">
              Email
              <input autoComplete="email" className="mt-1.5 min-h-11 w-full rounded-[6px] border border-[#c7d9c5] bg-white px-3 text-sm outline-none focus:border-[#205640]" name="email" required type="email" />
            </label>
            <label className="block text-sm font-medium text-[#455249]">
              Password
              <input autoComplete={isSignup ? "new-password" : "current-password"} className="mt-1.5 min-h-11 w-full rounded-[6px] border border-[#c7d9c5] bg-white px-3 text-sm outline-none focus:border-[#205640]" name="password" required type="password" />
            </label>
            {message && <p className="text-sm text-[#92551e]" role="alert">{message}</p>}
            <button className="min-h-11 w-full cursor-pointer rounded-[6px] bg-[#205640] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#174631] disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
              {isSubmitting ? (isSignup ? "Creating account..." : "Logging in...") : isSignup ? "Sign up" : "Log in"}
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-[#78857b]">{isSignup ? "Already have an account?" : "New to JobTrack?"} <Link className="font-semibold text-[#205640] hover:underline" href={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Sign up"}</Link></p>
        </section>
      </div>
    </main>
  );
}