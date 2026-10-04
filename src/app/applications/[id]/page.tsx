import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import DeleteApplicationButton from "@/components/DeleteApplicationButton";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


export const dynamic = "force-dynamic";

type ApplicationDetailsProps = {
    params: Promise<{ id: string }>;
};

const statusLabels: Record<string, string> = {
    APPLIED: "Applied",
    INTERVIEWING: "Interviewing",
    OFFERED: "Offered",
    REJECTED: "Rejected",
};

const statusStyles: Record<string, string> = {
    APPLIED: "bg-[#e5f0f8] text-[#315f7a]",
    INTERVIEWING: "bg-[#fff0df] text-[#92551e]",
    OFFERED: "bg-[#e5f2e6] text-[#32663a]",
    REJECTED: "bg-[#f8e7e7] text-[#a03c3c]",
};

export default async function ApplicationDetails({
    params,
}: ApplicationDetailsProps) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }
    const { id } = await params;

    const application = await prisma.application.findFirst({
        where: { id, userId: user.id },
        select: {
            id: true,
            company: true,
            position: true,
            status: true,
            appliedDate: true,
            url: true,
            location: true,
            notes: true,
        },
    });

    if (!application) {
        notFound();
    }

    const postingUrl = application.url?.match(/^https?:\/\//i)
        ? application.url
        : null;

    return (
        <main className="min-h-[calc(100vh-76px)] bg-[#d6e6d4] text-[#202a24]">
            <div className="mx-auto max-w-[960px] px-5 py-8 sm:px-10 sm:py-12">
                <Link className="mb-6 inline-flex text-sm font-medium text-[#42624c] hover:text-[#205640]" href="/applications">
                    <span aria-hidden="true" className="mr-2">←</span> All applications
                </Link>

                <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="mt-3 font-[var(--font-geist-sans)] text-[28px] font-semibold text-[#202a24] sm:text-[34px]">
                            {application.company}
                        </h1>
                        <p className="mt-1 text-base text-[#59675e]">{application.position}</p>
                        <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[application.status]}`}>
                            {statusLabels[application.status]}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            className="inline-flex min-h-10 items-center rounded-[6px] border border-[#aebfac] px-4 text-sm font-semibold text-[#35443a] transition-colors hover:bg-[#e9eee8]"
                            href={`/applications/${application.id}/edit`}
                        >
                            Edit
                        </Link>
                        <DeleteApplicationButton id={application.id} company={application.company} />
                    </div>
                </div>

                <section className="overflow-hidden rounded-[7px] border border-[#c7d9c5] bg-[#fbfcf9]" aria-label="Application details">
                    <dl className="grid sm:grid-cols-2">
                        <div className="border-b border-[#e7ebe4] px-5 py-4 sm:border-r">
                            <dt className="text-xs font-medium text-[#78857b]">Company</dt>
                            <dd className="mt-1 text-sm font-semibold">{application.company}</dd>
                        </div>
                        <div className="border-b border-[#e7ebe4] px-5 py-4">
                            <dt className="text-xs font-medium text-[#78857b]">Position</dt>
                            <dd className="mt-1 text-sm font-semibold">{application.position}</dd>
                        </div>
                        <div className="border-b border-[#e7ebe4] px-5 py-4 sm:border-r">
                            <dt className="text-xs font-medium text-[#78857b]">Location</dt>
                            <dd className="mt-1 text-sm">{application.location || "Not specified"}</dd>
                        </div>
                        <div className="border-b border-[#e7ebe4] px-5 py-4">
                            <dt className="text-xs font-medium text-[#78857b]">Applied</dt>
                            <dd className="mt-1 text-sm">
                                {application.appliedDate.toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </dd>
                        </div>
                        <div className="px-5 py-4 sm:border-r sm:border-[#e7ebe4]">
                            <dt className="text-xs font-medium text-[#78857b]">Job posting</dt>
                            <dd className="mt-1 text-sm">
                                {postingUrl ? (
                                    <a className="break-all font-medium text-[#315f7a] hover:underline" href={postingUrl} target="_blank" rel="noreferrer">
                                        Open posting <span aria-hidden="true">↗</span>
                                    </a>
                                ) : (
                                    <span>{application.url || "Not provided"}</span>
                                )}
                            </dd>
                        </div>
                        <div className="border-t border-[#e7ebe4] px-5 py-4 sm:border-t-0">
                            <dt className="text-xs font-medium text-[#78857b]">Status</dt>
                            <dd className="mt-1 text-sm">{statusLabels[application.status]}</dd>
                        </div>
                    </dl>
                    <div className="border-t border-[#e7ebe4] px-5 py-4">
                        <h2 className="text-xs font-medium text-[#78857b]">Notes</h2>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#455249]">
                            {application.notes || "No notes added."}
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}