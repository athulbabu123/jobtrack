import { notFound } from "next/navigation";
import EditApplicationForm from "@/components/EditApplicationForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type EditApplicationPageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditApplicationPage({ params }: EditApplicationPageProps) {
    const { id } = await params;
    const application = await prisma.application.findUnique({
        where: { id },
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

    return (
        <main className="min-h-[calc(100vh-76px)] bg-[#d6e6d4] text-[#202a24]">
            <div className="mx-auto max-w-[760px] px-5 py-8 sm:px-10 sm:py-12">
                <h1 className="mb-6 font-[var(--font-geist-sans)] text-[26px] font-semibold sm:text-[32px]">
                    Edit application
                </h1>
                <EditApplicationForm
                    application={{
                        ...application,
                        appliedDate: application.appliedDate.toISOString().slice(0, 10),
                    }}
                />
            </div>
        </main>
    );
}