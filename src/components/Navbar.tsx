"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavbarProps = {
  isAuthenticated: boolean;
};

export default function Navbar({ isAuthenticated }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutError, setLogoutError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to log out. Please try again.");
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#dce2d8] bg-[#fbfcf9] px-5 sm:px-10 lg:px-[max(40px,calc((100vw-1160px)/2))]">
      <Link className="flex items-center gap-3 font-[var(--font-geist-sans)] text-[22px] font-bold text-[#202a24]" href={isAuthenticated ? "/dashboard" : "/"} aria-label="JobTrack home">
        <span className="grid size-10 place-items-center rounded-[9px] bg-[#205640] text-base font-bold text-white" aria-hidden="true">J</span>
        <span>JobTrack</span>
      </Link>
      {isAuthenticated && (
        <div className="flex items-center gap-3">
          {logoutError && <p className="text-xs text-[#a03c3c]" role="alert">{logoutError}</p>}
          <button
            className="cursor-pointer rounded-[6px] border border-[#aebfac] px-4 py-2.5 text-[13px] font-semibold text-[#35443a] transition-colors hover:bg-[#e9eee8] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoggingOut}
            onClick={handleLogout}
            type="button"
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      )}
    </header>
  );
}