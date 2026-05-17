"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  name?: string;
  value?: string;
  onChange?: (html: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  errors?: string[];
  className?: string;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30",
        active && "bg-slate-100 text-slate-900",
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  name,
  value,
  onChange,
  label,
  placeholder = "Tulis sesuatu...",
  required,
  errors,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder }),
    ],
    content: value ?? "",
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-slate max-w-none min-h-[120px] px-4 py-3 outline-none focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  const html = editor?.getHTML() ?? value ?? "";

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <span className="text-[11px] font-medium text-slate-500">
          {label}
          {required && <span className="text-rose-500"> *</span>}
        </span>
      )}

      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={html} />}

      <div
        className={cn(
          "overflow-hidden rounded-2xl border bg-slate-50 transition focus-within:border-slate-400 focus-within:bg-white",
          errors?.length ? "border-rose-300" : "border-slate-200",
        )}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-white px-3 py-2">
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            active={editor?.isActive("bold")}
            title="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            active={editor?.isActive("italic")}
            title="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            active={editor?.isActive("underline")}
            title="Underline"
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </ToolbarButton>

          <div className="mx-1 h-4 w-px bg-slate-200" />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor?.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor?.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="h-3.5 w-3.5" />
          </ToolbarButton>

          <div className="mx-1 h-4 w-px bg-slate-200" />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            active={editor?.isActive("bulletList")}
            title="Bullet list"
          >
            <List className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            active={editor?.isActive("orderedList")}
            title="Ordered list"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolbarButton>

          <div className="mx-1 h-4 w-px bg-slate-200" />

          <ToolbarButton
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            title="Divider"
          >
            <Minus className="h-3.5 w-3.5" />
          </ToolbarButton>
        </div>

        {/* Editor area */}
        <EditorContent editor={editor} />
      </div>

      {errors?.map((err) => (
        <p key={err} className="text-xs text-rose-600">{err}</p>
      ))}
    </div>
  );
}
