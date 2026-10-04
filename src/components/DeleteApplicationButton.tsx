"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";

type DeleteApplicationButtonProps = {
  id: string;
  company: string;
};

export default function DeleteApplicationButton({
  id,
  company,
}: DeleteApplicationButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function deleteApplication() {
    if (!window.confirm(`Delete the application to ${company}? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete this application.");
      }

      router.push("/applications");
      router.refresh();
    } catch {
      setError("Could not delete this application. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Link
        aria-disabled={deleting}
        aria-label={`Delete ${company} application`}
        className={`inline-grid size-10 place-items-center rounded-[6px] border border-[#d8b7b3] text-[#a03c3c] transition-colors hover:bg-[#f8e7e7] ${deleting ? "!cursor-wait opacity-60" : "cursor-pointer"}`}
        href="/applications"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!deleting) void deleteApplication();
        }}
        onKeyDown={(event) => {
          if (event.key === " ") {
            event.preventDefault();
            if (!deleting) void deleteApplication();
          }
        }}
        role="button"
        title="Delete application"
      >
        {deleting ? <span className="text-xs">...</span> : <Trash2 aria-hidden="true" size={16} />}
      </Link>
      {error && <p className="text-xs text-[#a03c3c]" role="alert">{error}</p>}
    </div>
  );
}