import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeader from './SectionHeader'
import { usePrefersReducedMotion } from '../hooks'
import { useStrings } from '../i18n'

gsap.registerPlugin(ScrollTrigger)

const CARD_LAYOUT = [
  { image: '/work/invoice.jpg', span: 'md:col-span-7', aspect: 'aspect-[4/3] md:aspect-[16/10]' },
  { image: '/work/triage.jpg', span: 'md:col-span-5', aspect: 'aspect-[4/3]' },
  { image: '/work/reporting.jpg', span: 'md:col-span-5', aspect: 'aspect-[4/3]' },
  { image: '/work/governance.jpg', span: 'md:col-span-7', aspect: 'aspect-[4/3] md:aspect-[16/10]' },
]

export default function Work() {
  const s = useStrings().work
  const reduced = usePrefersReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // gentle parallax on the card artwork while scrolling
  useEffect(() => {
    if (reduced || !gridRef.current) return
    const layers = gridRef.current.querySelectorAll<HTMLElement>('[data-parallax]')
    const tweens = Array.from(layers).map((layer) =>
      gsap.fromTo(
        layer,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: layer.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      ),
    )
    return () =>
      tweens.forEach((t) => {
        t.scrollTrigger?.kill()
        t.kill()
      })
  }, [reduced])

  return (
    <section id="work" className="scroll-mt-24 bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} accent={s.accent} subtext={s.subtext} />

        <div ref={gridRef} className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {s.cases.map((c, i) => {
            const layout = CARD_LAYOUT[i]
            const isActive = activeIndex === i
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                viewport={{ once: true, margin: '-80px' }}
                onClick={() => setActiveIndex((prev) => (prev === i ? null : i))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveIndex((prev) => (prev === i ? null : i))
                  }
                }}
                className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-stroke bg-surface ${layout.span} ${layout.aspect}`}
              >
                {/* parallax wrapper — gsap owns its transform; the img keeps its own hover scale */}
                <div data-parallax className="absolute inset-0">
                  <img
                    src={layout.image}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full scale-110 object-cover transition-transform duration-700 group-hover:scale-[1.16]"
                    style={isActive ? { transform: 'scale(1.16)' } : undefined}
                  />
                </div>
                {/* halftone texture */}
                <div className="halftone absolute inset-0 opacity-20 mix-blend-multiply" />
                {/* persistent label */}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16">
                  <p className="text-xs uppercase tracking-[0.2em] text-moss-bright">{c.tag}</p>
                  <h3 className="mt-1 text-xl font-medium text-text-primary md:text-2xl">
                    {c.title}
                  </h3>
                </div>
                {/* hover overlay with the outcome metric — also toggled by tap/keyboard for touch devices */}
                <div
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-bg/70 opacity-0 backdrop-blur-lg transition-opacity duration-500 group-hover:opacity-100"
                  style={isActive ? { opacity: 1 } : undefined}
                >
                  <p className="font-display text-4xl italic text-text-primary md:text-5xl">
                    {c.metric}
                  </p>
                  <p className="px-6 text-center text-sm text-muted">{c.metricLabel}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
