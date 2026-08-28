import { describe, expect, it } from "vitest";
import { isLaserCampaignActive, LASER_CAMPAIGN, LASER_CAMPAIGN_COPY } from "@/lib/laser-campaign";

describe("laser campaign copy", () => {
  it("states that the discount is for new customers", () => {
    expect(LASER_CAMPAIGN.newCustomersOnly).toBe(true);
    expect(LASER_CAMPAIGN_COPY.heroNote).toBe(
      "20 % rabatt på laserhårborttagning för nya kunder t.o.m. 30 september 2026.",
    );
    expect(LASER_CAMPAIGN_COPY.homepageSupporting).toBe(
      "Som ny kund får du 20 % rabatt på laserhårborttagning t.o.m. 30 september 2026.",
    );
    expect(LASER_CAMPAIGN_COPY.bookingCta).toBe("Boka med 20 % rabatt för nya kunder");
    expect(LASER_CAMPAIGN_COPY.scopeNote).toBe("Gäller endast nya kunder.");
  });
});

describe("isLaserCampaignActive", () => {
  it("is active well before the end date", () => {
    expect(isLaserCampaignActive(new Date("2026-08-28T10:00:00Z"))).toBe(true);
  });

  it("is active for the full Stockholm calendar day of the end date, including late UTC evening", () => {
    // 2026-09-30 23:59 in Stockholm (CEST, UTC+2) is 2026-09-30T21:59:00Z.
    expect(isLaserCampaignActive(new Date("2026-09-30T21:59:00Z"))).toBe(true);
  });

  it("is active right at the Stockholm midnight start of the end date", () => {
    // 2026-09-30 00:00 in Stockholm (CEST, UTC+2) is 2026-09-29T22:00:00Z.
    expect(isLaserCampaignActive(new Date("2026-09-29T22:00:00Z"))).toBe(true);
  });

  it("is inactive once Stockholm local time has rolled over to October 1st", () => {
    // 2026-10-01 00:01 in Stockholm (CEST, UTC+2) is 2026-09-30T22:01:00Z.
    // A naive UTC-date comparison would still call this "Sep 30" and stay
    // active two hours too long — this is the boundary that check guards.
    expect(isLaserCampaignActive(new Date("2026-09-30T22:01:00Z"))).toBe(false);
  });

  it("is inactive well after the end date", () => {
    expect(isLaserCampaignActive(new Date("2026-10-15T10:00:00Z"))).toBe(false);
  });
});
