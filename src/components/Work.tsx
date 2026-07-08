import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeader from './SectionHeader'
import { usePrefersReducedMotion, useIsTouchDevice } from '../hooks'
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
  const isTouch = useIsTouchDevice()
  const gridRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // touch devices have no hover: spotlight whichever card is nearest the
  // viewport centre as the visitor scrolls, so the outcome metric surfaces
  // on its own instead of requiring a hover that can never happen
  useEffect(() => {
    if (!isTouch || reduced) return
    const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null)
    if (!cards.length) return

    const io = new IntersectionObserver(
      (entries) => {
        let bestIndex: number | null = null
        let bestRatio = 0
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = cards.indexOf(entry.target as HTMLDivElement)
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            bestIndex = index
          }
        })
        if (bestIndex !== null) setActiveIndex(bestIndex)
      },
      // a thin band around the vertical centre of the screen — whichever
      // card occupies it the most "wins" the spotlight
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-35% 0px -35% 0px' },
    )
    cards.forEach((card) => io.observe(card))
    return () => io.disconnect()
  }, [isTouch, reduced])

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
            const revealed = isTouch && activeIndex === i
            return (
              <motion.div
                key={c.title}
                ref={(el) => {
                  cardRefs.current[i] = el
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                viewport={{ once: true, margin: '-80px' }}
                onClick={() => isTouch && setActiveIndex((prev) => (prev === i ? null : i))}
                role={isTouch ? 'button' : undefined}
                aria-pressed={isTouch ? revealed : undefined}
                aria-label={isTouch ? `${c.title}: ${revealed ? c.metric : 'tap to reveal result'}` : undefined}
                className={`group relative overflow-hidden rounded-3xl border border-stroke bg-surface ${layout.span} ${layout.aspect} ${isTouch ? 'cursor-pointer' : ''}`}
              >
                {/* parallax wrapper — gsap owns its transform; the img keeps its own hover scale */}
                <div data-parallax className="absolute inset-0">
                  <img
                    src={layout.image}
                    alt={c.title}
                    loading="lazy"
                    className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.16] ${revealed ? 'scale-[1.16]' : 'scale-110'}`}
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
                {/* touch affordance — signals the card is tappable before it's ever been revealed */}
                {isTouch && (
                  <div
                    className={`absolute right-4 top-4 z-30 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-text-primary backdrop-blur-md transition-opacity duration-300 ${revealed ? 'opacity-0' : 'opacity-100'}`}
                  >
                    <span aria-hidden="true">↕</span> tap
                  </div>
                )}
                {/* outcome overlay — hover reveals it on desktop; on touch it's driven by
                    scroll position (spotlight) and can be toggled with a tap */}
                <div
                  className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-bg/70 backdrop-blur-lg transition-opacity duration-500 group-hover:opacity-100 ${revealed ? 'opacity-100' : 'opacity-0'}`}
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
