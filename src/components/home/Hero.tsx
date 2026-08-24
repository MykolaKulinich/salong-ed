import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import BookingButton from "@/components/ui/BookingButton";
import { ArrowRightIcon } from "@/components/icons";

export default function Hero() {
  return (
    <section className="border-b border-border">
      <Container className="grid !max-w-none !px-0 gap-0 py-0 md:grid-cols-[0.96fr_1.04fr] md:items-stretch lg:grid-cols-[1.04fr_0.96fr]">
        <div className="flex flex-col items-start justify-center px-5 py-12 sm:px-6 sm:py-16 md:py-20 lg:pl-[8.5vw] lg:pr-12">
          <div className="mb-7 flex w-full items-center gap-4">
            <span className="editorial-rule w-10" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Skönhet & välmående i Ursvik</span>
          </div>
          <h1 className="text-balance font-serif text-[3.35rem] leading-[0.98] tracking-[-0.035em] text-foreground sm:text-6xl lg:text-[5.5rem]">
            Din skönhet.
            <br />
            <span className="text-accent">Vårt hantverk.</span>
          </h1>
          <p className="mt-8 max-w-md text-base text-muted sm:text-lg">
            Avancerade behandlingar, personlig service och resultat du ser och känner.
          </p>
          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <BookingButton>Boka din tid</BookingButton>
            <Button href="#behandlingar" variant="ghost" size="sm" className="group pl-0">
              Hitta rätt behandling
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </div>
          <Link href="/salonged" className="mt-12 hidden items-center gap-3 text-xs text-muted transition-colors hover:text-accent sm:flex">
            <span className="h-px w-8 bg-border" />
            Läs om Salong ED
          </Link>
        </div>

        <div className="relative">
          <div className="relative aspect-[0.88] min-h-[26rem] w-full overflow-hidden sm:min-h-[34rem] md:aspect-[1.3] md:min-h-0">
            <Image
              src="/images/salong-ed/hero/hero-beauty-editorial.webp"
              alt="Skönhetsporträtt på Salong ED"
              fill
              preload
              sizes="(min-width: 768px) 52vw, 100vw"
              className="object-cover object-[50%_46%] md:object-[50%_52%]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
