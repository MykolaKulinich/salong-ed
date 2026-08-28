export const ROUTES = {
  home: "/",
  about: "/salonged",
  face: "/ansiktsbehandlingar",
  body: "/kroppsbehandlingar",
  eyes: "/behandlingar-ögon-område",
  lashesAndNails: "/fransar-naglar-ursvik",
  exilis: "/exilis-ultra-360-ursvik",
  icoone: "/icoone-lasermed-sundbyberg-ursvik",
  giftCard: "/skönhet-presentkort-ursvik",
  scarnik: "/scarnik-scar",
  laser: "/laserharborttagning-sundbyberg-ursvik",
} as const;

/** Protected Wix routes. Keep these exact paths stable during migration. */
export const SEO_ROUTES = [
  ROUTES.home,
  ROUTES.about,
  ROUTES.face,
  ROUTES.body,
  ROUTES.eyes,
  ROUTES.lashesAndNails,
  ROUTES.exilis,
  ROUTES.icoone,
  ROUTES.giftCard,
  ROUTES.scarnik,
] as const;
