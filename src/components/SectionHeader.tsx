import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  eyebrow: string
  title: ReactNode
  accent?: string
  subtext?: string
}

/** Shared section header: eyebrow rule, heading with italic serif accent word. */
export default function SectionHeader({ eyebrow, title, accent, subtext }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-8 bg-moss/50" />
        <span className="text-xs uppercase tracking-[0.3em] text-moss">{eyebrow}</span>
      </div>
      <h2 className="max-w-3xl text-4xl font-medium tracking-tight text-text-primary md:text-5xl">
        {title}
        {accent && (
          <>
            {' '}
            <span className="font-display italic font-normal">{accent}</span>
          </>
        )}
      </h2>
      {subtext && <p className="mt-4 max-w-xl leading-relaxed text-muted">{subtext}</p>}
    </motion.div>
  )
}
