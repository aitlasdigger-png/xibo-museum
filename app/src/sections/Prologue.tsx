import { useLang, L } from '@/lib/i18n'
import { PAL } from '@/lib/palette'
import { Kicker, Seal } from '@/components/Bits'
import content from '@/data/content.json'

export default function Prologue() {
  const { lang, t } = useLang()
  const p = content.prologue
  return (
    <section id="prologue" style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      background: PAL.inkDeep, color: PAL.paperLt,
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/assets/img/prologue-hero.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center 30%',
        opacity: 0.5, filter: 'sepia(0.35) brightness(0.75)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, ${PAL.inkDeep}e6 0%, ${PAL.inkDeep}66 45%, ${PAL.inkDeep}f2 100%)`,
      }} />
      <div style={{ position: 'relative', maxWidth: 1080, margin: '0 auto', padding: '120px 24px 90px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26 }}>
          <Seal size={46} />
          <Kicker light>{t('prologue_kicker')}</Kicker>
        </div>
        <h1 className="font-display" style={{
          fontSize: 'clamp(40px, 7vw, 84px)', fontWeight: 700, lineHeight: 1.08, margin: '0 0 8px',
          color: PAL.paperLt, letterSpacing: lang === 'zh' ? '0.06em' : '0',
        }}>
          {t('brand_zh')}
        </h1>
        <p className="font-display" style={{
          fontSize: 'clamp(18px, 2.6vw, 28px)', color: `${PAL.paperDk}bb`, margin: '0 0 40px', letterSpacing: '0.08em',
        }}>
          {t('brand_en')}
        </p>

        <div style={{
          borderLeft: `3px solid ${PAL.vermil}`, paddingLeft: 22, maxWidth: 700, marginBottom: 36,
        }}>
          <p className="font-display" style={{
            fontSize: 'clamp(17px, 2.2vw, 23px)', lineHeight: 2.1, margin: 0,
            fontStyle: lang === 'en' ? 'italic' : 'normal',
          }}>
            {L(lang, p.epigraph_zh, p.epigraph_en)}
          </p>
          <p style={{ fontSize: 12.5, color: `${PAL.paperDk}99`, marginTop: 10, letterSpacing: '0.12em' }}>
            —— {L(lang, p.epigraph_source_zh, p.epigraph_source_en)}
          </p>
        </div>

        <p style={{ maxWidth: 660, lineHeight: 2, fontSize: 'clamp(14px, 1.6vw, 16px)', color: `${PAL.paperLt}d9` }}>
          {L(lang, p.intro_zh, p.intro_en)}
        </p>

        <div style={{ marginTop: 52, display: 'flex', alignItems: 'center', gap: 14 }}>
          <a href="#act1" style={{
            display: 'inline-block', textDecoration: 'none',
            border: `1px solid ${PAL.vermil}`, background: PAL.vermil, color: PAL.paperLt,
            padding: '12px 30px', fontSize: 14, letterSpacing: '0.25em', borderRadius: 2,
          }}>
            {t('prologue_begin')}
          </a>
          <span style={{ fontSize: 11, letterSpacing: '0.3em', color: `${PAL.paperDk}77`, textTransform: 'uppercase' }}>
            {t('prologue_scroll')} ↓
          </span>
        </div>
      </div>
    </section>
  )
}
