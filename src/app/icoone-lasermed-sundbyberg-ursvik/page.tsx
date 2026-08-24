import type { Metadata } from "next";
import TreatmentPage from "@/components/page/TreatmentPage";
import { ICOONE_PAGE } from "@/lib/content";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "Icoone LaserMed i Sundbyberg & Ursvik", description: "Läs om Icoone LaserMed hos Salong ED i Ursvik — mikrostimulering och vakuumteknik för olika kropps­områden.", path: ICOONE_PAGE.path });

export default function IcooneLaserMedPage() { return <TreatmentPage data={ICOONE_PAGE} />; }
