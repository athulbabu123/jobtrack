import { redirect } from "next/navigation";
import NewApplicationForm from "@/components/NewApplicationForm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewApplicationPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <main className="min-h-[calc(100vh-76px)] bg-[#d6e6d4] text-[#202a24]">
            <div className="mx-auto max-w-[760px] px-5 py-8 sm:px-10 sm:py-12">
                <h1 className="mb-6 font-[var(--font-geist-sans)] text-[26px] font-semibold sm:text-[32px]">
                    Add application
                </h1>
                <NewApplicationForm />
            </div>
        </main>
    );
}