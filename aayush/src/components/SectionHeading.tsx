import { Reveal } from "@/components/Reveal";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={className}>
      <div className="flex items-center gap-4">
        <span className="font-mono text-[11px] tracking-[0.3em] text-white/30">{index}</span>
        <span className="h-px w-10 bg-white/15" aria-hidden="true" />
        <span className="text-[11px] uppercase tracking-[0.3em] text-white/45">{eyebrow}</span>
      </div>
      <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-paper md:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/45 md:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
