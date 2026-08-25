"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

type ContactLinkKind = "phone" | "email";

const EVENT_BY_KIND: Record<ContactLinkKind, AnalyticsEventName> = {
  phone: "phone_click",
  email: "email_click",
};

type ContactLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  kind: ContactLinkKind;
  children: ReactNode;
};

/**
 * Thin wrapper around existing tel:/mailto: links that adds click tracking
 * without changing markup, styling, or destination — just the same <a>
 * with one extra onClick.
 */
export default function ContactLink({ kind, onClick, children, ...props }: ContactLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackEvent(EVENT_BY_KIND[kind]);
    onClick?.(event);
  }

  return (
    <a onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
