"use client";

import { CircleAlert, CircleCheckBig } from "lucide-react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "@/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormInput } from "@/components/ui/form-field";
import { defaultAuthState } from "@/lib/auth/default-auth-state";

export function SignInForm() {
  const searchParams = useSearchParams();
  const [state, formAction, pending] = useActionState(login, defaultAuthState);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <FormInput
        label="Email"
        name="email"
        type="email"
        required
        errors={state.errors?.email}
      />

      <FormInput
        label="Password"
        name="password"
        type="password"
        required
        errors={state.errors?.password}
      />

      {state.message ? (
        <Alert variant={state.success ? "default" : "destructive"}>
          {state.success ? (
            <CircleCheckBig className="h-4 w-4" />
          ) : (
            <CircleAlert className="h-4 w-4" />
          )}
          <AlertTitle>{state.success ? "Berhasil" : "Login gagal"}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Memproses..." : "Login"}
      </button>
    </form>
  );
}
