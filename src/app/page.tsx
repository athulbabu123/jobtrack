import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  const homeHref = user ? "/dashboard" : "/";
  const loginHref = user ? "/dashboard" : "/login";

  return (
    <main className="min-h-screen bg-[#f3f5f0] text-[#202a24]">
      <header className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 sm:px-10">
        <Link className="flex items-center gap-3 font-[var(--font-geist-sans)] text-[22px] font-bold text-[#202a24]" href={homeHref} aria-label="JobTrack home">
          <span className="grid size-10 place-items-center rounded-[9px] bg-[#205640] text-base font-bold text-white" aria-hidden="true">J</span>
          <span>JobTrack</span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5" aria-label="Account navigation">
          <Link className="hidden text-sm font-semibold text-[#35443a] hover:text-[#205640] sm:inline" href={loginHref}>Log in</Link>
          <Link className="rounded-[6px] bg-[#205640] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#174631]" href="/signup">Sign up</Link>
        </nav>
      </header>

      <section className="overflow-hidden bg-[#173d2e] text-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-14 sm:px-10 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-24">
          <div className="max-w-[560px]">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#b7d1b8]">A clearer way to move forward</p>
            <h1 className="font-[var(--font-geist-sans)] text-[42px] font-semibold leading-[1.05] sm:text-[58px]">Make your next move count.</h1>
            <p className="mt-6 max-w-[470px] text-base leading-7 text-[#d4e2d6]">Keep every application, interview, and offer organized in one calm, clear workspace.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link className="inline-flex min-h-12 items-center rounded-[6px] bg-[#e2efe0] px-5 text-sm font-semibold text-[#173d2e] transition-colors hover:bg-white" href="/signup">Create your account</Link>
              <Link className="inline-flex min-h-12 items-center rounded-[6px] border border-[#819e89] px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10" href={loginHref}>Log in</Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[640px] rounded-[10px] border border-white/20 bg-[#f8faf7] p-3 text-[#202a24] shadow-2xl sm:p-5" aria-label="JobTrack application dashboard preview">
            <div className="flex items-center justify-between border-b border-[#e1e7df] pb-3">
              <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#dc8a6b]" /><span className="size-2 rounded-full bg-[#e2be68]" /><span className="size-2 rounded-full bg-[#78a27d]" /></div>
              <span className="text-[10px] font-medium text-[#829087]">JOBTRACK / OVERVIEW</span>
            </div>
            <div className="flex items-center justify-between py-4">
              <div><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#829087]">Workspace</p><h2 className="mt-1 text-base font-semibold">Your applications</h2></div>
              <span className="rounded-[5px] bg-[#205640] px-3 py-2 text-[10px] font-semibold text-white">+ Add application</span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-[6px] border border-[#dce4dc] bg-white p-3"><p className="text-[10px] text-[#68766c]">Applications</p><p className="mt-1 text-xl font-semibold">12</p></div>
              <div className="rounded-[6px] border border-[#dce4dc] bg-white p-3"><p className="text-[10px] text-[#68766c]">Interviews</p><p className="mt-1 text-xl font-semibold">3</p></div>
              <div className="rounded-[6px] border border-[#dce4dc] bg-white p-3"><p className="text-[10px] text-[#68766c]">Offers</p><p className="mt-1 text-xl font-semibold">1</p></div>
            </div>
            <div className="mt-4 rounded-[6px] border border-[#dce4dc] bg-white">
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2 border-b border-[#e7ebe4] px-3 py-2 text-[9px] font-semibold uppercase text-[#829087] sm:px-4"><span>Company</span><span>Position</span><span>Status</span></div>
              <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 border-b border-[#eef1ed] px-3 py-3 text-[10px] sm:px-4"><span className="font-semibold">Northstar</span><span className="truncate text-[#68766c]">Product designer</span><span className="rounded-full bg-[#fff0df] px-2 py-1 text-[9px] font-medium text-[#92551e]">Interview</span></div>
              <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 px-3 py-3 text-[10px] sm:px-4"><span className="font-semibold">Fieldwork</span><span className="truncate text-[#68766c]">UX researcher</span><span className="rounded-full bg-[#e5f0f8] px-2 py-1 text-[9px] font-medium text-[#315f7a]">Applied</span></div>
            </div>
            <p className="mt-2 text-right text-[9px] text-[#829087]">Product preview</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1280px] gap-8 px-5 py-12 sm:grid-cols-3 sm:px-10 sm:py-16">
        <div><p className="text-xs font-semibold text-[#205640]">01</p><h2 className="mt-3 text-base font-semibold">Every application, accounted for</h2></div>
        <div><p className="text-xs font-semibold text-[#b46843]">02</p><h2 className="mt-3 text-base font-semibold">A clear view of your pipeline</h2></div>
        <div><p className="text-xs font-semibold text-[#557b98]">03</p><h2 className="mt-3 text-base font-semibold">More focus for what comes next</h2></div>
      </section>
    </main>
  );
}

