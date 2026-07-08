type Props = {
  withText?: boolean
  className?: string
}

/** Brand lockup: gradient-ring ΔF badge + serif italic name. */
export default function Wordmark({ withText = true, className = '' }: Props) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className="accent-gradient flex h-9 w-9 shrink-0 rounded-full p-[2px]">
        <span className="flex h-full w-full items-center justify-center rounded-full bg-bg">
          <span className="font-display text-[14px] italic leading-none text-text-primary">
            ΔF
          </span>
        </span>
      </span>
      {withText && (
        <span className="font-display text-xl italic leading-none text-text-primary">
          Delta FluvAI
        </span>
      )}
    </span>
  )
}
