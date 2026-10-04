import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ApplicationsView from "@/components/ApplicationsView";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }
    const applications = await prisma.application.findMany({
        where: {
            userId: user.id,
        },
        orderBy: { appliedDate: "desc" },
        select: {
            id: true,
            company: true,
            position: true,
            location: true,
            status: true,
            appliedDate: true,
        },
    });

    return (
        <main className="min-h-[calc(100vh-76px)] bg-[#d6e6d4] text-[#202a24]">
            <div className="mx-auto max-w-[1160px] px-5 py-8 sm:px-10 sm:py-12">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h1 className="font-[var(--font-geist-sans)] text-[26px] font-semibold text-[#202a24] sm:text-[32px]">Your Applications</h1>
                    <Link
                        className="inline-flex min-h-10 items-center rounded-[6px] bg-[#205640] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#174631]"
                        href="/applications/new"
                    >
                        <span aria-hidden="true" className="mr-2 text-base">+</span>
                        Add application
                    </Link>
                </div>
                <ApplicationsView
                    applications={applications.map((application) => ({
                        ...application,
                        appliedDate: application.appliedDate.toISOString(),
                        appliedDateLabel: application.appliedDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        }),
                    }))}
                />
            </div>
        </main>
    );
}