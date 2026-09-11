import { cn } from "@/lib/utils/cn";
import type { LabelHTMLAttributes } from "react";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-foreground mb-1.5",
        className,
      )}
      {...props}
    />
  );
}
