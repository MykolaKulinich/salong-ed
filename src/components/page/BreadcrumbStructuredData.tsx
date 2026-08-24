import { absoluteUrl } from "@/lib/site";

type BreadcrumbStructuredDataProps = {
  current: string;
  path: string;
};

export default function BreadcrumbStructuredData({ current, path }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Salong ED", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: current, item: absoluteUrl(path) },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />;
}
