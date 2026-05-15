"use client";

import type { ChangeEvent } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageUploadFieldProps = {
  id: string;
  name: string;
  label: string;
  preview: string | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  helperText?: string;
  previewAlt?: string;
  emptyText?: string;
  filledText?: string;
  layout?: "stacked" | "inline";
  tone?: "slate" | "amber";
};

const toneClassName = {
  slate: {
    border: "border-slate-200 hover:border-slate-400",
    iconWrap: "bg-slate-200 text-slate-400",
  },
  amber: {
    border: "border-amber-200 hover:border-amber-400",
    iconWrap: "bg-amber-100 text-amber-400",
  },
};

export function ImageUploadField({
  id,
  name,
  label,
  preview,
  onChange,
  required,
  helperText,
  previewAlt = "Preview gambar",
  emptyText = "Upload gambar",
  filledText = "Ganti gambar",
  layout = "stacked",
  tone = "slate",
}: ImageUploadFieldProps) {
  const classes = toneClassName[tone];
  const isInline = layout === "inline";

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer gap-3 rounded-2xl border-2 border-dashed bg-white transition",
          isInline ? "items-center p-4" : "flex-col items-center p-5",
          classes.border,
        )}
      >
        {preview ? (
          <div className={cn("relative shrink-0 overflow-hidden rounded-full", isInline ? "h-16 w-16" : "h-24 w-24")}>
            <Image src={preview} alt={previewAlt} fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className={cn("flex shrink-0 items-center justify-center rounded-full", isInline ? "h-16 w-16" : "h-16 w-16", classes.iconWrap)}>
            <ImagePlus className="h-7 w-7" />
          </div>
        )}
        <div className={cn(isInline ? "text-left" : "text-center")}>
          <p className="text-sm font-medium text-slate-700">
            {preview ? filledText : emptyText}
          </p>
          <p className="mt-1 text-xs text-slate-400">JPG, PNG, WEBP - maks 3 MB</p>
        </div>
      </label>
      <input
        id={id}
        name={name}
        type="file"
        accept="image/*"
        required={required}
        onChange={onChange}
        className="sr-only"
      />
      {helperText ? <p className="mt-1.5 text-xs text-slate-500">{helperText}</p> : null}
    </div>
  );
}
