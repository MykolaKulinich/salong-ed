import Container from "@/components/ui/Container";
import ContactLink from "@/components/ui/ContactLink";
import Breadcrumbs from "@/components/page/Breadcrumbs";
import BreadcrumbStructuredData from "@/components/page/BreadcrumbStructuredData";
import PresentkortOrderButton from "@/components/page/PresentkortOrderButton";
import PresentkortViewTracker from "@/components/page/PresentkortViewTracker";
import RelatedTreatments from "@/components/page/RelatedTreatments";
import { ROUTES } from "@/lib/routes";
import { CONTACT } from "@/lib/site";

const giftCardCategories = ["Ansikte", "Kropp", "Fransar", "Naglar"];

const orderSteps = [
  {
    number: "01",
    title: "Kontakta oss",
    description: "Ring eller skicka e-post och berätta vilket belopp eller vilken behandling du önskar.",
  },
  {
    number: "02",
    title: "Vi förbereder presentkortet",
    description: "Vi hjälper dig med upplägg och praktiska detaljer.",
  },
  {
    number: "03",
    title: "Ge bort något personligt",
    description: "Ett presentkort på Salong ED blir en gåva med tid för sig själv.",
  },
];

export default function GiftCardPage() {
  return (
    <>
      <BreadcrumbStructuredData current="Presentkort" path={ROUTES.giftCard} />
      <PresentkortViewTracker />

      <section className="border-b border-border bg-surface">
        <Container>
          <div className="py-6 sm:py-8">
            <Breadcrumbs current="Presentkort" />
          </div>

          <div className="grid gap-12 pb-16 sm:pb-20 md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-16 md:pb-24">
            <div>
              <div className="flex items-center gap-4">
                <span className="editorial-rule w-10" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Skönhetspresentkort</span>
              </div>
              <h1 className="mt-6 max-w-xl font-serif text-5xl leading-[1.02] tracking-[-0.025em] text-foreground sm:text-6xl">
                En personlig gåva
                <br className="hidden sm:block" /> för någon du tycker om.
              </h1>
              <p className="mt-7 max-w-xl text-base text-muted sm:text-lg">
                Ge bort en stund för avkoppling, skönhet och välmående hos Salong ED i Ursvik.
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                Presentkortet kan anpassas efter önskat belopp eller behandling och passar för exempelvis ansiktsbehandlingar, kroppsbehandlingar, fransar och naglar.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <PresentkortOrderButton />
                <ContactLink
                  kind="phone"
                  href={CONTACT.phoneHref}
                  className="inline-flex min-h-12 items-center border-b border-accent px-1 text-sm font-medium text-foreground transition-colors hover:text-accent"
                >
                  Kontakta Salong ED
                </ContactLink>
              </div>
            </div>

            <div className="relative aspect-[1.04] border border-accent/45 bg-[#ded1bf] p-8 text-foreground sm:p-12">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-accent">
                  <span>Salong ED</span>
                  <span>Ursvik</span>
                </div>
                <div>
                  <p className="font-serif text-4xl leading-none sm:text-5xl">Presentkort</p>
                  <p className="mt-3 text-sm tracking-[0.08em] text-foreground/70">En personlig gåva</p>
                </div>
                <div className="flex items-end justify-between border-t border-accent/35 pt-4 text-[10px] uppercase tracking-[0.22em] text-accent">
                  <span>Skönhet &amp; välmående</span>
                  <span className="font-serif text-xl normal-case tracking-normal">ED</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-24">
          <aside>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">En gåva som kan anpassas</span>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">Välj ett belopp eller en behandling</h2>
          </aside>
          <div className="border-t border-border">
            <div className="border-b border-border py-8 sm:py-10">
              <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                Du kan välja ett valfritt belopp eller låta presentkortet gälla för en specifik behandling.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                Har du svårt att välja hjälper vi gärna till att hitta något som passar mottagaren.
              </p>
              <ul className="mt-8 grid grid-cols-2 border-y border-border sm:grid-cols-4">
                {giftCardCategories.map((category) => (
                  <li key={category} className="border-r border-border px-4 py-5 text-sm text-foreground last:border-r-0 sm:px-5">
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface-muted py-16 sm:py-20 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-24">
          <aside>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Så beställer du</span>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">Så beställer du ditt presentkort</h2>
          </aside>
          <ol className="border-t border-border">
            {orderSteps.map((step) => (
              <li key={step.number} className="grid gap-4 border-b border-border py-7 sm:grid-cols-[3.5rem_1fr] sm:gap-6 sm:py-8">
                <span className="text-[10px] uppercase tracking-[0.22em] text-accent">{step.number}</span>
                <div>
                  <h3 className="font-serif text-2xl text-foreground">{step.title}</h3>
                  <p className="mt-3 max-w-2xl leading-relaxed text-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="bestall-presentkort" className="scroll-mt-24 bg-foreground py-14 text-background sm:py-18">
        <Container className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Beställ ditt presentkort</span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Beställ ditt presentkort</h2>
            <p className="mt-4 max-w-xl text-background/75">Kontakta Salong ED så hjälper vi dig att skapa ett presentkort som passar.</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <ContactLink kind="phone" href={CONTACT.phoneHref} className="underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent">{CONTACT.phone}</ContactLink>
              <ContactLink kind="email" href={CONTACT.emailHref} className="break-all underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent">{CONTACT.email}</ContactLink>
            </div>
          </div>
          <ContactLink kind="phone" href={CONTACT.phoneHref} className="inline-flex min-h-12 shrink-0 items-center justify-center border border-accent px-6 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-foreground">
            Kontakta Salong ED
          </ContactLink>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { title: "Fransar & naglar", href: ROUTES.lashesAndNails, description: "Se behandlingar som kan bli en personlig gåva." },
          { title: "Ansiktsbehandlingar", href: ROUTES.face, description: "Utforska behandlingar för hud och lyster." },
          { title: "Om Salong ED", href: ROUTES.about, description: "Lär känna salongen innan du väljer." },
        ]}
      />
    </>
  );
}
