import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks'
import { useStrings } from '../i18n'

const COUNT_DURATION = 2400

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const reduced = usePrefersReducedMotion()
  const words = useStrings().loading.words
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (reduced) {
      onCompleteRef.current()
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / COUNT_DURATION)
      setCount(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => onCompleteRef.current(), 400)
    }
    raf = requestAnimationFrame(tick)
    const wordTimer = setInterval(() => setWordIndex((i) => i + 1), 800)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(wordTimer)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-bg"
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
      aria-hidden="true"
    >
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute left-6 top-6 text-xs uppercase tracking-[0.3em] text-muted md:left-10 md:top-8"
      >
        Delta FluvAI
      </motion.p>

      <div className="flex h-full items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex % words.length}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="font-display text-4xl italic text-text-primary/80 md:text-6xl lg:text-7xl"
          >
            {words[wordIndex % words.length]}
          </motion.span>
        </AnimatePresence>
      </div>

      <p className="absolute bottom-10 right-6 font-display text-6xl tabular-nums text-text-primary md:right-10 md:text-8xl lg:text-9xl">
        {String(count).padStart(3, '0')}
      </p>

      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-stroke/50">
        <div
          className="accent-gradient h-full origin-left"
          style={{
            transform: `scaleX(${count / 100})`,
            boxShadow: '0 0 8px rgba(91, 147, 255, 0.35)',
          }}
        />
      </div>
    </motion.div>
  )
}
