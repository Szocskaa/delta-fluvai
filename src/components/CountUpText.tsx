import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks'

/** Renders text with every number in it counting up from 0 once scrolled into view. */
export default function CountUpText({
  text,
  duration = 1400,
}: {
  text: string
  duration?: number
}) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [progress, setProgress] = useState(reduced ? 1 : 0)

  useEffect(() => {
    if (reduced) {
      setProgress(1)
      return
    }
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          setProgress(1 - Math.pow(1 - p, 3))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [reduced, duration])

  const rendered = text.replace(/\d+/g, (m) => String(Math.round(Number(m) * progress)))
  return (
    <span ref={ref} className="tabular-nums">
      {rendered}
    </span>
  )
}
