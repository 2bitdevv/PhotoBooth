"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { CaptureScreen } from "@/components/CaptureScreen";
import { CustomizeScreen } from "@/components/CustomizeScreen";
import { LayoutSelector } from "@/components/LayoutSelector";
import RouteLoading from "@/components/RouteLoading";
import { ResultScreen } from "@/components/ResultScreen";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { useBoothStore } from "@/store/useBoothStore";

export function BoothFlow() {
  const appState = useBoothStore((state) => state.appState);
  const prevState = useRef<typeof appState | null>(null);
  const [stepLoading, setStepLoading] = useState(false);

  useLayoutEffect(() => {
    if (prevState.current === null) {
      prevState.current = appState;
      return;
    }
    if (prevState.current === appState) return;
    const from = prevState.current;
    prevState.current = appState;
    if (from === "WELCOME" && appState === "LAYOUT_SELECT") {
      return;
    }
    setStepLoading(true);
    const id = window.setTimeout(() => setStepLoading(false), 280);
    return () => window.clearTimeout(id);
  }, [appState]);

  const screen =
    appState === "WELCOME" ? (
      <WelcomeScreen />
    ) : appState === "LAYOUT_SELECT" ? (
      <LayoutSelector />
    ) : appState === "CAPTURE" ? (
      <CaptureScreen />
    ) : appState === "CUSTOMIZE" ? (
      <CustomizeScreen />
    ) : (
      <ResultScreen />
    );

  return (
    <div className="relative">
      {stepLoading && (
        <div className="fixed inset-0 z-250 bg-[#eff6ff]/90 backdrop-blur-[2px]">
          <RouteLoading />
        </div>
      )}
      {screen}
    </div>
  );
}
