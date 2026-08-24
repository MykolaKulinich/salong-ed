import Container from "@/components/ui/Container";
import { CalendarCheckIcon, PersonIcon, ShieldCheckIcon, SparkleIcon } from "@/components/icons";

const ITEMS = [
  { icon: SparkleIcon, label: "Avancerade behandlingar" },
  { icon: PersonIcon, label: "Personligt anpassat" },
  { icon: ShieldCheckIcon, label: "Tryggt & professionellt" },
  { icon: CalendarCheckIcon, label: "Enkel onlinebokning" },
];

export default function TrustStrip() {
  return (
    <section className="border-b border-border bg-surface">
      <Container className="grid grid-cols-2 divide-x divide-border sm:grid-cols-4">
        {ITEMS.map(({ icon: Icon, label }, index) => (
          <div key={label} className={`flex min-h-28 items-center gap-3 px-4 py-6 sm:justify-center sm:px-5 ${index >= 2 ? "border-t border-border sm:border-t-0" : ""}`}>
            <Icon className="h-6 w-6 shrink-0 text-accent" />
            <span className="max-w-[8rem] text-xs leading-5 text-foreground/80 sm:text-sm">{label}</span>
          </div>
        ))}
      </Container>
    </section>
  );
}
