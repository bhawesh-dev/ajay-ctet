export default function LegalAccordion({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <details
          key={item.title}
          className="group overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:border-gold-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-6 py-5 font-bold text-navy-950 transition-colors duration-300 hover:bg-gold-50 sm:px-7 sm:py-6">
            <span>{item.title}</span>

            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-100 text-gold-600 transition-all duration-300 group-open:rotate-180 group-open:bg-gold-400 group-open:text-navy-950"
            >
              ↓
            </span>
          </summary>

          <div className="border-t border-line px-6 py-6 text-[0.97rem] leading-8 text-muted sm:px-7">
            {item.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}

            {item.bullets && (
              <ul className="mt-2 grid gap-3 sm:grid-cols-2 sm:gap-x-8">
                {item.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-3 rounded-xl p-2 transition-colors duration-200 hover:bg-gold-50"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.65rem] h-2 w-2 shrink-0 rounded-full bg-gold-500"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}