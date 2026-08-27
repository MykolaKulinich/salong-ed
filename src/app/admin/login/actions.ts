"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type LoginState = { error: string } | undefined;

const GENERIC_ERROR = "Fel e-postadress eller lösenord.";

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const email = typeof emailValue === "string" ? emailValue.trim() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!email || !password) {
    return { error: GENERIC_ERROR };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  // Never surface the raw Supabase error message — always the same calm,
  // generic Swedish copy regardless of whether the account exists.
  if (error) {
    return { error: GENERIC_ERROR };
  }

  redirect("/admin/presentkort");
}
