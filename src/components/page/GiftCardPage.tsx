import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import BookingButton from "@/components/ui/BookingButton";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import Breadcrumbs from "@/components/page/Breadcrumbs";
import RelatedTreatments from "@/components/page/RelatedTreatments";
import { ROUTES } from "@/lib/routes";
import { CONTACT } from "@/lib/site";

export default function GiftCardPage() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <Container>
          <div className="py-6 sm:py-8"><Breadcrumbs current="Presentkort" /></div>
          <div className="grid gap-12 pb-16 sm:pb-20 md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-16 md:pb-24">
            <div>
              <div className="flex items-center gap-4"><span className="editorial-rule w-10" /><span className="text-[10px] uppercase tracking-[0.22em] text-accent">Ge bort skönhet</span></div>
              <h1 className="text-balance mt-6 font-serif text-5xl leading-[1.02] tracking-[-0.025em] text-foreground sm:text-6xl">Skönhetspresentkort i Ursvik.</h1>
              <p className="mt-7 max-w-xl text-base text-muted sm:text-lg">En stund för ansikte, kropp, fransar eller naglar kan vara ett fint sätt att ge någon tid för sig själv.</p>
              <div className="mt-9 flex flex-wrap gap-4"><BookingButton>Till Bokadirekt</BookingButton><Button href="#kontakt-presentkort" variant="ghost">Fråga salongen</Button></div>
            </div>
            <ImagePlaceholder label="Presentkortsfotografi behövs" aspect="aspect-[1.04]" tone="sand" />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 md:py-28"><Container className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-24"><aside><span className="text-[10px] uppercase tracking-[0.22em] text-accent">Så går du vidare</span><h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">En enkel väg till en personlig gåva.</h2></aside><div className="border-t border-border"><article className="border-b border-border py-8 sm:py-10"><h2 className="font-serif text-2xl sm:text-3xl">Köp via Bokadirekt</h2><p className="mt-4 text-muted">Bokadirekt listar presentkort som en köpmöjlighet för Salong ED. Använd länken ovan för att kontrollera aktuell information och tillgänglighet.</p></article><article id="kontakt-presentkort" className="scroll-mt-24 border-b border-border py-8 sm:py-10"><h2 className="font-serif text-2xl sm:text-3xl">Vill du fråga först?</h2><p className="mt-4 text-muted">Om du vill veta mer om valör, behandling eller praktiska detaljer kan du kontakta salongen direkt.</p><div className="mt-5 flex flex-wrap gap-4 text-sm"><a href={CONTACT.phoneHref} className="text-accent underline decoration-accent/40 underline-offset-4">{CONTACT.phone}</a><a href={CONTACT.emailHref} className="text-accent underline decoration-accent/40 underline-offset-4">{CONTACT.email}</a></div></article></div></Container></section>
      <section className="bg-foreground py-14 text-background sm:py-18"><Container className="flex flex-col justify-between gap-7 md:flex-row md:items-center"><div><span className="text-[10px] uppercase tracking-[0.22em] text-accent">Salong ED</span><h2 className="mt-3 font-serif text-3xl sm:text-4xl">Ge bort en stund i Ursvik.</h2></div><BookingButton variant="inverse">Boka en behandling</BookingButton></Container></section>
      <RelatedTreatments items={[{ title: "Fransar & naglar", href: ROUTES.lashesAndNails, description: "Se behandlingar som kan bli en personlig gåva." }, { title: "Ansiktsbehandlingar", href: ROUTES.face, description: "Utforska behandlingar för hud och lyster." }, { title: "Om Salong ED", href: ROUTES.about, description: "Lär känna salongen innan du väljer." }]} />
    </>
  );
}
