"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useBoothStore } from "@/store/useBoothStore";

const LAYOUT_PREVIEW_SRC = ["/1-2.png", "/1-3.png", "/1-4.png", "/1-6.png"];

export function WelcomeScreen() {
  const setAppState = useBoothStore((state) => state.setAppState);

  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    for (const href of LAYOUT_PREVIEW_SRC) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      document.head.appendChild(link);
      links.push(link);
    }
    for (const href of LAYOUT_PREVIEW_SRC) {
      const img = new Image();
      img.src = href;
    }
    return () => {
      links.forEach((el) => el.remove());
    };
  }, []);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-5xl font-black text-slate-900">Welcome!</h1>
      <p className="max-w-2xl text-slate-700">
        You have <span className="font-bold">3 seconds</span> for each shot, and the app captures a full photo strip in one go.
      </p>
      <p className="mt-2 max-w-2xl text-slate-700">After your session, download your strip or share it instantly.</p>
      <Button
        variant="primary"
        className="mt-8 px-8 py-3 text-lg"
        onClick={() => setAppState("LAYOUT_SELECT")}
      >
        START
      </Button>
    </section>
  );
}
