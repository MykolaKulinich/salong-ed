import type { Metadata } from "next";
import SalongEdLogo from "@/components/brand/SalongEdLogo";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Logga in",
};

const FORBIDDEN_MESSAGE = "Du har inte behörighet till administrationen.";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError = error === "forbidden" ? FORBIDDEN_MESSAGE : null;

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm border border-border bg-surface p-8 sm:p-10">
        <div className="flex justify-center">
          <SalongEdLogo />
        </div>
        <p className="mt-7 text-center text-[10px] uppercase tracking-[0.22em] text-accent">
          Administration
        </p>
        <LoginForm initialError={initialError} />
      </div>
    </div>
  );
}
