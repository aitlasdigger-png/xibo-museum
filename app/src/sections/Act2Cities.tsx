import { useEffect, useRef, useState } from 'react'
import type maplibregl from 'maplibre-gl'
import { useLang, L } from '@/lib/i18n'
import { PAL, PERIOD_COLOR } from '@/lib/palette'
import { Kicker, ActTitle, Lead, ArchImg, Sources, Chip, QuoteBlock, Hairline } from '@/components/Bits'
import AntiqueMap from '@/components/AntiqueMap'
import content from '@/data/content.json'
import sites from '@/data/sites.json'

const VALLEY_BOUNDS: [[number, number], [number, number]] = [[80.1, 43.35], [82.15, 44.55]]

const CITY_IMG: Record<string, string> = {
  taleqi: 'city-taleqi', suiding: 'city-suiding', ningyuan: 'city-ningyuan',
  'huiyuan-old': 'city-huiyuan-old', huining: 'city-huining', guangren: 'city-guangren',
  zhande: 'city-zhande', gongchen: 'city-gongchen', xichun: 'city-xichun',
  'huiyuan-new-city': 'city-huiyuan-new',
}

const ARCH_PHOTO: Record<string, { src: string; cap_zh: string; cap_en: string }> = {
  'huiyuan-old': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Yili-military-complex-ca-1809.jpg?width=1200',
    cap_zh: '《伊犁军府图》（约1809年），公有领域', cap_en: 'Ili military complex, c. 1809 — public domain',
  },
  suiding: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lansdell-1885-p204-Ruined-Chinese-gates-at-Suidun.jpg?width=1200',
    cap_zh: 'Lansdell 1885年版画：绥定残门，公有领域', cap_en: 'Lansdell 1885, ruined gates at Suidun — public domain',
  },
  ningyuan: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lansdell-1885-p231-The-Chief-Taranchi-Mosque-in-Kuldja.jpg?width=1200',
    cap_zh: 'Lansdell 1885年版画：固勒扎塔兰奇大寺，公有领域', cap_en: 'Lansdell 1885, the chief Taranchi mosque in Kuldja — public domain',
  },
}

type City = (typeof content.cities)[number]

const PHASE_IMG: Record<string, { src: string; zh: string; en: string }> = {
  war: { src: 'war-fall-1866', zh: 'AIGC 场景复原：1866年的惠远', en: 'AI reconstruction: Huiyuan, 1866' },
  reconstruction: { src: 'rebuild-1892', zh: 'AIGC 场景复原：1892年惠远新城竣工', en: 'AI reconstruction: New Huiyuan completed, 1892' },
}

export default function Act2Cities() {
  const { lang, t } = useLang()
  const tl = content.timeline
  const [phase, setPhase] = useState<string>('founding')
  const [cityId, setCityId] = useState<string>('huiyuan-old')
  const mapRef = useRef<maplibregl.Map | null>(null)

  const citySites = (sites as { id: string; name_zh: string; name_en: string; category: string; lon: number; lat: number }[])
    .filter((s) => s.category === 'city' || s.category === 'ancient')

  const onReady = (map: maplibregl.Map) => {
    mapRef.current = map
    map.addSource('cities', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: citySites.map((s) => {
          const c = content.cities.find((x) => x.id === s.id)
          const sec = content.secondary_sites.find((x) => x.id === s.id)
          return {
            type: 'Feature' as const,
            geometry: { type: 'Point' as const, coordinates: [s.lon, s.lat] },
            properties: {
              id: s.id, name_zh: s.name_zh, name_en: s.name_en,
              period: c?.period ?? sec?.period ?? 'unknown',
            },
          }
        }),
      },
    })
    map.addLayer({
      id: 'cities-circle', type: 'circle', source: 'cities',
      paint: {
        'circle-radius': 7,
        'circle-color': ['match', ['get', 'period'],
          'founding', PERIOD_COLOR.founding, 'height', PERIOD_COLOR.height,
          'consolidation', PERIOD_COLOR.consolidation, 'reconstruction', PERIOD_COLOR.reconstruction,
          PERIOD_COLOR.unknown],
        'circle-stroke-color': PAL.paperLt, 'circle-stroke-width': 2,
        'circle-opacity': 0.95,
      },
    })
    map.addLayer({
      id: 'cities-label', type: 'symbol', source: 'cities',
      layout: {
        'text-field': ['get', lang === 'zh' ? 'name_zh' : 'name_en'],
        'text-font': ['Noto Serif Regular'], 'text-size': 11.5,
        'text-offset': [0, 1.2], 'text-anchor': 'top', 'text-optional': true,
      },
      paint: { 'text-color': PAL.ink, 'text-halo-color': PAL.paperLt, 'text-halo-width': 1.4 },
    })
    map.on('click', 'cities-circle', (e) => {
      const id = e.features?.[0]?.properties?.id as string | undefined
      if (id && content.cities.some((c) => c.id === id)) {
        setCityId(id)
        document.getElementById('city-dossier')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
    map.on('mouseenter', 'cities-circle', () => { map.getCanvas().style.cursor = 'pointer' })
    map.on('mouseleave', 'cities-circle', () => { map.getCanvas().style.cursor = '' })
  }

  // 时期高亮
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.getLayer('cities-circle')) return
    const cur = tl.find((p) => p.id === phase)
    const ids = cur?.cities ?? []
    if (phase === 'war') {
      map.setPaintProperty('cities-circle', 'circle-opacity', 0.25)
      map.setPaintProperty('cities-label', 'text-opacity', 0.25)
    } else {
      map.setPaintProperty('cities-circle', 'circle-opacity', ['case', ['in', ['get', 'id'], ['literal', ids]], 1, 0.22])
      map.setPaintProperty('cities-label', 'text-opacity', ['case', ['in', ['get', 'id'], ['literal', ids]], 1, 0.22])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.getLayer('cities-label')) return
    map.setLayoutProperty('cities-label', 'text-field', ['get', lang === 'zh' ? 'name_zh' : 'name_en'])
  }, [lang])

  const curPhase = tl.find((p) => p.id === phase)!
  const city: City = content.cities.find((c) => c.id === cityId) ?? content.cities[0]
  const arch = ARCH_PHOTO[city.id]
  const periodName = (id: string) => {
    const p = tl.find((x) => x.id === id)
    return p ? L(lang, p.name_zh, p.name_en) : ''
  }

  return (
    <section id="act2" style={{ background: PAL.paperDk, padding: '110px 0 90px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <Kicker>{t('act2_kicker')}</Kicker>
        <ActTitle>{t('act2_title')}</ActTitle>
        <Lead>{t('act2_lead')}</Lead>

        {/* 时间轴 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, margin: '44px 0 0', border: `1px solid ${PAL.sepia}55` }}>
          {tl.map((p) => {
            const on = phase === p.id
            return (
              <button key={p.id} onClick={() => setPhase(p.id)} style={{
                flex: '1 1 150px', cursor: 'pointer', border: 'none',
                borderLeft: `1px solid ${PAL.sepia}44`,
                background: on ? PAL.inkDeep : PAL.paperLt,
                color: on ? PAL.paperLt : PAL.ink,
                padding: '12px 14px', textAlign: 'left', transition: 'all 0.3s',
              }}>
                <div style={{ fontSize: 11, letterSpacing: '0.12em', opacity: 0.75 }}>{L(lang, p.years_zh, p.years_en)}</div>
                <div className="font-display" style={{ fontSize: 17, fontWeight: 700, marginTop: 3 }}>{L(lang, p.name_zh, p.name_en)}</div>
              </button>
            )
          })}
        </div>

        {/* 河谷地图 */}
        <div style={{ border: `1px solid ${PAL.sepia}55`, borderTop: 'none' }}>
          <AntiqueMap bounds={VALLEY_BOUNDS} onReady={onReady} className="act2-map" />
        </div>
        <div style={{
          border: `1px solid ${PAL.sepia}55`, borderTop: 'none', background: PAL.paperLt,
          padding: '18px 22px', display: 'grid', gridTemplateColumns: PHASE_IMG[curPhase.id] ? 'minmax(0,2fr) minmax(0,1fr)' : '1fr', gap: 20, alignItems: 'center',
        }}>
          <p style={{ fontSize: 14, lineHeight: 1.95, color: PAL.ink, margin: 0 }}>{L(lang, curPhase.text_zh, curPhase.text_en)}</p>
          {PHASE_IMG[curPhase.id] && <ArchImg src={`/assets/img/${PHASE_IMG[curPhase.id].src}.jpg`} caption={L(lang, PHASE_IMG[curPhase.id].zh, PHASE_IMG[curPhase.id].en)} />}
        </div>

        {/* 城市档案 */}
        <div id="city-dossier" style={{ display: 'grid', gridTemplateColumns: '240px minmax(0,1fr)', gap: 26, marginTop: 60, scrollMarginTop: 80 }} className="act2-grid">
          <div>
            {tl.filter((p) => p.cities.length > 0).map((p) => (
              <div key={p.id} style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 11, letterSpacing: '0.2em', color: PAL.sepia, margin: '0 0 8px', textTransform: 'uppercase' }}>
                  {L(lang, p.name_zh, p.name_en)} · {L(lang, p.years_zh, p.years_en)}
                </p>
                {p.cities.map((cid) => {
                  const c = content.cities.find((x) => x.id === cid)!
                  const on = cityId === cid
                  return (
                    <button key={cid} onClick={() => setCityId(cid)} style={{
                      display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
                      background: on ? PAL.paperLt : 'transparent',
                      border: 'none', borderLeft: `3px solid ${on ? PAL.vermil : `${PAL.sepia}44`}`,
                      padding: '8px 12px', color: on ? PAL.vermilDk : PAL.ink,
                      fontSize: 14, fontWeight: on ? 700 : 400, transition: 'all 0.25s',
                    }}>
                      {L(lang, c.name_zh, c.name_en)}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          <article style={{ background: PAL.paperLt, border: `1px solid ${PAL.sepia}55`, padding: 'clamp(20px, 3vw, 36px)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <h3 className="font-display" style={{ fontSize: 30, fontWeight: 700, color: PAL.inkDeep, margin: 0 }}>
                    {L(lang, city.name_zh, city.name_en)}
                  </h3>
                  <span className="font-display" style={{ fontSize: 16, color: PAL.sepia }}>
                    {lang === 'zh' ? city.name_en : city.name_zh}
                  </span>
                </div>
                <p style={{ color: PAL.vermil, fontSize: 14, margin: '8px 0 0', fontWeight: 600 }}>
                  {L(lang, city.role_zh, city.role_en)}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: PERIOD_COLOR[city.period] ?? PAL.sepia }}>{city.year}</div>
                <div style={{ fontSize: 12, color: PAL.sepia }}>{city.reign_zh} · {periodName(city.period)}</div>
              </div>
            </div>

            <div style={{ margin: '14px 0 4px' }}>
              <Chip color={PAL.sepia}>{t('dossier_dims')}：{L(lang, city.dims_zh, city.dims_en)}</Chip>
              <Chip color={PAL.sepia}>{t('dossier_location')}：{L(lang, city.location_zh, city.location_en)}</Chip>
            </div>
            {city.gates && city.gates.length > 0 && (
              <div style={{ marginBottom: 4 }}>
                <Chip color={PAL.vermil}>{t('dossier_gates')}</Chip>
                {city.gates.map((g) => (
                  <Chip key={g.dir_zh}>{L(lang, `${g.dir_zh}·${g.name_zh}`, `${g.dir_en} ${g.name_en}`)}</Chip>
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: arch ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr)', gap: 20, margin: '18px 0' }} className="act2-imgs">
              <ArchImg src={`/assets/img/${CITY_IMG[city.id]}.jpg`} caption={L(lang, 'AIGC 场景复原', 'AI-generated reconstruction')} alt={L(lang, city.name_zh, city.name_en)} />
              {arch && <ArchImg src={arch.src} caption={L(lang, arch.cap_zh, arch.cap_en)} />}
            </div>

            <p style={{ fontSize: 15, lineHeight: 2.05, color: PAL.ink, margin: '10px 0 0', textAlign: 'justify' }}>
              {L(lang, city.story_zh, city.story_en)}
            </p>

            <div style={{ background: `${PAL.paperDk}`, border: `1px solid ${PAL.sepia}44`, padding: '16px 18px', marginTop: 22 }}>
              <p style={{ fontSize: 11, letterSpacing: '0.25em', color: PAL.vermil, margin: '0 0 8px', textTransform: 'uppercase' }}>
                {t('dossier_remains')}
              </p>
              <p style={{ fontSize: 13.5, lineHeight: 1.95, color: PAL.ink, margin: 0 }}>
                {L(lang, city.remains_zh, city.remains_en)}
              </p>
            </div>
            <Sources items={city.sources} />
          </article>
        </div>

        {/* 九城之外 */}
        <div style={{ marginTop: 70 }}>
          <h3 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: PAL.inkDeep, marginBottom: 20 }}>{t('secondary_title')}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {content.secondary_sites.map((s) => (
              <div key={s.id} style={{ border: `1px solid ${PAL.sepia}55`, background: PAL.paperLt, padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                  <h4 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: PAL.inkDeep, margin: 0 }}>{L(lang, s.name_zh, s.name_en)}</h4>
                  {s.year && <span style={{ fontSize: 13, color: PAL.vermil, fontWeight: 700 }}>{s.year}</span>}
                </div>
                <p style={{ fontSize: 12.5, color: PAL.vermil, margin: '6px 0 10px' }}>{L(lang, s.role_zh, s.role_en)}</p>
                <p style={{ fontSize: 13.5, lineHeight: 1.9, color: PAL.ink, margin: 0 }}>{L(lang, s.text_zh, s.text_en)}</p>
                <p style={{ fontSize: 12.5, lineHeight: 1.8, color: PAL.sepia, margin: '10px 0 0' }}>{L(lang, s.remains_zh, s.remains_en)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 双核与都会 */}
        <div style={{ marginTop: 80 }}>
          <Hairline />
          <h3 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: PAL.inkDeep, margin: '26px 0 16px' }}>
            {L(lang, content.dual_core.title_zh, content.dual_core.title_en)}
          </h3>
          <p style={{ fontSize: 14.5, lineHeight: 2, color: PAL.ink, maxWidth: 860, margin: 0 }}>
            {L(lang, content.dual_core.text_zh, content.dual_core.text_en)}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 10, marginTop: 10 }}>
            {content.quotes.filter((q) => q.about === 'huiyuan-old').map((q, i) => (
              <QuoteBlock key={i} zh={q.text_zh} en={q.text_en} source={L(lang, q.source_zh, q.source_en)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
