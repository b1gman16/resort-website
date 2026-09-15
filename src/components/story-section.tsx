import { Link } from "next-view-transitions";
import { Reveal } from "@/components/ui/reveal";

export function StorySection({
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  visual,
  reversed = false,
  tint = "foam",
}: {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  visual: React.ReactNode;
  reversed?: boolean;
  tint?: "foam" | "sand";
}) {
  const bg = tint === "foam" ? "bg-[var(--color-foam)]" : "bg-[var(--color-sand)]";

  return (
    <section className={`relative py-24 md:py-32 ${bg}`}>
      <div
        className={`max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
          reversed ? "md:[direction:rtl]" : ""
        }`}
      >
        <Reveal>
          <div
            className={`relative aspect-[4/5] md:aspect-auto md:h-[60vh] rounded-lg overflow-hidden ${
              reversed ? "md:[direction:ltr]" : ""
            }`}
          >
            {visual}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className={reversed ? "md:[direction:ltr]" : ""}>
            <p className="text-[var(--color-brass)] text-sm mb-3 tracking-wide">{eyebrow}</p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-[var(--color-tide)] leading-tight">
              {title}
            </h2>
            <p className="mt-6 text-[var(--color-ink)]/70 max-w-md">{body}</p>
            <Link
              href={ctaHref}
              className="inline-block mt-8 px-6 py-3 rounded-sm border border-[var(--color-tide)] text-[var(--color-tide)] text-sm font-medium hover:bg-[var(--color-tide)] hover:text-[var(--color-foam)] transition-colors"
            >
              {ctaLabel}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}