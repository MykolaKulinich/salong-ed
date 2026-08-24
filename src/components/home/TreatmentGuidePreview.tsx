import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import BookingButton from "@/components/ui/BookingButton";
import { ArrowRightIcon } from "@/components/icons";

const STEPS = ["Beskriv dina mål", "Berätta vilket område", "Få relevanta alternativ", "Läs mer eller boka konsultation"];

export default function TreatmentGuidePreview() {
  return (
    <section id="hitta-ratt-behandling" className="scroll-mt-24 border-b border-border bg-surface py-20 sm:py-24 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Hitta rätt behandling</span>
            <h2 className="text-balance mt-5 font-serif text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">För dina mål.<br /><span className="text-accent">På ditt sätt.</span></h2>
            <p className="mt-7 max-w-md text-muted">Osäker på vilken behandling som passar dig? Börja med det du vill fokusera på. Guiden är en introduktion — individuell bedömning görs vid behov innan behandling.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#behandlingar" variant="secondary" className="group">Se behandlingar <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Button>
              <BookingButton variant="ghost" className="pl-0">Boka konsultation</BookingButton>
            </div>
          </div>

          <ol className="border-t border-border">
            {STEPS.map((step, index) => (
              <li key={step} className="grid grid-cols-[3rem_1fr] items-center gap-4 border-b border-border py-5 sm:grid-cols-[4rem_1fr] sm:py-6">
                <span className="font-serif text-2xl text-accent">0{index + 1}</span>
                <span className="font-serif text-xl text-foreground sm:text-2xl">{step}</span>
              </li>
            ))}
            <li className="pt-6 text-sm text-muted">Dessa behandlingar kan vara relevanta utifrån dina val. En individuell bedömning görs vid behov innan behandling.</li>
          </ol>
        </div>
      </Container>
    </section>
  );
}
