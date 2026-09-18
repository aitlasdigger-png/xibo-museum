import { useEffect, useRef, type ReactNode } from 'react'

export default function Observe({ onEnter, children, className }: { onEnter: () => void; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const cb = useRef(onEnter)
  cb.current = onEnter
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) cb.current() }),
      { threshold: 0.45 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={className}>{children}</div>
}
