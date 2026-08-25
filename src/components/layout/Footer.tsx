import Link from "next/link";
import SalongEdLogo from "@/components/brand/SalongEdLogo";
import Container from "@/components/ui/Container";
import BookingButton from "@/components/ui/BookingButton";
import ContactLink from "@/components/ui/ContactLink";
import { LocationIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { CONTACT, OPENING_HOURS } from "@/lib/site";
import { TREATMENT_LINKS } from "@/lib/nav";

export default function Footer() {
  return (
    <footer id="site-footer" className="border-t border-border bg-surface">
      <Container id="kontakt" className="scroll-mt-24 grid gap-12 py-16 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] md:gap-8 md:py-20">
        <div className="flex flex-col items-start gap-5">
          <SalongEdLogo />
          <p className="max-w-xs text-sm text-muted">
            Skönhets- och kroppsbehandlingar i Ursvik, Sundbyberg — med omtanke om detaljerna.
          </p>
          <BookingButton variant="secondary" size="sm">Boka tid</BookingButton>
        </div>

        <nav aria-label="Behandlingar" className="flex flex-col gap-4">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-accent">Behandlingar</h2>
          <ul className="flex flex-col gap-2.5">
            {TREATMENT_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-foreground/75 transition-colors hover:text-accent">{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-accent">Kontakt</h2>
          <ul className="flex flex-col gap-3 text-sm text-foreground/75">
            <li className="flex items-start gap-2.5">
              <LocationIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{CONTACT.address}</span>
            </li>
            <li>
              <ContactLink kind="phone" href={CONTACT.phoneHref} className="flex items-center gap-2.5 transition-colors hover:text-accent">
                <PhoneIcon className="h-4 w-4 shrink-0 text-accent" />
                <span>{CONTACT.phone}</span>
              </ContactLink>
            </li>
            <li>
              <ContactLink kind="email" href={CONTACT.emailHref} className="flex items-center gap-2.5 break-all transition-colors hover:text-accent">
                <MailIcon className="h-4 w-4 shrink-0 text-accent" />
                <span>{CONTACT.email}</span>
              </ContactLink>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-accent">Öppettider</h2>
          <ul className="flex flex-col gap-2.5 text-sm text-foreground/75">
            {OPENING_HOURS.map((row) => (
              <li key={row.day} className="flex justify-between gap-4 border-b border-border pb-2">
                <span>{row.day}</span>
                <span className="text-right">{row.hours}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">Bokning sker enkelt online via Bokadirekt.</p>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Salong ED. Alla rättigheter förbehållna.</p>
          <p>Ursvik · Sundbyberg</p>
        </Container>
      </div>
    </footer>
  );
}
