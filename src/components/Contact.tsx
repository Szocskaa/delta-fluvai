import { useEffect, useRef, useState, type FormEvent } from 'react'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks'
import { useStrings } from '../i18n'

export default function Contact() {
  const reduced = usePrefersReducedMotion()
  const s = useStrings().contact
  const sectionRef = useRef<HTMLElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [sent, setSent] = useState(false)

  // endless marquee
  useEffect(() => {
    if (reduced || !marqueeRef.current) return
    const tween = gsap.to(marqueeRef.current, {
      xPercent: -50,
      duration: 40,
      ease: 'none',
      repeat: -1,
    })
    return () => {
      tween.kill()
    }
  }, [reduced])

  // background video only plays while the section is on screen
  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.05 },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [reduced])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: wire up to a form backend or booking link
    setSent(true)
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-bg pb-16 pt-16 md:pb-24 md:pt-20"
    >
      {/* Flipped morph video as ambient background */}
      {!reduced && (
        <video
          ref={videoRef}
          src="/hero-reveal.mp4"
          poster="/hero-poster.jpg"
          className="absolute inset-0 h-full w-full scale-y-[-1] object-cover opacity-70"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative">
        {/* Marquee */}
        <div className="overflow-hidden whitespace-nowrap py-6" aria-hidden="true">
          <div ref={marqueeRef} className="inline-flex will-change-transform">
            {[0, 1].map((half) => (
              <span
                key={half}
                className="font-display text-4xl italic text-moss/25 sm:text-5xl md:text-7xl"
              >
                {s.marquee.repeat(5)}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[1200px] px-6 md:mt-16 md:px-10 lg:px-16">
          <div className="grid gap-14 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-stroke" />
                <span className="text-xs uppercase tracking-[0.3em] text-muted">{s.eyebrow}</span>
              </div>
              <h2 className="max-w-xl text-4xl font-medium tracking-tight text-text-primary md:text-5xl">
                {s.title}{' '}
                <span className="font-display italic font-normal">{s.accent}</span>
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-muted">{s.body}</p>
              <a
                href="mailto:hello@deltafluvai.com"
                className="group relative mt-8 inline-flex rounded-full"
              >
                <span className="accent-gradient-animated absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex items-center gap-2 rounded-full border-2 border-stroke bg-bg px-7 py-3.5 text-sm font-medium text-text-primary transition-colors duration-300 group-hover:border-transparent">
                  hello@deltafluvai.com <span aria-hidden="true">↗</span>
                </span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-100px' }}
              className="glass rounded-3xl p-8"
            >
              {sent ? (
                <div className="flex h-full flex-col items-start justify-center">
                  <h3 className="font-display text-3xl italic text-text-primary">{s.sentTitle}</h3>
                  <p className="mt-3 text-muted">{s.sentBody}</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm text-text-primary/85">
                        {s.formName}
                      </span>
                      <input
                        required
                        type="text"
                        name="name"
                        autoComplete="name"
                        className="w-full rounded-xl border border-stroke bg-bg/60 px-4 py-2.5 text-sm text-text-primary placeholder-muted/50 focus:border-accent focus:outline-none"
                        placeholder={s.formNamePlaceholder}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm text-text-primary/85">
                        {s.formEmail}
                      </span>
                      <input
                        required
                        type="email"
                        name="email"
                        autoComplete="email"
                        className="w-full rounded-xl border border-stroke bg-bg/60 px-4 py-2.5 text-sm text-text-primary placeholder-muted/50 focus:border-accent focus:outline-none"
                        placeholder={s.formEmailPlaceholder}
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-sm text-text-primary/85">
                      {s.formMessage}
                    </span>
                    <textarea
                      name="message"
                      rows={4}
                      className="w-full rounded-xl border border-stroke bg-bg/60 px-4 py-2.5 text-sm text-text-primary placeholder-muted/50 focus:border-accent focus:outline-none"
                      placeholder={s.formMessagePlaceholder}
                    />
                  </label>
                  <button
                    type="submit"
                    className="accent-gradient-animated btn-shine group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(42,111,232,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(42,111,232,0.6)] active:scale-95"
                  >
                    {s.formSubmit}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      ↗
                    </span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
