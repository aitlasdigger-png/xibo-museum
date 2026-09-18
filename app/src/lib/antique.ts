import type { StyleSpecification } from 'maplibre-gl'
import { PAL } from './palette'

// 程序化"古地图"底图：OpenFreeMap 矢量瓦片 + Mapterhorn 地形晕渲
// 只保留 landcover / water / waterway / boundary / mountain_peak，无道路、无现代地名
export function antiqueStyle(opts: { hillshade?: boolean } = {}): StyleSpecification {
  const hillshade = opts.hillshade !== false
  const sources: StyleSpecification['sources'] = {
    ofm: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
  }
  if (hillshade) {
    sources.terrarium = {
      type: 'raster-dem',
      url: 'https://tiles.mapterhorn.com/tilejson.json',
      encoding: 'terrarium',
      tileSize: 256,
    }
  }

  const layers: StyleSpecification['layers'] = [
    { id: 'bg', type: 'background', paint: { 'background-color': PAL.paper } },
    {
      id: 'landcover', type: 'fill', source: 'ofm', 'source-layer': 'landcover',
      paint: { 'fill-color': PAL.paperDk, 'fill-opacity': 0.55 },
    },
    {
      id: 'water', type: 'fill', source: 'ofm', 'source-layer': 'water',
      paint: { 'fill-color': PAL.water, 'fill-opacity': 0.9 },
    },
    {
      id: 'waterway', type: 'line', source: 'ofm', 'source-layer': 'waterway',
      paint: { 'line-color': PAL.waterLine, 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.6, 10, 2] },
    },
  ]
  if (hillshade) {
    layers.push({
      id: 'hillshade', type: 'hillshade', source: 'terrarium',
      paint: {
        'hillshade-shadow-color': '#6b5638',
        'hillshade-highlight-color': '#f8f0dd',
        'hillshade-accent-color': '#d8c9a3',
        'hillshade-exaggeration': 0.42,
      },
    } as never)
  }
  layers.push(
    {
      id: 'boundary', type: 'line', source: 'ofm', 'source-layer': 'boundary',
      filter: ['<=', ['get', 'admin_level'], 2],
      paint: { 'line-color': PAL.sepia, 'line-width': 1, 'line-dasharray': [4, 3], 'line-opacity': 0.55 },
    },
    {
      id: 'water-name', type: 'symbol', source: 'ofm', 'source-layer': 'water_name',
      layout: {
        'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name:zh'], ['get', 'name']],
        'text-font': ['Noto Serif Regular'], 'text-size': 11,
      },
      paint: { 'text-color': '#5f7263', 'text-halo-color': PAL.paper, 'text-halo-width': 1 },
    },
    {
      id: 'peak', type: 'symbol', source: 'ofm', 'source-layer': 'mountain_peak',
      layout: {
        'text-field': ['concat', '▲ ', ['coalesce', ['get', 'name:en'], ['get', 'name:zh'], ['get', 'name']]],
        'text-font': ['Noto Serif Regular'], 'text-size': 10,
      },
      paint: { 'text-color': PAL.sepia, 'text-halo-color': PAL.paper, 'text-halo-width': 1 },
    },
  )

  return {
    version: 8,
    name: 'xibe-antique',
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    sources,
    layers,
  }
}
