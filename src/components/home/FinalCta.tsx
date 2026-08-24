import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import BookingButton from "@/components/ui/BookingButton";

export default function FinalCta() {
  return (
    <section className="border-y border-border bg-[#eae2d7] py-16 sm:py-20 md:py-24">
      <Container className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Nästa steg</span>
          <h2 className="text-balance mt-4 font-serif text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">Redo att ta hand om dig själv?</h2>
          <p className="mt-5 max-w-lg text-muted">Boka din behandling eller hitta ett alternativ som passar dina mål.</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <BookingButton>Boka din tid</BookingButton>
          <Button href="#hitta-ratt-behandling" variant="ghost">Hitta rätt behandling</Button>
        </div>
      </Container>
    </section>
  );
}
