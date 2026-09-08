<div align="center">

# 📷 索尼 E 卡口镜头数据库 (Sony FE Lens DB)

**全网最全的索尼 E 卡口镜头全景选型与光学评分数据库**

[![Deploy to GitHub Pages](https://github.com/fwindpeak/sony-fe-lens-db/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/fwindpeak/sony-fe-lens-db/actions/workflows/deploy-pages.yml)
[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[🌐 在线访问 (Live Demo)](https://fwindpeak.github.io/sony-fe-lens-db/) · [✨ 功能特性](#-功能特性) · [🚀 快速开始](#-快速开始) · [📊 数据维护](#-数据更新与维护) · [🤝 贡献指南](#-贡献指南)

</div>

---

## 📖 项目简介 (Introduction)

**Sony FE Lens DB** 是一个专为摄影师与相机爱好者打造的索尼 E 卡口镜头全景数据库应用。收录了来自索尼（Sony）、腾龙（Tamron）、适马（Sigma）、蔡司（Zeiss）、唯卓仕（Viltrox）、森养（Samyang）、老蛙（Laowa）、福伦达（Voigtländer）等十余个主流品牌的 **480+ 款全画幅镜头**。

通过多维度光学测试标定、便携与性价比指数、六维雷达图可视化以及强大的对比选型工具，帮助你快速找到最适合自己拍摄场景的镜头方案。

> [!IMPORTANT]
> **⚠️ 数据说明与免责声明 (Disclaimer)**
>
> 本项目数据库中的所有镜头规格、参考价格与光学评分数据均来源于**网络公开资料搜集**以及 **AI 辅助补充与校正**，相关评分与参数**仅供选型参考**，不代表官方测试标准。
> 
> 如果您在查阅过程中发现任何数据遗漏、参数错误或评分偏差，非常欢迎提交 [Issues](https://github.com/fwindpeak/sony-fe-lens-db/issues) 或 Pull Request 协助指正，共同完善索尼 E 卡口镜头数据库！

---

## ✨ 功能特性 (Key Features)

- 🔍 **智能模糊搜索**：基于 Fuse.js 实现品牌、型号、中英文别名、焦段与光圈规格的拼音及模糊匹配。
- 🔗 **官方详情一键直达**：全面收录官方详情页链接，在镜头详情弹窗中支持一键跳转品牌官网查看一手技术参数与官方样张。
- 📊 **6 维光学标定雷达图**：
  - 综合加权锐度
  - 全开可用度
  - 全画面一致性（边缘画质）
  - 色散控制评分（紫边/绿边抑制）
  - 虚化氛围评分（焦外过渡与光斑）
  - 畸变与暗角控制
- 🎯 **一键快捷场景预设**：人像特写、风光旅行、扫街人文、视频 Vlog、长焦打鸟、微距探微、极致便携、性价比之选等 8 种精选预设。
- ⚖️ **多镜头同屏深度对比**：支持加入多支镜头，横向比对焦段、重量、光圈、最近对焦距离、滤镜口径与光学评分雷达图叠加。
- 🗂️ **网格卡片 / 数据表格双视图**：卡片视图直观展现关键数据，表格视图适合大屏海量参数快速筛选与排序。
- 🌐 **国际化双语支持**：内置完善的中文（简体）与英文（English）国际化切换 (react-i18next)。
- 🌓 **深色 / 浅色模式**：遵循系统偏好或手动切换，采用精调暗色与高对比度摄影风格 UI。
- 📱 **全端响应式设计**：完美适配桌面端、平板与移动端屏幕。

---

## 🛠️ 技术栈 (Tech Stack)

- **核心框架**：[React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**：[Vite 6](https://vitejs.dev/)
- **样式方案**：[Tailwind CSS](https://tailwindcss.com/) + [PostCSS](https://postcss.org/) + `clsx` / `tailwind-merge`
- **搜索算法**：[Fuse.js](https://www.fusejs.io/)
- **国际化**：[i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/)
- **图标库**：[Lucide React](https://lucide.dev/)
- **CSV 解析**：[PapaParse](https://www.papaparse.com/)

---

## 🚀 快速开始 (Quick Start)

### 1. 环境准备
确保本机已安装 [Node.js](https://nodejs.org/) (推荐 LTS 18+ 或 20+)。

### 2. 克隆仓库
```bash
git clone https://github.com/fwindpeak/sony-fe-lens-db.git
cd sony-fe-lens-db
```

### 3. 安装依赖
```bash
npm install
```

### 4. 启动本地开发服务器
```bash
npm run dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始使用。

### 5. 构建生产版本
```bash
npm run build
```
构建产物将输出在 `dist/` 目录中。

---

## 📊 数据架构与持续维护 (Data Architecture & Maintenance)

本项目已全面升级为 **纯 JSON 权威数据源模式 (Single Source of Truth)**，主数据位于 `src/data/lenses.json`：
- 前端打包直接读取经过严格类型定义与光学标定的 JSON 数据，告别多层中转带来的字段脱节与格式丢失；
- 内置自动化数据治理工具 `scripts/lens-manager.js`，支持一键校验、规范 CSV 导出与 SQLite 数据库生成。

### 常用维护命令

| 命令 | 说明 |
| :--- | :--- |
| `npm run data:validate` | 全量校验：检测是否有虚构型号、评分越界 (>5.0 或 <1.0)、重复条目与价格异常 |
| `npm run data:export-csv` | 一键同步导出为规范带 BOM 的 `resource/sony_lenses_calibrated_complete.csv`（兼容 Excel/Numbers） |
| `npm run data:export-sqlite` | 一键生成 `dist/lenses.db` SQLite 数据库（含完整表结构、索引与 SQL 导入文件） |
| `npm run data:all` | 一键执行“全量数据校验 + CSV导出 + SQLite生成” |
| `npm run build` | 自动执行数据校验、TypeScript 编译与 Vite 生产级极速打包 |

### 前端一键导出支持
Web 界面顶部导航栏提供「导出数据」功能，访客与摄友可一键将最新清洗的索尼全画幅镜头库直接保存为 `.json` 或 `.csv` 文件，便于离线分析、分享交流或导入自建项目。

---

## 📁 目录结构 (Project Structure)

```text
sony-fe-lens-db/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml      # GitHub Actions 自动部署工作流
├── resource/
│   └── sony_lenses_calibrated_complete.csv # 规范导出的镜头数据库 (CSV)
├── scripts/
│   ├── lens-manager.js           # 数据库统一治理工具 (校验/CSV导出/SQLite生成)
│   └── sanitize-and-upgrade-db.js # 数据清洗与行情升级脚本
├── src/
│   ├── components/               # React UI 组件
│   │   ├── ComparisonDrawer.tsx  # 镜头对比抽屉 (含二手与新品多维价格PK)
│   │   ├── FilterSidebar.tsx     # 筛选侧边栏
│   │   ├── Header.tsx            # 顶部导航与一键导出菜单 (JSON/CSV)
│   │   ├── LensCard.tsx          # 镜头卡片 (二手行情与电商新品并列)
│   │   ├── LensDetailModal.tsx   # 镜头详情弹窗 (全景四维行情与雷达图)
│   │   ├── LensGrid.tsx          # 镜头卡片网格
│   │   ├── LensTable.tsx         # 镜头数据表格 (支持多价格排序)
│   │   ├── OpticalRadarChart.tsx # 六维光学雷达图 (严控 5.0 封顶)
│   │   ├── QuickPresets.tsx      # 快捷预设场景
│   │   ├── SearchBar.tsx         # 搜索框
│   │   └── SortControls.tsx      # 排序控制栏
│   ├── data/
│   │   └── lenses.json           # 核心权威结构化镜头数据库 (纯 JSON 直读)
│   ├── hooks/                    # 自定义 React Hooks
│   ├── i18n/                     # 中英文多语言配置与翻译词条
│   ├── types/                    # TypeScript 类型定义
│   ├── utils/                    # 格式化与辅助函数
│   ├── App.tsx                   # 根应用组件
│   ├── index.css                 # 全局样式与 Tailwind 导入
│   └── main.tsx                  # 挂载入口
├── index.html                    # HTML 模板
├── package.json
├── tailwind.config.js            # Tailwind 配置
├── tsconfig.json                 # TypeScript 配置
└── vite.config.ts                # Vite 配置
```

---

## 🤝 贡献指南 (Contributing)

欢迎提交 Issue 或 Pull Request 来补充新镜头数据、校正参数或优化交互体验！

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

---

## 📄 开源许可证 (License)

本项目采用 [MIT](LICENSE) 许可证。
