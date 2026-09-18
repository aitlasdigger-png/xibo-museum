import { useLang, L } from '@/lib/i18n'
import { PAL } from '@/lib/palette'
import { Kicker, ActTitle, QuoteBlock, Hairline, Seal } from '@/components/Bits'
import content from '@/data/content.json'

export default function Act5Epilogue() {
  const { lang, t } = useLang()
  const env = content.environment
  const p = content.prologue
  return (
    <section id="act5" style={{ background: PAL.paper, padding: '110px 0 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <Kicker>{t('act5_kicker')}</Kicker>
        <ActTitle>{L(lang, env.title_zh, env.title_en)}</ActTitle>
        <p style={{ maxWidth: 860, lineHeight: 2, fontSize: 15, color: PAL.ink }}>
          {L(lang, env.text_zh, env.text_en)}
        </p>

        <div style={{ margin: '60px 0' }}>
          <QuoteBlock
            zh={p.epigraph_zh} en={p.epigraph_en}
            source={L(lang, p.epigraph_source_zh, p.epigraph_source_en)}
          />
        </div>

        <Hairline />
        <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: PAL.inkDeep, margin: '40px 0 16px' }}>
          {t('act5_title')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 26, paddingBottom: 80 }}>
          <p style={{ fontSize: 13.5, lineHeight: 2, color: PAL.sepia, margin: 0 }}>{t('colophon_content')}</p>
          <p style={{ fontSize: 13.5, lineHeight: 2, color: PAL.sepia, margin: 0 }}>{t('colophon_burials')}</p>
        </div>
      </div>

      <footer style={{ background: PAL.inkDeep, color: `${PAL.paperDk}aa`, padding: '34px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Seal size={30} />
          <span className="font-display" style={{ color: PAL.paperLt, fontSize: 15 }}>{t('brand_zh')} · {t('brand_en')}</span>
          <span style={{ fontSize: 12, marginLeft: 'auto', letterSpacing: '0.08em', lineHeight: 1.8, textAlign: 'right' }}>
            <a href="#/song" style={{ color: PAL.paperLt, textDecoration: 'none', borderBottom: `1px solid ${PAL.vermil}` }}>
              {L(lang, '民歌馆《长歌西去》', 'The Song Pavilion')}
            </a>
            <br />
            Basemap © OpenStreetMap contributors · OpenFreeMap · Terrain: Mapterhorn<br />
            寻迹锡伯数字博物馆 · V3 · 2026
          </span>
        </div>
      </footer>
    </section>
  )
}
