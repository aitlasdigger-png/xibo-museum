import { useRef } from 'react'
import type maplibregl from 'maplibre-gl'
import { useLang, L } from '@/lib/i18n'
import { PAL } from '@/lib/palette'
import { Kicker, ActTitle, ArchImg } from '@/components/Bits'
import AntiqueMap from '@/components/AntiqueMap'
import content from '@/data/content.json'
import burials from '@/data/burials.json'

const BURIAL_BOUNDS: [[number, number], [number, number]] = [[79.7, 42.4], [82.6, 44.2]]
const PLUM = '#5f4a6e'

export default function Act4Burials() {
  const { lang, t } = useLang()
  const bi = content.burials_intro
  const mapRef = useRef<maplibregl.Map | null>(null)

  const onReady = (map: maplibregl.Map) => {
    mapRef.current = map
    map.addSource('burials', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: (burials as { id: string; lon: number; lat: number }[]).map((b) => ({
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [b.lon, b.lat] },
          properties: { id: b.id },
        })),
      },
    })
    map.addLayer({
      id: 'burials-halo', type: 'circle', source: 'burials',
      paint: { 'circle-radius': 13, 'circle-color': PLUM, 'circle-opacity': 0.18 },
    })
    map.addLayer({
      id: 'burials-circle', type: 'circle', source: 'burials',
      paint: {
        'circle-radius': 5.5, 'circle-color': PLUM, 'circle-opacity': 0.85,
        'circle-stroke-color': PAL.paperLt, 'circle-stroke-width': 1.5,
      },
    })
  }

  return (
    <section id="act4" style={{ background: PAL.inkDeep, padding: '110px 0 100px', color: PAL.paperLt }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <Kicker light>{t('act4_kicker')}</Kicker>
        <ActTitle light>{L(lang, bi.title_zh, bi.title_en)}</ActTitle>
        <p style={{ maxWidth: 860, lineHeight: 2, fontSize: 15, color: `${PAL.paperLt}d9`, margin: 0 }}>
          {L(lang, bi.text_zh, bi.text_en)}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,3fr) minmax(0,2fr)', gap: 26, marginTop: 44, alignItems: 'start' }} className="act4-grid">
          <div>
            <AntiqueMap bounds={BURIAL_BOUNDS} onReady={onReady} className="act4-map" />
            <p style={{ fontSize: 12, color: `${PAL.paperDk}99`, marginTop: 10, lineHeight: 1.8 }}>
              {(burials as unknown[]).length} {L(lang, '个点位 · ', ' sites · ')}{t('act4_note')}
            </p>
          </div>
          <div style={{ display: 'grid', gap: 18 }}>
            <ArchImg src="/assets/img/remote-sensing.jpg" caption={L(lang, '方法：卫星遥感 + 实地踏查', 'Method: satellite remote sensing + field survey')} />
            <ArchImg src="/assets/img/kurgan-night.jpg" caption={L(lang, 'AIGC 场景复原：河谷里的封土堆', 'AI reconstruction: burial mounds in the valley')} />
          </div>
        </div>
      </div>
    </section>
  )
}
