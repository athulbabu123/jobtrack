"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";


const fieldClassName = "mt-1.5 min-h-11 w-full rounded-[6px] border border-[#c7d9c5] bg-white px-3 text-sm text-[#202a24] outline-none focus:border-[#205640] focus:ring-2 focus:ring-[#205640]/15";

function getTodayDate() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export default function NewApplicationForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      company: String(formData.get("company") ?? "").trim(),
      position: String(formData.get("position") ?? "").trim(),
      status: formData.get("status"),
      appliedDate: formData.get("appliedDate"),
      url: String(formData.get("url") ?? "").trim() || null,
      location: String(formData.get("location") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
    };

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: { id?: string; error?: string; details?: string[] } = await response.json();

      if (!response.ok || !result.id) {
        throw new Error(result.details?.join(" ") || result.error || "Could not create the application. Please try again.");
      }

      window.location.href = new URL("/applications", window.location.href).toString();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not create the application. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form
      className="rounded-[7px] border border-[#c7d9c5] bg-[#fbfcf9] p-5 sm:p-7"
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
          event.preventDefault();
        }
      }}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-[#455249]">
          Company
          <input className={fieldClassName} name="company" required />
        </label>
        <label className="text-sm font-medium text-[#455249]">
          Position
          <input className={fieldClassName} name="position" required />
        </label>
        <label className="text-sm font-medium text-[#455249]">
          Status
          <select className={fieldClassName} name="status" defaultValue="APPLIED" required>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEWING">Interviewing</option>
            <option value="OFFERED">Offered</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </label>
        <label className="text-sm font-medium text-[#455249]">
          Applied date
          <input className={fieldClassName} name="appliedDate" type="date" defaultValue={getTodayDate()} required />
        </label>
        <label className="text-sm font-medium text-[#455249]">
          Location
          <input className={fieldClassName} name="location" />
        </label>
        <label className="text-sm font-medium text-[#455249]">
          Job posting URL
          <input className={fieldClassName} name="url" type="url" />
        </label>
        <label className="text-sm font-medium text-[#455249] sm:col-span-2">
          Notes
          <textarea className={`${fieldClassName} min-h-28 py-3`} name="notes" rows={4} />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-[#a03c3c]" role="alert">{error}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button className="min-h-10 cursor-pointer rounded-[6px] bg-[#205640] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#174631] disabled:cursor-wait disabled:opacity-60" disabled={saving} type="submit">
          {saving ? "Adding..." : "Add application"}
        </button>
        <button className="inline-flex min-h-10 cursor-pointer items-center rounded-[6px] border border-[#aebfac] px-4 text-sm font-semibold text-[#35443a] transition-colors hover:bg-[#e9eee8]" onClick={() => router.push("/applications")} type="button">
          Cancel
        </button>
      </div>
    </form>
  );
}
