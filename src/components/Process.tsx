import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeader from './SectionHeader'
import { usePrefersReducedMotion } from '../hooks'
import { useStrings } from '../i18n'

gsap.registerPlugin(ScrollTrigger)

export default function Process() {
  const s = useStrings().process
  const reduced = usePrefersReducedMotion()
  const lineRef = useRef<HTMLDivElement>(null)

  // moss→blue line draws itself across the section as it scrolls in
  useEffect(() => {
    if (reduced || !lineRef.current) return
    const tween = gsap.fromTo(
      lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: lineRef.current, start: 'top 90%', end: 'top 40%', scrub: true },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reduced])

  return (
    <section id="process" className="scroll-mt-24 bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} accent={s.accent} subtext={s.subtext} />

        <div ref={lineRef} className="accent-gradient mt-14 h-px origin-left" />

        <ol className="mt-6 grid gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {s.steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-80px' }}
              className="glass group rounded-3xl p-8 transition-colors hover:bg-white/[0.06]"
            >
              <p className="font-display text-5xl italic text-muted/50 transition-colors group-hover:text-moss">
                0{i + 1}
              </p>
              <h3 className="mt-6 text-xl font-medium text-text-primary">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
