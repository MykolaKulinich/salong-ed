import Image from "next/image";
import Container from "@/components/ui/Container";
import BookingButton from "@/components/ui/BookingButton";
import Breadcrumbs from "@/components/page/Breadcrumbs";
import RelatedTreatments from "@/components/page/RelatedTreatments";
import { ROUTES } from "@/lib/routes";

const BACKGROUND = [
  { label: "Kosmetologi", value: "Arbete inom området sedan 2001" },
  { label: "Stockholm", value: "Verksam i Stockholm sedan 2015" },
  { label: "Fokus", value: "Biologisk förnyelse & helhetsvård" },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <Container>
          <div className="py-6 sm:py-8"><Breadcrumbs current="Om Salong ED" /></div>
          <div className="grid gap-12 pb-16 sm:pb-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16 lg:pb-24">
            <div>
              <div className="flex items-center gap-4"><span className="editorial-rule w-10" /><span className="text-[10px] uppercase tracking-[0.22em] text-accent">Om Salong ED</span></div>
              <h1 className="text-balance mt-6 font-serif text-5xl leading-[1.02] tracking-[-0.025em] text-foreground sm:text-6xl">Med hjärta för skönhet.</h1>
              <p className="mt-7 max-w-xl text-base text-muted sm:text-lg">Salong ED är en skönhetssalong i Ursvik där kunskap, modern teknik och ett personligt bemötande får ta plats.</p>
              <BookingButton className="mt-9">Boka tid</BookingButton>
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-border">
              <Image
                src="/images/brand/ewelina-dubowska-portrait.webp"
                alt="Ewelina Dubowska på Salong ED"
                fill
                preload
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border">
        <Container className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {BACKGROUND.map((item) => <div key={item.label} className="flex flex-col gap-2 py-6 sm:px-6 sm:py-8 first:sm:pl-0 last:sm:pr-0"><span className="text-[10px] uppercase tracking-[0.2em] text-accent">{item.label}</span><span className="font-serif text-xl text-foreground">{item.value}</span></div>)}
        </Container>
      </section>

      <section className="py-16 sm:py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-24">
          <aside><span className="text-[10px] uppercase tracking-[0.22em] text-accent">Ewelina Dubowska</span><h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">Kosmetologi är min passion.</h2></aside>
          <div className="border-t border-border">
            <article className="border-b border-border py-8 sm:py-10"><h2 className="font-serif text-2xl sm:text-3xl">En erfaren grund</h2><p className="mt-4 text-muted">Ewelina Dubowska har arbetat inom kosmetikområdet sedan 2001. Hon avslutade studier inom kosmetologi vid högskola 2009 och har även arbetat som föreläsare inom området.</p></article>
            <article className="border-b border-border py-8 sm:py-10"><h2 className="font-serif text-2xl sm:text-3xl">Kunskap som fortsätter utvecklas</h2><p className="mt-4 text-muted">Mellan 2012 och 2015 samarbetade Ewelina med Clarena som utbildare för norra och östra Polen. Sedan flytten till Stockholm 2015 har utveckling genom utbildningar och symposier fortsatt vara en viktig del av arbetet.</p></article>
            <article className="border-b border-border py-8 sm:py-10"><h2 className="font-serif text-2xl sm:text-3xl">Salong ED i Ursvik</h2><p className="mt-4 text-muted">Verksamheten är inriktad på biologisk förnyelse och helhetsvård för ansikte och kropp, med inslag av estetisk kosmetologi och moderna teknologiska enheter. Här får du ett personligt bemötande i en lugn och professionell miljö.</p></article>
          </div>
        </Container>
      </section>

      <section className="bg-foreground py-14 text-background sm:py-18"><Container className="flex flex-col justify-between gap-7 md:flex-row md:items-center"><div><span className="text-[10px] uppercase tracking-[0.22em] text-accent">Välkommen</span><h2 className="mt-3 font-serif text-3xl sm:text-4xl">Ta nästa steg i din egen takt.</h2></div><BookingButton variant="inverse">Boka din tid</BookingButton></Container></section>
      <RelatedTreatments items={[
        { title: "Ansiktsbehandlingar", href: ROUTES.face, description: "Utforska hudvård och ansiktsbehandlingar." },
        { title: "Icoone LaserMed", href: ROUTES.icoone, description: "Läs om avancerad kroppsteknik." },
        { title: "Fransar & naglar", href: ROUTES.lashesAndNails, description: "Se behandlingar för blick och händer." },
      ]} />
    </>
  );
}
