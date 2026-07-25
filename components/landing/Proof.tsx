import { Avatar } from "./marks";
import { panel } from "./ui";

const STATS = [
  { value: "2024", label: "resumeai Founded" },
  { value: "50K+", label: "Active Users" },
  { value: "1k+", label: "Companies Hiring" },
];

export function Proof() {
  return (
    <section className="px-5 pb-14 sm:px-8 sm:pb-16">
      <div className="mx-auto max-w-[1180px] space-y-4">
        {/* Testimonial */}
        <figure className={`${panel} flex flex-col items-center px-6 py-16 text-center sm:py-20`}>
          <svg
            viewBox="0 0 20 16"
            className="h-4 w-5 text-brand"
            aria-hidden="true"
          >
            <path d="M4.6 0h3.2L5.2 16H2z" fill="currentColor" />
            <path d="M12.6 0h3.2L13.2 16H10z" fill="currentColor" />
          </svg>

          <blockquote className="mt-7 max-w-[860px] text-[21px] leading-[1.45] font-extrabold tracking-tight text-ink sm:text-[27px]">
            &ldquo;resumeai cut the time I spend tailoring applications from an
            evening to about ten minutes, while making every version read
            sharper than the one I&apos;d have written on my own.&rdquo;
          </blockquote>

          <figcaption className="mt-10 flex flex-col items-center">
            <Avatar
              name="Maya Okafor"
              seed={4}
              className="h-10 w-10 text-[12px]"
            />
            <span className="mt-3 text-[14px] font-bold text-ink">
              Maya Okafor
            </span>
            <span className="mt-0.5 text-[12.5px] text-ink-soft">
              Senior Product Designer
            </span>
          </figcaption>
        </figure>

        {/* Stats */}
        <div className={`${panel} grid gap-8 px-6 py-11 sm:grid-cols-3`}>
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[34px] font-extrabold tracking-tight text-ink sm:text-[40px]">
                {s.value}
              </div>
              <div className="mt-1.5 text-[13px] font-semibold text-ink-soft">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
