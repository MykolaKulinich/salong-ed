import { CameraIcon } from "@/components/icons";

type ImagePlaceholderProps = {
  label?: string;
  aspect?: string;
  className?: string;
  tone?: "ivory" | "sand" | "charcoal" | "blush";
};

const TONE_CLASSES = {
  ivory: "bg-[#f2ede5] text-foreground",
  sand: "bg-[#ded1bf] text-foreground",
  charcoal: "bg-[#302b26] text-background",
  blush: "bg-[#e8d8cf] text-foreground",
};

/** Quiet, finished-looking art direction until approved photography arrives. */
export default function ImagePlaceholder({
  label = "Fotografi behövs",
  aspect = "aspect-[4/3]",
  className = "",
  tone = "ivory",
}: ImagePlaceholderProps) {
  return (
    <div
      className={`placeholder-art relative flex ${aspect} w-full items-end border border-border ${TONE_CLASSES[tone]} ${className}`}
      aria-label={label}
      role="img"
    >
      <div className="relative z-10 flex w-full items-end justify-between gap-4 p-5 sm:p-6">
        <span className="max-w-[13rem] text-[10px] uppercase tracking-[0.19em] opacity-70">{label}</span>
        <CameraIcon className="h-5 w-5 shrink-0 opacity-60" />
      </div>
    </div>
  );
}
