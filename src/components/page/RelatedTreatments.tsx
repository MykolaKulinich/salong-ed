import Link from "next/link";
import Container from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/icons";
import type { RelatedTreatment } from "@/lib/content";

type RelatedTreatmentsProps = {
  items: RelatedTreatment[];
};

export default function RelatedTreatments({ items }: RelatedTreatmentsProps) {
  return (
    <section className="border-t border-border bg-surface py-16 sm:py-20">
      <Container>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Fortsätt utforska</span>
            <h2 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">Fler vägar till Salong ED</h2>
          </div>
          <Link href="/#behandlingar" className="text-sm text-muted transition-colors hover:text-accent">Alla behandlingar →</Link>
        </div>
        <div className="mt-10 grid gap-px bg-border md:grid-cols-3">
          {items.map((item) => {
            const external = item.href.startsWith("http");
            const content = (
              <>
                <p className="text-[10px] uppercase tracking-[0.18em] text-accent">Salong ED</p>
                <h3 className="mt-4 font-serif text-2xl text-foreground">{item.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-muted">{item.description}</p>
                <ArrowRightIcon className="mt-8 h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
              </>
            );

            return external ? (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="group bg-background p-6 transition-colors hover:bg-[#f4eee6] sm:p-8">{content}</a>
            ) : (
              <Link key={item.href} href={item.href} className="group bg-background p-6 transition-colors hover:bg-[#f4eee6] sm:p-8">{content}</Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
