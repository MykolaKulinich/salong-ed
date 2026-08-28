/**
 * Centralized config for the temporary September laser-hair-removal
 * campaign. Keep campaign data and copy here so the laser page and homepage
 * always describe the same offer.
 */
export const LASER_CAMPAIGN = {
  enabled: true,
  discountPercent: 20,
  newCustomersOnly: true,
  serviceName: "laserhårborttagning",
  /** Last active day, Europe/Stockholm local time (inclusive), ISO yyyy-mm-dd. */
  endDate: "2026-09-30",
  /** Display label for the end date, kept alongside endDate as the single source. */
  endDateLabel: "30 september 2026",
} as const;

function joinCampaignParts(...parts: Array<string | false>): string {
  return parts.filter(Boolean).join(" ");
}

/** All temporary campaign wording used by the site. */
export const LASER_CAMPAIGN_COPY = (() => {
  const discount = `${LASER_CAMPAIGN.discountPercent} % rabatt`;
  const customerCondition = LASER_CAMPAIGN.newCustomersOnly ? "för nya kunder" : false;
  const expiry = `t.o.m. ${LASER_CAMPAIGN.endDateLabel}`;
  const offer = joinCampaignParts(discount, `på ${LASER_CAMPAIGN.serviceName}`, customerCondition, expiry);

  return {
    badge: "Septemberkampanj",
    homepageEyebrow: "Laserhårborttagning",
    homepageHeadline: joinCampaignParts(discount, customerCondition),
    homepageSupporting: `Som ny kund får du ${joinCampaignParts(discount, `på ${LASER_CAMPAIGN.serviceName}`, expiry)}.`,
    heroNote: `${offer}.`,
    bookingCta: joinCampaignParts("Boka med", discount, customerCondition),
    scopeNote: LASER_CAMPAIGN.newCustomersOnly ? "Gäller endast nya kunder." : "Gäller alla kunder.",
  } as const;
})();

/** Returns the current date in Europe/Stockholm as "YYYY-MM-DD" (sv-SE formats ISO-order). */
function stockholmDateString(date: Date): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * True through the end of the campaign's last day in Stockholm local time.
 * Comparing ISO-formatted date strings avoids pulling in a date library
 * while still respecting the Europe/Stockholm boundary rather than UTC's.
 */
export function isLaserCampaignActive(referenceDate: Date = new Date()): boolean {
  if (!LASER_CAMPAIGN.enabled) return false;
  return stockholmDateString(referenceDate) <= LASER_CAMPAIGN.endDate;
}
