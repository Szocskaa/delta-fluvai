import { useEffect, useState } from 'react'
import { useLang } from '../i18n'
import type { Lang } from '../strings'
import Wordmark from './Wordmark'

export default function Nav() {
  const { lang, setLang, s } = useLang()
  const [scrolled, setScrolled] = useState(false)

  const links = [
    { label: s.nav.approach, href: '#approach' },
    { label: s.nav.process, href: '#process' },
    { label: s.nav.work, href: '#work' },
    { label: s.nav.pricing, href: '#pricing' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-4 md:pt-6">
      <div className="relative flex items-center justify-between md:justify-center">
        <nav
          className={`glass inline-flex items-center rounded-full px-2 py-2 transition-shadow ${
            scrolled ? 'shadow-lg shadow-black/40' : ''
          }`}
          aria-label="Main navigation"
        >
          {/* Logo — ΔF badge */}
          <a
            href="#top"
            aria-label="Delta FluvAI — back to top"
            className="shrink-0 transition-transform duration-300 hover:scale-110"
          >
            <Wordmark withText={false} />
          </a>

          <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />

          <div className="hidden items-center sm:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-xs text-muted transition hover:bg-stroke/50 hover:text-text-primary sm:px-4 sm:py-2 sm:text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>

          <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />

          {/* Primary CTA — always visible */}
          <a
            href="#contact"
            className="accent-gradient-animated btn-shine group ml-1 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-[0_0_18px_rgba(42,111,232,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_26px_rgba(42,111,232,0.6)] active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            {s.nav.bookCall}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>
        </nav>

        {/* Language switcher — top right */}
        <div
          className="glass inline-flex items-center rounded-full p-1 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2"
          role="group"
          aria-label="Language"
        >
          {(['en', 'hu'] as Lang[]).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-pressed={lang === code}
              className={`rounded-full px-2.5 py-1.5 text-xs font-medium uppercase transition sm:px-3 ${
                lang === code
                  ? 'bg-stroke/70 text-text-primary'
                  : 'text-muted hover:text-text-primary'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
