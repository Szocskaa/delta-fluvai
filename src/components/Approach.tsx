import { motion } from 'framer-motion'
import { EyeOff, Lock, Server } from 'lucide-react'
import { useStrings } from '../i18n'

const BULLET_ICONS = [EyeOff, Lock, Server]

export default function Approach() {
  const s = useStrings().approach

  const cards = [
    { line1: s.card1Line1, line2: s.card1Line2, body: s.card1Body, tagline: s.card1Tagline },
    { line1: s.card2Line1, line2: s.card2Line2, body: s.card2Body, tagline: s.card2Tagline },
  ]

  return (
    <section id="approach" className="relative scroll-mt-24 overflow-hidden bg-bg py-16 md:py-24">
      {/* ambient moss pool */}
      <div className="glow-moss pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem]" />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-moss/50" />
            <span className="text-xs uppercase tracking-[0.3em] text-moss">{s.eyebrow}</span>
          </div>
          {/* two statements, two lines — both carry equal weight */}
          <h2 className="max-w-3xl text-4xl font-medium tracking-tight text-text-primary md:text-5xl">
            <span className="block">
              {s.line1}{' '}
              <span className="font-display italic font-normal text-moss-bright">
                {s.line1Accent}
              </span>
            </span>
            <span className="mt-4 block md:mt-6">
              {s.line2}{' '}
              <span className="text-gradient font-display italic font-normal">
                {s.line2Accent}
              </span>
            </span>
          </h2>
          <p className="mt-6 max-w-xl leading-relaxed text-muted">{s.subtext}</p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:gap-6 lg:grid-cols-2">
          {cards.map((card, i) => (
            <motion.div
              key={card.line1}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-80px' }}
              className="glass rounded-3xl p-8 transition-colors hover:bg-white/[0.06]"
            >
              <p className="font-display text-3xl italic text-text-primary">{card.line1}</p>
              <p className="text-3xl font-medium tracking-tight text-text-primary">{card.line2}</p>
              <p className="mt-5 leading-relaxed text-muted">{card.body}</p>
              <p className="mt-5 text-sm text-moss-bright">{card.tagline}</p>
            </motion.div>
          ))}
        </div>

        {/* Privacy-first — gradient border panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: '-80px' }}
          className="accent-gradient mt-5 rounded-3xl p-[1px] md:mt-6"
        >
          <div className="glass rounded-[calc(1.5rem-1px)] !bg-bg/80 p-8">
            <h3 className="text-2xl font-medium tracking-tight text-text-primary md:text-3xl">
              {s.privacyTitle}{' '}
              <span className="font-display italic font-normal">{s.privacyAccent}</span>
            </h3>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">{s.privacyBody}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {s.privacyBullets.map((bullet, i) => {
                const Icon = BULLET_ICONS[i]
                return (
                  <div key={bullet.strong} className="flex items-start gap-3">
                    <Icon size={20} className="mt-0.5 shrink-0 text-moss" />
                    <p className="text-sm leading-relaxed text-text-primary/85">
                      <span className="font-medium text-text-primary">{bullet.strong}</span>{' '}
                      {bullet.rest}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
