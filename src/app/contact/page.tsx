import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { NavBar } from "@/components/NavBar";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white pb-10">
      <NavBar />
      <section className="mx-auto mt-4 max-w-6xl px-4">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0_0_#1e293b]">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-600">Contact</p>
            <h1 className="mt-2 text-4xl font-black text-slate-900">Connect With Us</h1>
            <p className="mt-3 max-w-md text-slate-600">
              Share your feedback, report a bug, or ask for custom features. We usually reply within 24-48 hours.
            </p>

            <div className="mt-8 space-y-5 text-slate-800">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-bold">Find us</p>
                  <p className="text-sm text-slate-600">Bangkok, Thailand</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-bold">Call us</p>
                  <p className="text-sm text-slate-600">+66 99-999-9999</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-bold">Mail us</p>
                  <p className="text-sm text-slate-600">dev2bit@example.com</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock3 className="mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-bold">Visit us</p>
                  <p className="text-sm text-slate-600">Monday - Friday, 10PM - 11PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0_0_#1e293b]">
            <form className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">First Name</label>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="John" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Last Name</label>
                  <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Subject</label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2">
                  <option>Web Development</option>
                  <option>General Inquiry</option>
                  <option>Support</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Message</label>
                <textarea
                  rows={6}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="button"
                className="w-full rounded-lg bg-blue-200 px-4 py-2 font-semibold 
                text-white transition hover:bg-blue-500"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
