import { cn } from "@/lib/utils/cn";
import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-[var(--radius-md)] border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus-visible:border-input-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
