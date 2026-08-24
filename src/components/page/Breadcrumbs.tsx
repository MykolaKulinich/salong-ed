import Link from "next/link";

type BreadcrumbsProps = {
  current: string;
};

export default function Breadcrumbs({ current }: BreadcrumbsProps) {
  return (
    <nav aria-label="Brödsmulor" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
      <Link href="/" className="transition-colors hover:text-accent">Salong ED</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page" className="min-w-0 break-words text-foreground/70">{current}</span>
    </nav>
  );
}
