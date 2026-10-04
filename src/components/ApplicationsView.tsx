"use client";

import Link from "next/link";
import { useState, type DragEvent } from "react";
import { ArrowUpRight } from "lucide-react";

type ApplicationStatus = "APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED";

type ApplicationItem = {
  id: string;
  company: string;
  position: string;
  location: string | null;
  status: ApplicationStatus;
  appliedDate: string;
  appliedDateLabel: string;
};

type ApplicationsViewProps = {
  applications: ApplicationItem[];
};

const statuses: ApplicationStatus[] = [
  "APPLIED",
  "INTERVIEWING",
  "OFFERED",
  "REJECTED",
];

const statusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  OFFERED: "Offered",
  REJECTED: "Rejected",
};

const statusStyles: Record<ApplicationStatus, string> = {
  APPLIED: "bg-[#e5f0f8] text-[#315f7a]",
  INTERVIEWING: "bg-[#fff0df] text-[#92551e]",
  OFFERED: "bg-[#e5f2e6] text-[#32663a]",
  REJECTED: "bg-[#f8e7e7] text-[#a03c3c]",
};

export default function ApplicationsView({ applications: initialApplications }: ApplicationsViewProps) {
  const [view, setView] = useState<"table" | "kanban">("table");
  const [applications, setApplications] = useState(initialApplications);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function moveApplication(id: string, status: ApplicationStatus) {
    const application = applications.find((item) => item.id === id);
    if (!application || application.status === status || savingId) return;

    const previousStatus = application.status;
    setSavingId(id);
    setError("");
    setApplications((items) => items.map((item) => item.id === id ? { ...item, status } : item));

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Could not update the application status.");
    } catch {
      setApplications((items) => items.map((item) => item.id === id ? { ...item, status: previousStatus } : item));
      setError("Status update failed. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  function handleDragStart(event: DragEvent<HTMLElement>, id: string) {
    event.dataTransfer.setData("text/application-id", id);
    event.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(event: DragEvent<HTMLElement>, status: ApplicationStatus) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/application-id");
    if (id) void moveApplication(id, status);
  }

  return (
    <>
      <div className="mb-5 flex border-b border-[#aebfac]" aria-label="Application views">
        <button
          aria-pressed={view === "table"}
          className={`min-h-11 cursor-pointer border-b-2 px-4 text-sm font-semibold ${view === "table" ? "border-[#205640] text-[#205640]" : "border-transparent text-[#69766d] hover:text-[#35443a]"}`}
          onClick={() => setView("table")}
          type="button"
        >
          Table view
        </button>
        <button
          aria-pressed={view === "kanban"}
          className={`min-h-11 cursor-pointer border-b-2 px-4 text-sm font-semibold ${view === "kanban" ? "border-[#205640] text-[#205640]" : "border-transparent text-[#69766d] hover:text-[#35443a]"}`}
          onClick={() => setView("kanban")}
          type="button"
        >
          Kanban view
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-[#a03c3c]" role="alert">{error}</p>}

      {view === "table" ? (
        <div className="overflow-x-auto rounded-[7px] border border-[#c7d9c5] bg-[#fbfcf9]">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#dce2d8] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#69766d]">
                <th className="px-5 py-3.5">Company</th>
                <th className="px-5 py-3.5">Position</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Applied</th>
                <th className="w-14 px-3 py-3.5 text-right"><span className="sr-only">Open application</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7ebe4]">
              {applications.map((application) => (
                <tr className="text-[13px]" key={application.id}>
                  <td className="px-5 py-4 font-semibold">{application.company}</td>
                  <td className="px-5 py-4 text-[#455249]">{application.position}</td>
                  <td className="px-5 py-4 text-[#69766d]">{application.location || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles[application.status]}`}>
                      {statusLabels[application.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[#69766d]">{application.appliedDateLabel}</td>
                  <td className="px-3 py-3 text-right">
                    <Link
                      aria-label={`Open ${application.company} application details`}
                      className="inline-grid size-10 place-items-center rounded-[6px] text-[#536057] transition-colors hover:bg-[#e8f0f5] hover:text-[#205640]"
                      href={`/applications/${application.id}`}
                      title="Open application details"
                    >
                      <ArrowUpRight aria-hidden="true" size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr><td className="px-5 py-12 text-center text-sm text-[#69766d]" colSpan={6}>No applications yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statuses.map((status) => {
            const statusApplications = applications.filter((application) => application.status === status);

            return (
              <section
                aria-label={`${statusLabels[status]} applications`}
                className="min-h-52 rounded-[7px] border border-[#c7d9c5] bg-[#eaf1e9] p-3"
                key={status}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                onDrop={(event) => handleDrop(event, status)}
              >
                <header className="mb-3 flex items-center justify-between border-b border-[#c7d9c5] pb-3">
                  <h2 className="text-sm font-semibold text-[#35443a]">{statusLabels[status]}</h2>
                  <span className="text-xs text-[#69766d]">{statusApplications.length}</span>
                </header>
                <div className="space-y-2">
                  {statusApplications.map((application) => (
                    <article
                      className={`rounded-[6px] border border-[#dce2d8] bg-[#fbfcf9] p-3 shadow-sm ${savingId === application.id ? "opacity-60" : ""}`}
                      draggable={savingId !== application.id}
                      key={application.id}
                      onDragStart={(event) => handleDragStart(event, application.id)}
                    >
                      <Link className="block text-sm font-semibold text-[#28342c] hover:text-[#205640]" href={`/applications/${application.id}`}>
                        {application.company}
                      </Link>
                      <p className="mt-1 text-xs text-[#69766d]">{application.position}</p>
                      {application.location && <p className="mt-1 text-xs text-[#849087]">{application.location}</p>}
                      <p className="mt-3 text-[11px] text-[#849087]">{application.appliedDateLabel}</p>
                    </article>
                  ))}
                  {statusApplications.length === 0 && (
                    <p className="rounded-[6px] border border-dashed border-[#c7d9c5] px-3 py-5 text-center text-xs text-[#78857b]">Drop applications here</p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}