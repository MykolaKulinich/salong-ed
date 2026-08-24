import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/icons";
import { ROUTES } from "@/lib/routes";

const TREATMENTS = [
  {
    title: "Icoone LaserMed",
    href: ROUTES.icoone,
    featured: true,
    softened: false,
    label: "Kropp · avancerad teknik",
    tone: "sand" as const,
    image: { src: "/images/salong-ed/devices/icoone-lasermed.png", alt: "Icoone LaserMed", fit: "contain" as const },
  },
  {
    title: "Exilis Ultra 360",
    href: ROUTES.exilis,
    featured: true,
    softened: false,
    label: "Kropp & ansikte · teknik",
    tone: "sand" as const,
    image: { src: "/images/salong-ed/devices/exilis-ultra-360.png", alt: "Exilis Ultra 360", fit: "contain" as const },
  },
  {
    title: "Ansiktsbehandlingar",
    href: ROUTES.face,
    featured: false,
    softened: false,
    label: "Hudvård · lyster · omsorg",
    tone: "blush" as const,
    image: { src: "/images/treatments/ansiktsbehandlingar-treatment.webp", alt: "Ansiktsbehandling på Salong ED", fit: "cover" as const, position: "object-top" },
  },
  {
    title: "Kroppsbehandlingar",
    href: ROUTES.body,
    featured: false,
    softened: false,
    label: "Kropp · välmående",
    tone: "ivory" as const,
    image: { src: "/images/treatments/kroppsbehandlingar-treatment.webp", alt: "Kroppsbehandling på Salong ED", fit: "cover" as const, position: "object-top" },
  },
  {
    title: "Ögonbehandlingar",
    href: ROUTES.eyes,
    featured: false,
    softened: true,
    label: "Ögonområdet · blick",
    tone: "blush" as const,
    image: { src: "/images/treatments/ogonbehandlingar-editorial.webp", alt: "Behandling för ögonområdet på Salong ED", fit: "cover" as const },
  },
  {
    title: "Fransar & naglar",
    href: ROUTES.lashesAndNails,
    featured: false,
    softened: true,
    label: "Detaljer · form · finish",
    tone: "sand" as const,
    image: { src: "/images/treatments/fransar-closeup.webp", alt: "Fransar på Salong ED", fit: "cover" as const },
  },
];

function TreatmentCard({ treatment }: { treatment: (typeof TREATMENTS)[number] }) {
  const isFeatured = treatment.featured;

  return (
    <Link
      href={treatment.href}
      className={`group transition-colors hover:bg-surface ${
        isFeatured
          ? "grid min-h-[17rem] grid-cols-[0.42fr_0.58fr] border border-border bg-[#ded1bf] p-4 sm:min-h-[18rem] sm:p-5"
          : "bg-background p-3"
      }`}
    >
      {isFeatured ? (
        <>
          <div className="image-hover-zoom relative min-h-[13rem] overflow-hidden sm:min-h-0">
            <Image
              src={treatment.image.src}
              alt={treatment.image.alt}
              fill
              sizes="(min-width: 640px) 22vw, 42vw"
              className={`object-contain object-bottom p-5 sm:p-6 ${
                treatment.title === "Icoone LaserMed"
                  ? "scale-[1.10]"
                  : treatment.title === "Exilis Ultra 360"
                    ? "scale-[1.16]"
                    : ""
              }`}
            />
          </div>
          <div className="relative flex flex-col justify-center px-3 py-4 sm:px-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-accent">{treatment.label}</p>
            <h3 className="mt-3 font-serif text-2xl leading-tight text-foreground sm:text-3xl">{treatment.title}</h3>
            <ArrowRightIcon className="absolute right-2 top-4 h-5 w-5 shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-1 sm:right-4 sm:top-5" />
          </div>
        </>
      ) : (
        <>
          <div className="image-hover-zoom overflow-hidden">
            <div className="relative aspect-[1.2] border border-border">
              <Image
                src={treatment.image.src}
                alt={treatment.image.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className={`object-cover ${treatment.image.position ?? ""} ${treatment.softened ? "contrast-[0.96] saturate-[0.95]" : ""}`}
              />
            </div>
          </div>
          <div className="flex items-end justify-between gap-4 px-2 pb-2 pt-5">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-accent">{treatment.label}</p>
              <h3 className="font-serif text-2xl leading-tight text-foreground">{treatment.title}</h3>
            </div>
            <ArrowRightIcon className="mb-1 h-5 w-5 shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </>
      )}
    </Link>
  );
}

export default function TreatmentPreview() {
  return (
    <section id="behandlingar" className="scroll-mt-24 py-20 sm:py-24 md:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Våra behandlingar</span>
            <h2 className="text-balance mt-4 font-serif text-4xl leading-[1.05] tracking-[-0.025em] text-foreground sm:text-5xl">Omsorg med precision.</h2>
          </div>
          <p className="max-w-sm text-sm text-muted md:pb-1">Från ansikte och ögon till kropp, fransar och naglar — hitta den behandling som passar din stund.</p>
        </div>

        <div className="mt-12">
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {TREATMENTS.filter((treatment) => treatment.featured).map((treatment) => (
              <TreatmentCard key={treatment.href} treatment={treatment} />
            ))}
          </div>
          <div className="mt-10 grid gap-px bg-border sm:mt-12 sm:grid-cols-2">
            {TREATMENTS.filter((treatment) => !treatment.featured).map((treatment) => (
              <TreatmentCard key={treatment.href} treatment={treatment} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
