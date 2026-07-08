import { motion } from 'framer-motion'
import { useStrings } from '../i18n'

/** Mid-page conversion point between the proof (Work) and the details. */
export default function CTABanner() {
  const s = useStrings().banner

  return (
    <section className="bg-bg py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true, margin: '-80px' }}
        className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16"
      >
        <div className="glass relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl p-8 md:flex-row md:items-center md:p-12">
          <div className="glow-moss pointer-events-none absolute -right-24 -top-24 h-80 w-80" />
          <div className="glow-blue pointer-events-none absolute -bottom-24 -left-24 h-72 w-72" />
          <h3 className="relative max-w-xl text-2xl font-medium tracking-tight text-text-primary md:text-3xl">
            {s.title}{' '}
            <span className="text-gradient font-display italic font-normal">{s.accent}</span>
          </h3>
          <a
            href="#contact"
            className="accent-gradient-animated btn-shine group relative flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(42,111,232,0.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_36px_rgba(42,111,232,0.65)] active:scale-95"
          >
            {s.cta}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  )
}
