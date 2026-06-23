import LegalAccordion from '../components/LegalAccordion'
import { privacy, terms } from '../content/legal'
import Image from "next/image";

const highlights = [
  {
    number: '01',
    title: 'Structured Programs',
    text: 'Purposeful classroom learning built around clear academic goals.',
  },
  {
    number: '02',
    title: 'Expert Guidance',
    text: 'Focused support that helps students prepare with clarity and discipline.',
  },
  {
    number: '03',
    title: 'Practice & Assessment',
    text: 'Scholarship examinations, test series, and study materials for steady progress.',
  },
]

function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  inverse = false,
}) {
  const alignment = align === 'center' ? 'mx-auto text-center' : ''
  const titleColor = inverse ? 'text-white' : 'text-navy-950'
  const descriptionColor = inverse ? 'text-blue-100/75' : 'text-muted'
  const eyebrowColor = inverse ? 'text-gold-400' : 'text-navy-800'

  return (
    <div className={`max-w-3xl ${alignment}`}>
      <p
        className={`mb-4 text-xs font-bold tracking-[0.24em] uppercase ${eyebrowColor}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl ${titleColor}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-base leading-8 sm:text-lg ${descriptionColor}`}>
          {description}
        </p>
      )}
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ContactIcon({ type }) {
  const paths = {
    phone: (
      <path d="M7.5 4.5 9.8 8l-1.7 1.7a14 14 0 0 0 6.2 6.2l1.7-1.7 3.5 2.3v2a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 7.5a2 2 0 0 1 2-2h1Z" />
    ),
    email: (
      <>
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path d="m5 7 7 5 7-5" />
      </>
    ),
    address: (
      <>
        <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[type]}
    </svg>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-ink">
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-lg bg-gold-400 px-4 py-3 font-bold text-navy-950 transition focus:translate-y-0"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/95 text-white backdrop-blur-xl">
  <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8 lg:px-12">
    <a
      href="#home"
      className="group flex items-center gap-3"
      aria-label="ACC GS Academy home"
    >
      <Image
        src="/logo.PNG"
        alt="ACC GS Academy"
        width={40}
        height={40}
        className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105"
      />
  <span className="text-base font-extrabold tracking-[0.02em] text-gold-400 sm:text-lg">
    ACC GS Academy
  </span>
</a>
<a
  href="#contact"
  className="
    inline-flex
    items-center
    justify-center
    rounded-xl
    bg-gold-400
    px-6
    py-3
    text-sm
    font-semibold
    text-navy-950
    transition-all
    duration-200
    hover:scale-105
    hover:bg-gold-500
    active:scale-95
  "
>
  Contact Us
</a>
  </div>
</header>

      <main id="main-content">
        <section
          id="top"
          className="relative isolate overflow-hidden bg-navy-950 text-white"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(53,107,198,0.35),transparent_34%),radial-gradient(circle_at_10%_90%,rgba(245,189,38,0.12),transparent_32%)]"
          />
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 -z-10 h-full w-1/2 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:48px_48px]"
          />

          <div className="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.08fr_.92fr] lg:px-12 lg:py-28">
            <div className="max-w-3xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-bold tracking-[0.18em] text-blue-100 uppercase">
                <span className="h-2 w-2 rounded-full bg-gold-400" />
                Learn with direction
              </div>
              <p className="text-lg font-bold text-gold-400 sm:text-xl">
                ACC GS Academy
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl leading-[1.08] font-bold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Preparation with purpose.{' '}
                <span className="text-gold-400">Progress with confidence.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-blue-100/80 sm:text-xl sm:leading-9">
                A focused learning environment for competitive examination
                aspirants—bringing structured programs, expert guidance,
                consistent practice, and academic support together.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-400 px-7 py-4 font-bold text-navy-950 transition hover:-translate-y-0.5 hover:bg-gold-500"
                >
                  Talk to our team
                  <ArrowIcon />
                </a>
                <a
                  href="#about"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-bold text-white transition hover:bg-white/10"
                >
                  Discover the Academy
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
  <div
    aria-hidden="true"
    className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-gold-400/20 to-blue-100/5 blur-2xl"
  />
  <div
    className="
      relative
      overflow-hidden
      rounded-[2rem]
      border
      border-white/15
      bg-white/[0.08]
      p-6
      backdrop-blur
      transition-all
      duration-500
      hover:-translate-y-2
      hover:border-gold-400/40
      hover:shadow-[0_30px_90px_rgba(245,189,38,0.12)]
      sm:p-8
    "
  >
    <div className="flex items-center justify-between border-b border-white/10 pb-5">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-gold-400 uppercase">
          Your Preparation
        </p>
    <p className="mt-2 text-xl font-bold transition-colors duration-300">
      A clearer path forward
    </p>
  </div>
  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 p-2">
    <Image
      src="/logo.PNG"
      alt="ACC GS Academy"
      width={40}
      height={40}
      className="h-10 w-10 object-contain"
    />
  </div>
</div>
<div className="mt-6 space-y-4">
  {[
    'Structured classroom programs',
    'Expert academic guidance',
    'Test series & study materials',
    'Student-centered support',
  ].map((item, index) => (
    <div
      key={item}
      className="
        group
        flex
        cursor-default
        items-center
        gap-4
        rounded-2xl
        border
        border-white/10
        bg-navy-900/65
        p-4
        transition-all
        duration-300
        hover:translate-x-2
        hover:border-gold-400/40
        hover:bg-navy-900
      "
    >
      <span
        className="
          grid
          h-9
          w-9
          shrink-0
          place-items-center
          rounded-full
          bg-gold-400/15
          text-sm
          font-bold
          text-gold-400
          transition-all
          duration-300
          group-hover:bg-gold-400
          group-hover:text-navy-950
        "
      >
        {index + 1}
      </span>
      <span
        className="
          font-semibold
          text-blue-100
          transition-colors
          duration-300
          group-hover:text-white
        "
      >
        {item}
      </span>
    </div>
  ))}
</div>
  </div>
</div>
          </div>
        </section>

        <section
  aria-label="Academy highlights"
  className="relative z-10 mx-auto -mt-1 max-w-7xl px-5 sm:px-8 lg:px-12"
>
  <div className="grid overflow-hidden rounded-b-3xl border-x border-b border-line bg-white shadow-soft md:grid-cols-3">
    {highlights.map((item) => (
      <article
        key={item.number}
        className="
          group
          relative
          overflow-hidden
          border-b
          border-line
          p-7
          transition-all
          duration-300
          last:border-0
          sm:p-8
          md:border-r
          md:border-b-0
          md:last:border-r-0
        "
      >
        {/* Sliding Background */}
        <div
          className="
            absolute
            inset-0
            -z-0
            origin-left
            scale-x-0
            bg-gold-400/10
            transition-transform
            duration-500
            ease-out
            group-hover:scale-x-100
          "
        />
    <div className="relative z-10">
      <span
        className="
          text-xs
          font-black
          tracking-[0.2em]
          text-gold-500
          transition-all
          duration-300
          group-hover:text-gold-600
        "
      >
        {item.number}
      </span>
      <h2
        className="
          mt-4
          text-xl
          font-bold
          text-navy-950
          transition-all
          duration-300
          group-hover:translate-x-1
        "
      >
        {item.title}
      </h2>
      <p
        className="
          mt-3
          leading-7
          text-muted
          transition-all
          duration-300
          group-hover:text-navy-800
        "
      >
        {item.text}
      </p>
    </div>
  </article>
))}
  </div>
</section>

        <section
  id="about"
  className="relative bg-white px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
>
  <div className="mx-auto max-w-7xl">
    <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
      {/* Left Side */}
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold-500">
          Who We Are
        </p>
    <h2 className="mt-4 text-4xl font-bold tracking-tight text-navy-950 sm:text-5xl">
      About Us
    </h2>
    <div className="mt-8 h-1 w-20 rounded-full bg-gold-400" />
    <p className="mt-8 max-w-sm text-lg leading-8 text-muted">
      A disciplined, supportive place to prepare for the opportunities
      ahead.
    </p>
  </div>
  {/* Right Side */}
  <div className="space-y-10">
    <div
      className="
        group
        border-l-4
        border-gold-400
        pl-8
        transition-all
        duration-300
        hover:pl-10
      "
    >
      <p className="text-xl leading-10 text-ink">
        ACC GS Academy is a coaching institute dedicated to helping
        students prepare for competitive examinations through structured
        classroom programs, expert guidance, scholarship examinations,
        test series, study materials, and academic support.
      </p>
    </div>
    <div className="h-px bg-line" />
    <div
      className="
        group
        border-l-4
        border-gold-400
        pl-8
        transition-all
        duration-300
        hover:pl-10
      "
    >
      <p className="text-xl leading-10 text-ink">
        The Academy focuses on providing quality education, disciplined
        preparation, and student-centered learning experiences designed
        to help learners achieve their academic and career goals.
      </p>
    </div>
  </div>
</div>
  </div>
</section>

        <section
  id="terms"
  className="border-y border-line bg-white px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
>
  <div className="mx-auto max-w-5xl">
    <SectionHeading
      eyebrow="Clear Expectations"
      title="Terms & Conditions"
      description="Welcome to ACC GS Academy. By accessing our website, mobile application, online learning platforms, offline classrooms, test series, scholarship examinations, study materials, and other services, you agree to comply with the following Terms & Conditions."
      align="center"
    />

    <details className="mt-12 overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <summary className="flex cursor-pointer list-none items-center justify-between px-8 py-6 text-xl font-bold text-navy-950">
        View Terms & Conditions

        <span className="transition-transform duration-300 group-open:rotate-180">
          ↓
        </span>
      </summary>

      <div className="border-t border-line p-6 sm:p-8">
        <LegalAccordion items={terms} />
      </div>
    </details>
  </div>
</section>

        <section
  id="privacy"
  className="bg-white px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
>
  <div className="mx-auto max-w-5xl">
    <SectionHeading
      eyebrow="Your Information"
      title="Privacy Policy"
      description="At ACC GS Academy, we value the privacy of our students, parents, website visitors, and users."
      align="center"
    />

    <details className="mt-12 overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <summary className="flex cursor-pointer list-none items-center justify-between px-8 py-6 text-xl font-bold text-navy-950">
        View Privacy Policy

        <span className="transition-transform duration-300 group-open:rotate-180">
          ↓
        </span>
      </summary>

      <div className="border-t border-line p-6 sm:p-8">
        <LegalAccordion items={privacy} />
      </div>
    </details>
  </div>
</section>

        <section
          id="contact"
          className="relative overflow-hidden bg-navy-950 px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(245,189,38,.13),transparent_30%),radial-gradient(circle_at_90%_90%,rgba(65,118,210,.25),transparent_35%)]"
          />
          <div className="relative mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Let’s connect"
              title="Contact Us"
              description="Have a question about ACC GS Academy? Reach out through our official contact channels."
              align="center"
              inverse
            />
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              <article className="rounded-3xl border border-white/10 bg-white/[0.07] p-7 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10 sm:p-8">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400 text-navy-950">
                  <ContactIcon type="phone" />
                </div>
                <p className="mt-7 text-sm font-bold tracking-[0.16em] text-blue-100/65 uppercase">
                  Phone Number
                </p>
                <p className="mt-2 text-xl font-bold">011 692 729 38</p>
              </article>
              <article className="rounded-3xl border border-white/10 bg-white/[0.07] p-7 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10 sm:p-8">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400 text-navy-950">
                  <ContactIcon type="email" />
                </div>
                <p className="mt-7 text-sm font-bold tracking-[0.16em] text-blue-100/65 uppercase">
                  Email
                </p>
                <a
                  className="mt-2 block break-all text-xl font-bold hover:text-gold-400"
                  href="mailto:support@ajayctetclasses.in"
                >
                  support@ajayctetclasses.in
                </a>
              </article>
              <article className="rounded-3xl border border-white/10 bg-white/[0.07] p-7 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10 sm:p-8">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400 text-navy-950">
                  <ContactIcon type="address" />
                </div>
                <p className="mt-7 text-sm font-bold tracking-[0.16em] text-blue-100/65 uppercase">
                  Address
                </p>
                <p className="mt-2 text-xl font-bold">Gokul Chowk, Gangjala, Saharsa, Bihar (852201)</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#04132e] px-5 py-8 text-blue-100/70 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-white">
            <Image
        src="/logo.PNG"
        alt="ACC GS Academy"
        width={40}
        height={40}
        className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105"
      />
            <span className="font-bold">ACC GS Academy</span>
          </div>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            <a href="#about" className="transition hover:text-white">
              About
            </a>
            <a href="#terms" className="transition hover:text-white">
              Terms
            </a>
            <a href="#privacy" className="transition hover:text-white">
              Privacy
            </a>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </nav>
          <p>© {new Date().getFullYear()} ACC GS Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
