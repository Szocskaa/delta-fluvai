import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { useStrings } from '../i18n'

const HIGHLIGHTED_INDEX = 1

export default function Pricing() {
  const s = useStrings().pricing

  return (
    <section id="pricing" className="scroll-mt-24 bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} accent={s.accent} subtext={s.subtext} />

        <div className="mt-14 grid gap-5 md:gap-6 lg:grid-cols-3">
          {s.tiers.map((tier, i) => {
            const highlighted = i === HIGHLIGHTED_INDEX
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                viewport={{ once: true, margin: '-80px' }}
                className={highlighted ? 'accent-gradient rounded-3xl p-[1px]' : ''}
              >
                <div
                  className={`flex h-full flex-col rounded-3xl p-8 ${
                    highlighted ? 'glass rounded-[calc(1.5rem-1px)] !bg-bg/80' : 'glass'
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-medium text-text-primary">{tier.name}</h3>
                    <span className="text-xs text-muted">{tier.detail}</span>
                  </div>
                  <p className="mt-3 font-display text-4xl italic text-text-primary">
                    {tier.price}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{tier.description}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm text-text-primary/85"
                      >
                        <Check size={16} className="mt-0.5 shrink-0 text-moss" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition hover:scale-105 ${
                      highlighted
                        ? 'bg-text-primary text-bg'
                        : 'border-2 border-stroke text-text-primary hover:border-accent/60'
                    }`}
                  >
                    {tier.cta}
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
