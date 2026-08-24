"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SalongEdLogo from "@/components/brand/SalongEdLogo";
import Container from "@/components/ui/Container";
import BookingButton from "@/components/ui/BookingButton";
import { ArrowDownIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { NAV_LINKS, TREATMENT_LINKS } from "@/lib/nav";
import { ROUTES } from "@/lib/routes";

const INERT_TARGET_IDS = ["site-header-bar", "main-content", "site-footer"];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTreatmentMenuOpen, setIsTreatmentMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const targets = INERT_TARGET_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      targets.forEach((element) => element.setAttribute("inert", ""));
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      targets.forEach((element) => element.removeAttribute("inert"));
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsTreatmentMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => () => {
    document.body.style.overflow = "";
  }, []);

  function closeMenu() {
    setIsMenuOpen(false);
    setIsTreatmentMenuOpen(false);
    menuButtonRef.current?.focus();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <Container id="site-header-bar" className="flex h-[4.5rem] !max-w-none items-center justify-between gap-4 px-5 sm:px-6 lg:h-20 lg:!px-12">
        <Link href="/" className="shrink-0" aria-label="Salong ED – till startsidan">
          <span className="lg:hidden"><SalongEdLogo compact /></span>
          <span className="hidden lg:inline-flex"><SalongEdLogo /></span>
        </Link>

        <nav aria-label="Huvudmeny" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-5 xl:gap-7">
            <li className="relative">
              <button
                type="button"
                aria-expanded={isTreatmentMenuOpen}
                aria-controls="treatment-menu"
                onClick={() => setIsTreatmentMenuOpen((open) => !open)}
                className="inline-flex min-h-10 items-center gap-1.5 text-[13px] text-foreground/80 transition-colors hover:text-accent"
              >
                Behandlingar
                <ArrowDownIcon className={`h-3.5 w-3.5 transition-transform ${isTreatmentMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {isTreatmentMenuOpen && (
                <div
                  id="treatment-menu"
                  className="absolute left-1/2 top-full w-64 -translate-x-1/2 border border-border bg-surface p-2"
                >
                  <p className="px-3 pb-2 pt-1 text-[10px] uppercase tracking-[0.2em] text-accent">Utforska</p>
                  <ul>
                    {TREATMENT_LINKS.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsTreatmentMenuOpen(false)}
                          className="flex min-h-10 items-center border-t border-border px-3 text-sm text-foreground/80 transition-colors hover:bg-background hover:text-accent"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-10 items-center text-[13px] text-foreground/80 transition-colors hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <BookingButton size="sm" className="px-4 text-xs sm:px-5 sm:text-sm" aria-label="Boka tid hos Salong ED">
            Boka tid
          </BookingButton>
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Stäng meny" : "Öppna meny"}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center text-foreground lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </Container>

      {isMenuOpen && (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Meny" className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background lg:hidden">
          <Container className="flex h-[4.5rem] items-center justify-between">
            <Link href="/" onClick={closeMenu} aria-label="Salong ED – till startsidan">
              <SalongEdLogo compact />
            </Link>
            <button ref={closeButtonRef} type="button" aria-label="Stäng meny" onClick={closeMenu} className="inline-flex h-10 w-10 items-center justify-center text-foreground">
              <CloseIcon className="h-5 w-5" />
            </button>
          </Container>

          <nav aria-label="Mobilmeny" className="flex-1">
            <Container as="div" className="py-5">
              <p className="pb-2 text-[10px] uppercase tracking-[0.2em] text-accent">Behandlingar</p>
              <ul>
                {TREATMENT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={closeMenu} className="flex min-h-12 items-center border-b border-border font-serif text-xl text-foreground transition-colors hover:text-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href={ROUTES.giftCard} onClick={closeMenu} className="flex min-h-12 items-center border-b border-border font-serif text-xl text-foreground transition-colors hover:text-accent">
                  Presentkort
                </Link>
              </div>
              <p className="pb-2 pt-8 text-[10px] uppercase tracking-[0.2em] text-accent">Salong ED</p>
              <ul>
                {NAV_LINKS.filter((link) => link.href !== ROUTES.giftCard && !TREATMENT_LINKS.some((treatment) => treatment.href === link.href)).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={closeMenu} className="flex min-h-12 items-center border-b border-border font-serif text-xl text-foreground transition-colors hover:text-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </nav>

          <Container className="border-t border-border py-6">
            <BookingButton className="w-full" onClick={closeMenu}>
              Boka din tid
            </BookingButton>
          </Container>
        </div>
      )}
    </header>
  );
}
