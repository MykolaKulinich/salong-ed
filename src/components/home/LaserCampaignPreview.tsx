import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { isLaserCampaignActive, LASER_CAMPAIGN_COPY } from "@/lib/laser-campaign";
import { ROUTES } from "@/lib/routes";

export default function LaserCampaignPreview() {
  if (!isLaserCampaignActive()) return null;

  return (
    <section className="border-b border-border bg-surface-muted py-10 sm:py-12">
      <Container>
        <div className="flex flex-col gap-6 border-y border-accent/35 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:py-7">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">{LASER_CAMPAIGN_COPY.homepageEyebrow}</span>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-foreground sm:text-4xl">{LASER_CAMPAIGN_COPY.homepageHeadline}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">{LASER_CAMPAIGN_COPY.homepageSupporting}</p>
          </div>
          <Button href={ROUTES.laser} variant="secondary" className="shrink-0 self-start sm:self-center">
            Läs mer &amp; boka
          </Button>
        </div>
      </Container>
    </section>
  );
}
