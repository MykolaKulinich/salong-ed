/**
 * Developer-only: generates the real gift-card PDF for both fixtures and
 * writes them to tmp/ (gitignored, never committed) so you can open and
 * inspect them locally. No Supabase order is read — see
 * scripts/gift-card-fixtures.mjs.
 *
 * Usage:
 *   node scripts/preview-gift-card-pdf.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateGiftCardPdf, buildGiftCardPdfFilename } from "../src/lib/gift-card-pdf.ts";
import { FULL_FIXTURE, MINIMAL_FIXTURE } from "./gift-card-fixtures.mjs";

const outDir = path.resolve(import.meta.dirname, "../tmp");
await mkdir(outDir, { recursive: true });

for (const fixture of [FULL_FIXTURE, MINIMAL_FIXTURE]) {
  const bytes = await generateGiftCardPdf(fixture);
  const filename = buildGiftCardPdfFilename(fixture.orderReference);
  const outPath = path.join(outDir, filename);
  await writeFile(outPath, bytes);
  console.log(`Wrote ${path.relative(process.cwd(), outPath)} (${bytes.length} bytes).`);
}
