import { useStrings } from '../i18n'
import Wordmark from './Wordmark'

export default function Footer() {
  const s = useStrings().footer

  return (
    <footer className="border-t border-stroke bg-bg py-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center md:px-10 lg:px-16">
        <a href="#top" aria-label="Delta FluvAI — back to top">
          <Wordmark />
        </a>
        <nav className="flex items-center gap-6 text-sm text-muted" aria-label="Footer">
          <a href="#process" className="transition hover:text-text-primary">
            {s.process}
          </a>
          <a href="#approach" className="transition hover:text-text-primary">
            {s.approach}
          </a>
          <a href="#contact" className="transition hover:text-text-primary">
            {s.contact}
          </a>
        </nav>
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-moss" />
          </span>
          <span className="text-xs text-muted">{s.available}</span>
        </div>
        <p className="text-xs text-muted/60">© {new Date().getFullYear()} Delta FluvAI</p>
      </div>
    </footer>
  )
}
