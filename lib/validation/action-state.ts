import type { ZodError } from "zod";

export type ActionState<TValues extends Record<string, unknown>> = {
  success: boolean;
  message: string;
  errors?: Partial<Record<keyof TValues, string[]>>;
};

export function createValidationErrorState<
  TValues extends Record<string, unknown>,
>(message: string, error: ZodError<TValues>): ActionState<TValues> {
  return {
    success: false,
    message,
    errors: error.flatten().fieldErrors as Partial<Record<
      keyof TValues,
      string[]
    >>,
  };
}
