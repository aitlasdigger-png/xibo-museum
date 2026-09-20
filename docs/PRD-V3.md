# 寻迹锡伯 · Traces of the Xibe — 产品需求文档（PRD V3）

> 版本：V3.3（Cloudflare 部署版） · 2026-09
> 本文档同步当前线上版本（version ID: de51dbb），取代 PRD V2。
> 内容唯一事实来源：郝园林《西陲屏藩——清代伊犁河谷驻防城的考古学研究》（科学出版社，2023）。

---

## 1. 项目概述

「寻迹锡伯」是一座面向海外受众的锡伯族文化遗产数字博物馆（留学作品集项目），以 1764 年锡伯族西迁伊犁为核心叙事，覆盖伊犁九城、八旗八堡、卡伦体系与早期墓葬遥感发现。

- **形态**：纯静态网站（无后端、无数据库），React 19 + TypeScript + Vite + Tailwind + MapLibre GL
- **语言**：中英双语，默认英文（海外受众优先），右上角一键切换
- **数据源**：全部为静态 JSON + 静态图片/音频，打包进 `dist/` 直接部署

## 2. 版本历史

| 版本 | 内容 |
|---|---|
| V1 | 预览版：单图滚动叙事 |
| V2 | OpenFreeMap 暗色底图 + 九城故事卡 + 卡伦三幕 + 墓葬坐标模糊化 |
| V3.0 | 全量重构：古地图档案风；五章结构；十城档案页；18 卡伦逐个档案；八牛录；全部内容改写自《西陲屏藩》 |
| V3.1 | 新增民歌馆《长歌西去》：《西迁之歌》十二幕音画长卷 |
| V3.2 | 民歌馆背景音换为佟李美清唱《西迁之歌》原声；12 幕图按清代锡伯旗人规范全部重生成；全站图片 PNG→JPG（76MB→8.7MB） |
| V3.3 | Cloudflare 部署适配：移除 Kimi 沙盒插件、修复路由为纯 hash、接入 Sketchfab 5 卡伦 3D 扫描模型画廊、修复音频自动播放与返回位置记忆、添加 `_headers` 缓存策略、JS 分包优化 |

## 3. 设计系统：「古地图档案」

- **色板**：纸 `#ece1c5` / 纸深 `#e3d6b2` / 纸浅 `#f4ecd8` / 墨 `#4a3b28` / 墨深 `#241b0f` / 赭 `#7d6547` / 朱砂 `#a63a2b`（印章、路线、重点）/ 水 `#b7c4b2`
- **字体**：Playfair Display + Noto Serif SC（全文宋体/衬线体系）
- **组件**：朱砂印章（Seal）、档案图片框（ArchImg，纸框+说明条+加载失败自动隐藏）、史料折叠（Sources）、引文块（QuoteBlock）、数字条（StatStrip）、徽章（Chip）
- **底图**：程序化生成的古地图风（见 §8）

## 4. 信息架构

单页主馆（5 章）+ 独立民歌馆子页（hash 路由 `#/song`，静态托管无需 rewrite 规则）。

```
序章 Prologue        洪亮吉《伊犁纪事诗》题词 + 建馆缘起
第一章 西迁          交互古地图 + 8 站点滚动叙事 + 数字条 + 民歌馆入口
第二章 筑城          五段时间轴驱动河谷地图 → 十城档案页 → 九城之外 → 双核与都会
第三章 卡伦人家      卡伦制度 → 卡伦分布图(按营着色) → 18 卡伦档案 → 戍边生活 → 八旗八堡 → 3D 扫描画廊
第四章 更深的河谷    墓葬遥感点位（坐标已模糊化）+ 方法
尾声 Colophon        山水选址 + 诗歌回环 + 版权与信源
民歌馆 /#/song       启卷页 → 十二幕音画长卷 → 尾声页
```

**路由实现**：纯 hash 路由，无 react-router。`Home.tsx` 通过 `window.location.hash.startsWith('#/song')` 判断视图；TopNav「长歌」按钮调用 `goSong()` 记录当前滚动位置和 hash，跳转到 `#/song`；民歌馆返回时调用 `goHome()` 恢复之前位置。

## 5. 章节规格（主馆）

### 5.1 第一章 · 西迁
- 左侧常驻古地图（78.5–126.5°E）：朱砂虚线路线 + 8 站点，点击站点跳转叙事卡；右侧 Observe 滚动联动高亮
- 三幕背景卡（1759 空旷疆土 / 1762 伊犁将军 / 1764 四营移驻）
- 4 张 AIGC 场景图（盛京出发/蒙古高原/乌里雅苏台羊群/抵达伊犁）
- 数字条：1764 / 约千名兵三千余口 / 30,000 只羊 / 每兵 25 只 / 6→8 牛录 / 200 余里

### 5.2 第二章 · 筑城
- 时间轴 5 段（初建 1761–63 / 高潮 1763–65 / 完善 1766–1862 / 战乱 1864–81 / 重建 1882–1911），点选后河谷地图上对应时期城池点亮、其余淡出
- 战乱段配 war-fall-1866.jpg，重建段配 rebuild-1892.jpg
- 十城档案页（主从式：左按期分组列表，右档案）：规制/今址/城门名/正文 220–334 字/考古现状/史料折叠；惠远老城、绥定、宁远嵌公有领域历史图（Wikimedia，见 §9）
- 九城之外：哈什怀顺城、索伦营城、火烧庄子古城

### 5.3 第三章 · 卡伦人家
- 制度卡三类型（常设/移设/添撤）+ 1777 年六辖区 84 座 + 职能清单 + 两期分期
- 守卡回忆引文两条（何叶尔·文克津、锡伯老兵灵福寿）
- 卡伦地图按驻守营着色（锡伯营朱砂/索伦营青/厄鲁特营绿/待考灰）
- 18 座卡伦分 5 组逐个呈现，档案弹窗：所属营、海拔、规制、正文、考古现状、史料
- 戍边生活：四营格局、图伯特大渠（canal-1796.jpg）、信仰空间；Lansdell 1885 锡伯军屯版画
- 八旗八堡：8 牛录档案弹窗（顺序按 1908 年大渠自西向东）
- 3D 画廊：Sketchfab iframe 嵌入 5 座卡伦三维扫描档案（沙彦/头湖/梧桐孜/纳旦木/多兰图），顶部卡名切换，右侧档案卡片联动显示该卡伦基础信息（时期/驻守营/海拔/规制/位置/遗址现状），底部提供「打开完整档案」与「在 Sketchfab 中查看」入口；模型来自 Sketchfab @aitlas-kalun 收藏

### 5.4 第四章 · 更深的河谷
- 21 个墓葬点位（坐标已做 300–700m 随机偏移，`obfuscated: true`，原数据仅存于 `src/data/burials_precise_backup.json`，不进公开仓）
- 图上明示模糊化声明

## 6. 民歌馆《长歌西去》专项

- **歌曲**：《西迁之歌》，锡伯族民间长诗，管兴才整理（20 世纪 50 年代），127 组每组 4 行，伊犁州级非物质文化遗产；每幕节选 2–4 行并署名，英文为本馆译
- **十二幕**：圣旨→饯别→辞坟→送别→启程→关山→苦旅→越冬→抵达→立足→大渠→戍边·望乡；第 8 幕歌词取自原诗第三部分（调序已在 meta 与幕注双重声明）
- **音频**：背景音为国家级非遗传承人佟李美（93 岁）2022 年清唱《西迁之歌》原声（59 秒，循环）。来源：bilibili BV1xG411E7pM。**版权归原作者，当前为节选署名使用——公开上线前建议取得演唱者/平台授权**
- **图像**：12 张 2048×1152（JPG），统一人物规范提示词（清代锡伯旗人：辫发、马蹄袖、皮帽、勒勒车；硬性排除现代服装/现代军装/西方人），色温弧线暖→冷→暖
- **交互**：启卷页（点击手势解锁音频，setTimeout 100ms 延迟重试确保 `<audio>` 已挂载）→ 自动模式（9 秒/幕推进）/手动模式（进度轨、箭头、键盘 ←→、触摸滑动、Esc 退出）→ 尾声页（版本说明 + 回主馆入口）
- **音频路径**：`song.json` 中 `audio_dir` 为相对路径 `assets/audio/`（非 `/assets/audio/`），确保子路径部署时音频可正常加载
- 图像淡入 + Ken Burns 缓推镜；`prefers-reduced-motion` 时禁用动效；每幕预加载后续 2 图

## 7. 数据模型（`src/data/`）

| 文件 | 说明 |
|---|---|
| `content.json` | 主馆全部内容（173KB）：migration（why/stops×8/numbers）、cities×10、niulu×8、karun×18、secondary_sites×3、timeline×5、karun_system、garrison_life、dual_core、environment、quotes×4、prologue、burials_intro。条目均带 `sources` + `image_hint` |
| `song.json` | 民歌馆：meta（署名/声明/音频配置/启卷与尾声文案）+ scenes×12（标题/歌词中英/故事注中英/image_hint/tone/link/audio） |
| `sites.json` | 48 个点位（id/name_zh/name_en/category/lon/lat/year/preservation），category: city/niulu/karun/barracks/outpost/ancient |
| `route.json` | 西迁 8 站（id/coord/name_zh/name_en/year） |
| `burials.json` | 21 墓葬点（已模糊化）；`burials_precise_backup.json` 为原始坐标备份，**勿公开** |

## 8. 底图技术方案（`src/lib/antique.ts`）

- 数据源：OpenFreeMap 矢量瓦片（`tiles.openfreemap.org/planet`）+ Mapterhorn 地形晕渲（terrarium 编码）+ OpenFreeMap 字体 glyphs（CJK 可用）
- 仅保留 landcover/water/waterway/boundary/mountain_peak/water_name 图层；无道路、无现代地名；水体与山峰标注英文优先
- 晕渲暖色调（shadow #6b5638 / highlight #f8f0dd / exaggeration 0.42）
- 四个地图实例懒初始化（接近视口才创建）：西迁大图（无晕渲）、河谷图、卡伦图、墓葬图
- 署名：页脚 + 地图角落 © OpenStreetMap contributors / OpenFreeMap / Mapterhorn

## 9. 素材清单与版权

- **AIGC 图 41 张**（已标注 AI 生成）：`assets/img/` 29 张 + `assets/song/` 12 张
- **公有领域历史图**（Wikimedia Special:FilePath 直链，失败自动隐藏）：伊犁军府图（约1809）、Lansdell 1885 绥定残门版画、固勒扎塔兰奇大寺版画、锡伯军屯版画
- **音频**：佟李美《西迁之歌》原声 1 段（版权见 §6）；旧占位音频（12 段朗诵+氛围乐）备份于 `work/audio_placeholder_backup/`
- **3D**：Sketchfab iframe 嵌入 5 座卡伦三维扫描模型（沙彦/头湖/梧桐孜/纳旦木/多兰图），来自 Sketchfab @aitlas-kalun 收藏；`public/models/karun-placeholder.glb` 保留作 fallback 但当前未使用
- **待补**：PRD V2 §9.2.1 的其余历史照片清单（沙箱无法下载，需在有网环境补入）

## 10. 部署（Cloudflare Pages）

纯静态，无后端/数据库，两种上线方式：

### 方式一：Git 连接（推荐）

1. 推送到 GitHub 仓库
2. Cloudflare Pages → **Create → Connect to Git** → 选择仓库
3. **构建配置**：
   - **Root directory**: `app`（关键！`package.json` 在 `app/` 子目录）
   - **Build command**: `npm install && npm run build`
   - **Build output directory**: `dist`
   - **Node version**: 20+（Settings → Environment variables → `NODE_VERSION` = `20`）
4. **无需任何 SPA rewrite 规则**（民歌馆为 hash 路由 `#/song`）

> ⚠️ 注意：如果不设置 Root directory 为 `app`，构建命令会改为 `cd app && npm install && npm run build`，输出目录改为 `app/dist`。

### 方式二：直接上传

`npm run build` 后把 `app/dist/` 文件夹拖进 Cloudflare Pages（Direct Upload）。

### 部署体积与缓存

- dist ≈ 17MB
- `_headers` 配置（`public/_headers` → `dist/_headers`）：
  - `.glb` → `Content-Type: model/gltf-binary`
  - 静态资源（js/css/jpg/mp3/glb/fonts）→ `Cache-Control: public, max-age=31536000, immutable`
  - `index.html` → `Cache-Control: max-age=0, must-revalidate`
  - 安全头：`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`

## 11. 后续路线图

已完成（V3.3）：
- [x] Sketchfab 卡伦扫描模型替换 3D 占位槽 → 已实现为 5 模型画廊 + 档案卡片联动
- [x] 性能：JS 分包（manualChunks 拆 maplibre / model-viewer / react）

待办：
- [ ] 《西迁之歌》演唱录音正式授权（佟李美家属/察布查尔县文化馆）
- [ ] 补入 PRD V2 §9.2.1 历史照片（有网环境下载入库）
- [ ] 英译稿母语校对
- [ ] 可选增强：真实古地图图层叠加槽位（设计稿 §2.4 已预留）

## 12. 验收标准（当前版本全部通过）

- [x] 五章 + 民歌馆全部在浏览器实机验证（双语、时间轴筛选、站点跳转、档案弹窗、音画长卷自动/手动模式、返回链路）
- [x] 所有历史事实出自《西陲屏藩》，引文 ≤30 字并署名
- [x] 全部图像无时代错乱元素（清代锡伯旗人规范提示词重生成）
- [x] 墓葬坐标模糊化声明与实际数据一致
- [x] `npm run build` 通过，dist 完整

## 13. 变更日志（V3.3 · 2026-09-18）

从 Kimi 沙盒交付到 Cloudflare 部署的所有修改：

### 13.1 构建与部署适配
| 修改 | 文件 | 说明 |
|------|------|------|
| 移除 Kimi 沙盒插件 | `vite.config.ts` | 删除 `kimi-plugin-inspect-react` 导入与调用，生产构建不再报错 |
| 移除依赖 | `package.json` | 删除 `kimi-plugin-inspect-react` |
| 修复 base 路径 | `vite.config.ts` | `base: './'` → `base: '/'`，匹配代码中 `/assets/...` 绝对路径 |
| JS 分包 | `vite.config.ts` | 添加 `manualChunks`：maplibre / model-viewer / react 分包，解决 2.6MB 单包问题 |
| 新增 `_headers` | `public/_headers` | Cloudflare Pages 缓存策略：静态资源一年缓存、index.html 不缓存、glb MIME、安全头 |
| 修复 CSS @import | `src/index.css` | Google Fonts @import 移到文件顶部，消除 PostCSS 警告 |
| 优化 index.html | `index.html` | 添加 description、theme-color、preconnect |

### 13.2 路由与交互修复
| 修改 | 文件 | 说明 |
|------|------|------|
| 移除 BrowserRouter | `App.tsx`, `main.tsx` | 纯 hash 路由，静态托管刷新不再 404 |
| 新增返回位置记忆 | `Home.tsx` | `returnRef` 记录进入民歌馆前的 scrollY 和 hash，`goHome()` 恢复 |
| 修复 goHome anchor bug | `Home.tsx` | 传入 anchor 时也会 `setView('home')`，不再困在民歌馆 |
| 新增 goSong | `Home.tsx` | 记录当前位置后跳转到 `#/song` |
| TopNav 高亮 | `TopNav.tsx` | 「长歌」按钮朱砂色边框+文字，接收 `onSongClick` prop |
| 语言按钮弱化 | `TopNav.tsx` | 改为 sepia 色，避免视觉冲突 |

### 13.3 音频修复
| 修改 | 文件 | 说明 |
|------|------|------|
| 音频路径相对化 | `song.json` | `audio_dir`: `/assets/audio/` → `assets/audio/`，子路径部署不 404 |
| 播放延迟重试 | `SongPavilion.tsx` | `setTimeout(100ms)` 确保 `<audio>` 已挂载；添加 autoplay 被阻止的警告 |

### 13.4 3D 模型接入
| 修改 | 文件 | 说明 |
|------|------|------|
| Sketchfab 画廊 | `Act3Karun.tsx` | 替换原 model-viewer 占位，实现 5 卡伦 3D 扫描模型切换画廊（iframe 嵌入 + 档案卡片联动） |
| 模型 UID 映射 | `Act3Karun.tsx` | 沙彦/头湖/梧桐孜/纳旦木/多兰图 ↔ Sketchfab UID |
| 档案弹窗提示 | `Act3Karun.tsx` | 有 3D 模型的卡伦在 AIGC 图上方显示朱砂色提示文字 |
| i18n 更新 | `i18n.tsx` | `model_note` 更新为实际 Sketchfab 扫描档案说明 |
