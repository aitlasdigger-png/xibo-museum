import { useEffect, useRef, type ReactNode } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { antiqueStyle } from '@/lib/antique'
import { PAL } from '@/lib/palette'

export interface AntiqueMapProps {
  bounds?: [[number, number], [number, number]]
  center?: [number, number]
  zoom?: number
  hillshade?: boolean
  interactive?: boolean
  onReady?: (map: maplibregl.Map) => void
  className?: string
  children?: ReactNode
}

/** 古地图底图容器：接近视口才初始化，卸载即销毁 */
export default function AntiqueMap({ bounds, center, zoom, hillshade = true, interactive = true, onReady, className, children }: AntiqueMapProps) {
  const holderRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const readyRef = useRef(onReady)
  readyRef.current = onReady

  // 懒初始化
  useEffect(() => {
    const holder = holderRef.current
    if (!holder) return
    let map: maplibregl.Map | null = null
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        if (mapRef.current || !boxRef.current) return
        map = new maplibregl.Map({
          container: boxRef.current,
          style: antiqueStyle({ hillshade }),
          bounds: bounds as maplibregl.LngLatBoundsLike | undefined,
          center: bounds ? undefined : (center ?? [81, 43.8]),
          zoom: bounds ? undefined : (zoom ?? 7),
          fitBoundsOptions: { padding: 30 },
          attributionControl: { compact: true },
          interactive,
          dragRotate: false,
          pitchWithRotate: false,
          touchPitch: false,
          fadeDuration: 200,
        })
        if (!interactive) {
          map.scrollZoom.disable(); map.dragPan.disable(); map.touchZoomRotate.disable()
        }
        mapRef.current = map
        map.on('load', () => { if (mapRef.current) readyRef.current?.(mapRef.current) })
      },
      { rootMargin: '500px' },
    )
    io.observe(holder)
    return () => { io.disconnect(); mapRef.current?.remove(); mapRef.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={holderRef} className={className} style={{ position: 'relative' }}>
      <div ref={boxRef} style={{ position: 'absolute', inset: 0 }} />
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
          boxShadow: `inset 0 0 0 1px ${PAL.sepia}55, inset 0 0 60px ${PAL.sepia}30`,
        }}
      />
      {children}
    </div>
  )
}
