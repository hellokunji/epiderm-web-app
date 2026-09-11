import { cn } from "@/lib/utils/cn";
import type { TextareaHTMLAttributes } from "react";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-[var(--radius-md)] border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus-visible:border-input-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
