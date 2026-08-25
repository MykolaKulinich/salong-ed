"use client";

import type { MouseEvent, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Button, { type ButtonAsLink } from "@/components/ui/Button";
import { BOOKING_HREF } from "@/lib/site";
import { ROUTES } from "@/lib/routes";
import { trackEvent } from "@/lib/analytics";

type BookingButtonProps = Omit<ButtonAsLink, "href" | "children"> & {
  children?: ReactNode;
};

/**
 * Every Bokadirekt booking CTA in the app renders through this component,
 * so click tracking lives here once instead of being scattered per page.
 */
export default function BookingButton({ children = "Boka tid", onClick, ...props }: BookingButtonProps) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackEvent("booking_click");
    if (pathname === ROUTES.icoone) {
      trackEvent("icoone_booking_click");
    } else if (pathname === ROUTES.exilis) {
      trackEvent("exilis_booking_click");
    }
    onClick?.(event);
  }

  return (
    <Button href={BOOKING_HREF} target="_blank" rel="noopener noreferrer" onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
