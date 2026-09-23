import { useEffect, useRef, useState } from 'react'
import type maplibregl from 'maplibre-gl'
import '@google/model-viewer'
import { useLang, L } from '@/lib/i18n'
import { PAL, GARRISON_COLOR } from '@/lib/palette'
import { Kicker, ActTitle, Lead, ArchImg, Sources, Chip, QuoteBlock, Hairline } from '@/components/Bits'
import AntiqueMap from '@/components/AntiqueMap'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import content from '@/data/content.json'
import sites from '@/data/sites.json'

const KARUN_BOUNDS: [[number, number], [number, number]] = [[79.9, 42.45], [81.35, 44.65]]

const KARUN_LIFE_IMG = [
  '/assets/img/karun-watchtower.jpg', '/assets/img/karun-family.jpg', '/assets/img/karun-farming.jpg',
  '/assets/img/karun-drill.jpg', '/assets/img/karun-life.jpg',
]

const NIULU_IMG: Record<string, string> = {
  'wuzhu-niru': '/assets/img/niulu-fort.jpg',
  'sunjaqi-niru': '/assets/img/niulu-temples.jpg',
  'nadaqi-niru': '/assets/img/canal-1796.jpg',
}

const SKETCHFAB_MODELS: { karunId: string; uid: string; slug: string; name_zh: string; name_en: string }[] = [
  { karunId: 'nikan-kashayan-karun', uid: 'd5c3533515df4a4e8501932e365cf0ee', slug: 'shayan-karun', name_zh: '沙彦卡伦', name_en: 'Shayan Karun' },
  { karunId: 'touhu-karun',          uid: '9b7f6b94a09d4b11a8c0343a66605e7d', slug: 'touhu-kalun', name_zh: '头湖卡伦', name_en: 'Touhu Karun' },
  { karunId: 'wutongzi-karun',       uid: '126d89b789774757b76f76387a51536e', slug: 'wutongzi-kalun', name_zh: '梧桐孜卡伦', name_en: 'Wutongzi Karun' },
  { karunId: 'nadanmu-karun',        uid: 'a27e0a716ee04857a6cd44f4a4b2e553', slug: 'nandanmu-karun', name_zh: '纳旦木卡伦', name_en: 'Nadanmu Karun' },
  { karunId: 'dolantu-karun',        uid: '13f8ca633f454a4da3b699644f47a3a9', slug: 'duolantu-karun', name_zh: '多兰图卡伦', name_en: 'Dolantu Karun' },
]
const sketchfabOf = (karunId: string) => SKETCHFAB_MODELS.find((m) => m.karunId === karunId)
const sketchfabEmbed = (uid: string) =>
  `https://sketchfab.com/models/${uid}/embed?autostart=0&ui_theme=dark&ui_infos=1&ui_inspector=0&ui_controls=1&ui_settings=0&ui_stop=0&ui_watermark=0&dnt=1&transparent=1&preload=1`

type Karun = (typeof content.karun)[number]
type Niru = (typeof content.niulu)[number]

export default function Act3Karun() {
  const { lang, t } = useLang()
  const ks = content.karun_system
  const gl = content.garrison_life
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [openKarun, setOpenKarun] = useState<Karun | null>(null)
  const [openNiru, setOpenNiru] = useState<Niru | null>(null)
  const [galleryIdx, setGalleryIdx] = useState(0)

  const karunSites = (sites as { id: string; category: string; lon: number; lat: number }[]).filter((s) => s.category === 'karun')

  const onReady = (map: maplibregl.Map) => {
    mapRef.current = map
    map.addSource('karun', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: karunSites.map((s) => {
          const k = content.karun.find((x) => x.id === s.id)!
          return {
            type: 'Feature' as const,
            geometry: { type: 'Point' as const, coordinates: [s.lon, s.lat] },
            properties: {
              id: s.id, name_zh: k.name_zh, name_en: k.name_en,
              garrison: k.garrison_zh ?? '',
            },
          }
        }),
      },
    })
    map.addLayer({
      id: 'karun-circle', type: 'circle', source: 'karun',
      paint: {
        'circle-radius': 6,
        'circle-color': ['match', ['get', 'garrison'],
          '锡伯营', GARRISON_COLOR['锡伯营'], '索伦营', GARRISON_COLOR['索伦营'], '厄鲁特营', GARRISON_COLOR['厄鲁特营'],
          PAL.unknownGarrison],
        'circle-stroke-color': PAL.paperLt, 'circle-stroke-width': 1.8,
      },
    })
    map.addLayer({
      id: 'karun-label', type: 'symbol', source: 'karun',
      layout: {
        'text-field': ['get', lang === 'zh' ? 'name_zh' : 'name_en'],
        'text-font': ['Noto Serif Regular'], 'text-size': 10.5,
        'text-offset': [0, 1.1], 'text-anchor': 'top', 'text-optional': true,
      },
      paint: { 'text-color': PAL.ink, 'text-halo-color': PAL.paperLt, 'text-halo-width': 1.3 },
    })
    map.on('click', 'karun-circle', (e) => {
      const id = e.features?.[0]?.properties?.id as string | undefined
      const k = content.karun.find((x) => x.id === id)
      if (k) setOpenKarun(k)
    })
    map.on('mouseenter', 'karun-circle', () => { map.getCanvas().style.cursor = 'pointer' })
    map.on('mouseleave', 'karun-circle', () => { map.getCanvas().style.cursor = '' })
  }

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.getLayer('karun-label')) return
    map.setLayoutProperty('karun-label', 'text-field', ['get', lang === 'zh' ? 'name_zh' : 'name_en'])
  }, [lang])

  const groups: { key: string; zh: string; en: string; note_zh?: string; note_en?: string; items: Karun[] }[] = [
    {
      key: 'solon', zh: '霍尔果斯河谷 · 索伦营', en: 'Horgos valley · Solon Battalion',
      items: content.karun.filter((k) => k.garrison_zh === '索伦营'),
    },
    {
      key: 'xibe', zh: '察布查尔平原 · 锡伯营', en: 'Qapqal plain · Xibe Battalion',
      note_zh: '锡伯营共设四处卡伦，塔奇勒哈卡已无存。', note_en: 'The Xibe battalion manned four karun; Taqilha has not survived.',
      items: content.karun.filter((k) => k.garrison_zh === '锡伯营'),
    },
    {
      key: 'oirat', zh: '南山古道 · 厄鲁特营', en: 'Southern mountains · Oirat Battalion',
      items: content.karun.filter((k) => k.garrison_zh === '厄鲁特营'),
    },
    {
      key: 'early', zh: '乾隆期山地卡伦', en: 'Qianlong-era mountain posts',
      items: content.karun.filter((k) => !k.garrison_zh && k.period === 'qianlong'),
    },
    {
      key: 'late', zh: '霍诺海山前 · 光绪期', en: 'Huonohai foothills · Guangxu era',
      items: content.karun.filter((k) => !k.garrison_zh && k.period === 'guangxu'),
    },
  ]

  return (
    <section id="act3" style={{ background: PAL.paper, padding: '110px 0 90px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <Kicker>{t('act3_kicker')}</Kicker>
        <ActTitle>{t('act3_title')}</ActTitle>
        <Lead>{t('act3_lead')}</Lead>
        <p style={{ fontSize: 14.5, lineHeight: 2, color: PAL.ink, maxWidth: 900, marginTop: 22 }}>
          {L(lang, content.karun_intro.text_zh, content.karun_intro.text_en)}
        </p>

        {/* 制度 */}
        <h3 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: PAL.inkDeep, margin: '56px 0 18px' }}>{t('karun_system_title')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          {ks.types.map((ty) => (
            <div key={ty.name_zh} style={{ border: `1px solid ${PAL.sepia}55`, background: PAL.paperLt, padding: '18px 20px' }}>
              <h4 className="font-display" style={{ fontSize: 17, fontWeight: 700, color: PAL.vermilDk, margin: '0 0 8px' }}>{L(lang, ty.name_zh, ty.name_en)}</h4>
              <p style={{ fontSize: 13.5, lineHeight: 1.9, color: PAL.ink, margin: 0 }}>{L(lang, ty.text_zh, ty.text_en)}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 14, lineHeight: 2, color: PAL.ink, margin: '22px 0 0', maxWidth: 900 }}>
          {L(lang, ks.jurisdiction_zh, ks.jurisdiction_en)}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 30, marginTop: 40 }} className="act3-cols">
          <div>
            <h4 className="font-display" style={{ fontSize: 19, fontWeight: 700, color: PAL.inkDeep, margin: '0 0 12px' }}>{t('karun_duties_title')}</h4>
            <p style={{ fontSize: 14, lineHeight: 2, color: PAL.ink, margin: 0 }}>{L(lang, ks.duties_zh, ks.duties_en)}</p>
            <p style={{ fontSize: 14, lineHeight: 2, color: PAL.ink }}>{L(lang, ks.periods_zh, ks.periods_en)}</p>
          </div>
          <div>
            <h4 className="font-display" style={{ fontSize: 19, fontWeight: 700, color: PAL.inkDeep, margin: '0 0 12px' }}>{t('karun_interior_title')}</h4>
            {ks.interior_quotes.map((q, i) => (
              <QuoteBlock key={i} zh={q.text_zh} en={q.text_en} source={L(lang, q.source_zh, q.source_en)} />
            ))}
          </div>
        </div>

        {/* 卡伦地图 */}
        <div style={{ marginTop: 50, border: `1px solid ${PAL.sepia}55` }}>
          <AntiqueMap bounds={KARUN_BOUNDS} onReady={onReady} className="act3-map" />
        </div>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', margin: '12px 0 0' }}>
          {[['锡伯营', 'Xibe'], ['索伦营', 'Solon'], ['厄鲁特营', 'Oirat']].map(([zh, en]) => (
            <span key={zh} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: PAL.ink }}>
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: GARRISON_COLOR[zh], display: 'inline-block', border: `2px solid ${PAL.paperLt}`, boxShadow: `0 0 0 1px ${PAL.sepia}66` }} />
              {lang === 'zh' ? zh : `${en} Battalion`}
            </span>
          ))}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: PAL.ink }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: PAL.unknownGarrison, display: 'inline-block', border: `2px solid ${PAL.paperLt}`, boxShadow: `0 0 0 1px ${PAL.sepia}66` }} />
            {L(lang, '所属营待考', 'Garrison unassigned')}
          </span>
        </div>

        {/* 18 卡伦 */}
        <h3 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: PAL.inkDeep, margin: '56px 0 22px' }}>{t('karun_index_title')}</h3>
        {groups.map((g) => (
          <div key={g.key} style={{ marginBottom: 34 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
              <h4 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: PAL.vermilDk, margin: 0 }}>{L(lang, g.zh, g.en)}</h4>
              {g.note_zh && <span style={{ fontSize: 12, color: PAL.sepia }}>{L(lang, g.note_zh, g.note_en ?? '')}</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {g.items.map((k) => (
                <button key={k.id} onClick={() => setOpenKarun(k)} style={{
                  textAlign: 'left', cursor: 'pointer', border: `1px solid ${PAL.sepia}55`, background: PAL.paperLt,
                  padding: '14px 16px', transition: 'all 0.25s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = PAL.vermil; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${PAL.sepia}55`; e.currentTarget.style.transform = 'none' }}
                >
                  <div className="font-display" style={{ fontSize: 16, fontWeight: 700, color: PAL.inkDeep }}>{L(lang, k.name_zh, k.name_en)}</div>
                  <div style={{ fontSize: 11.5, color: PAL.sepia, marginTop: 6, lineHeight: 1.7 }}>
                    {k.alias_zh && lang === 'zh' && <span style={{ marginRight: 8 }}>又称{k.alias_zh}</span>}
                    {k.altitude_m != null && <span style={{ marginRight: 8 }}>{t('karun_altitude')} {k.altitude_m}m</span>}
                    <span>{k.period === 'qianlong' ? t('karun_period_qianlong') : t('karun_period_guangxu')}</span>
                  </div>
                  <div style={{ fontSize: 11, color: PAL.vermil, marginTop: 8, letterSpacing: '0.1em' }}>{t('click_to_open')} →</div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* 戍边生活 */}
        <Hairline />
        <h3 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: PAL.inkDeep, margin: '40px 0 18px' }}>{t('life_title')}</h3>
        <p style={{ fontSize: 14.5, lineHeight: 2, color: PAL.ink, maxWidth: 900, margin: 0 }}>{L(lang, gl.disposition_zh, gl.disposition_en)}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 22, margin: '26px 0' }} className="act3-cols">
          <ArchImg src="/assets/img/canal-1796.jpg" caption={L(lang, 'AIGC 场景复原：1796年图伯特督挖察布查尔大渠', 'AI reconstruction: Tubet directing the Qapqal canal, 1796')} />
          <ArchImg
            src="https://commons.wikimedia.org/wiki/Special:FilePath/Lansdell-1885-p211-Sibo-military-colonists.jpg?width=1200"
            caption={L(lang, 'Lansdell 1885年版画：锡伯军屯，公有领域', 'Lansdell 1885: Sibo military colonists — public domain')}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 26 }} className="act3-cols">
          <p style={{ fontSize: 14, lineHeight: 2, color: PAL.ink, margin: 0 }}>{L(lang, gl.canal_zh, gl.canal_en)}</p>
          <p style={{ fontSize: 14, lineHeight: 2, color: PAL.ink, margin: 0 }}>{L(lang, gl.faith_zh, gl.faith_en)}</p>
        </div>

        {/* 八旗八堡 */}
        <h3 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: PAL.inkDeep, margin: '56px 0 8px' }}>{t('niulu_title')}</h3>
        <p style={{ fontSize: 14, lineHeight: 2, color: PAL.ink, maxWidth: 900, margin: '0 0 22px' }}>
          {L(lang, content.niulu_intro.text_zh, content.niulu_intro.text_en)}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
          {content.niulu.map((n) => (
            <button key={n.id} onClick={() => setOpenNiru(n)} style={{
              cursor: 'pointer', border: `1px solid ${PAL.sepia}55`, background: PAL.paperLt, padding: '14px 12px',
              textAlign: 'center', transition: 'all 0.25s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = PAL.vermil; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${PAL.sepia}55`; e.currentTarget.style.transform = 'none' }}
            >
              <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color: PAL.vermil }}>{L(lang, n.order_zh, n.order_en)}</div>
              <div style={{ fontSize: 13, color: PAL.inkDeep, marginTop: 6, fontWeight: 600 }}>{L(lang, n.name_zh, n.name_en)}</div>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 22, maxWidth: 720 }}>
          <ArchImg src="/assets/img/niulu-fort.jpg" caption={L(lang, 'AIGC 场景复原：牛录城堡——围墙里的村庄', 'AI reconstruction: a niru fort — a walled village')} />
        </div>
        {content.quotes.filter((q) => q.about === 'niulu').map((q, i) => (
          <QuoteBlock key={i} zh={q.text_zh} en={q.text_en} source={L(lang, q.source_zh, q.source_en)} />
        ))}

        {/* 3D · 5 卡伦扫描模型画廊 */}
        <div style={{ marginTop: 60, border: `1px solid ${PAL.sepia}55`, background: PAL.inkDeep, padding: '26px 28px' }}>
          <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: PAL.paperLt, margin: '0 0 6px' }}>{t('model_title')}</h3>
          <p style={{ fontSize: 13, color: `${PAL.paperDk}aa`, margin: '0 0 10px', lineHeight: 1.9, maxWidth: 900 }}>
            {L(lang,
              '以下为 5 处卡伦遗址的三维扫描档案，属光绪期边界卡伦体系（1880 年代《中俄伊犁条约》后新界）。沙彦、头湖、梧桐孜、纳旦木四卡沿伊犁河—霍尔果斯河一线排列，把守渡口与平原通道；多兰图卡位于霍诺海沟西侧山麓，扼守山区牧道。拖动可旋转视角，滚轮可缩放。',
              '3D scans of 5 Guangxu-era border posts (post-1881 Treaty of Saint Petersburg). Shayan, Touhu, Wutongzi and Nadanmu line the Ili–Horgos river system guarding crossings and plains; Dolantu sits on the western flank of the Huonohai ravine, blocking the mountain pasture route. Drag to rotate, scroll to zoom.'
            )}
          </p>
          <p style={{ fontSize: 11.5, color: `${PAL.paperDk}66`, margin: '0 0 18px', letterSpacing: '0.05em' }}>
            Models on Sketchfab · aitlas-kalun
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            {SKETCHFAB_MODELS.map((m, i) => (
              <button key={m.karunId} onClick={() => setGalleryIdx(i)} style={{
                cursor: 'pointer',
                background: galleryIdx === i ? PAL.vermil : 'transparent',
                color: galleryIdx === i ? PAL.paperLt : `${PAL.paperDk}cc`,
                border: `1px solid ${galleryIdx === i ? PAL.vermil : `${PAL.paperDk}55`}`,
                padding: '9px 16px', fontSize: 13, fontWeight: galleryIdx === i ? 700 : 500,
                borderRadius: 2, letterSpacing: '0.08em',
                transition: 'all 0.2s',
              }}>
                {L(lang, m.name_zh, m.name_en)}
              </button>
            ))}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
            gap: 18,
            alignItems: 'stretch',
          }} className="act3-cols">
            <div style={{ height: 460, background: '#0d0a05', borderRadius: 2, overflow: 'hidden', border: `1px solid ${PAL.sepia}33` }}>
              <iframe
                key={SKETCHFAB_MODELS[galleryIdx].uid}
                title={`${SKETCHFAB_MODELS[galleryIdx].name_en} 3D scan on Sketchfab`}
                src={sketchfabEmbed(SKETCHFAB_MODELS[galleryIdx].uid)}
                allowFullScreen
                allow="autoplay; fullscreen; xr-spatial-tracking"
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                loading="lazy"
              />
            </div>
            {(() => {
              const cur = content.karun.find((x) => x.id === SKETCHFAB_MODELS[galleryIdx].karunId) as Karun | undefined
              if (!cur) return null
              const sf = SKETCHFAB_MODELS[galleryIdx]
              return (
                <div style={{
                  border: `1px solid ${PAL.sepia}44`,
                  background: '#141009',
                  padding: '20px 20px 18px',
                  borderRadius: 2,
                  color: PAL.paperLt,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '0.25em', color: PAL.vermil, textTransform: 'uppercase', marginBottom: 6 }}>
                      {cur.period === 'qianlong' ? t('karun_period_qianlong') : t('karun_period_guangxu')}
                    </div>
                    <h4 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: PAL.paperLt, margin: 0, lineHeight: 1.3 }}>
                      {L(lang, cur.name_zh, cur.name_en)}
                      {cur.alias_zh && lang === 'zh' && (
                        <span style={{ fontSize: 13, fontWeight: 400, color: `${PAL.paperDk}aa`, marginLeft: 10 }}>又称 {cur.alias_zh}</span>
                      )}
                    </h4>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {cur.garrison_zh && (
                      <span style={{
                        display: 'inline-block', fontSize: 11, letterSpacing: '0.05em',
                        border: `1px solid ${GARRISON_COLOR[cur.garrison_zh] ?? PAL.sepia}88`,
                        color: GARRISON_COLOR[cur.garrison_zh] ?? `${PAL.paperDk}cc`,
                        borderRadius: 2, padding: '3px 10px',
                      }}>
                        {L(lang, `${cur.garrison_zh}驻守`, `Garrison: ${(cur as any).garrison_en ?? cur.garrison_zh}`)}
                      </span>
                    )}
                    {cur.altitude_m != null && (
                      <span style={{
                        display: 'inline-block', fontSize: 11, letterSpacing: '0.05em',
                        border: `1px solid ${PAL.paperDk}55`,
                        color: `${PAL.paperDk}cc`,
                        borderRadius: 2, padding: '3px 10px',
                      }}>
                        {t('karun_altitude')} {cur.altitude_m} m
                      </span>
                    )}
                    {cur.dims_zh && (
                      <span style={{
                        display: 'inline-block', fontSize: 11, letterSpacing: '0.05em',
                        border: `1px solid ${PAL.paperDk}55`,
                        color: `${PAL.paperDk}cc`,
                        borderRadius: 2, padding: '3px 10px',
                      }}>
                        {L(lang, cur.dims_zh, cur.dims_en)}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: `${PAL.paperDk}aa`, margin: 0, lineHeight: 1.9 }}>
                    {L(lang, cur.location_zh, cur.location_en)}
                  </p>
                  <div style={{ borderTop: `1px dashed ${PAL.sepia}44`, paddingTop: 14 }}>
                    <p style={{ fontSize: 11, letterSpacing: '0.25em', color: PAL.vermil, textTransform: 'uppercase', margin: '0 0 8px' }}>
                      {t('dossier_remains')}
                    </p>
                    <p style={{ fontSize: 13, color: PAL.paperLt, lineHeight: 1.95, margin: 0, opacity: 0.92 }}>
                      {L(lang, cur.remains_zh, cur.remains_en)}
                    </p>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 6 }}>
                    <button onClick={() => setOpenKarun(cur)} style={{
                      cursor: 'pointer',
                      background: PAL.vermil, color: PAL.paperLt, border: 'none',
                      padding: '8px 16px', fontSize: 12, letterSpacing: '0.12em',
                      borderRadius: 2, fontWeight: 600,
                    }}>
                      → {L(lang, '打开完整档案', 'Open full dossier')}
                    </button>
                    <a
                      href={`https://sketchfab.com/3d-models/${sf.slug}-${sf.uid}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{
                        cursor: 'pointer', background: 'none',
                        border: `1px solid ${PAL.paperDk}55`,
                        color: `${PAL.paperDk}dd`, padding: '7px 14px',
                        fontSize: 12, borderRadius: 2, letterSpacing: '0.1em',
                        textDecoration: 'none',
                      }}
                    >
                      {L(lang, '在 Sketchfab 中查看', 'View on Sketchfab')} ↗
                    </a>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </div>

      {/* 卡伦档案弹窗 */}
      <Dialog open={!!openKarun} onOpenChange={(o) => !o && setOpenKarun(null)}>
        <DialogContent style={{ background: PAL.paperLt, border: `1px solid ${PAL.sepia}66`, maxWidth: 720, maxHeight: '86vh', overflowY: 'auto' }}>
          {openKarun && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display" style={{ fontSize: 24, color: PAL.inkDeep }}>
                  {L(lang, openKarun.name_zh, openKarun.name_en)}
                </DialogTitle>
              </DialogHeader>
              <div style={{ margin: '4px 0 12px' }}>
                {openKarun.garrison_zh && (
                  <Chip color={GARRISON_COLOR[openKarun.garrison_zh] ?? PAL.sepia}>
                    {t('karun_garrison')}：{L(lang, openKarun.garrison_zh, openKarun.garrison_en)}
                  </Chip>
                )}
                <Chip color={PAL.sepia}>{openKarun.period === 'qianlong' ? t('karun_period_qianlong') : t('karun_period_guangxu')}</Chip>
                {openKarun.altitude_m != null && <Chip color={PAL.sepia}>{t('karun_altitude')} {openKarun.altitude_m}m</Chip>}
                <Chip color={PAL.sepia}>{L(lang, openKarun.dims_zh, openKarun.dims_en)}</Chip>
              </div>
              <p style={{ fontSize: 12.5, color: PAL.sepia, margin: '0 0 14px' }}>{L(lang, openKarun.location_zh, openKarun.location_en)}</p>
              {sketchfabOf(openKarun.id) && (
                <p style={{ fontSize: 11.5, color: PAL.vermil, margin: '0 0 10px', letterSpacing: '0.05em' }}>
                  ✦ {L(lang, '本卡伦附有三维扫描档案，见本章末尾「卡伦遗址扫描档案」画廊', 'A 3D scan of this karun is available in the gallery at the end of this chapter.')}
                </p>
              )}
              <ArchImg
                src={KARUN_LIFE_IMG[Math.abs([...openKarun.id].reduce((a, c) => a + c.charCodeAt(0), 0)) % KARUN_LIFE_IMG.length]}
                caption={L(lang, 'AIGC 场景复原：卡伦戍边生活', 'AI reconstruction: karun garrison life')}
              />
              <p style={{ fontSize: 14.5, lineHeight: 2, color: PAL.ink, margin: '16px 0 0', textAlign: 'justify' }}>
                {L(lang, openKarun.story_zh, openKarun.story_en)}
              </p>
              <div style={{ background: PAL.paperDk, border: `1px solid ${PAL.sepia}44`, padding: '14px 16px', marginTop: 18 }}>
                <p style={{ fontSize: 11, letterSpacing: '0.25em', color: PAL.vermil, margin: '0 0 6px', textTransform: 'uppercase' }}>{t('dossier_remains')}</p>
                <p style={{ fontSize: 13, lineHeight: 1.9, color: PAL.ink, margin: 0 }}>{L(lang, openKarun.remains_zh, openKarun.remains_en)}</p>
              </div>
              <Sources items={openKarun.sources} />
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 牛录档案弹窗 */}
      <Dialog open={!!openNiru} onOpenChange={(o) => !o && setOpenNiru(null)}>
        <DialogContent style={{ background: PAL.paperLt, border: `1px solid ${PAL.sepia}66`, maxWidth: 720, maxHeight: '86vh', overflowY: 'auto' }}>
          {openNiru && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display" style={{ fontSize: 24, color: PAL.inkDeep }}>
                  {L(lang, openNiru.order_zh, openNiru.order_en)} · {L(lang, openNiru.name_zh, openNiru.name_en)}
                </DialogTitle>
              </DialogHeader>
              <p style={{ fontSize: 12.5, color: PAL.sepia, margin: '0 0 14px' }}>{L(lang, openNiru.location_zh, openNiru.location_en)}</p>
              {NIULU_IMG[openNiru.id] && (
                <ArchImg src={NIULU_IMG[openNiru.id]} caption={L(lang, 'AIGC 场景复原', 'AI-generated reconstruction')} />
              )}
              <p style={{ fontSize: 14.5, lineHeight: 2, color: PAL.ink, margin: '16px 0 0', textAlign: 'justify' }}>
                {L(lang, openNiru.story_zh, openNiru.story_en)}
              </p>
              <div style={{ background: PAL.paperDk, border: `1px solid ${PAL.sepia}44`, padding: '14px 16px', marginTop: 18 }}>
                <p style={{ fontSize: 11, letterSpacing: '0.25em', color: PAL.vermil, margin: '0 0 6px', textTransform: 'uppercase' }}>{t('dossier_remains')}</p>
                <p style={{ fontSize: 13, lineHeight: 1.9, color: PAL.ink, margin: 0 }}>{L(lang, openNiru.remains_zh, openNiru.remains_en)}</p>
              </div>
              <Sources items={openNiru.sources} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
