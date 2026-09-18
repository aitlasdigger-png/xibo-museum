# 寻迹锡伯 · Traces of the Xibe — 交付包

锡伯族文化遗产数字博物馆，纯静态网站（React 19 + TypeScript + Vite + Tailwind + MapLibre GL），中英双语（默认英文）。

## 目录结构

```
交付包/
├── README.md                ← 本文件
├── docs/
│   ├── PRD-V3.md            ← 产品需求文档（当前版本）
│   ├── 设计稿-V3.md          ← 视觉与交互设计稿
│   ├── content_v3.json      ← 主馆内容源稿（= app/src/data/content.json）
│   ├── 长歌西去-song-v1.json  ← 民歌馆内容源稿（= app/src/data/song.json）
│   └── 图片清单-V3.json       ← 图像资产与内容条目对应表
└── app/                     ← 网站源码（在 IDE 中打开此目录）
    ├── src/                 ← 代码（sections/ 五章+民歌馆, lib/ 底图与调色, data/ 五个JSON）
    ├── public/assets/       ← 图片(img 29张 / song 12张) + 音频(西迁之歌原声) + 3D占位模型
    ├── dist/                ← 已构建产物（可直接拖入 Cloudflare Pages 上线）
    └── package.json
```

## 本地开发

```bash
cd app
npm install
npm run dev        # 开发预览
npm run build      # 构建到 dist/
```

## 部署（Cloudflare Pages）

纯静态，无后端无数据库，无需任何 rewrite 规则（民歌馆为 hash 路由 `#/song`）：

- **方式一（推荐）**：把 `app/` 推到 GitHub → Cloudflare Pages → Connect to Git → 构建命令 `npm run build`，输出目录 `dist`；
- **方式二**：`npm run build` 后，把 `dist/` 文件夹直接拖进 Cloudflare Pages（Direct Upload）。

## 内容维护（不改代码）

- 改文字：编辑 `app/src/data/content.json`（主馆）与 `app/src/data/song.json`（民歌馆），重新 build 即可；
- 换 3D 模型：Sketchfab 上传后，把 `src/sections/Act3Karun.tsx` 中 `<model-viewer>` 换成 Sketchfab iframe 嵌入；
- 换音频：替换 `public/assets/audio/xiqian-original-tonglimei.mp3`（同名覆盖）；
- 墓葬数据：`burials.json` 为模糊化公开坐标；`burials_precise_backup.json` 是原始坐标，**勿公开发布**。

## 版权注意（上线前）

1. 《西迁之歌》背景音为佟李美（93 岁）清唱原声（来源 bilibili BV1xG411E7pM），版权归原作者——公开上线前建议取得演唱者授权；
2. 歌词为管兴才整理本节选（每幕 2–4 行，已署名）；
3. AIGC 图像已在站内声明；历史图为公有领域（Wikimedia）；
4. 底图 © OpenStreetMap contributors · OpenFreeMap · Mapterhorn（页脚已署名）。

git 提交历史见 `docs/git-log.txt`。
