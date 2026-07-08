import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../hooks'
import { useStrings } from '../i18n'

gsap.registerPlugin(ScrollTrigger)

const POS_EASE = 0.085
const RADIUS_EASE = 0.06
const IDLE_RESUME_MS = 4000

/**
 * Total camera creep baked into the clip (measured ~0.9%/s via SSIM
 * scale-sweep → ~6.5% over the 7s morph). The video is counter-scaled
 * (1 + k)/(1 + k·p) each frame and the base still held at (1 + k), so the
 * apparent geometry is constant and the creep cancels out exactly.
 * Tune this single number if a regenerated clip drifts more or less.
 */
const CLIP_ZOOM_TOTAL = 0.065

/**
 * Spotlight-reveal hero.
 *
 * The morph video (river delta → neuron brain, boomerang loop) shows through
 * a feathered circle that lags behind the cursor. A second, smaller circle
 * overlays the fully-transformed brain still, with opacity tied to the
 * video's own morph progress — so the transformation always reads as most
 * advanced at the exact point the user is pointing at, easing back out to
 * the untouched river delta at the circle's edge.
 *
 * With no pointer (page load, touch devices, cursor off the hero) the reveal
 * drifts on its own along a slow Lissajous path; a touch-drag takes over
 * directly and the drift resumes after a few idle seconds.
 */
export default function Hero({ started }: { started: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const s = useStrings()
  const [wordIndex, setWordIndex] = useState(0)

  // content drifts up and fades as the hero scrolls out — hands the eye to the next section
  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return
    const tween = gsap.to(content, {
      yPercent: -16,
      opacity: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom 30%', scrub: true },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reducedMotion])

  // cycling "what we automate" word
  useEffect(() => {
    if (reducedMotion) return
    const timer = setInterval(() => setWordIndex((i) => i + 1), 2000)
    return () => clearInterval(timer)
  }, [reducedMotion])

  // entrance animation, after the loading screen finishes
  useEffect(() => {
    if (!started || reducedMotion || !sectionRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.name-reveal', { opacity: 0, y: 50, duration: 1.2, delay: 0.1 })
      tl.from(
        '.blur-in',
        { opacity: 0, filter: 'blur(10px)', y: 20, duration: 1, stagger: 0.1 },
        0.3,
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [started, reducedMotion])

  // reveal effect
  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    const pos = { x: section.clientWidth * 0.62, y: section.clientHeight * 0.42 }
    const target = { x: pos.x, y: pos.y }
    let radius = 0
    let targetRadius = 0
    let drifting = true
    let visible = true
    let rafId = 0
    let idleTimer: ReturnType<typeof setTimeout> | undefined
    const t0 = performance.now()
    // internal playback clock — video.currentTime stair-steps at the media
    // framerate, which makes anything derived from it visibly vibrate
    let clock = video.currentTime
    let lastNow = t0

    const maxRadius = () =>
      Math.min(360, Math.max(180, Math.min(section.clientWidth, section.clientHeight) * 0.285))

    const resumeDriftAfterIdle = () => {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        drifting = true
      }, IDLE_RESUME_MS)
    }

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame)
      const dt = Math.min(0.1, (now - lastNow) / 1000)
      lastNow = now
      if (!visible) return

      if (drifting) {
        const t = (now - t0) / 1000
        const w = section.clientWidth
        const h = section.clientHeight
        target.x = w * (0.52 + 0.26 * Math.sin(t * 0.19) + 0.07 * Math.sin(t * 0.47))
        target.y = h * (0.44 + 0.18 * Math.sin(t * 0.14 + 1.7) + 0.05 * Math.cos(t * 0.37))
        targetRadius = maxRadius() * 0.85
      }

      pos.x += (target.x - pos.x) * POS_EASE
      pos.y += (target.y - pos.y) * POS_EASE
      radius += (targetRadius - radius) * RADIUS_EASE

      // Morph progress from the boomerang clip: 0 = river delta, 1 = brain.
      // Advance our own clock by wall time and only *softly* correct toward
      // video.currentTime, so the derived zoom is perfectly continuous.
      const duration = video.duration || 14
      if (!video.paused && !video.ended) clock += dt
      const drift = video.currentTime - clock
      if (Math.abs(drift) > 0.25) clock = video.currentTime // seek or loop wrap
      else clock += drift * 0.04
      if (clock > duration) clock -= duration
      if (clock < 0) clock = 0
      const half = duration / 2
      const progress = clock <= half ? clock / half : (duration - clock) / half

      const style = section.style
      style.setProperty('--mx', pos.x.toFixed(1))
      style.setProperty('--my', pos.y.toFixed(1))
      style.setProperty('--r', radius.toFixed(1))
      // breathe the video opposite its baked-in creep so geometry stays put
      style.setProperty(
        '--vzoom',
        ((1 + CLIP_ZOOM_TOTAL) / (1 + CLIP_ZOOM_TOTAL * progress)).toFixed(4),
      )
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      target.x = e.clientX - rect.left
      target.y = e.clientY - rect.top
      drifting = false
      targetRadius = maxRadius() * (e.pointerType === 'touch' ? 0.72 : 1)
      if (e.pointerType === 'touch') resumeDriftAfterIdle()
    }

    const onPointerLeave = () => {
      if (!isCoarsePointer) targetRadius = 0
      resumeDriftAfterIdle()
    }

    section.addEventListener('pointermove', onPointerMove)
    section.addEventListener('pointerdown', onPointerMove)
    section.addEventListener('pointerleave', onPointerLeave)

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) void video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.05 },
    )
    io.observe(section)

    // frame 0 content is magnified to match the constant apparent geometry
    section.style.setProperty('--bzoom', (1 + CLIP_ZOOM_TOTAL).toFixed(4))

    targetRadius = maxRadius() * 0.85
    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(idleTimer)
      io.disconnect()
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerdown', onPointerMove)
      section.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative h-svh min-h-[640px] overflow-hidden"
      aria-label="Delta FluvAI — where data becomes intelligence"
    >
      {reducedMotion ? (
        <>
          <img
            src="/hero-delta.jpg"
            alt=""
            className="hero-media"
            fetchPriority="high"
            draggable={false}
          />
          <img
            src="/hero-brain.jpg"
            alt=""
            className="hero-media hero-static-reveal"
            draggable={false}
          />
        </>
      ) : (
        <>
          {/* Morph video — runs fully visible underneath everything */}
          <div className="hero-video-layer" aria-hidden="true">
            <video
              ref={videoRef}
              src="/hero-reveal.mp4"
              poster="/hero-poster.jpg"
              className="hero-media hero-video-inner"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
          {/* Cover still at partial opacity — the morph shimmers through
              everywhere, and the cursor circle cuts a feathered hole in it */}
          <div className="hero-base-layer">
            <img
              src="/hero-delta.jpg"
              alt=""
              className="hero-media hero-base-inner"
              fetchPriority="high"
              draggable={false}
            />
          </div>
        </>
      )}

      {/* Scrims for text legibility over both light water and dark CGI tones */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/60 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent" />

      {/* Centered copy */}
      <div
        ref={contentRef}
        className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center sm:px-6"
      >
        <p className="blur-in mb-8 text-xs uppercase tracking-[0.3em] text-text-primary/70">
          {s.hero.eyebrow}
        </p>
        <h1 className="name-reveal mb-6 text-5xl font-medium leading-[0.95] tracking-tight text-text-primary drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)] sm:text-7xl lg:text-8xl xl:text-9xl">
          {s.hero.line1}
          <br />
          <span className="text-gradient font-display italic">{s.hero.line2}</span>
        </h1>
        <p className="blur-in mb-4 text-base text-text-primary/85 md:text-lg">
          {s.hero.cyclePrefix}
          <span
            key={wordIndex % s.hero.cycleWords.length}
            className="animate-role-fade-in inline-block font-display italic text-moss-bright"
          >
            {s.hero.cycleWords[wordIndex % s.hero.cycleWords.length]}
          </span>
          {s.hero.cycleSuffix}
        </p>
        <p className="blur-in mb-12 max-w-md text-sm text-text-primary/60 md:text-base">
          {s.hero.description}
        </p>
        <div className="blur-in inline-flex flex-wrap items-center justify-center gap-4">
          <a
            href="#contact"
            className="accent-gradient-animated btn-shine group flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(42,111,232,0.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_36px_rgba(42,111,232,0.65)] active:scale-95"
          >
            {s.hero.ctaPrimary}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
          <a href="#process" className="group relative rounded-full transition-transform duration-300 hover:scale-105 active:scale-95">
            <span className="accent-gradient-animated absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="btn-shine glass relative flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-text-primary transition-colors duration-300">
              {s.hero.ctaSecondary}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-y-1"
              >
                ↓
              </span>
            </span>
          </a>
        </div>

        {/* Trust chips */}
        <ul className="blur-in mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {s.hero.chips.map((chip) => (
            <li
              key={chip}
              className="glass flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-text-primary/75"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-moss" />
              {chip}
            </li>
          ))}
        </ul>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">{s.hero.scroll}</span>
        <span className="relative h-10 w-px overflow-hidden bg-stroke">
          <span className="animate-scroll-down absolute inset-x-0 h-1/2 bg-moss" />
        </span>
      </div>
    </section>
  )
}
