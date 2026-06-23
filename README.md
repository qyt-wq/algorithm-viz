# 🧮 算法过程可视化系统

> 面向数据结构、离散数学、程序设计课程学习者的交互式算法可视化实验平台

[![CI](https://github.com/qyt-wq/algorithm-viz/actions/workflows/ci.yml/badge.svg)](https://github.com/qyt-wq/algorithm-viz/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4-000?logo=express)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/Docker-✓-2496ed?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

---

## 📖 系统简介

本系统通过**动画、图形、表格、步骤列表、代码高亮**等多元化形式，动态展示算法完整执行流程与关键状态变化。支持自主选择算法、自定义或随机生成测试数据，配套算法原理、复杂度分析、多语言代码实现（C/C++ / Java / Python）和交互式对比模式。

提供精美的**认证页面**（玻璃态卡片、算法主题点阵网格背景、浮动图节点装饰），支持用户注册/登录、学习统计追踪。

## 🎯 已实现算法（6种 · 4类）

| 算法类别 | 算法名称 | 难度 | 可视化方式 |
|----------|----------|------|-----------|
| 排序算法 | **快速排序** Quick Sort | 低–中 | 柱状图动画 |
| 排序算法 | **冒泡排序** Bubble Sort | 低 | 柱状图动画 |
| 排序算法 | **归并排序** Merge Sort | 中 | 柱状图动画 |
| 图算法 | **Dijkstra 最短路径** | 中 | SVG 图节点 + 边 |
| 树结构 | **哈夫曼编码树** Huffman | 中 | 树形 SVG + 编码表 |
| 递归算法 | **汉诺塔** Tower of Hanoi | 中–高 | 三柱圆盘动画 |

---

## ✨ 功能特性

### 核心功能
- ✅ 6 种算法可视化，覆盖排序、图、树、递归四大类
- ✅ 完整动态过程展示 — 非仅展示最终结果
- ✅ 三种数据输入方式：**手动输入** / **随机生成** / **预设测试用例**
- ✅ 每个算法 2+ 条预设测试用例（全局共 18 条）
- ✅ 最终结果 + 关键步骤说明 + 时间/空间复杂度分析
- ✅ 多语言代码展示（伪代码 / C/C++ / Java / Python），支持语法高亮与步骤同步

### 播放控制
- ✅ ▶ 自动播放 / ⏸ 暂停
- ✅ 🔄 最后一帧一键重新播放
- ✅ ◀ 上一步 / ▶ 下一步
- ✅ 📍 步骤列表点击跳转到任意步骤
- ✅ ⏩ 慢 / 中 / 快三档播放速度
- ✅ ⏮ 重置算法

### 高级功能
- ✅ **对比模式** — 并排运行同类型算法，独立控制，实时对比
- ✅ **6 种画布主题** — 暗色 / 明亮 / 深蓝 / 护眼 / 暖橙 / 像素
- ✅ **用户系统** — 注册 / 登录 / JWT 鉴权 / 会话时长追踪
- ✅ **学习统计** — 记录学习轨迹，展示各算法学习次数与步骤
- ✅ **移动端适配** — 响应式布局，滑动手势导航
- ✅ **键盘快捷键** — 空格播放/暂停，← → 单步，R 重置

---

## 🚀 快速开始

### 环境要求

| 工具 | 最低版本 |
|------|---------|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |

### 本地开发

```bash
# 1. 克隆仓库
git clone <repository-url>
cd algorithm-visualization-system

# 2. 安装依赖
npm install

# 3. 启动开发服务器（前端）
npm run dev
# 浏览器访问 http://localhost:3000

# 4. 启动后端服务器（需要 MySQL）
npm run server
# API 运行在 http://localhost:3001
```

### 生产构建

```bash
npm run build        # 构建到 dist/ 目录
npm run preview      # 预览生产版本
```

---

## 🐳 Docker 部署

项目提供完整的 Docker 容器化方案，一键部署。

```bash
# 启动所有服务（前端 + 后端 + MySQL）
docker compose up -d --build
```

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端 (Nginx) | 80 | 静态文件服务 + API 反向代理 |
| 后端 (Express) | 3001 | RESTful API + JWT 鉴权 |
| MySQL 8.0 | 3306 | 用户数据 + 学习统计持久化 |

详细部署脚本见 [`deploy.sh`](deploy.sh) / [`deploy.mjs`](deploy.mjs)。

---

## 📋 使用指南

### 1. 登录系统
访问系统首页 → 注册账号 → 登录进入主界面

### 2. 选择算法
顶部导航栏点击算法标签，或左侧面板选择

### 3. 输入数据
- **手动输入** — 按提示格式在输入框录入
- **随机生成** — 点击「🎲 随机生成」自动填充
- **测试用例** — 点击预设用例直接加载并执行

### 4. 控制播放
- 点击 ▶ 自动播放，观察算法每一步的动画变化
- 拖动速度滑块调整播放节奏
- 点击步骤列表项可跳转到任意历史步骤

### 5. 阅读代码
右侧面板同步展示当前步骤对应的代码行（支持伪代码 / C / Java / Python 切换）

### 6. 对比算法（高级）
勾选「对比模式」→ 选择同类型算法 → 并排对比执行过程

---

## 📐 测试数据输入规范

### 排序算法（快速排序 / 冒泡排序 / 归并排序）

- **格式** — 逗号或空格分隔的整数序列
- **示例** — `64, 34, 25, 12, 22, 11, 90`
- **限制** — 2–20 个元素

### Dijkstra 最短路径

- **格式** — 单个大写字母（A–G），表示起始节点
- **示例** — `A`
- **图结构** — 内置 7 节点加权无向图，支持自定义图

### 哈夫曼编码树

- **格式** — `字符:频率 字符:频率 ...`
- **示例** — `a:5 b:9 c:12 d:13 e:16 f:45`
- **限制** — 4–8 个字符

### 汉诺塔

- **格式** — 整数（2–8），表示盘子数量
- **示例** — `4`
- **说明** — 数字越大移动步骤呈指数增长（n 个盘子 = 2ⁿ−1 步）

---

## 🔧 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Space` | 播放 / 暂停 |
| `→` | 下一步 |
| `←` | 上一步 |
| `R` | 重置算法 |

---

## 🛠 技术栈

| 层次 | 技术 | 说明 |
|------|------|------|
| 前端框架 | React 18 | 函数组件 + Hooks |
| 构建工具 | Vite 5 | ESBuild 编译，HMR 热更新 |
| 图形渲染 | SVG | Dijkstra 图 / 汉诺塔 / 哈夫曼树 |
| 动画 | CSS Transitions + Animations | GPU 加速 |
| 后端框架 | Express.js 4 | RESTful API |
| 鉴权 | JWT (jsonwebtoken) | Bearer Token，24 小时过期 |
| 密码加密 | bcryptjs | 带盐哈希 |
| 数据库 | MySQL 8.0 | 用户表 + 学习记录表 |
| 反向代理 | Nginx (Alpine) | 静态文件 + API 代理 |
| 容器化 | Docker + Docker Compose | 三服务编排 |
| 开发工具 | Node.js 18+, npm 9+ | — |

---

## 📁 项目结构

```
algorithm-visualization-system/
├── src/                              # React 前端源码
│   ├── main.jsx                      # 应用入口
│   ├── App.jsx                       # 主布局与全局状态管理
│   ├── App.css                       # 全局样式 + CSS 变量 + 主题
│   ├── algorithms/                   # 算法引擎
│   │   ├── registry.js               # 算法注册中心 + 代码库
│   │   ├── quickSort.js              # 快速排序
│   │   ├── bubbleSort.js             # 冒泡排序
│   │   ├── mergeSort.js              # 归并排序
│   │   ├── dijkstra.js               # Dijkstra 最短路径
│   │   ├── huffman.js                # 哈夫曼编码树
│   │   └── hanoi.js                  # 汉诺塔
│   ├── components/                   # UI 组件
│   │   ├── AuthPage.jsx/css          # 登录/注册页面
│   │   ├── AlgorithmSelector.jsx     # 算法选择器
│   │   ├── DataInput.jsx             # 数据输入（手动/随机/用例）
│   │   ├── VisualizationArea.jsx     # 可视化容器（含对比模式布局）
│   │   ├── QuickSortViz.jsx          # 排序柱状图渲染
│   │   ├── BubbleSortViz.jsx         # 冒泡排序柱状图
│   │   ├── MergeSortViz.jsx          # 归并排序柱状图
│   │   ├── DijkstraViz.jsx           # 图 SVG 节点/边渲染
│   │   ├── HuffmanViz.jsx            # 哈夫曼树 + 编码表渲染
│   │   ├── HanoiViz.jsx              # 汉诺塔三柱 SVG 渲染
│   │   ├── CodePanel.jsx             # 代码面板（语法高亮 + 步骤同步）
│   │   ├── PlaybackControls.jsx      # 播放控制栏
│   │   ├── StepList.jsx              # 步骤列表
│   │   ├── InfoPanel.jsx             # 算法信息面板
│   │   ├── StatsPanel.jsx            # 学习统计面板
│   │   └── SessionTimer.jsx          # 会话计时器
│   ├── data/
│   │   └── testCases.js              # 测试用例配置（18 条）
│   └── utils/
│       ├── syntaxHighlight.js        # 多语言语法高亮
│       ├── useSwipeGesture.js        # 移动端滑动手势 Hook
│       └── formatDuration.js         # 时间格式化
│
├── server/                           # Express 后端
│   ├── index.js                      # 服务器入口 + CORS + 代理
│   ├── db.js                         # MySQL 连接池
│   ├── init.sql                      # 数据库初始化 DDL
│   └── routes/
│       ├── auth.js                   # 注册/登录/验证 API
│       └── stats.js                  # 学习统计 API
│
├── frontend/                         # 前端 Docker 构建
│   ├── Dockerfile                    # 多阶段构建 (Node → Nginx)
│   └── nginx.conf                    # Nginx 静态文件 + API 代理
│
├── backend/                          # 后端 Docker 构建
│   ├── Dockerfile                    # Node.js 生产镜像
│   └── .env.production               # 生产环境变量
│
├── docker-compose.yml                # 三服务编排
├── deploy.sh                         # 一键部署脚本 (bash)
├── deploy.mjs                        # 一键部署脚本 (Node.js)
├── vite.config.js                    # Vite 配置
└── package.json                      # 项目依赖与脚本
```

---

## 🧪 功能测试速查

### 排序算法

| 步骤 | 操作 | 预期结果 |
|------|------|----------|
| 1 | 选择排序算法（快速/冒泡/归并） | 算法卡片高亮，输入提示更新 |
| 2 | 点击测试用例 | 自动填入数据并执行 |
| 3 | 点击 ▶ 自动播放 | 柱状图逐步动画，元素比较、交换可视化 |
| 4 | 等待完成 | 所有柱子变绿 |
| 5 | 手动输入 `10, 5, 8, 3` 并执行 | 验证手动输入功能 |

### Dijkstra 最短路径

| 步骤 | 操作 | 预期结果 |
|------|------|----------|
| 1 | 选择 Dijkstra | 图可视化就绪 |
| 2 | 点击测试用例"从节点 A 出发" | 逐步展示最短路径计算 |
| 3 | 逐步前进 | 节点颜色变化：蓝色→灰色→绿色，距离标签更新 |
| 4 | 输入 `D` 作为起点 | 验证不同起点结果 |

### 哈夫曼编码树

| 步骤 | 操作 | 预期结果 |
|------|------|----------|
| 1 | 选择哈夫曼编码树 | 频率表可视化就绪 |
| 2 | 点击测试用例 | 自动构建编码树 |
| 3 | 逐步播放 | 观察森林合并过程，树结构动画 |
| 4 | 查看编码表 | 右侧显示各字符的哈夫曼编码 |

### 汉诺塔

| 步骤 | 操作 | 预期结果 |
|------|------|----------|
| 1 | 选择汉诺塔 | 三柱可视化就绪 |
| 2 | 点击测试用例"3 个盘子" | 执行 7 步（2³−1） |
| 3 | 自动播放 | 盘子动画从 A→C，遵守规则 |
| 4 | 输入 `5` 并执行 | 共 31 步（2⁵−1） |
| 5 | 步骤列表点击任意步骤 | 跳转到对应历史状态 |

---

## 🔒 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `DB_HOST` | localhost | MySQL 主机地址 |
| `DB_PORT` | 3306 | MySQL 端口 |
| `DB_USER` | root | 数据库用户名 |
| `DB_PASSWORD` | redhat | 数据库密码 |
| `DB_NAME` | algorithm_viz | 数据库名称 |
| `JWT_SECRET` | — | JWT 签名密钥（生产环境务必修改） |
| `PORT` | 3001 | 后端服务端口 |

---

## 📄 License

MIT License

---

*Made with ❤️ for algorithm learners*
