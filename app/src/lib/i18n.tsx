import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'zh'

const dict = {
  brand_en: 'Traces of the Xibe',
  brand_zh: '寻迹锡伯',
  loading: { en: 'Preparing the archive…', zh: '正在整理档案…' },
  nav_prologue: { en: 'Prologue', zh: '序章' },
  nav_act1: { en: 'The Road West', zh: '西迁' },
  nav_act2: { en: 'Nine Towns', zh: '筑城' },
  nav_act3: { en: 'Karun & Home', zh: '卡伦人家' },
  nav_act4: { en: 'The Deeper Valley', zh: '更深的河谷' },
  nav_act5: { en: 'Colophon', zh: '尾声' },
  nav_song: { en: 'The Song', zh: '长歌' },

  song_begin: { en: 'Unroll the scroll', zh: '启卷' },
  song_begin_mute: { en: 'Enter without sound', zh: '静音入卷' },
  song_mode_auto: { en: 'Auto', zh: '自动' },
  song_mode_manual: { en: 'Manual', zh: '手动' },
  song_mute: { en: 'Mute', zh: '静音' },
  song_unmute: { en: 'Sound on', zh: '开声' },
  song_back: { en: 'Back to the museum', zh: '返回主馆' },
  song_placeholder: {
    en: 'Background audio: the original Song of the Westward Migration, sung a cappella by Tong Limei (age 93), national-level bearer of this intangible heritage (2022). Rights belong to the performer; excerpt used with attribution.',
    zh: '背景音：《西迁之歌》原声——国家级非物质文化遗产传承人佟李美（93岁）清唱，2022年录制。版权归原作者，本馆节选使用并署名。',
  },

  prologue_kicker: { en: 'A Digital Museum of Xibe Heritage in the Ili Valley', zh: '伊犁河谷锡伯文化遗产数字博物馆' },
  prologue_begin: { en: 'Enter the museum', zh: '入馆' },
  prologue_scroll: { en: 'Scroll', zh: '下滑' },
  prologue_identity_en: { en: '', zh: '' },
  prologue_identity_zh: { en: '', zh: '' },
  prologue_project_en: {
    en: 'A bilingual digital museum of Xibe heritage in the Ili valley, created by Yufan, a Xibe descendant.\nBuilt from 60+ field-verified sites, AI remote sensing cross-referenced with multiple documentary sources, and 3D models of 10 million polygons.',
    zh: '',
  },
  prologue_project_zh: {
    en: '',
    zh: '锡伯族后裔 Yufan 所创造的一座伊犁河谷锡伯遗产双语数字博物馆。\n基于60余处田野遗址、AI遥感识别与交叉对比多种文献、1000万个polygon组成的三维模型而建成。',
  },
  prologue_for_reviewers: { en: 'For reviewers: a 90-second route', zh: '评审速览：90秒路线' },
  prologue_map_title: { en: 'Exhibition Map', zh: '本馆导览' },
  prologue_map_sub: { en: 'Six stories, each with its own method — click to enter', zh: '六个故事，各有方法——点击进入' },

  ev1_title: { en: 'SCHOLARSHIP', zh: '文献研究' },
  ev1_desc_en: { en: 'Every fort, garrison town and karun linked to the Xibe was located in the documentary record — with the monograph Western Shield of the Frontier (Science Press, 2023) as the single source of fact — then verified in the field.', zh: '' },
  ev1_desc_zh: { en: '', zh: '系统梳理文献记录中所有与锡伯族相关的军事城堡、要塞与卡伦——以考古学专著《西陲屏藩》（科学出版社 2023）为唯一事实来源，并逐一田野核对' },
  ev2_title: { en: 'FIELDWORK', zh: '田野调查' },
  ev2_desc_en: { en: 'A full summer of fieldwalking in the Ili valley; 60+ sites verified on foot.', zh: '' },
  ev2_desc_zh: { en: '', zh: '一整个夏天在伊犁河谷实地踏查，核对 60 余处遗址' },
  ev3_title: { en: 'AI + REMOTE SENSING', zh: 'AI 遥感识别' },
  ev3_desc_en: { en: "Transferred AI remote-sensing methods from my AiTLAS Lab internship to this project: beyond the documented Xibe sites, 21 early Bronze-Age sites absent from any government archaeological record were newly detected.", zh: '' },
  ev3_desc_zh: { en: '', zh: '把 AiTLAS 实验室实习中积累的遥感 AI 识别技术迁移到本项目：除已知锡伯遗址外，新发现 21 处未见于任何政府考古记录的早期青铜遗址' },
  ev4_title: { en: 'DIGITAL STORYTELLING', zh: '数字叙事' },
  ev4_desc_en: { en: '4 antique-style interactive maps · 41 AI-generated reconstructions · 3D photogrammetry · a 12-scene folk-song scroll.', zh: '' },
  ev4_desc_zh: { en: '', zh: '4 幅古地图风交互地图 · 41 幅 AIGC 场景复原 · 3D 摄影测量 · 十二幕民歌音画长卷' },

  map_prologue_story_en: { en: 'Ili in a single poem', zh: '' },
  map_prologue_story_zh: { en: '', zh: '一首诗里的伊犁' },
  map_prologue_tech_en: { en: 'Map visualisation based on documentary research, tracing the full westward migration', zh: '' },
  map_prologue_tech_zh: { en: '', zh: '基于文献研究的地图可视化，呈现整个西迁过程' },
  map_act1_story_en: { en: 'Three thousand people, ten thousand li, one folk song', zh: '' },
  map_act1_story_zh: { en: '', zh: '三千人、一万里、一支民歌' },
  map_act1_tech_en: { en: 'Interactive antique map + scrolling narrative', zh: '' },
  map_act1_tech_zh: { en: '', zh: '交互古地图 + 滚动叙事' },
  map_act2_story_en: { en: 'Nine towns, fifty years, twice destroyed, twice rebuilt', zh: '' },
  map_act2_story_zh: { en: '', zh: '九座城的五十年两毁两建' },
  map_act2_tech_en: { en: 'Timeline-driven map + per-town dossiers', zh: '' },
  map_act2_tech_zh: { en: '', zh: '时间轴驱动地图 + 逐城档案' },
  map_act3_story_en: { en: 'Eighteen frontier posts and the people who held them', zh: '' },
  map_act3_story_zh: { en: '', zh: '18 座边防哨所与守卡的人' },
  map_act3_tech_en: { en: 'Site coordinate archives + 3D photogrammetry', zh: '' },
  map_act3_tech_zh: { en: '', zh: '遗址坐标建档 + 3D 摄影测量' },
  map_act4_story_en: { en: 'Two thousand years of inhabitants before the banners', zh: '' },
  map_act4_story_zh: { en: '', zh: '旗营到来之前两千年的居民' },
  map_act4_tech_en: { en: 'AI remote-sensing discovery (coordinates protected)', zh: '' },
  map_act4_tech_zh: { en: '', zh: 'AI 遥感新发现（坐标已保护性模糊）' },
  map_song_story_en: { en: 'Twelve scenes of the Song of the Westward Migration', zh: '' },
  map_song_story_zh: { en: '', zh: '《西迁之歌》十二幕' },
  map_song_tech_en: { en: 'Original audio + AIGC illustrated scroll', zh: '' },
  map_song_tech_zh: { en: '', zh: '原声音频 + AIGC 音画长卷' },

  act1_kicker: { en: 'Act I · 1764–1765', zh: '第一章 · 1764–1765' },
  act1_title: { en: 'The Road West', zh: '西迁之路' },
  act1_lead: {
    en: 'Why did a people leave the forests of the northeast for a valley at the empire’s far edge? Follow the road they walked.',
    zh: '一个民族为什么离开东北故土，走向帝国最西端的河谷？沿着他们走过的路，一站一站走一遍。',
  },
  act1_stops: { en: 'Stations of the road', zh: '沿途站点' },

  act2_kicker: { en: 'Act II · 1761–1911', zh: '第二章 · 1761–1911' },
  act2_title: { en: 'Nine Towns on the River', zh: '九城：河谷上的帝国秩序' },
  act2_lead: {
    en: 'In fifty years the Qing raised nine walled towns in the Ili valley — twice destroyed, twice rebuilt. Scrub the timeline; open each town’s dossier.',
    zh: '五十年间，清廷在伊犁河谷筑起九座城，两毁两建。拨动时间轴，翻开每一座城的档案。',
  },
  dossier_remains: { en: 'What remains', zh: '考古现状' },
  dossier_sources: { en: 'Historical sources', zh: '史料依据' },
  dossier_gates: { en: 'Gates', zh: '城门' },
  dossier_dims: { en: 'Dimensions', zh: '规制' },
  dossier_location: { en: 'Location today', zh: '今址' },
  secondary_title: { en: 'Beyond the nine', zh: '九城之外' },

  act3_kicker: { en: 'Act III · The Xibe at the Border', zh: '第三章 · 边境上的锡伯人' },
  act3_title: { en: 'Karun: Homes on the Frontier Line', zh: '卡伦人家' },
  act3_lead: {
    en: 'Beyond the towns, a chain of tiny earthworks watched the frontier. Behind each stood a battalion — and its families.',
    zh: '城池之外，一串小小的土围子看守着边界。每一座卡伦背后，都站着一营人，和他们的家。',
  },
  karun_system_title: { en: 'How the karun worked', zh: '卡伦制度' },
  karun_duties_title: { en: 'What a karun did', zh: '卡伦的职守' },
  karun_interior_title: { en: 'Inside the walls', zh: '围墙之内' },
  karun_index_title: { en: 'Eighteen karun, one by one', zh: '十八座卡伦，逐一座谈' },
  karun_garrison: { en: 'Garrisoned by', zh: '驻守' },
  karun_altitude: { en: 'Altitude', zh: '海拔' },
  karun_period_qianlong: { en: 'Qianlong era', zh: '乾隆期' },
  karun_period_guangxu: { en: 'Guangxu era', zh: '光绪期' },
  niulu_title: { en: 'Eight banners, eight forts', zh: '八旗八堡' },
  life_title: { en: 'Garrison life', zh: '戍边生活' },
  model_title: { en: 'A karun in three dimensions', zh: '三维看卡伦' },
  model_note: {
    en: '3D scans of five karun sites from Sketchfab (aitlas-kalun collection). Drag to rotate, scroll to zoom.',
    zh: '五处卡伦遗址三维扫描档案（来自 Sketchfab · aitlas-kalun 收藏）。拖动旋转，滚轮缩放。',
  },

  act4_kicker: { en: 'Act IV · Before the Banners', zh: '第四章 · 旗营到来之前' },
  act4_title: { en: 'The Deeper Valley', zh: '更深的河谷' },
  act4_note: {
    en: 'Coordinates on this map have been randomly offset to protect the sites; the pattern, not the points, is the finding.',
    zh: '为保护遗址，图中坐标已做随机偏移处理——请看分布格局，而非单个点位。',
  },

  act5_kicker: { en: 'Colophon', zh: '尾声' },
  act5_title: { en: 'How this museum was made', zh: '本馆如何建成' },
  colophon_content: {
    en: 'All historical text is based on Hao Yuanlin’s archaeological monograph Western Shield of the Frontier (Science Press, 2023); quotations are from primary sources cited therein. Scene images are AI-generated reconstructions; archival photographs are public-domain works from Wikimedia Commons. Basemap data © OpenStreetMap contributors, served by OpenFreeMap; terrain shading from Mapterhorn.',
    zh: '本馆全部历史文字以郝园林《西陲屏藩——清代伊犁河谷驻防城的考古学研究》（科学出版社，2023）为依据，引文出自书中所引一手史料；场景图像为 AI 生成复原；历史照片为维基共享资源公有领域作品。底图数据 © OpenStreetMap contributors，由 OpenFreeMap 提供；地形晕渲来自 Mapterhorn。',
  },
  colophon_burials: {
    en: 'Burial point data: project team remote-sensing survey, coordinates obfuscated for site protection.',
    zh: '墓葬点位数据：项目团队遥感调查成果，坐标已模糊化以保护遗址。',
  },

  quote_source: { en: 'Source', zh: '出处' },
  click_to_open: { en: 'Open dossier', zh: '打开档案' },
  close: { en: 'Close', zh: '关闭' },
  lang_toggle: { en: '中文', zh: 'EN' },
}

export type DictKey = keyof typeof dict

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: DictKey) => string }>({
  lang: 'en', setLang: () => {}, t: () => '',
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const t = (k: DictKey): string => {
    const v = dict[k]
    if (typeof v === 'string') return v
    return v[lang]
  }
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>
}

export const useLang = () => useContext(LangCtx)

/** 双语字段取值：L(lang, obj, 'name') → obj.name_zh / obj.name_en */
export function L(lang: Lang, zh: string | null | undefined, en: string | null | undefined): string {
  if (lang === 'zh') return zh || en || ''
  return en || zh || ''
}
