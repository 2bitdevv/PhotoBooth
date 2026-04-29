"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "ghost";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full border-2 border-slate-800 px-5 py-2 text-sm font-semibold transition",
        "shadow-[4px_4px_0_0_#1e293b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#1e293b]",
        variant === "primary" && "bg-blue-200 hover:bg-blue-300",
        variant === "default" && "bg-white hover:bg-blue-50",
        variant === "ghost" && "bg-transparent hover:bg-white/70",
        className
      )}
      {...props}
    />
  );
}
