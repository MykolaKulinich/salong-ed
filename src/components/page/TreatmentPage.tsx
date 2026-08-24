import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import BookingButton from "@/components/ui/BookingButton";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import type { TreatmentPageData } from "@/lib/content";
import { TONE_BG_CLASSES } from "@/lib/tone";
import Breadcrumbs from "@/components/page/Breadcrumbs";
import BreadcrumbStructuredData from "@/components/page/BreadcrumbStructuredData";
import RelatedTreatments from "@/components/page/RelatedTreatments";

type TreatmentPageProps = {
  data: TreatmentPageData;
};

export default function TreatmentPage({ data }: TreatmentPageProps) {
  const supportingVisuals = [
    ...(data.secondaryVisual ? [data.secondaryVisual] : []),
    ...(data.supportingVisuals ?? []),
  ];

  return (
    <>
      <BreadcrumbStructuredData current={data.title} path={data.path} />
      <section className="border-b border-border bg-surface">
        <Container>
          <div className="py-6 sm:py-8"><Breadcrumbs current={data.title} /></div>
          <div className="grid gap-12 pb-16 sm:pb-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16 lg:pb-24">
            <div>
              <div className="flex items-center gap-4">
                <span className="editorial-rule w-10" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-accent">{data.eyebrow}</span>
              </div>
              <h1 className="text-balance mt-6 font-serif text-4xl leading-[1.02] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-6xl">{data.title}</h1>
              <p className="text-pretty mt-7 max-w-xl text-base text-muted sm:text-lg">{data.intro}</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <BookingButton>Boka tid</BookingButton>
                <Button href="#las-mer" variant="ghost" className="group pl-0">Läs mer <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Button>
              </div>
            </div>
            <div className="lg:pl-8">
              {data.visualImage ? (
                <div
                  className={`relative ${data.visualImage.aspectClass ?? "aspect-[1.03]"} w-full overflow-hidden border border-border ${
                    data.visualImage.fit === "contain" ? TONE_BG_CLASSES[data.visualTone] : ""
                  }`}
                >
                  <Image
                    src={data.visualImage.src}
                    alt={data.visualImage.alt}
                    fill
                    preload
                    sizes="(min-width: 1024px) 54vw, 100vw"
                    className={
                      data.visualImage.fit === "contain"
                        ? `object-contain ${data.visualImage.imageClassName ?? "p-8 sm:p-12"}`
                        : `object-cover ${data.visualImage.position ?? ""}`
                    }
                  />
                </div>
              ) : (
                <ImagePlaceholder label={data.visualLabel} aspect="aspect-[1.03]" tone={data.visualTone} />
              )}
            </div>
          </div>
        </Container>
      </section>

      {data.highlights && (
        <section className="border-b border-border bg-background">
          <Container className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {data.highlights.map((highlight) => (
              <div key={highlight.label} className="flex flex-col gap-2 px-0 py-6 sm:px-6 sm:py-8 first:sm:pl-0 last:sm:pr-0">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent">{highlight.label}</span>
                <span className="font-serif text-xl text-foreground">{highlight.value}</span>
              </div>
            ))}
          </Container>
        </section>
      )}

      <section id="las-mer" className="scroll-mt-24 py-16 sm:py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-24">
          <aside>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Om behandlingen</span>
            <h2 className="text-balance mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">Tydlig information. Personligt upplägg.</h2>
            <p className="mt-5 text-sm leading-7 text-muted">Läs om behandlingens inriktning och boka en tid när du vill gå vidare.</p>
            {supportingVisuals.map((visual) => (
              <div
                key={visual.src}
                className={`relative mt-8 w-full overflow-hidden border border-border ${visual.aspectClass ?? "aspect-[4/3]"} ${
                  visual.fit === "contain" ? TONE_BG_CLASSES[data.visualTone] : "bg-surface-muted"
                }`}
              >
                <Image
                  src={visual.src}
                  alt={visual.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 90vw"
                  className={visual.fit === "contain" ? "object-contain p-2 sm:p-3" : `object-cover ${visual.position ?? ""}`}
                />
              </div>
            ))}
          </aside>

          <div className="border-t border-border">
            {data.sections.map((section, index) => (
              <article key={section.title} className="border-b border-border py-8 sm:py-10">
                <div className="flex gap-5 sm:gap-8">
                  <span className="pt-1 font-serif text-lg text-accent">0{index + 1}</span>
                  <div className="max-w-2xl">
                    <h2 className="font-serif text-2xl text-foreground sm:text-3xl">{section.title}</h2>
                    {section.intro && <p className="mt-4 text-muted">{section.intro}</p>}
                    {section.body && <p className="mt-4 text-muted">{section.body}</p>}
                    {section.bullets && (
                      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2 text-sm text-foreground/80"><CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-foreground py-14 text-background sm:py-18">
        <Container className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Nästa steg</span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Vill du veta mer?</h2>
            <p className="mt-3 text-sm leading-6 text-background/65">{data.note}</p>
          </div>
          <BookingButton variant="inverse">Boka din tid</BookingButton>
        </Container>
      </section>

      <RelatedTreatments items={data.related} />
    </>
  );
}
