import { NavBar } from "@/components/NavBar";

const faqs = [
  {
    q: "How many photos are captured per session?",
    a: "It depends on your selected layout. Layouts can capture 2, 3, 4, or 6 shots automatically.",
  },
  {
    q: "Can I choose a countdown time?",
    a: "Yes. You can pick 3, 4, or 5 seconds before each shot in the capture screen.",
  },
  {
    q: "Do filters affect the final strip?",
    a: "Yes. Your selected filter is applied to the merged output so your final strip matches the preview style.",
  },
  {
    q: "How do I save my strip?",
    a: "Use the Download Photo Strip button in the result screen to save a PNG to your device.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white pb-10">
      <NavBar />
      <section className="mx-auto mt-6 max-w-4xl px-4">
        <h1 className="text-4xl font-black text-slate-900">FAQ</h1>
        <p className="mt-2 text-slate-700">Everything you need to know before your next photo booth session.</p>
        <div className="mt-8 space-y-4">
          {faqs.map((item) => (
            <article
              key={item.q}
              className="rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#1e293b]"
            >
              <h2 className="text-lg font-extrabold text-slate-900">{item.q}</h2>
              <p className="mt-1 text-slate-700">{item.a}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
