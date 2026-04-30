import { NavBar } from "@/components/NavBar";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white pb-10">
      <NavBar />
      <section className="mx-auto mt-6 max-w-4xl px-4">
        <h1 className="text-4xl font-black text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-slate-700">Last updated: April 2026</p>

        <div className="mt-8 space-y-4 text-slate-700">
          <article className="rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#1e293b]">
            <h2 className="text-lg font-extrabold text-slate-900">1. Captured Images</h2>
            <p className="mt-1">
              Photos are captured in your browser session for strip creation and download. We do not permanently store
              personal photos by default.
            </p>
          </article>

          <article className="rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#1e293b]">
            <h2 className="text-lg font-extrabold text-slate-900">2. Camera Permission</h2>
            <p className="mt-1">
              Camera access is requested only when you start capturing photos. You can revoke browser camera access at
              any time.
            </p>
          </article>

          <article className="rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#1e293b]">
            <h2 className="text-lg font-extrabold text-slate-900">3. Analytics and Logs</h2>
            <p className="mt-1">
              Basic technical logs may be used to keep the app stable, such as performance and crash diagnostics, but
              not for selling personal data.
            </p>
          </article>

          <article className="rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#1e293b]">
            <h2 className="text-lg font-extrabold text-slate-900">4. Contact</h2>
            <p className="mt-1">
              If you have questions about privacy, please use the Contact page and include your concern clearly.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
