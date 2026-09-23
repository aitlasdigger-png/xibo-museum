import { useLang, L } from '@/lib/i18n'
import { PAL } from '@/lib/palette'
import { Kicker, ActTitle, QuoteBlock, Hairline, Seal } from '@/components/Bits'
import content from '@/data/content.json'

export default function Act5Epilogue() {
  const { lang, t } = useLang()
  const env = content.environment
  const p = content.prologue
  const curator = content.curator_note
  return (
    <section id="act5" style={{ background: PAL.paper, padding: '110px 0 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <Kicker>{t('act5_kicker')}</Kicker>
        <ActTitle>{L(lang, env.title_zh, env.title_en)}</ActTitle>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
          gap: 48,
          alignItems: 'center',
          margin: '30px 0 60px',
        }} className="env-layout">
          <p style={{ lineHeight: 2, fontSize: 15, color: PAL.ink, margin: 0 }}>
            {L(lang, env.text_zh, env.text_en)}
          </p>
          {/* YouTube video placeholder */}
          <div>
            <p style={{
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: PAL.vermil, fontWeight: 600, marginBottom: 10,
            }}>
              {t('curator_video_title')}
            </p>
            <div style={{
              position: 'relative', aspectRatio: '16 / 9',
              background: PAL.inkDeep, borderRadius: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${PAL.sepia}55`,
            }}>
              <div style={{ textAlign: 'center', color: `${PAL.paperDk}88`, fontSize: 13, lineHeight: 1.8 }}>
                <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.5 }}>▶</div>
                {t('curator_video_placeholder')}
              </div>
            </div>
          </div>
        </div>

        <div style={{ margin: '60px 0' }}>
          <QuoteBlock
            zh={p.epigraph_zh} en={p.epigraph_en}
            source={L(lang, p.epigraph_source_zh, p.epigraph_source_en)}
          />
        </div>

        {/* ===== Curator's Note ===== */}
        <Hairline />
        <div style={{ margin: '50px 0 60px' }}>
          <Kicker>{t('curator_title')}</Kicker>
          <h3 className="font-display" style={{
            fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700,
            color: PAL.inkDeep, margin: '0 0 6px', lineHeight: 1.3,
          }}>
            {t('curator_subtitle')}
          </h3>
          <p style={{ fontSize: 14, color: PAL.sepia, margin: '0 0 30px', letterSpacing: '0.05em' }}>
            {t('curator_author')}
          </p>

          {/* Essay body + photo rail */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 720px) 1fr',
            gap: 56,
            alignItems: 'start',
          }} className="curator-layout">
            {/* Left: essay */}
            <div>
              {curator.paragraphs.map((para, i) => (
                <p key={i} style={{
                  fontSize: 14.5, lineHeight: 2.05, color: PAL.ink,
                  margin: '0 0 22px', textIndent: i === 0 ? 0 : '2em',
                }}>
                  {L(lang, para.text_zh, para.text_en)}
                </p>
              ))}
            </div>

            {/* Right: photo rail */}
            <div className="curator-photos" style={{ position: 'sticky', top: 90 }}>
              <p style={{
                fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: PAL.vermil, fontWeight: 600, margin: '4px 0 18px',
              }}>
                {t('curator_photos_title')}
              </p>
              {curator.photos.map((photo, i) => (
                <figure key={i} style={{ margin: '0 0 26px' }}>
                  <img
                    src={photo.src}
                    alt={L(lang, photo.caption_zh, photo.caption_en)}
                    loading="lazy"
                    style={{
                      width: '100%', display: 'block', borderRadius: 2,
                      border: `1px solid ${PAL.sepia}55`,
                      boxShadow: `0 2px 10px ${PAL.inkDeep}14`,
                    }}
                  />
                  <figcaption style={{
                    fontSize: 12, lineHeight: 1.7, color: PAL.sepia,
                    marginTop: 8, paddingLeft: 10,
                    borderLeft: `2px solid ${PAL.vermil}66`,
                  }}>
                    {L(lang, photo.caption_zh, photo.caption_en)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Contact */}
          <p style={{ marginTop: 30, fontSize: 13, color: PAL.sepia }}>
            {t('curator_contact')}{' '}
            <a href={`mailto:${curator.email}`} style={{ color: PAL.vermil, textDecoration: 'none', borderBottom: `1px solid ${PAL.vermil}44` }}>
              {curator.email}
            </a>
          </p>
        </div>

        {/* ===== Colophon ===== */}
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
