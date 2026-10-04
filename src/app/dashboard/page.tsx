import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

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

export default async function DashboardPage() {
	const user = await getCurrentUser();
	if (!user) {
		redirect("/login");
	}
	const [applicationCount, interviewCount, offerCount, recentApplications] = await Promise.all([
		prisma.application.count(
			{
				where: {
					userId: user.id,
				},
			}
		),
		prisma.application.count({ where: { status: "INTERVIEWING", userId: user.id } }),
		prisma.application.count({ where: { status: "OFFERED", userId: user.id } }),
		prisma.application.findMany({
				where: {
					userId: user.id,
				},
			orderBy: { appliedDate: "desc" },
			take: 5,
			select: {
				id: true,
				company: true,
				position: true,
				location: true,
				status: true,
				appliedDate: true,
			},
		}),
	]);

	return (
		<main className="min-h-[calc(100vh-76px)] bg-[#d6e6d4] text-[#202a24]">
			<div className="mx-auto max-w-[1160px] px-5 py-8 sm:px-10 sm:py-12">
				<div className="mb-7 flex flex-wrap items-end justify-between gap-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#557061]">JobTrack</p>
						<h1 className="mt-2 font-[var(--font-geist-sans)] text-[28px] font-semibold sm:text-[34px]">Dashboard</h1>
					</div>
					<Link className="text-sm font-semibold text-[#205640] hover:underline" href="/applications">View all applications <span aria-hidden="true">↗</span></Link>
				</div>

				<section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4" aria-label="Application overview">
					<article className="rounded-[7px] border border-[#c7d8e4] bg-[#e8f0f5] p-5 sm:p-6">
						<h2 className="text-center text-base font-semibold text-[#59675e] sm:text-lg">Applications</h2>
						<p className="mt-4 text-center font-[var(--font-geist-sans)] text-[40px] font-semibold leading-none sm:text-[44px]">{applicationCount}</p>
					</article>
					<article className="rounded-[7px] border border-[#c7d8e4] bg-[#e8f0f5] p-5 sm:p-6">
						<h2 className="text-center text-base font-semibold text-[#59675e] sm:text-lg">Interviews</h2>
						<p className="mt-4 text-center font-[var(--font-geist-sans)] text-[40px] font-semibold leading-none sm:text-[44px]">{interviewCount}</p>
					</article>
					<article className="rounded-[7px] border border-[#c7d8e4] bg-[#e8f0f5] p-5 sm:p-6">
						<h2 className="text-center text-base font-semibold text-[#59675e] sm:text-lg">Offers</h2>
						<p className="mt-4 text-center font-[var(--font-geist-sans)] text-[40px] font-semibold leading-none sm:text-[44px]">{offerCount}</p>
					</article>
				</section>

				<section className="mt-10" aria-labelledby="recent-applications-title">
					<div className="mb-4 flex items-center justify-between">
						<h2 id="recent-applications-title" className="font-[var(--font-geist-sans)] text-xl font-semibold">Recent applications</h2>
						<span className="text-xs text-[#69766d]">Latest {recentApplications.length}</span>
					</div>
					<div className="overflow-x-auto rounded-[7px] border border-[#c7d9c5] bg-[#fbfcf9]">
						<table className="w-full min-w-[640px] border-collapse text-left">
							<thead>
								<tr className="border-b border-[#dce2d8] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#69766d]">
									<th className="px-5 py-3.5">Company</th>
									<th className="px-5 py-3.5">Position</th>
									<th className="px-5 py-3.5">Status</th>
									<th className="px-5 py-3.5">Applied</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#e7ebe4]">
								{recentApplications.map((application) => (
									<tr className="text-[13px]" key={application.id}>
										<td className="px-5 py-4 font-semibold">
											<Link className="hover:text-[#205640]" href={`/applications/${application.id}`}>{application.company}</Link>
										</td>
										<td className="px-5 py-4 text-[#455249]">{application.position}{application.location ? ` · ${application.location}` : ""}</td>
										<td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles[application.status]}`}>{statusLabels[application.status]}</span></td>
										<td className="whitespace-nowrap px-5 py-4 text-[#69766d]">{application.appliedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
									</tr>
								))}
								{recentApplications.length === 0 && (
									<tr><td className="px-5 py-12 text-center text-sm text-[#69766d]" colSpan={4}>No applications yet.</td></tr>
								)}
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</main>
	);
}
