import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function AboutPreview() {
  return (
    <section className="py-20 sm:py-24 md:py-32">
      <Container className="grid gap-12 md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-20">
        <div className="image-hover-zoom relative aspect-[4/5] w-full overflow-hidden border border-border md:order-first">
          <Image
            src="/images/brand/ewelina-dubowska-portrait.webp"
            alt="Ewelina Dubowska på Salong ED"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-xl">
          <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Om Salong ED</span>
          <h2 className="text-balance mt-5 font-serif text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">Mer än en behandling. En helhet för din skönhet och ditt välmående.</h2>
          <p className="mt-7 text-muted">Salong ED har vuxit fram ur Ewelina Dubowskas arbete inom kosmetologi sedan 2001. Med vidare studier, utbildningserfarenhet och en verksamhet i Stockholm sedan 2015 kombineras kunskap med ett personligt bemötande.</p>
          <p className="mt-4 text-muted">I dag ligger fokus på biologisk förnyelse, ansikts- och kroppsvård samt modern teknik — med omsorg om varje detalj.</p>
          <Button href="/salonged" variant="secondary" className="mt-8">Läs mer om Salong ED</Button>
        </div>
      </Container>
    </section>
  );
}
