// 寻迹锡伯 V3 — 古地图式档案美学
export const PAL = {
  paper: '#ece1c5',
  paperLt: '#f4ecd8',
  paperDk: '#e3d6b2',
  ink: '#4a3b28',
  inkDeep: '#241b0f',
  sepia: '#7d6547',
  sepiaLt: '#a08a68',
  vermil: '#a63a2b',
  vermilDk: '#7e2b1f',
  water: '#b7c4b2',
  waterLine: '#8ea694',
  solon: '#5c6e8c',     // 索伦营
  xibe: '#a63a2b',      // 锡伯营
  oirat: '#6d7c4f',     // 厄鲁特营
  unknownGarrison: '#8a7a5c',
  night: '#171209',
}

export const PERIOD_COLOR: Record<string, string> = {
  founding: '#8c6d3f',
  height: '#a63a2b',
  consolidation: '#5c6e8c',
  war: '#3d3d3d',
  reconstruction: '#6d7c4f',
  qianlong: '#8c6d3f',
  guangxu: '#5c6e8c',
  unknown: '#8a7a5c',
}

export const GARRISON_COLOR: Record<string, string> = {
  '锡伯营': PAL.xibe,
  '索伦营': PAL.solon,
  '厄鲁特营': PAL.oirat,
}
