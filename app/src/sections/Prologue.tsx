import { useLang } from '@/lib/i18n'
import { PAL } from '@/lib/palette'
import { Kicker, Seal } from '@/components/Bits'
import content from '@/data/content.json'

// ---------- helpers ----------
function useT() {
  const { lang, t } = useLang()
  const pick = (enKey: string, zhKey: string) => (lang === 'en' ? t(enKey as never) : t(zhKey as never))
  return { lang, t, pick }
}

// ---------- data ----------
const EVIDENCE = [
  { id: '1', titleKey: 'ev1_title', descEn: 'ev1_desc_en', descZh: 'ev1_desc_zh' },
  { id: '2', titleKey: 'ev2_title', descEn: 'ev2_desc_en', descZh: 'ev2_desc_zh' },
  { id: '3', titleKey: 'ev3_title', descEn: 'ev3_desc_en', descZh: 'ev3_desc_zh' },
  { id: '4', titleKey: 'ev4_title', descEn: 'ev4_desc_en', descZh: 'ev4_desc_zh' },
]

const MAP_CELLS = [
  {
    id: 'prologue', href: '#prologue',
    img: '/assets/img/prologue-hero.jpg',
    labelKey: 'nav_prologue',
    storyEn: 'map_prologue_story_en', storyZh: 'map_prologue_story_zh',
    techEn: 'map_prologue_tech_en', techZh: 'map_prologue_tech_zh',
  },
  {
    id: 'act1', href: '#act1',
    img: '/assets/img/mig-departure.jpg',
    labelKey: 'nav_act1',
    storyEn: 'map_act1_story_en', storyZh: 'map_act1_story_zh',
    techEn: 'map_act1_tech_en', techZh: 'map_act1_tech_zh',
  },
  {
    id: 'act2', href: '#act2',
    img: '/assets/img/city-huiyuan-old.jpg',
    labelKey: 'nav_act2',
    storyEn: 'map_act2_story_en', storyZh: 'map_act2_story_zh',
    techEn: 'map_act2_tech_en', techZh: 'map_act2_tech_zh',
  },
  {
    id: 'act3', href: '#act3',
    img: '/assets/img/karun-border-line.jpg',
    labelKey: 'nav_act3',
    storyEn: 'map_act3_story_en', storyZh: 'map_act3_story_zh',
    techEn: 'map_act3_tech_en', techZh: 'map_act3_tech_zh',
  },
  {
    id: 'act4', href: '#act4',
    img: '/assets/img/kurgan-night.jpg',
    labelKey: 'nav_act4',
    storyEn: 'map_act4_story_en', storyZh: 'map_act4_story_zh',
    techEn: 'map_act4_tech_en', techZh: 'map_act4_tech_zh',
  },
  {
    id: 'song', href: '#/song',
    img: '/assets/song/s09.jpg',
    labelKey: 'nav_song',
    storyEn: 'map_song_story_en', storyZh: 'map_song_story_zh',
    techEn: 'map_song_tech_en', techZh: 'map_song_tech_zh',
  },
]

// ---------- components ----------
function EvidenceCard({ item }: { item: typeof EVIDENCE[0] }) {
  const { lang, t } = useLang()
  const desc = lang === 'en' ? t(item.descEn as never) : t(item.descZh as never)
  return (
    <div style={{
      background: 'rgba(36,27,15,0.55)',
      border: `1px solid ${PAL.paperDk}44`,
      borderRadius: 3,
      padding: '18px 16px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontFamily: "'Noto Serif SC', serif",
          fontSize: 13, fontWeight: 700, color: PAL.vermil,
          width: 22, height: 22, border: `1px solid ${PAL.vermil}66`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 2, flexShrink: 0,
        }}>
          {item.id}
        </span>
        <span style={{
          fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: `${PAL.paperDk}cc`, fontWeight: 600, lineHeight: 1.3,
        }}>
          {t(item.titleKey as never)}
        </span>
      </div>
      <p style={{
        fontSize: 12, lineHeight: 1.75, color: `${PAL.paperLt}b8`,
        margin: 0, flex: 1,
      }}>
        {desc}
      </p>
    </div>
  )
}

function MapCell({ cell }: { cell: typeof MAP_CELLS[0] }) {
  const { lang, t } = useLang()
  const story = lang === 'en' ? t(cell.storyEn as never) : t(cell.storyZh as never)
  const tech = lang === 'en' ? t(cell.techEn as never) : t(cell.techZh as never)
  const isSong = cell.id === 'song'
  return (
    <a
      href={cell.href}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        border: `1px solid ${PAL.sepia}55`,
        background: PAL.paperLt,
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 18px ${PAL.inkDeep}22`}
        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'}
      >
        <div style={{ aspectRatio: '16 / 9', overflow: 'hidden' }}>
          <img
            src={cell.img}
            alt=""
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'sepia(0.18) contrast(1.02)' }}
          />
        </div>
        <div style={{ padding: '12px 14px 14px' }}>
          <div style={{
            fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: isSong ? PAL.vermil : PAL.sepia, fontWeight: 700, marginBottom: 6,
          }}>
            {t(cell.labelKey as never)}
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: PAL.inkDeep, margin: '0 0 5px', lineHeight: 1.45 }}>
            {story}
          </p>
          <p style={{ fontSize: 11, color: PAL.sepia, margin: 0, lineHeight: 1.55 }}>
            {tech}
          </p>
        </div>
      </div>
    </a>
  )
}

// ---------- main ----------
export default function Prologue() {
  const { lang, t, pick } = useT()
  const p = content.prologue

  return (
    <>
      {/* ============ SCREEN 1: HERO + EVIDENCE ============ */}
      <section id="prologue" style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        background: PAL.inkDeep, color: PAL.paperLt,
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/assets/img/prologue-hero.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
          opacity: 0.32, filter: 'sepia(0.35) brightness(0.7)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, ${PAL.inkDeep}e6 0%, ${PAL.inkDeep}55 45%, ${PAL.inkDeep}f2 100%)`,
        }} />

        <div style={{ position: 'relative', maxWidth: 1160, margin: '0 auto', padding: '110px 24px 80px', width: '100%' }}>

          {/* ① Seal + Kicker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <Seal size={46} />
            <Kicker light>{t('prologue_kicker')}</Kicker>
          </div>

          {/* ② Title */}
          <h1 className="font-display" style={{
            fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.08, margin: '0 0 6px',
            color: PAL.paperLt, letterSpacing: lang === 'zh' ? '0.06em' : '0',
          }}>
            {t('brand_zh')}
          </h1>
          <p className="font-display" style={{
            fontSize: 'clamp(16px, 2.2vw, 24px)', color: `${PAL.paperDk}bb`, margin: '0 0 28px', letterSpacing: '0.08em',
          }}>
            {t('brand_en')}
          </p>

          {/* ③ Identity line — removed per user request */}
          {/* ④ Project statement */}
          <div style={{
            borderLeft: `3px solid ${PAL.vermil}`, paddingLeft: 22,
            maxWidth: 720, marginBottom: 28,
          }}>
            <p style={{
              fontSize: 'clamp(15px, 1.8vw, 19px)', lineHeight: 1.85,
              color: PAL.paperLt, margin: 0, fontWeight: 500,
              whiteSpace: 'pre-line',
            }}>
              {pick('prologue_project_en', 'prologue_project_zh').split('\n')[0]}
            </p>
            <p style={{
              fontSize: 'clamp(13px, 1.5vw, 16px)', lineHeight: 1.85,
              color: `${PAL.paperLt}cc`, margin: '6px 0 0', fontWeight: 400,
              whiteSpace: 'pre-line',
            }}>
              {pick('prologue_project_en', 'prologue_project_zh').split('\n')[1]}
            </p>
          </div>

          {/* ⑤ Epigraph (downgraded) */}
          <div style={{ maxWidth: 560, marginBottom: 36, opacity: 0.72 }}>
            <p className="font-display" style={{
              fontSize: 'clamp(13px, 1.5vw, 16px)', lineHeight: 2.0, margin: 0,
              fontStyle: lang === 'en' ? 'italic' : 'normal',
              color: `${PAL.paperLt}bb`,
            }}>
              {lang === 'zh' ? p.epigraph_zh : p.epigraph_en}
            </p>
            <p style={{ fontSize: 11, color: `${PAL.paperDk}77`, marginTop: 6, letterSpacing: '0.1em' }}>
              —— {lang === 'zh' ? p.epigraph_source_zh : p.epigraph_source_en}
            </p>
          </div>

          {/* ⑥ Evidence band: 4 cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: 10,
            marginBottom: 36,
          }}>
            {EVIDENCE.map(ev => <EvidenceCard key={ev.id} item={ev} />)}
          </div>

          {/* ⑦ CTA row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <a href="#act1" style={{
              display: 'inline-block', textDecoration: 'none',
              border: `1px solid ${PAL.vermil}`, background: PAL.vermil, color: PAL.paperLt,
              padding: '12px 30px', fontSize: 13, letterSpacing: '0.22em', borderRadius: 2,
            }}>
              {t('prologue_begin')}
            </a>
            <a href="#exhibition-map" style={{
              fontSize: 12, color: `${PAL.paperDk}99`, letterSpacing: '0.05em',
              textDecoration: 'none', borderBottom: `1px solid ${PAL.paperDk}44`,
              paddingBottom: 1,
            }}>
              {t('prologue_for_reviewers')} ↓
            </a>
          </div>
        </div>
      </section>

      {/* ============ SCREEN 2: EXHIBITION MAP ============ */}
      <section id="exhibition-map" style={{
        background: PAL.paper, padding: '70px 24px 80px',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ marginBottom: 36 }}>
            <p style={{ color: PAL.vermil, letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 10, fontWeight: 600, marginBottom: 8 }}>
              {lang === 'zh' ? '本馆导览' : 'Exhibition Map'}
            </p>
            <h2 className="font-display" style={{
              fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700,
              color: PAL.inkDeep, margin: '0 0 8px',
            }}>
              {t('prologue_map_title')}
            </h2>
            <p style={{ fontSize: 13, color: PAL.sepia, margin: 0 }}>
              {t('prologue_map_sub')}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
          }}>
            {MAP_CELLS.map(cell => <MapCell key={cell.id} cell={cell} />)}
          </div>
        </div>
      </section>
    </>
  )
}
