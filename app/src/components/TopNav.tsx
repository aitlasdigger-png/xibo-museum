import { useEffect, useState } from 'react'
import { useLang, type DictKey } from '@/lib/i18n'
import { PAL } from '@/lib/palette'
import { Seal } from './Bits'

const LINKS: { id: string; key: DictKey; isSong?: boolean }[] = [
  { id: 'prologue', key: 'nav_prologue' },
  { id: 'act1', key: 'nav_act1' },
  { id: 'act2', key: 'nav_act2' },
  { id: 'act3', key: 'nav_act3' },
  { id: 'act4', key: 'nav_act4' },
  { id: 'act5', key: 'nav_act5' },
  { id: '/song', key: 'nav_song', isSong: true },
]

export default function TopNav({ onSongClick }: { onSongClick?: () => void }) {
  const { lang, setLang, t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    fn(); window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof LINKS[number]) => {
    if (link.isSong && onSongClick) {
      e.preventDefault()
      onSongClick()
    }
  }

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? `${PAL.paper}f2` : 'transparent',
      backdropFilter: scrolled ? 'blur(6px)' : 'none',
      borderBottom: scrolled ? `1px solid ${PAL.sepia}44` : '1px solid transparent',
      transition: 'all 0.35s',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <a href="#prologue" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Seal size={34} />
          <span className="font-display" style={{ color: PAL.inkDeep, fontWeight: 700, fontSize: 17, letterSpacing: '0.04em' }}>
            {t('brand_zh')} <span style={{ color: PAL.sepia, fontWeight: 500, fontSize: 13 }}>{t('brand_en')}</span>
          </span>
        </a>
        <nav style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }} className="topnav-links">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => handleClick(e, l)}
              style={{
                color: PAL.ink, textDecoration: 'none', fontSize: 12.5, letterSpacing: '0.06em', padding: '6px 10px',
                borderRadius: 3,
                ...(l.isSong ? { border: `1px solid ${PAL.vermil}`, color: PAL.vermil, fontWeight: 600 } : {}),
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = PAL.vermil)}
              onMouseLeave={(e) => (e.currentTarget.style.color = l.isSong ? PAL.vermil : PAL.ink)}
            >
              {t(l.key)}
            </a>
          ))}
          <button
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            style={{
              marginLeft: 10, cursor: 'pointer', fontSize: 12, letterSpacing: '0.1em',
              border: `1px solid ${PAL.sepia}`, color: PAL.sepia, background: 'transparent',
              borderRadius: 3, padding: '5px 12px', fontWeight: 600,
            }}
          >
            {t('lang_toggle')}
          </button>
        </nav>
      </div>
    </header>
  )
}
