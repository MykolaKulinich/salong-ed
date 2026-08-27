"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";
import { loginAction, type LoginState } from "./actions";

const fieldClass =
  "mt-2 min-h-12 w-full rounded-none border border-border bg-background px-4 font-normal text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-foreground";

export default function LoginForm({ initialError }: { initialError?: string | null }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    initialError ? { error: initialError } : undefined,
  );

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      <div>
        <label htmlFor="admin-email" className="block text-sm font-medium text-foreground">
          E-post
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          aria-invalid={Boolean(state?.error)}
          aria-describedby={state?.error ? "admin-login-error" : undefined}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="block text-sm font-medium text-foreground">
          Lösenord
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(state?.error)}
          aria-describedby={state?.error ? "admin-login-error" : undefined}
          className={fieldClass}
        />
      </div>

      {state?.error && (
        <p id="admin-login-error" role="alert" className="text-sm text-accent-strong">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="min-h-12 w-full rounded-none">
        {pending ? "Loggar in…" : "Logga in"}
      </Button>
    </form>
  );
}
