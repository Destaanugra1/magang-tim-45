import { cn } from "@/lib/utils";

interface RichTextContentProps {
  html: string;
  className?: string;
}

export function RichTextContent({ html, className }: RichTextContentProps) {
  if (!html || html === "<p></p>") return null;

  return (
    <div
      className={cn(
        "prose prose-sm prose-slate max-w-none",
        "prose-headings:font-semibold prose-headings:text-slate-900",
        "prose-p:text-slate-600 prose-p:leading-relaxed",
        "prose-strong:text-slate-800 prose-strong:font-semibold",
        "prose-ul:text-slate-600 prose-ol:text-slate-600",
        "prose-hr:border-slate-200",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
