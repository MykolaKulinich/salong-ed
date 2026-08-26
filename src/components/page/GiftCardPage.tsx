import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import ContactLink from "@/components/ui/ContactLink";
import Breadcrumbs from "@/components/page/Breadcrumbs";
import BreadcrumbStructuredData from "@/components/page/BreadcrumbStructuredData";
import GiftCardConfigurator from "@/components/page/GiftCardConfigurator";
import PresentkortOrderButton from "@/components/page/PresentkortOrderButton";
import PresentkortViewTracker from "@/components/page/PresentkortViewTracker";
import RelatedTreatments from "@/components/page/RelatedTreatments";
import { ROUTES } from "@/lib/routes";
import { CONTACT } from "@/lib/site";

const orderSteps = [
  {
    number: "01",
    title: "Skapa ditt presentkort",
    description: "Välj ett belopp och gör gåvan personlig med mottagarens namn, en hälsning eller en önskad behandling.",
  },
  {
    number: "02",
    title: "Betala efter bekräftelse",
    description: "Vi kontaktar dig med betalningsinformation och bekräftar beställningen tillsammans.",
  },
  {
    number: "03",
    title: "Presentkortet skickas",
    description: "När betalningen har bekräftats skickas presentkortet till den e-postadress du har valt.",
  },
];

const faqItems = [
  {
    question: "Hur fungerar presentkort hos Salong ED?",
    answer: "Du väljer ett belopp från 100 kr, fyller i dina uppgifter och skickar en beställningsförfrågan. Vi kontaktar dig med betalningsinformation. Presentkortet skickas först efter att betalningen har bekräftats.",
  },
  {
    question: "Måste jag välja en behandling?",
    answer: "Nej. Presentkortet är alltid kopplat till ett belopp. Du kan skriva en önskad behandling som en valfri preferens, men du behöver inte veta exakt vad mottagaren vill ha.",
  },
  {
    question: "Kan jag själv välja belopp?",
    answer: "Ja. Välj 500, 1 000, 1 500 eller 2 000 kr, eller ange ett annat helt belopp mellan 100 och 100 000 kr.",
  },
  {
    question: "Kan presentkortet skickas direkt till mottagaren?",
    answer: "Ja. Du kan välja mottagarens e-postadress som leveransmål. E-postadressen behövs då i beställningen.",
  },
  {
    question: "När skickas presentkortet?",
    answer: "Presentkortet skickas efter att Salong ED har bekräftat betalningen. Det skickas inte automatiskt när beställningsförfrågan lämnas in.",
  },
  {
    question: "Hur betalar jag?",
    answer: "Vi kontaktar dig efter beställningen med betalningsinformation. Betalningen verifieras manuellt av Salong ED.",
  },
  {
    question: "Kan mottagaren välja en annan behandling?",
    answer: "Ja. Presentkortet gäller ett belopp, så mottagaren kan välja behandling efter sina önskemål och presentkortets värde.",
  },
  {
    question: "Hur kontaktar jag Salong ED om jag har frågor?",
    answer: "Du kan ringa 076 066 81 97 eller skicka e-post till Ewelinadubowska@gmail.com.",
  },
];

function FaqStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />;
}

export default function GiftCardPage() {
  return (
    <>
      <BreadcrumbStructuredData current="Presentkort" path={ROUTES.giftCard} />
      <FaqStructuredData />
      <PresentkortViewTracker />

      <section className="border-b border-border bg-background">
        <Container>
          <div className="py-5 sm:py-7">
            <Breadcrumbs current="Presentkort" />
          </div>

          <div className="grid gap-12 pb-14 sm:pb-20 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16 lg:pb-24">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent">Presentkort</span>
              <h1 className="text-balance mt-5 max-w-xl font-serif text-[2.75rem] leading-[0.98] tracking-[-0.035em] text-foreground sm:text-6xl">
                En personlig gåva för någon du tycker om.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                Ge bort en stund för skönhet, välmående och tid för sig själv hos Salong ED i Ursvik.
              </p>
              <p className="mt-4 text-sm text-muted">
                Välj valfritt belopp från 100 kr. Presentkortet skickas efter bekräftad betalning.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <PresentkortOrderButton />
                <ContactLink
                  kind="phone"
                  href={CONTACT.phoneHref}
                  className="inline-flex min-h-12 items-center border-b border-accent px-1 text-sm font-medium text-foreground transition-colors hover:text-accent"
                >
                  Kontakta salongen
                </ContactLink>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="image-hover-zoom relative aspect-[4/3] w-full overflow-hidden border border-border shadow-[0_40px_70px_-35px_rgba(76,58,34,0.45)]">
                <Image
                  src="/images/salong-ed/presentkort/presentkort-hero.webp"
                  alt="Presentkort från Salong ED i Ursvik"
                  fill
                  preload
                  sizes="(min-width: 1024px) 46vw, (min-width: 640px) 80vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <GiftCardConfigurator />

      <section className="bg-background py-16 sm:py-20 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">En gåva med mening</span>
            <h2 className="mt-4 max-w-md font-serif text-3xl leading-tight text-foreground sm:text-4xl">
              En personlig present när du vill ge något mer än en sak
            </h2>
          </div>
          <div className="grid gap-6 text-base leading-relaxed text-muted sm:grid-cols-2 sm:gap-10">
            <p>
              Ett presentkort hos Salong ED ger mottagaren tid för sig själv – en stund av skönhet, välmående och omtanke. Det passar lika fint som present till en partner, flickvän, fru eller vän som till en födelsedag, årsdag, Alla hjärtans dag, Mors dag eller jul.
            </p>
            <p>
              Eftersom presentkortet alltid gäller ett belopp kan mottagaren välja det som känns rätt. Du behöver bara välja summan och kan lämna behandlingen tom om du är osäker.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface-muted py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Bra att veta</span>
            <h2 className="mt-4 max-w-md font-serif text-3xl leading-tight text-foreground sm:text-4xl">
              Osäker på vilken behandling du ska välja?
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-relaxed text-foreground">
              Du behöver inte känna till mottagarens exakta önskemål.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Välj ett belopp och skriv eventuellt en önskad behandling som en liten ledtråd. Sedan kan mottagaren och Salong ED ta hand om detaljerna utifrån presentkortets värde. Utforska gärna våra <Link href={ROUTES.face} className="underline decoration-accent underline-offset-4 hover:text-accent">ansiktsbehandlingar</Link>, <Link href={ROUTES.body} className="underline decoration-accent underline-offset-4 hover:text-accent">kroppsbehandlingar</Link> eller <Link href={ROUTES.lashesAndNails} className="underline decoration-accent underline-offset-4 hover:text-accent">fransar och naglar</Link> för inspiration.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background py-16 sm:py-20 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Lokalt nära dig</span>
            <h2 className="mt-4 max-w-md font-serif text-3xl leading-tight text-foreground sm:text-4xl">Presentkort hos Salong ED i Ursvik</h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-base leading-relaxed text-muted">
              Salong ED finns på Marieborgsgatan i Ursvik, Sundbyberg, med behandlingar för skönhet och välmående. Ett presentkort är ett enkelt sätt att ge bort en personlig upplevelse nära Stockholm – utan att behöva bestämma allt i förväg.
            </p>
            <div className="mt-5 flex flex-wrap gap-5 text-sm">
              <Link href={ROUTES.icoone} className="border-b border-accent pb-1 text-foreground hover:text-accent">Icoone LaserMed</Link>
              <Link href={ROUTES.exilis} className="border-b border-accent pb-1 text-foreground hover:text-accent">Exilis Ultra 360</Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-surface-muted py-16 sm:py-20 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-24">
          <aside>
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Så går det till</span>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">En enkel väg till en personlig gåva</h2>
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

      <section className="bg-background py-16 sm:py-20 md:py-24">
        <Container className="max-w-4xl">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Vanliga frågor</span>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">Frågor om presentkort</h2>
          </div>
          <div className="mt-10 border-t border-border">
            {faqItems.map((item) => (
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
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Frågor om presentkort?</span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Kontakta salongen</h2>
            <p className="mt-4 max-w-xl text-background/75">Vi hjälper dig gärna om du vill bolla en gåva eller har frågor om beställningen.</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <ContactLink kind="phone" href={CONTACT.phoneHref} className="underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent">{CONTACT.phone}</ContactLink>
              <ContactLink kind="email" href={CONTACT.emailHref} className="break-all underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent">{CONTACT.email}</ContactLink>
            </div>
          </div>
          <ContactLink kind="phone" href={CONTACT.phoneHref} className="inline-flex min-h-12 shrink-0 items-center justify-center border border-accent px-6 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-foreground">
            Kontakta salongen
          </ContactLink>
        </Container>
      </section>

      <RelatedTreatments
        items={[
          { title: "Ansiktsbehandlingar", href: ROUTES.face, description: "Behandlingar för hud, lyster och välmående." },
          { title: "Kroppsbehandlingar", href: ROUTES.body, description: "Utforska behandlingar för kropp och avkoppling." },
          { title: "Icoone LaserMed", href: ROUTES.icoone, description: "Modern teknik för kropp och hud." },
          { title: "Exilis Ultra 360", href: ROUTES.exilis, description: "Läs mer om en av salongens tekniker." },
          { title: "Fransar & naglar", href: ROUTES.lashesAndNails, description: "Detaljer som gör gåvan personlig." },
        ]}
      />
    </>
  );
}
