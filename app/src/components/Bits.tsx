import { useState, type ReactNode } from 'react'
import { PAL } from '@/lib/palette'
import { useLang, L } from '@/lib/i18n'

/** 朱砂印章 */
export function Seal({ text = '锡伯', size = 40 }: { text?: string; size?: number }) {
  return (
    <div
      aria-hidden
      style={{
        width: size, height: size, background: PAL.vermil, color: '#f3e6d2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Noto Serif SC', serif", fontWeight: 700,
        fontSize: size * 0.3, lineHeight: 1, letterSpacing: -1,
        borderRadius: 3, boxShadow: `0 2px 10px ${PAL.vermil}55, inset 0 0 0 2px #f3e6d244`,
        flexShrink: 0, flexWrap: 'wrap', alignContent: 'center', padding: 2,
      }}
    >
      {text}
    </div>
  )
}

export function Kicker({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <p style={{
      color: light ? PAL.paperDk : PAL.vermil, letterSpacing: '0.35em', textTransform: 'uppercase',
      fontSize: 11, fontWeight: 600, marginBottom: 10, opacity: light ? 0.7 : 1,
    }}>
      {children}
    </p>
  )
}

export function ActTitle({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <h2 className="font-display" style={{
      fontSize: 'clamp(28px, 4.5vw, 46px)', lineHeight: 1.15, fontWeight: 700,
      color: light ? PAL.paperLt : PAL.inkDeep, margin: '0 0 14px',
    }}>
      {children}
    </h2>
  )
}

export function Lead({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <p style={{
      fontSize: 'clamp(15px, 1.6vw, 17px)', lineHeight: 1.9,
      color: light ? `${PAL.paperDk}cc` : PAL.sepia, maxWidth: 640,
    }}>
      {children}
    </p>
  )
}

export function Hairline({ center }: { center?: boolean }) {
  return (
    <div style={{
      height: 1, margin: '18px 0',
      background: `linear-gradient(90deg, transparent, ${PAL.sepia}88, transparent)`,
      width: center ? 180 : '100%', marginLeft: center ? 'auto' : 0, marginRight: center ? 'auto' : 0,
    }} />
  )
}

/** 史料依据（可折叠） */
export function Sources({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false)
  const { t } = useLang()
  if (!items?.length) return null
  return (
    <div style={{ marginTop: 14 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none', border: `1px solid ${PAL.sepia}66`, borderRadius: 3, cursor: 'pointer',
          color: PAL.sepia, fontSize: 11, letterSpacing: '0.15em', padding: '4px 10px',
        }}
      >
        {open ? '− ' : '+ '}{t('dossier_sources')}
      </button>
      {open && (
        <ul style={{ margin: '8px 0 0', padding: '0 0 0 4px', listStyle: 'none' }}>
          {items.map((s, i) => (
            <li key={i} style={{ color: PAL.sepia, fontSize: 12.5, lineHeight: 1.8, paddingLeft: 14, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: PAL.vermil }}>·</span>{s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** 引文块 */
export function QuoteBlock({ zh, en, source, light }: { zh: string; en: string; source: string; light?: boolean }) {
  const { lang } = useLang()
  return (
    <blockquote style={{
      borderLeft: `3px solid ${PAL.vermil}`, padding: '4px 0 4px 18px', margin: '20px 0',
      maxWidth: 620,
    }}>
      <p className="font-display" style={{
        fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 2, fontStyle: lang === 'en' ? 'italic' : 'normal',
        color: light ? PAL.paperLt : PAL.ink, margin: 0,
      }}>
        {L(lang, zh, en)}
      </p>
      <cite style={{ display: 'block', marginTop: 8, fontSize: 12, color: light ? `${PAL.paperDk}aa` : PAL.sepia, fontStyle: 'normal', letterSpacing: '0.1em' }}>
        —— {source}
      </cite>
    </blockquote>
  )
}

/** 数字条 */
export function StatStrip({ items }: { items: { value: string; label_zh: string; label_en: string }[] }) {
  const { lang } = useLang()
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      border: `1px solid ${PAL.sepia}55`, background: `${PAL.paperLt}`,
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          padding: '18px 16px', borderLeft: i ? `1px solid ${PAL.sepia}44` : 'none',
        }}>
          <div className="font-display" style={{ fontSize: 26, fontWeight: 700, color: PAL.vermil, lineHeight: 1.1 }}>{it.value}</div>
          <div style={{ fontSize: 12, color: PAL.sepia, marginTop: 6, lineHeight: 1.6 }}>{L(lang, it.label_zh, it.label_en)}</div>
        </div>
      ))}
    </div>
  )
}

/** 档案图片（纸纹框 + 说明条 + 加载失败回退） */
export function ArchImg({ src, caption, ratio = '3 / 2', alt = '' }: { src: string; caption?: string; ratio?: string; alt?: string }) {
  const [err, setErr] = useState(false)
  if (err) return null
  return (
    <figure style={{ margin: 0, position: 'relative', border: `1px solid ${PAL.sepia}66`, background: PAL.paperDk, padding: 6 }}>
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: ratio }}>
        <img
          src={src} alt={alt} loading="lazy" onError={() => setErr(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'sepia(0.18) contrast(1.02)' }}
        />
      </div>
      {caption && (
        <figcaption style={{
          fontSize: 11, color: PAL.sepia, letterSpacing: '0.08em', padding: '7px 4px 2px', lineHeight: 1.5,
        }}>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** 小徽章 */
export function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: 11, letterSpacing: '0.08em',
      border: `1px solid ${color ?? PAL.sepia}88`, color: color ?? PAL.sepia,
      borderRadius: 2, padding: '2px 8px', marginRight: 6, marginBottom: 4, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}
