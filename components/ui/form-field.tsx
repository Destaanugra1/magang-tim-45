import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
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

const defaultFieldClassName = "space-y-2";
const defaultLabelClassName = "text-sm font-medium text-slate-700";
const defaultControlClassName =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white";

function FieldLabel({
  label,
  required,
  requiredMark,
  hideLabel,
  className,
}: {
  label: ReactNode;
  required?: boolean;
  requiredMark?: boolean;
  hideLabel?: boolean;
  className?: string;
}) {
  return (
    <span className={cn(defaultLabelClassName, hideLabel && "sr-only", className)}>
      {label}
      {required || requiredMark ? <span className="text-rose-500"> *</span> : null}
    </span>
  );
}

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
  ...props
}: FormInputProps) {
  const inputId = id ?? name;

  return (
    <label className={cn(defaultFieldClassName, "block", className)}>
      <FieldLabel
        label={label}
        required={required}
        requiredMark={requiredMark}
        hideLabel={hideLabel}
        className={labelClassName}
      />
      <input
        id={inputId}
        name={name}
        required={required}
        aria-invalid={errors?.length ? true : undefined}
        {...props}
        className={cn(defaultControlClassName, errors?.length && "border-rose-300", inputClassName)}
      />
      <FieldErrors errors={errors} />
    </label>
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
  ...props
}: FormTextareaProps) {
  const textareaId = id ?? name;

  return (
    <label className={cn(defaultFieldClassName, "block", className)}>
      <FieldLabel
        label={label}
        required={required}
        requiredMark={requiredMark}
        hideLabel={hideLabel}
        className={labelClassName}
      />
      <textarea
        id={textareaId}
        name={name}
        required={required}
        aria-invalid={errors?.length ? true : undefined}
        {...props}
        className={cn(
          defaultControlClassName,
          "min-h-24 resize-none",
          errors?.length && "border-rose-300",
          textareaClassName,
        )}
      />
      <FieldErrors errors={errors} />
    </label>
  );
}
