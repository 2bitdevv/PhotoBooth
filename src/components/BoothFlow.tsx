"use client";

import { CaptureScreen } from "@/components/CaptureScreen";
import { CustomizeScreen } from "@/components/CustomizeScreen";
import { LayoutSelector } from "@/components/LayoutSelector";
import { ResultScreen } from "@/components/ResultScreen";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { useBoothStore } from "@/store/useBoothStore";

export function BoothFlow() {
  const appState = useBoothStore((state) => state.appState);

  if (appState === "WELCOME") return <WelcomeScreen />;
  if (appState === "LAYOUT_SELECT") return <LayoutSelector />;
  if (appState === "CAPTURE") return <CaptureScreen />;
  if (appState === "CUSTOMIZE") return <CustomizeScreen />;
  return <ResultScreen />;
}
