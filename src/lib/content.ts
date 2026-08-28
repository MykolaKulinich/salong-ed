import { ROUTES } from "@/lib/routes";
import { BOOKING_HREF } from "@/lib/site";
import type { Tone } from "@/lib/tone";

export type PageSection = {
  title: string;
  intro?: string;
  body?: string;
  bullets?: string[];
};

export type RelatedTreatment = {
  title: string;
  href: string;
  description: string;
};

/** An approved photograph/product shot for a treatment page. */
export type TreatmentVisual = {
  src: string;
  alt: string;
  /** "cover" for real photography, "contain" for device shots with transparent backgrounds. Defaults to "cover". */
  fit?: "cover" | "contain";
  /** Tailwind object-position utility, e.g. "object-top". Defaults to centered. */
  position?: string;
  /** Aspect-ratio utility for the visual stage. Defaults to "aspect-[4/3]" for supporting images and "aspect-[1.03]" for hero images. */
  aspectClass?: string;
  /** Optional padding override for transparent product photography optical sizing. */
  imageClassName?: string;
};

export type TreatmentPageData = {
  path: string;
  eyebrow: string;
  title: string;
  intro: string;
  visualLabel: string;
  visualTone: Tone;
  /** Approved hero photography/product shot. Falls back to ImagePlaceholder when absent. */
  visualImage?: TreatmentVisual;
  /** Optional supporting image shown alongside the "Om behandlingen" intro text. */
  secondaryVisual?: TreatmentVisual;
  /** Additional supporting visuals shown alongside the "Om behandlingen" intro text. */
  supportingVisuals?: TreatmentVisual[];
  highlights?: { label: string; value: string }[];
  sections: PageSection[];
  note?: string;
  related: RelatedTreatment[];
};

export const ICOONE_PAGE: TreatmentPageData = {
  path: ROUTES.icoone,
  eyebrow: "Avancerad kroppsbehandling",
  title: "Icoone LaserMed i Sundbyberg & Ursvik",
  intro: "Icoone LaserMed är en kroppsbehandling som använder mikrostimulering och vakuumteknik. På Salong ED erbjuds behandlingen med fokus på ett personligt upplägg för kroppens olika områden.",
  visualLabel: "Icoone-fotografi behövs",
  visualTone: "sand",
  visualImage: {
    src: "/images/salong-ed/devices/icoone-lasermed.png",
    alt: "Icoone LaserMed",
    fit: "contain",
    imageClassName: "p-8 sm:p-12",
  },
  highlights: [
    { label: "Teknik", value: "Mikrostimulering & vakuum" },
    { label: "Områden", value: "Ben, mage, rumpa & armar" },
    { label: "Plats", value: "Ursvik, Sundbyberg" },
  ],
  sections: [
    {
      title: "Vad är Icoone LaserMed?",
      body: "Den befintliga Salong ED-sidan beskriver Icoone LaserMed som en innovativ kroppsbehandling med mikrostimulering och vakuumteknik. Behandlingen kan anpassas för områden som ben, mage, rumpa och armar.",
    },
    {
      title: "Ett upplägg för dina önskemål",
      body: "Icoone kan vara relevant för dig som vill arbeta med hudens struktur, synliga celluliter, cirkulation eller kroppens form. Mål och upplägg gårs igenom individuellt innan behandling.",
      bullets: ["Hudens struktur och ojämnheter", "Cirkulation och känslan av lätthet", "Kroppens form och hudens spänst", "Ben, mage, rumpa eller armar"],
    },
    {
      title: "Boka din Icoone-behandling",
      body: "Du bokar enkelt online via Bokadirekt. Välj en tid som passar och ta gärna upp dina mål och frågor med Salong ED innan behandlingen.",
    },
  ],
  note: "Resultat och lämplighet varierar individuellt. En individuell bedömning görs vid behov innan behandling.",
  related: [
    { title: "Kroppsbehandlingar", href: ROUTES.body, description: "Utforska fler behandlingar för kropp och välmående." },
    { title: "Exilis Ultra 360", href: ROUTES.exilis, description: "Läs om ytterligare en teknik för kropp och ansikte." },
    { title: "ScarNik Scar", href: ROUTES.scarnik, description: "Läs om Salong ED:s ScarNik-sida." },
  ],
};

export const EXILIS_PAGE: TreatmentPageData = {
  path: ROUTES.exilis,
  eyebrow: "Avancerad teknik",
  title: "Exilis Ultra 360 i Sundbyberg",
  intro: "Exilis Ultra 360 är ett icke-invasivt system för hudföryngring och kroppsskulptering som kombinerar ultraljud och radiofrekvens. Hos Salong ED finns alternativ för både ansikte och kropp.",
  visualLabel: "Exilis-fotografi behövs",
  visualTone: "sand",
  visualImage: {
    src: "/images/salong-ed/devices/exilis-ultra-360.png",
    alt: "Exilis Ultra 360",
    fit: "contain",
    imageClassName: "p-6 sm:p-9",
  },
  highlights: [
    { label: "Teknik", value: "Ultraljud & radiofrekvens" },
    { label: "Behandlingsområden", value: "Ansikte, hals & kropp" },
    { label: "Plats", value: "Ursvik, Sundbyberg" },
  ],
  sections: [
    {
      title: "Vad är Exilis Ultra 360?",
      body: "Den befintliga sidan beskriver Exilis Ultra 360 som ett system för hudföryngring och kroppsskulptering. Tekniken kombinerar ultraljud och radiofrekvens för att värma upp underhudsvävnad och dermis.",
    },
    {
      title: "Behandlingsområden",
      body: "Bokningsalternativen hos Salong ED omfattar bland annat ansikte, ansikte/hals/dekolletage, armar, mage, kärlekshandtag och ridlår. Vilket alternativ som är relevant beror på dina önskemål och den individuella bedömningen.",
      bullets: ["Ansikte", "Ansikte, hals och dekolletage", "Armar", "Mage och kärlekshandtag", "Ridlår"],
    },
    {
      title: "Inför din bokning",
      body: "Boka en tid via Bokadirekt och välj det alternativ som bäst motsvarar ditt önskade område. Om du är osäker kan du ta upp frågan med Salong ED innan behandling.",
    },
  ],
  note: "Resultat och lämplighet varierar individuellt. Informationen på sidan är översiktlig och ersätter inte en individuell bedömning.",
  related: [
    { title: "Kroppsbehandlingar", href: ROUTES.body, description: "Se fler behandlingar för kropp och kroppens välmående." },
    { title: "Icoone LaserMed", href: ROUTES.icoone, description: "Jämför med Salong ED:s andra teknikbehandling." },
    { title: "Ansiktsbehandlingar", href: ROUTES.face, description: "Utforska ansiktsbehandlingar och hudvård." },
  ],
};

export const FACE_PAGE: TreatmentPageData = {
  path: ROUTES.face,
  eyebrow: "Ansikte & hud",
  title: "Ansiktsbehandlingar i Ursvik",
  intro: "Hos Salong ED finns ansiktsbehandlingar med olika inriktningar — från rengöring och infusion till peeling, mikronålar, laser och IPL. Läs om alternativen och boka den tid som passar dina mål.",
  visualLabel: "Ansiktsbild behövs",
  visualTone: "blush",
  visualImage: { src: "/images/treatments/ansiktsbehandlingar-treatment.webp", alt: "Ansiktsbehandling på Salong ED", position: "object-top" },
  secondaryVisual: { src: "/images/treatments/ansiktsbehandling-real-session.webp", alt: "Ansiktsbehandling i praktiken på Salong ED", aspectClass: "aspect-[4/3]" },
  sections: [
    { title: "Vätebehandling / Hydrogen cleansing", intro: "Flerfasig hudrengöring med aktiv vätebehandling, hydropeeling och exfoliering med syrabaserade preparat." },
    { title: "Syreinfusion", intro: "En ansiktsbehandling med koncentrerat syre och aktiva ingredienser som vitaminer, hyaluronsyra och antioxidanter." },
    { title: "Termolifting – mikronålsradiofrekvens", intro: "Kombinerar mikronålar och radiofrekvens med fokus på hudens struktur, elasticitet och spänst." },
    { title: "HIFU", intro: "Fokuserat ultraljud för ansikte och kropp. Den befintliga sidan beskriver behandlingen med inriktning på uppstramning och hudföryngring." },
    { title: "BIOREPEEL", intro: "En kemisk peeling som kombinerar exfolierande ingredienser med en närande och föryngrande inriktning." },
    { title: "DR PEN", intro: "Mikronålsbehandling för hudens struktur, ton och spänst, med användningsområden som ansikte, hals och dekolletage." },
    { title: "Ablativ fraktionerad CO₂-laser", intro: "Laserbehandling med fokus på hudens struktur, ärr, linjer och ojämn hudton." },
    { title: "Koldioxidlaser / Black Doll", intro: "Koldioxidlaser i kombination med aktivt kol för rengöring och hudens lyster." },
    { title: "Karboksyterapi", intro: "En behandling med medicinskt koldioxid som på den befintliga sidan kopplas till hudens fasthet, elasticitet och cirkulation." },
    { title: "E-LIGHT IPL + RF", intro: "IPL och radiofrekvens med inriktning på pigmentering, hudton och hudens struktur." },
    { title: "RETIX C", intro: "En ansiktsbehandling med retinol och C-vitamin för hudens struktur, ton och lyster." },
  ],
  note: "Behandlingens innehåll, lämplighet och förväntningar gås igenom individuellt. Boka gärna en tid för att prata om dina mål.",
  related: [
    { title: "Ögonbehandlingar", href: ROUTES.eyes, description: "Behandlingar med fokus på huden runt ögonen." },
    { title: "Exilis Ultra 360", href: ROUTES.exilis, description: "En teknikbehandling med alternativ för ansikte." },
    { title: "Fransar & naglar", href: ROUTES.lashesAndNails, description: "Komplettera din stund med detaljer för blick och händer." },
    { title: "Laserhårborttagning", href: ROUTES.laser, description: "Långvarig hårreduktion för bland annat ansikte och överläpp." },
  ],
};

export const BODY_PAGE: TreatmentPageData = {
  path: ROUTES.body,
  eyebrow: "Kropp & välmående",
  title: "Kroppsbehandlingar i Ursvik",
  intro: "Salong ED:s kroppsbehandlingar omfattar bland annat presoterapi, vakuumterapi, kroppsinpackningar, fettreducering och muskelstimulering. Upplägget anpassas efter område och önskemål.",
  visualLabel: "Kroppsbild behövs",
  visualTone: "sand",
  visualImage: { src: "/images/treatments/kroppsbehandlingar-treatment.webp", alt: "Kroppsbehandling på Salong ED", position: "object-top" },
  sections: [
    { title: "Presoterapi", intro: "En behandling med kompression som på den befintliga sidan beskrivs med fokus på lymfsystem, cirkulation och känslan av lätthet." },
    { title: "Primelle", intro: "Vakuumterapi med mekanisk massage och fokus på kroppens form samt hudens utseende." },
    { title: "Kriolipolys", intro: "En behandling som använder kyla och på den befintliga sidan presenteras för lokala områden och kroppens kontur." },
    { title: "Lipolaser Xante", intro: "Laserbehandling som på den befintliga sidan beskrivs med inriktning på kroppens omfång och hudens spänst." },
    { title: "Arosha Bandage", intro: "Kroppsinpackning med aktiva ingredienser och kompression, med fokus på hudens utseende och kroppens form." },
    { title: "Injektionslipolys", intro: "En behandling med injektioner som på den befintliga sidan kopplas till lokala områden och kroppens kontur." },
    { title: "SCULPT", intro: "En modern metod med elektromagnetisk teknologi som på den befintliga sidan presenteras för muskelstimulering och kroppens form." },
  ],
  note: "Kroppsbehandlingar passar olika önskemål. Boka en tid för att gå igenom område, mål och vilken behandling som kan vara relevant.",
  related: [
    { title: "Icoone LaserMed", href: ROUTES.icoone, description: "Läs om mikrostimulering och vakuumteknik." },
    { title: "Exilis Ultra 360", href: ROUTES.exilis, description: "Utforska en annan teknik för kropp och ansikte." },
    { title: "ScarNik Scar", href: ROUTES.scarnik, description: "Läs om arbete med ärrens utseende och komfort." },
    { title: "Laserhårborttagning", href: ROUTES.laser, description: "Långvarig hårreduktion för ben, armhålor, bikini och fler områden." },
  ],
};

export const EYES_PAGE: TreatmentPageData = {
  path: ROUTES.eyes,
  eyebrow: "Ögonområdet",
  title: "Behandlingar för ögonområdet",
  intro: "Salong ED:s befintliga sida samlar behandlingar för den känsliga huden runt ögonen — från revitaliserande hudvård till tekniker och mesoterapi.",
  visualLabel: "Ögonbild behövs",
  visualTone: "blush",
  visualImage: { src: "/images/treatments/ogonbehandlingar-editorial.webp", alt: "Behandling för ögonområdet på Salong ED" },
  sections: [
    { title: "RETIX C EYE", intro: "En revitaliserande behandling för huden runt ögonen med retinol, berylliumsyra och floretyn." },
    { title: "STYLEYE", intro: "En kombination av aktiva preparat, vibrationer, LED-ljus och radiovågor med fokus på ögonområdets hud." },
    { title: "Plasma", intro: "Den befintliga sidan beskriver Plasma som en teknik för hudens struktur och ålderstecken runt ögonen." },
    { title: "Lumi Eyes", intro: "En mesoterapiprodukt för ögonområdet och tårkanalen som presenteras på den befintliga Salong ED-sidan." },
  ],
  note: "Ögonområdet är känsligt. Behandlingens lämplighet och upplägg behöver bedömas individuellt.",
  related: [
    { title: "Ansiktsbehandlingar", href: ROUTES.face, description: "Utforska behandlingar för ansikte och hud." },
    { title: "Fransar & naglar", href: ROUTES.lashesAndNails, description: "Skapa en komplett stund för blick och detaljer." },
    { title: "Boka tid", href: BOOKING_HREF, description: "Se tillgängliga tider hos Salong ED." },
  ],
};

export const LASHES_AND_NAILS_PAGE: TreatmentPageData = {
  path: ROUTES.lashesAndNails,
  eyebrow: "Fransar & naglar",
  title: "Fransar och naglar i Ursvik",
  intro: "Från naturligt definierade fransar till volym, lashlift och välgjorda naglar — Salong ED:s utbud samlar behandlingar för blick, händer och fötter.",
  visualLabel: "Frans- och nagelbild behövs",
  visualTone: "sand",
  visualImage: { src: "/images/treatments/fransar-closeup.webp", alt: "Fransar på Salong ED" },
  secondaryVisual: { src: "/images/treatments/naglar-champagne.webp", alt: "Naglar på Salong ED", aspectClass: "aspect-square" },
  sections: [
    {
      title: "Fransar",
      body: "På den befintliga sidan presenteras flera uttryck och nivåer av fransförlängning samt behandlingar för lyft och färg.",
      bullets: ["Singelfransar 1:1", "Light volym 2/3 D", "Medium volym 4/5 D", "MegaVolym 6/8 D", "Eyeliner", "Lifting / Botox, fransar lamination"],
    },
    {
      title: "Naglar",
      body: "Bokningsutbudet omfattar bland annat klassisk manikyr, gellack, nytt set och påfyllning samt pedikyr.",
      bullets: ["Manikyr klassisk", "Manikyr med gellack", "Nytt set gel/akryl", "Påfyllning av naglar", "Pedikyr", "Pedikyr med gellack"],
    },
  ],
  note: "Välj behandling efter det uttryck och den finish du önskar. Aktuella tider och alternativ finns via Bokadirekt.",
  related: [
    { title: "Ögonbehandlingar", href: ROUTES.eyes, description: "Utforska fler behandlingar för ögonområdet." },
    { title: "Ansiktsbehandlingar", href: ROUTES.face, description: "Lägg till en stund för ansikte och hud." },
    { title: "Presentkort", href: ROUTES.giftCard, description: "Ge bort en behandling eller en stund för egen tid." },
  ],
};

export const SCARNIK_PAGE: TreatmentPageData = {
  path: ROUTES.scarnik,
  eyebrow: "ScarNik Concept",
  title: "SCARINK – behandling av ärr",
  intro: "ScarNik Concept är ett arbetssätt för ärr där fokus ligger på hudens utseende, komfort och välbefinnande — inte enbart på att dölja förändringen.",
  visualLabel: "",
  visualTone: "ivory",
  visualImage: {
    src: "/images/salong-ed/scarink/scarink-treatment.webp",
    alt: "ScarNik-behandling på Salong ED",
    position: "object-center",
    aspectClass: "aspect-[1.45]",
  },
  supportingVisuals: [
    {
      src: "/images/salong-ed/scarink/scarink-before-after.webp",
      alt: "Dokumentation av hudens förändring efter ScarNik-behandling",
      fit: "contain",
      aspectClass: "aspect-[4/3]",
    },
    {
      src: "/images/salong-ed/scarink/scarink-result-arm.webp",
      alt: "Dokumentation av ScarNik-resultat på arm",
      fit: "contain",
      aspectClass: "aspect-[4/3]",
    },
  ],
  sections: [
    {
      title: "Vad är ScarNik Concept?",
      body: "På Salong ED:s befintliga sida beskrivs hur mikropunktur introducerades i Polen 2015 och bidrog till utvecklingen av nya sätt att arbeta med ärr.",
    },
    {
      title: "Mer än kosmetisk korrigering",
      body: "ScarNik Concept presenteras som ett förhållningssätt där man ser till både hudens utseende och den komfort och livskvalitet som kan påverkas av att leva med ärr.",
    },
    {
      title: "Nästa steg",
      body: "Boka en tid för att prata om dina önskemål och få en individuell genomgång innan behandling.",
    },
  ],
  note: "Ärr och hud skiljer sig åt. En individuell bedömning görs innan behandling och informationen på sidan ersätter inte medicinsk rådgivning.",
  related: [
    { title: "Ansiktsbehandlingar", href: ROUTES.face, description: "Se behandlingar som arbetar med hudens struktur." },
    { title: "Kroppsbehandlingar", href: ROUTES.body, description: "Utforska fler behandlingar för kropp och hud." },
    { title: "Om Salong ED", href: ROUTES.about, description: "Lär känna salongen och dess bakgrund." },
  ],
};
