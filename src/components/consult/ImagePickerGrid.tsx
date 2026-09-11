"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import type { FileConstraints } from "@/lib/consult/types";

type ImagePickerGridProps = {
  files: File[];
  onChange: (files: File[]) => void;
  constraints?: FileConstraints;
  disabled?: boolean;
  error?: string;
};

export function ImagePickerGrid({
  files,
  onChange,
  constraints,
  disabled,
  error,
}: ImagePickerGridProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const maxFiles = constraints?.max_files ?? 3;
  const mimeTypes = constraints?.allowed_mime_types ?? [];
  const isVideo = mimeTypes.some((type) => type.startsWith("video/"));
  const accept = mimeTypes.join(",") || (isVideo ? "video/*" : "image/*");
  const addLabel = isVideo ? "Add video" : "Add photo";

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(() => {
    return () => {
      for (const preview of previews) URL.revokeObjectURL(preview.url);
    };
  }, [previews]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const next = [...files];
    for (const file of incoming) {
      if (next.length >= maxFiles) break;
      const duplicate = next.some(
        (existing) =>
          existing.name === file.name && existing.size === file.size,
      );
      if (!duplicate) next.push(file);
    }
    onChange(next);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {previews.map((preview, index) => (
          <div
            key={`${preview.file.name}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-[var(--radius-lg)] border border-border bg-muted"
          >
            {preview.file.type.startsWith("video/") ? (
              <video
                src={preview.url}
                className="h-full w-full object-cover"
                muted
                playsInline
                controls
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.url}
                alt={preview.file.name}
                className="h-full w-full object-cover"
              />
            )}
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute right-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium text-foreground shadow-sm"
            >
              Remove
            </button>
          </div>
        ))}

        {files.length < maxFiles ? (
          <label
            htmlFor={inputId}
            className={cn(
              "flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-input bg-card text-center text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground",
              disabled && "pointer-events-none opacity-50",
              error && "border-destructive",
            )}
          >
            <span className="text-2xl leading-none text-primary">+</span>
            <span>{addLabel}</span>
            <span className="px-3 text-xs">
              {files.length}/{maxFiles}
            </span>
          </label>
        ) : null}
      </div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => addFiles(event.target.files)}
      />
    </div>
  );
}
