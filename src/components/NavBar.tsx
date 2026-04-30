"use client";

import Link from "next/link";
import Image from "next/image";
import { Coffee, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useBoothStore } from "@/store/useBoothStore";

const links = [
  { label: "Home", href: "/" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Contact", href: "/contact" },
];

export function NavBar() {
  const resetSession = useBoothStore((state) => state.resetSession);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="mx-auto flex w-full justify-center px-4 pt-3">
        <nav className="relative flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3 py-2 shadow-lg backdrop-blur-md">
          <Link href="/" onClick={resetSession} className="mr-1 flex items-center rounded-full px-2 py-1 hover:bg-white/80">
            <Image src="/logo.png" alt="PhotoBoot logo" width={28} height={28} className="rounded-md" />
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            {links.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  if (item.label === "Home") {
                    resetSession();
                  }
                }}
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-white/80"
              >
                {item.label}
              </Link>
            ))}
            <a href="https://buymeacoffee.com/dev2bit" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="flex items-center gap-2 px-4 py-2">
                <Coffee size={16} />
                Tip Me
              </Button>
            </a>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-slate-800 hover:bg-white/80 md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {isOpen && (
            <div className="absolute left-1/2 top-16 z-30 w-[88vw] max-w-xs -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur md:hidden">
              {links.map((item) => (
                <Link
                  key={`mobile-${item.label}`}
                  href={item.href}
                  onClick={() => {
                    if (item.label === "Home") {
                      resetSession();
                    }
                    setIsOpen(false);
                  }}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-blue-50"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="https://buymeacoffee.com/dev2bit"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block"
                onClick={() => setIsOpen(false)}
              >
                <Button variant="primary" className="flex w-full items-center justify-center gap-2 px-4 py-2">
                  <Coffee size={16} />
                  Tip Me
                </Button>
              </a>
            </div>
          )}
        </nav>
      </header>
      <div className="h-4" />
    </>
  );
}
