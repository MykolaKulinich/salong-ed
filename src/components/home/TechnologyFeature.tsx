import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/icons";
import { ROUTES } from "@/lib/routes";

const TECHNOLOGIES = [
  {
    name: "Icoone LaserMed",
    href: ROUTES.icoone,
    eyebrow: "Mikrostimulering · vakuum",
    copy: "En avancerad kroppsbehandling som på Salong ED kan anpassas efter olika områden och mål.",
    image: { src: "/images/salong-ed/devices/icoone-lasermed.png", alt: "Icoone LaserMed" },
    imageScaleClassName: "",
  },
  {
    name: "Exilis Ultra 360",
    href: ROUTES.exilis,
    eyebrow: "Ultraljud · radiofrekvens",
    copy: "Teknik för kroppsskulptering och hudföryngring, med behandlingsalternativ för både ansikte och kropp.",
    image: { src: "/images/salong-ed/devices/exilis-ultra-360.png", alt: "Exilis Ultra 360" },
    imageScaleClassName: "scale-[1.08]",
  },
];

export default function TechnologyFeature() {
  return (
    <section className="bg-foreground py-20 text-background sm:py-24 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Skönhetsteknik</span>
            <h2 className="text-balance mt-5 font-serif text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl">När modern teknik möter personligt hantverk.</h2>
            <p className="mt-7 max-w-md text-sm leading-7 text-background/65">Salong ED erbjuder två tydliga teknikspår för olika önskemål. Läs mer om behandlingarna och boka den tid som passar dig.</p>
            <div className="mt-8 h-px w-16 bg-accent" />
          </div>

          <div className="grid items-stretch gap-px bg-background/20 sm:grid-cols-2">
            {TECHNOLOGIES.map((technology, index) => (
              <Link key={technology.href} href={technology.href} className="group flex h-full flex-col bg-foreground p-3 transition-colors hover:bg-[#3a342e]">
                <div className="image-hover-zoom overflow-hidden">
                  <div className="relative aspect-[1.05] border border-accent/55 bg-[#2d2822]">
                    <Image
                      src={technology.image.src}
                      alt={technology.image.alt}
                      fill
                      sizes="(min-width: 640px) 25vw, 50vw"
                      className={`object-contain object-bottom p-6 sm:p-8 ${technology.imageScaleClassName}`}
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col px-2 pb-3 pt-6">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-accent">0{index + 1} / {technology.eyebrow}</p>
                  <h3 className="mt-3 font-serif text-2xl text-background">{technology.name}</h3>
                  <p className="mt-4 text-sm leading-6 text-background/60">{technology.copy}</p>
                  <div className="mt-auto flex justify-end pt-6">
                    <ArrowRightIcon className="h-5 w-5 shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
