import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import CountUpText from './CountUpText'
import { useStrings } from '../i18n'

export default function Problem() {
  const s = useStrings().problem

  return (
    <section className="relative overflow-hidden bg-bg py-16 md:py-24">
      <div className="glow-moss pointer-events-none absolute -left-48 top-0 h-[30rem] w-[30rem]" />
      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} accent={s.accent} subtext={s.subtext} />

        <div className="mt-14 grid gap-5 sm:grid-cols-3 md:gap-6">
          {s.stats.map((stat, i) => (
            <motion.div
              key={stat.figure}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-80px' }}
              className="glass rounded-3xl p-8"
            >
              <p className="text-gradient font-display text-5xl md:text-6xl">
                <CountUpText text={stat.figure} />
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
