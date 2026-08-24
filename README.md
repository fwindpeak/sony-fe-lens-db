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

## 📊 数据更新与维护 (Data Maintenance)

镜头原始数据存放在 `resource/sony_lenses_calibrated_complete.csv` 中。

当你更新或添加了新的镜头数据行后，只需执行以下命令即可重新生成 JSON 数据集：

```bash
npm run parse-data
```

或者直接执行 `npm run build`，脚本会在每次打包前自动同步最新的 CSV 标定数据到 `src/data/lenses.json`。

---

## 📁 目录结构 (Project Structure)

```text
sony-fe-lens-db/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml      # GitHub Actions 自动部署工作流
├── resource/
│   └── sony_lenses_calibrated_complete.csv # 镜头基础数据库 (CSV)
├── scripts/
│   └── parse-csv.js              # CSV 转 JSON 数据预处理脚本
├── src/
│   ├── components/               # React UI 组件
│   │   ├── ComparisonDrawer.tsx  # 镜头对比抽屉
│   │   ├── FilterSidebar.tsx     # 筛选侧边栏
│   │   ├── Header.tsx            # 顶部导航与操作栏
│   │   ├── LensCard.tsx          # 镜头卡片
│   │   ├── LensDetailModal.tsx   # 镜头详情弹窗
│   │   ├── LensGrid.tsx          # 镜头卡片网格
│   │   ├── LensTable.tsx         # 镜头数据表格
│   │   ├── OpticalRadarChart.tsx # 六维光学雷达图
│   │   ├── QuickPresets.tsx      # 快捷预设场景
│   │   ├── SearchBar.tsx         # 搜索框
│   │   └── SortControls.tsx      # 排序控制栏
│   ├── data/
│   │   └── lenses.json           # 生成的镜头结构化数据
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
