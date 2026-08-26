import type { Metadata } from "next";

export const SITE_NAME = "Salong ED";

export const SITE_URL = "https://www.salongewelinadubowska.com";

export const SITE_DESCRIPTION =
  "Salong ED i Ursvik, Sundbyberg erbjuder ansikts-, kropps-, frans- och nagelbehandlingar med personlig service och modern teknik.";

export const BOOKING_HREF = "https://www.bokadirekt.se/places/salong-ed-32327";

export const CONTACT = {
  address: "Marieborgsgatan 6, 174 62 Sundbyberg",
  phone: "076 066 81 97",
  phoneHref: "tel:+46760668197",
  email: "Ewelinadubowska@gmail.com",
  emailHref: "mailto:Ewelinadubowska@gmail.com",
} as const;

export const OPENING_HOURS = [
  { day: "Måndag–fredag", hours: "09.00–19.00" },
  { day: "Lördag", hours: "09.00–16.00" },
  { day: "Söndag", hours: "Stängt" },
] as const;

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "sv_SE",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
  };
}
