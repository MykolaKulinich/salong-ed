import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import BookingButton from "@/components/ui/BookingButton";
import ContactLink from "@/components/ui/ContactLink";
import Breadcrumbs from "@/components/page/Breadcrumbs";
import BreadcrumbStructuredData from "@/components/page/BreadcrumbStructuredData";
import RelatedTreatments from "@/components/page/RelatedTreatments";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { ROUTES } from "@/lib/routes";
import { absoluteUrl, CONTACT, SITE_URL } from "@/lib/site";
import Image from "next/image";
import { isLaserCampaignActive, LASER_CAMPAIGN_COPY } from "@/lib/laser-campaign";

// Verified against Salong ED's live Bokadirekt listing — the 8 laser hair
// removal services actually offered, with their booking durations.
const TREATMENT_AREAS = [
  { name: "Ansikte", duration: "15 min" },
  { name: "Överläpp", duration: "15 min" },
  { name: "Armhålor", duration: "15 min" },
  { name: "Bikinilinje", duration: "20 min" },
  { name: "Hela bikiniområdet", duration: "30 min" },
  { name: "Underben", duration: "25 min" },
  { name: "Hela ben", duration: "35 min" },
  { name: "Rygg och axlar", duration: "25 min" },
];

const PREP_ITEMS = [
  "Raka området cirka 24 timmar före behandlingen.",
  "Undvik vaxning, epilering och plockning före och mellan behandlingarna — hårroten behöver finnas kvar för att lasern ska kunna verka.",
  "Undvik solning och brun-utan-sol inför behandlingen, och skydda huden mot sol efteråt.",
  "Kom med ren hud på det område som ska behandlas, utan kräm, olja eller deodorant.",
];

const WHY_CHOOSE_ITEMS = [
  "Mindre behov av rakning i vardagen",
  "Mindre behov av vaxning och epilering",
  "Långvarig minskning av hårväxten",
  "Behandlingen anpassas efter område och dina individuella förutsättningar",
];

const WHY_SALONG_ED_ITEMS = [
  "Salong ED ligger på Marieborgsgatan 6 i Ursvik, Sundbyberg",
  "Personlig kontakt och ett upplägg som anpassas individuellt",
  "Behandlingen anpassas efter hud, hårfärg och behandlingsområde",
  "Enkel bokning online via Bokadirekt",
];

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Ljusenergi riktas mot pigmentet",
    description: "Diodlasern skickar ljusenergi som tas upp av pigmentet i håret.",
  },
  {
    number: "02",
    title: "Hårsäcken påverkas",
    description: "Ljusenergin omvandlas till värme som påverkar den aktiva hårsäcken.",
  },
  {
    number: "03",
    title: "Bäst effekt i tillväxtfas",
    description: "Hår som befinner sig i en aktiv tillväxtfas svarar normalt bäst på behandlingen.",
  },
  {
    number: "04",
    title: "Hårstrån växer i olika faser",
    description: "Alla hårstrån är inte i samma tillväxtfas samtidigt, så en enskild behandling räcker sällan.",
  },
  {
    number: "05",
    title: "En serie, individuellt anpassad",
    description: "Antal behandlingar och inställningar anpassas efter din hud, hårfärg och det område som behandlas.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Hur fungerar laserhårborttagning?",
    answer:
      "Diodlasern riktar ljusenergi mot pigmentet i håret, vilket påverkar den aktiva hårsäcken. Målet är en långvarig minskning av hårväxten. Eftersom hårstrån växer i olika faser byggs behandlingen normalt upp som en serie tillfällen.",
  },
  {
    question: "Hur många behandlingar behövs?",
    answer:
      "Det varierar utifrån området, hårets tillväxtcykel och dina individuella förutsättningar. De flesta behöver flera behandlingar över tid för bästa möjliga resultat — vi går igenom vad som är rimligt för dig vid bokning.",
  },
  {
    question: "Gör laserhårborttagning ont?",
    answer: "Upplevelsen varierar från person till person och mellan olika områden.",
  },
  {
    question: "Kan jag raka mig mellan behandlingarna?",
    answer:
      "Ja, rakning är den rekommenderade metoden mellan behandlingarna. Undvik däremot vaxning, epilering och plockning, eftersom lasern behöver hårroten kvar i huden.",
  },
  {
    question: "Hur ska jag förbereda mig inför behandlingen?",
    answer:
      "Raka området cirka 24 timmar före besöket och kom med ren hud utan kräm, olja eller deodorant på det som ska behandlas. Undvik vaxning, epilering och plockning samt solning eller brun-utan-sol inför behandlingen.",
  },
  {
    question: "Kan jag sola före eller efter laserbehandling?",
    answer:
      "Undvik solning och brun-utan-sol inför behandlingen, och skydda huden mot sol efteråt. Kontakta gärna Salong ED om huden är solbränd, irriterad eller mycket känslig.",
  },
  {
    question: "Fungerar laserhårborttagning på ljust hår?",
    answer:
      "Diodlaser har begränsad effekt på mycket ljust, grått och rött hår, eftersom tekniken bygger på pigmentet i håret. Är du osäker på om det passar din hårtyp går det bra att ta upp frågan i samband med bokning.",
  },
  {
    question: "Var ligger Salong ED?",
    answer: "Salong ED finns på Marieborgsgatan 6, 174 62 Sundbyberg, i Ursvik.",
  },
];

function ServiceStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Laserhårborttagning",
    name: "Laserhårborttagning i Sundbyberg & Ursvik",
    description:
      "Laserhårborttagning med diodlaser hos Salong ED i Ursvik, Sundbyberg. Behandlingen anpassas efter hud, hårfärg och behandlingsområde.",
    url: absoluteUrl(ROUTES.laser),
    areaServed: [
      { "@type": "Place", name: "Sundbyberg" },
      { "@type": "Place", name: "Ursvik" },
    ],
    provider: { "@id": `${SITE_URL}/#salong-ed` },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />;
}

function FaqStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />;
}

/** Compact, bordered champagne-accent element — never a loud sale badge. */
function CampaignNote({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex flex-col gap-1.5 border border-accent/40 px-5 py-4 sm:flex-row sm:items-center sm:gap-4 ${className}`}>
      <span className="shrink-0 text-[10px] uppercase tracking-[0.22em] text-accent">{LASER_CAMPAIGN_COPY.badge}</span>
      <p className="text-sm text-foreground/85">{LASER_CAMPAIGN_COPY.heroNote}</p>
    </div>
  );
}

export default function LaserHairRemovalPage() {
  const campaignActive = isLaserCampaignActive();
  const bookingLabel = campaignActive ? LASER_CAMPAIGN_COPY.bookingCta : "Boka laserhårborttagning";

  return (
    <>
      <BreadcrumbStructuredData current="Laserhårborttagning" path={ROUTES.laser} />
      <ServiceStructuredData />
      <FaqStructuredData />

      <section className="border-b border-border bg-surface">
        <Container>
          <div className="py-6 sm:py-8">
            <Breadcrumbs current="Laserhårborttagning" />
          </div>
          <div className="grid gap-12 pb-16 sm:pb-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16 lg:pb-24">
            <div>
              {campaignActive && <CampaignNote className="mb-7 max-w-xl" />}

              <div className="flex items-center gap-4">
                <span className="editorial-rule w-10" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Diodlaser · hårreduktion</span>
              </div>
              <h1 className="text-balance mt-6 font-serif text-4xl leading-[1.02] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-6xl">
                Laserhårborttagning i Sundbyberg &amp; Ursvik
              </h1>
              <p className="text-pretty mt-7 max-w-xl text-base text-muted sm:text-lg">
                För dig som vill minska oönskad hårväxt med laser. Hos Salong ED i Ursvik anpassas behandlingen efter
                område, hårtyp och hud, för en trygg och individuell laserhårborttagning.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <BookingButton>{bookingLabel}</BookingButton>
                <Button href="#sa-fungerar" variant="ghost" className="group pl-0">
                  Så fungerar behandlingen <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="relative aspect-[1.08] w-full overflow-hidden border border-border bg-[#f2ede5] sm:aspect-[1.2] lg:aspect-[1.03]">
                <Image
                  src="/images/salong-ed/laser/laserharborttagning-hero.webp"
                  alt="Laserhårborttagning på ben med diodlaser"
                  fill
                  preload
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="object-cover object-[58%_50%]"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background">
        <Container className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex flex-col gap-2 px-0 py-6 sm:px-6 sm:py-8 first:sm:pl-0 last:sm:pr-0">
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent">Teknik</span>
            <span className="font-serif text-xl text-foreground">Diodlaser</span>
          </div>
          <div className="flex flex-col gap-2 px-0 py-6 sm:px-6 sm:py-8 first:sm:pl-0 last:sm:pr-0">
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent">Behandlingsområden</span>
            <span className="font-serif text-xl text-foreground">8 områden — ansikte till rygg</span>
          </div>
          <div className="flex flex-col gap-2 px-0 py-6 sm:px-6 sm:py-8 first:sm:pl-0 last:sm:pr-0">
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent">Plats</span>
            <span className="font-serif text-xl text-foreground">Ursvik, Sundbyberg</span>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-24">
          <aside>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Om behandlingen</span>
            <h2 className="text-balance mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
              Vad du bör veta innan du bokar
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted">
              Laserhårborttagning är en behandling som byggs upp över tid. Här är grunderna innan du bokar din första tid.
            </p>
          </aside>

          <div className="border-t border-border">
            <article className="border-b border-border py-8 sm:py-10">
              <div className="flex gap-5 sm:gap-8">
                <span className="pt-1 font-serif text-lg text-accent">01</span>
                <div className="max-w-2xl">
                  <h2 className="font-serif text-2xl text-foreground sm:text-3xl">Vad är laserhårborttagning?</h2>
                  <p className="mt-4 text-muted">
                    Laserhårborttagning med diodlaser riktar ljusenergi mot pigmentet i håret och påverkar hårsäcken.
                    Målet är en långvarig minskning av hårväxten — inte ett resultat efter en enda behandling. Eftersom
                    hårstrån växer i olika faser byggs laserhårborttagning normalt upp som en serie behandlingar,
                    anpassade efter din hud och hårfärg.
                  </p>
                </div>
              </div>
            </article>
            <article className="border-b border-border py-8 sm:py-10">
              <div className="flex gap-5 sm:gap-8">
                <span className="pt-1 font-serif text-lg text-accent">02</span>
                <div className="max-w-2xl">
                  <h2 className="font-serif text-2xl text-foreground sm:text-3xl">Därför väljer många laserhårborttagning</h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {WHY_CHOOSE_ITEMS.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </Container>
      </section>

      <section id="sa-fungerar" className="scroll-mt-24 border-y border-border bg-surface-muted py-16 sm:py-20 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-24">
          <aside>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Steg för steg</span>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">Så fungerar laserhårborttagning</h2>
          </aside>
          <ol className="border-t border-border">
            {HOW_IT_WORKS_STEPS.map((step) => (
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

      <section className="py-16 sm:py-20 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-24">
          <aside>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Behandlingsområden</span>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">Områden vi behandlar</h2>
            <p className="mt-5 text-sm leading-7 text-muted">
              Nedan ser du de områden Salong ED erbjuder laserhårborttagning för. Aktuella priser och lediga tider hittar
              du via Bokadirekt.
            </p>
            <BookingButton className="mt-7">Se aktuella priser och boka</BookingButton>
          </aside>

          <div>
            <ul className="grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
              {TREATMENT_AREAS.map((area) => (
                <li key={area.name} className="flex items-center justify-between gap-4 border-b border-border py-3 text-sm text-foreground/85">
                  <span className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 shrink-0 text-accent" />
                    {area.name}
                  </span>
                  <span className="text-xs text-muted">{area.duration}</span>
                </li>
              ))}
            </ul>

            {campaignActive && (
              <div className="mt-8 border border-accent/40 px-6 py-6 sm:px-8">
                <span className="text-[10px] uppercase tracking-[0.22em] text-accent">{LASER_CAMPAIGN_COPY.badge}</span>
                <p className="mt-2 font-serif text-xl text-foreground">
                  {LASER_CAMPAIGN_COPY.heroNote}
                </p>
                <p className="mt-2 text-sm text-muted">Gäller Salong ED:s laserhårborttagning, samtliga behandlingsområden ovan. {LASER_CAMPAIGN_COPY.scopeNote}</p>
                <BookingButton variant="secondary" size="sm" className="mt-5">
                  Se tider och boka
                </BookingButton>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-16 sm:py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-24">
          <aside>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Bra att veta</span>
            <h2 className="text-balance mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
              Inför och mellan dina behandlingar
            </h2>
          </aside>

          <div className="border-t border-border">
            <article className="border-b border-border py-8 sm:py-10">
              <div className="flex gap-5 sm:gap-8">
                <span className="pt-1 font-serif text-lg text-accent">01</span>
                <div className="max-w-2xl">
                  <h2 className="font-serif text-2xl text-foreground sm:text-3xl">Inför din laserbehandling</h2>
                  <ul className="mt-5 flex flex-col gap-3">
                    {PREP_ITEMS.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
            <article className="border-b border-border py-8 sm:py-10">
              <div className="flex gap-5 sm:gap-8">
                <span className="pt-1 font-serif text-lg text-accent">02</span>
                <div className="max-w-2xl">
                  <h2 className="font-serif text-2xl text-foreground sm:text-3xl">Hur många behandlingar behövs?</h2>
                  <p className="mt-4 text-muted">
                    Antalet behandlingar varierar utifrån området, hårets tillväxtcykel och dina individuella
                    förutsättningar. Eftersom hårstrån växer i olika faser byggs laserhårborttagning normalt upp som en
                    serie behandlingar snarare än ett enda tillfälle. Vid din bokning går vi igenom vad som är rimligt
                    för just dina behov.
                  </p>
                </div>
              </div>
            </article>
            <article className="py-8 sm:py-10">
              <div className="flex gap-5 sm:gap-8">
                <span className="pt-1 font-serif text-lg text-accent">03</span>
                <div className="max-w-2xl">
                  <h2 className="font-serif text-2xl text-foreground sm:text-3xl">Hår- och hudtyp — vad påverkar resultatet?</h2>
                  <p className="mt-4 text-muted">
                    Resultatet påverkas av pigmentet i håret. Diodlaser har begränsad effekt på mycket ljust, grått och
                    rött hår, eftersom tekniken bygger på att kunna reagera på pigment. Är du osäker på om
                    laserhårborttagning passar din hårtyp går det bra att ta upp frågan i samband med bokning.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface-muted py-16 sm:py-20 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Lokalt i Ursvik</span>
            <h2 className="mt-4 max-w-md font-serif text-3xl leading-tight text-foreground sm:text-4xl">
              Laserhårborttagning hos Salong ED
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-base leading-relaxed text-muted">
              Salong ED ligger på Marieborgsgatan 6 i Ursvik, Sundbyberg. Här får du laserhårborttagning med personlig
              kontakt, i en lugn salongsmiljö, med ett upplägg som anpassas efter dina förutsättningar snarare än en
              standardmall.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {WHY_SALONG_ED_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-5 text-sm">
              <Link href={ROUTES.face} className="border-b border-accent pb-1 text-foreground hover:text-accent">Ansiktsbehandlingar</Link>
              <Link href={ROUTES.body} className="border-b border-accent pb-1 text-foreground hover:text-accent">Kroppsbehandlingar</Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20 md:py-24">
        <Container className="max-w-4xl">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Vanliga frågor</span>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">Frågor om laserhårborttagning</h2>
          </div>
          <div className="mt-10 border-t border-border">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="group border-b border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-serif text-xl text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span aria-hidden="true" className="font-sans text-2xl font-light text-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-3xl pb-6 pr-10 leading-relaxed text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-foreground py-14 text-background sm:py-18">
        <Container className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Nästa steg</span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Redo att boka laserhårborttagning?</h2>
            <p className="mt-4 max-w-xl text-background/75">
              Boka en tid via Bokadirekt, eller kontakta Salong ED om du har frågor innan din första behandling.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <ContactLink kind="phone" href={CONTACT.phoneHref} className="underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent">{CONTACT.phone}</ContactLink>
              <ContactLink kind="email" href={CONTACT.emailHref} className="break-all underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent">{CONTACT.email}</ContactLink>
            </div>
          </div>
          <BookingButton variant="inverse">{bookingLabel}</BookingButton>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { title: "Ansiktsbehandlingar", href: ROUTES.face, description: "Hudvård och ansiktsbehandlingar i Ursvik." },
          { title: "Kroppsbehandlingar", href: ROUTES.body, description: "Fler behandlingar för kropp och välmående." },
          { title: "Om Salong ED", href: ROUTES.about, description: "Lär känna salongen och Ewelina Dubowska." },
        ]}
      />
    </>
  );
}
