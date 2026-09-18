import { useEffect, useRef, useState } from 'react'
import type maplibregl from 'maplibre-gl'
import { useLang, L } from '@/lib/i18n'
import { PAL } from '@/lib/palette'
import { Kicker, ActTitle, Lead, ArchImg, Sources, StatStrip, Chip } from '@/components/Bits'
import AntiqueMap from '@/components/AntiqueMap'
import Observe from '@/components/Observe'
import content from '@/data/content.json'
import route from '@/data/route.json'

const STOP_IMG: Record<string, string> = {
  shengjing: '/assets/img/mig-departure.jpg',
  urga: '/assets/img/mig-steppe.jpg',
  uliastai: '/assets/img/mig-sheep.jpg',
  ili: '/assets/img/mig-arrival.jpg',
}

const ROUTE_BOUNDS: [[number, number], [number, number]] = [[78.5, 38.5], [126.5, 50.2]]

export default function Act1Migration() {
  const { lang, t } = useLang()
  const mig = content.migration
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [active, setActive] = useState<string>('shengjing')

  const onReady = (map: maplibregl.Map) => {
    mapRef.current = map
    const line = {
      type: 'Feature' as const,
      geometry: { type: 'LineString' as const, coordinates: route.map((r) => r.coord) },
      properties: {},
    }
    map.addSource('route', { type: 'geojson', data: line })
    map.addSource('stops', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: route.map((r) => ({
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: r.coord },
          properties: { id: r.id, name_zh: r.name_zh, name_en: r.name_en },
        })),
      },
    })
    map.addLayer({
      id: 'route-casing', type: 'line', source: 'route',
      paint: { 'line-color': PAL.paperLt, 'line-width': 5, 'line-opacity': 0.9 },
    })
    map.addLayer({
      id: 'route-line', type: 'line', source: 'route',
      paint: { 'line-color': PAL.vermil, 'line-width': 2.2, 'line-dasharray': [3, 2.2] },
    })
    map.addLayer({
      id: 'stops-circle', type: 'circle', source: 'stops',
      paint: {
        'circle-radius': ['case', ['==', ['get', 'id'], active], 9, 5.5],
        'circle-color': ['case', ['==', ['get', 'id'], active], PAL.vermil, PAL.paperLt],
        'circle-stroke-color': PAL.vermil,
        'circle-stroke-width': 2,
      },
    })
    map.addLayer({
      id: 'stops-label', type: 'symbol', source: 'stops',
      layout: {
        'text-field': ['get', lang === 'zh' ? 'name_zh' : 'name_en'],
        'text-font': ['Noto Serif Regular'],
        'text-size': ['case', ['==', ['get', 'id'], active], 14, 11],
        'text-offset': [0, 1.1], 'text-anchor': 'top',
        'text-optional': true,
      },
      paint: {
        'text-color': ['case', ['==', ['get', 'id'], active], PAL.vermilDk, PAL.ink],
        'text-halo-color': PAL.paperLt, 'text-halo-width': 1.4,
      },
    })
    map.on('click', 'stops-circle', (e) => {
      const f = e.features?.[0]
      const id = f?.properties?.id as string | undefined
      if (id) document.getElementById(`stop-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    map.on('mouseenter', 'stops-circle', () => { map.getCanvas().style.cursor = 'pointer' })
    map.on('mouseleave', 'stops-circle', () => { map.getCanvas().style.cursor = '' })
  }

  // 高亮当前站点
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.getLayer('stops-circle')) return
    map.setPaintProperty('stops-circle', 'circle-radius', ['case', ['==', ['get', 'id'], active], 9, 5.5])
    map.setPaintProperty('stops-circle', 'circle-color', ['case', ['==', ['get', 'id'], active], PAL.vermil, PAL.paperLt])
    map.setLayoutProperty('stops-label', 'text-size', ['case', ['==', ['get', 'id'], active], 14, 11])
    map.setPaintProperty('stops-label', 'text-color', ['case', ['==', ['get', 'id'], active], PAL.vermilDk, PAL.ink])
  }, [active])

  // 语言切换 → 标签字段
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.getLayer('stops-label')) return
    map.setLayoutProperty('stops-label', 'text-field', ['get', lang === 'zh' ? 'name_zh' : 'name_en'])
  }, [lang])

  return (
    <section id="act1" style={{ background: PAL.paper, padding: '110px 0 90px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <Kicker>{t('act1_kicker')}</Kicker>
        <ActTitle>{t('act1_title')}</ActTitle>
        <Lead>{t('act1_lead')}</Lead>

        {/* 为什么西迁：三幕 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22, margin: '54px 0 70px' }}>
          {mig.why.scenes.map((s) => (
            <div key={s.id} style={{
              border: `1px solid ${PAL.sepia}55`, background: PAL.paperLt, padding: '22px 22px 18px',
            }}>
              <div className="font-display" style={{ fontSize: 30, fontWeight: 700, color: PAL.vermil }}>{s.year}</div>
              <h3 className="font-display" style={{ fontSize: 19, color: PAL.inkDeep, margin: '8px 0 10px', fontWeight: 700 }}>
                {L(lang, s.title_zh, s.title_en)}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.95, color: PAL.ink, margin: 0 }}>{L(lang, s.text_zh, s.text_en)}</p>
            </div>
          ))}
        </div>

        {/* 地图 + 站点叙事 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)', gap: 30, alignItems: 'start' }} className="act1-grid">
          <div style={{ position: 'sticky', top: 76 }}>
            <AntiqueMap bounds={ROUTE_BOUNDS} hillshade={false} onReady={onReady} className="act1-map" />
            <p style={{ fontSize: 11, color: PAL.sepia, marginTop: 8, letterSpacing: '0.08em' }}>
              {L(lang, '古地图风底图 · 点击站点跳转对应叙事', 'Antique-style basemap · click a station to jump to its story')}
            </p>
          </div>
          <div>
            <p style={{ fontSize: 12, letterSpacing: '0.25em', color: PAL.sepia, textTransform: 'uppercase', marginBottom: 18 }}>
              {t('act1_stops')}
            </p>
            {mig.stops.map((s, i) => {
              const img = STOP_IMG[s.id]
              const isActive = active === s.id
              return (
                <Observe key={s.id} onEnter={() => setActive(s.id)}>
                  <article id={`stop-${s.id}`} style={{
                    borderLeft: `3px solid ${isActive ? PAL.vermil : `${PAL.sepia}44`}`,
                    background: isActive ? PAL.paperLt : 'transparent',
                    padding: '20px 20px 18px', marginBottom: 26, transition: 'all 0.4s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                      <span className="font-display" style={{ fontSize: 13, color: PAL.sepia }}>{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="font-display" style={{ fontSize: 21, fontWeight: 700, color: isActive ? PAL.vermilDk : PAL.inkDeep, margin: 0 }}>
                        {L(lang, s.name_zh, s.name_en)}
                      </h3>
                      {s.year && <Chip color={PAL.vermil}>{s.year}</Chip>}
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.95, color: PAL.ink, margin: '10px 0 0' }}>
                      {L(lang, s.text_zh, s.text_en)}
                    </p>
                    {img && (
                      <div style={{ marginTop: 14 }}>
                        <ArchImg src={img} caption={L(lang, 'AIGC 场景复原', 'AI-generated reconstruction')} alt={L(lang, s.name_zh, s.name_en)} />
                      </div>
                    )}
                    <Sources items={s.sources} />
                  </article>
                </Observe>
              )
            })}
          </div>
        </div>

        <div style={{ marginTop: 60 }}>
          <StatStrip items={mig.numbers} />
        </div>

        {/* 民歌馆入口 */}
        <a href="#/song" style={{
          display: 'flex', alignItems: 'center', gap: 18, textDecoration: 'none', marginTop: 56,
          border: `1px solid ${PAL.sepia}55`, background: PAL.inkDeep, padding: '24px 28px',
        }}>
          <span style={{ fontSize: 26 }}>♪</span>
          <span style={{ flex: 1 }}>
            <span className="font-display" style={{ display: 'block', fontSize: 19, fontWeight: 700, color: PAL.paperLt }}>
              {L(lang, '这条路，锡伯人自己唱了两百年', 'The Xibe sang this road for two hundred years')}
            </span>
            <span style={{ display: 'block', fontSize: 13, color: `${PAL.paperDk}aa`, marginTop: 6 }}>
              {L(lang, '民歌馆《长歌西去》：《西迁之歌》十二幕音画长卷 →', 'The Song Pavilion — twelve scenes of the Song of the Westward Migration →')}
            </span>
          </span>
          <span style={{ color: PAL.vermil, fontSize: 22 }}>→</span>
        </a>
      </div>
    </section>
  )
}
