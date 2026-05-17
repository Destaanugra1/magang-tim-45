"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldBaseProps = {
  label: ReactNode;
  errors?: string[];
  className?: string;
  labelClassName?: string;
  hideLabel?: boolean;
  requiredMark?: boolean;
};

type FormInputProps = InputHTMLAttributes<HTMLInputElement> &
  FieldBaseProps & {
    inputClassName?: string;
  };

type FormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  FieldBaseProps & {
    textareaClassName?: string;
  };

type FormSelectOption = { value: string; label: string };

type FormSelectProps = {
  label: ReactNode;
  name?: string;
  id?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  errors?: string[];
  className?: string;
  selectClassName?: string;
  labelClassName?: string;
};

function FieldErrors({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <>
      {errors.map((error) => (
        <p key={error} className="text-xs text-rose-600">
          {error}
        </p>
      ))}
    </>
  );
}

export function FormInput({
  label,
  errors,
  className,
  labelClassName,
  inputClassName,
  hideLabel,
  requiredMark,
  id,
  name,
  required,
  type,
  placeholder: _placeholder,
  ...props
}: FormInputProps) {
  const inputId = id ?? name;
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("space-y-1", className)}>
      <div className="relative">
        <input
          id={inputId}
          name={name}
          required={required}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder=" "
          aria-invalid={errors?.length ? true : undefined}
          {...props}
          className={cn(
            "peer w-full rounded-2xl border bg-slate-50 px-4 pb-2.5 pt-6 text-slate-900 outline-none transition",
            "focus:border-slate-400 focus:bg-white",
            isPassword && "pr-11",
            errors?.length ? "border-rose-300" : "border-slate-200",
            inputClassName,
          )}
        />
        {/* Floating label */}
        {!hideLabel && (
          <label
            htmlFor={inputId}
            className={cn(
              "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 transition-all",
              "peer-focus:top-3.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-slate-500",
              "peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-slate-500",
              labelClassName,
            )}
          >
            {label}
            {required || requiredMark ? <span className="text-rose-500"> *</span> : null}
          </label>
        )}
        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      <FieldErrors errors={errors} />
    </div>
  );
}

export function FormSelect({
  label,
  name,
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  required,
  errors,
  className,
  labelClassName,
}: FormSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectId = id ?? name;
  const selected = options.find((o) => o.value === value);
  const hasValue = !!selected;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={cn("space-y-1", className)} ref={ref}>
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value ?? ""} />

      <div className="relative">
        <button
          id={selectId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={errors?.length ? true : undefined}
          onClick={() => !disabled && setOpen((v) => !v)}
          className={cn(
            "w-full rounded-2xl border bg-slate-50 px-4 pb-2.5 pt-6 text-left text-sm text-slate-900 outline-none transition",
            open ? "border-slate-400 bg-white" : "border-slate-200",
            "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
            errors?.length && "border-rose-300",
          )}
        >
          <span className={hasValue ? "text-slate-900" : "text-slate-400"}>
            {selected?.label ?? placeholder ?? "\u00A0"}
          </span>
        </button>

        {/* Floating label */}
        <label
          htmlFor={selectId}
          className={cn(
            "pointer-events-none absolute left-4 text-sm text-slate-400 transition-all",
            hasValue || open
              ? "top-3.5 translate-y-0 text-[11px] text-slate-500"
              : "top-1/2 -translate-y-1/2",
            labelClassName,
          )}
        >
          {label}
          {required ? <span className="text-rose-500"> *</span> : null}
        </label>

        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />

        {/* Dropdown panel */}
        {open && (
          <ul
            role="listbox"
            className="absolute z-50 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1 shadow-lg"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={value === opt.value}
                onClick={() => { onChange?.(opt.value); setOpen(false); }}
                className={cn(
                  "cursor-pointer px-4 py-2.5 text-sm transition-colors",
                  value === opt.value
                    ? "bg-slate-100 font-medium text-slate-900"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <FieldErrors errors={errors} />
    </div>
  );
}

export function FormTextarea({
  label,
  errors,
  className,
  labelClassName,
  textareaClassName,
  hideLabel,
  requiredMark,
  id,
  name,
  required,
  placeholder: _placeholder,
  ...props
}: FormTextareaProps) {
  const textareaId = id ?? name;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="relative">
        <textarea
          id={textareaId}
          name={name}
          required={required}
          placeholder=" "
          aria-invalid={errors?.length ? true : undefined}
          {...props}
          className={cn(
            "peer w-full rounded-2xl border bg-slate-50 px-4 pb-2.5 pt-6 text-slate-900 outline-none transition",
            "min-h-24 resize-none focus:border-slate-400 focus:bg-white",
            errors?.length ? "border-rose-300" : "border-slate-200",
            textareaClassName,
          )}
        />
        {!hideLabel && (
          <label
            htmlFor={textareaId}
            className={cn(
              "pointer-events-none absolute left-4 top-5 text-sm text-slate-400 transition-all",
              "peer-focus:top-3 peer-focus:text-[11px] peer-focus:text-slate-500",
              "peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-slate-500",
              labelClassName,
            )}
          >
            {label}
            {required || requiredMark ? <span className="text-rose-500"> *</span> : null}
          </label>
        )}
      </div>
      <FieldErrors errors={errors} />
    </div>
  );
}
