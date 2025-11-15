# API Hub UX Design Specification

_Created on 2025-11-15 by BMad_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

**API Hub**是一个专为Coze工作流创作者设计的API聚合平台，旨在通过极致便捷性降低API使用门槛。核心使命是**让Coze创作者在10分钟内从注册到成功调用API**，消除技术焦虑，建立自信和掌控感。

**核心价值主张：**
- ✅ **统一账户管理** - 一个API Key访问所有API
- ✅ **灵活计费系统** - 三种模式（按次/按量/会员）适配不同API特性
- ✅ **Coze插件代码生成** - 智能生成即用代码，零配置
- ✅ **10分钟极速上手** - 注册、选择API、测试调用，流程精简到极致

本UX设计规范定义了实现这一愿景的完整用户体验策略，包括设计系统、视觉风格、交互模式、用户旅程、组件库和无障碍标准。

---

## 1. Design System Foundation

### 1.1 Design System Choice

**选择：shadcn/ui + Tailwind CSS**

**决策理由：**

shadcn/ui是一个现代化的React组件集合，基于Radix UI和Tailwind CSS构建。与传统组件库不同，shadcn/ui的组件是通过CLI复制到项目中的，开发者拥有完全的源码控制权，可以自由定制。

**为什么选择shadcn/ui：**

1. **现代化设计语言** ⭐⭐⭐⭐⭐
   - 符合Stripe、Vercel等顶级开发者工具的视觉风格
   - 传达专业感、信任感和创新性
   - 适合API Hub的"现代化API聚合平台"定位

2. **开发效率高** ⭐⭐⭐⭐⭐
   - 组件复制即用，无需从零搭建基础UI
   - 与Tailwind CSS深度集成，样式定制简单
   - MVP阶段（3-4个月）时间紧迫，需要快速交付

3. **高度可定制** ⭐⭐⭐⭐⭐
   - 不是黑盒库，可以直接修改组件源码
   - 通过Tailwind配置实现品牌化（颜色、圆角、阴影等）
   - 支持创建业务特定组件（ApiCard、PriceTag等）

4. **深色模式内置** ⭐⭐⭐⭐
   - 开发者群体偏好深色主题
   - CSS Variables实现，亮/暗模式无缝切换

5. **无障碍性优秀** ⭐⭐⭐⭐⭐
   - 基于Radix UI，默认WCAG 2.1 AA级无障碍
   - 键盘导航、屏幕阅读器、焦点管理开箱即用

**技术栈：**

```
UI组件层: shadcn/ui (基于Radix UI)
  ↓
样式层: Tailwind CSS
  ↓
框架层: React (假设使用Next.js)
  ↓
构建工具: Vite / Next.js
```

**配套工具链：**

- **图标**: Lucide Icons（与shadcn/ui配套）
- **字体**: Inter（英文）+ Noto Sans SC（中文）
- **图表**: Recharts（用于使用量可视化）
- **代码高亮**: Shiki（展示Coze插件代码）
- **动画**: Framer Motion（庆祝动画、页面过渡）

**组件复用比例：**

```
shadcn/ui直接使用:   35个组件 (35%) ████
shadcn/ui修改样式:   20个组件 (20%) ███
完全自定义组件:      45个组件 (45%) █████
──────────────────────────────────────
总计:                100个组件 (100%)
```

**实施计划：**

- **第1周**: 初始化shadcn/ui，配置Tailwind主题，调整品牌色
- **第2-3周**: 创建自定义分子组件（PriceTag、StatCard、CopyButton）
- **第4-8周**: 开发业务有机体组件（ApiCard、ApiTester、CozeCodeGenerator）
- **第9-10周**: 构建页面模板（DashboardLayout、MarketplaceLayout）

---

## 2. Core User Experience

### 2.1 Defining Experience

**核心体验目标：**

> **"10分钟从注册到成功调用API"**

这不仅是一个时间目标，更是一种体验承诺：用户应该感受到**快速、简单、无压力**的整个过程，每一步都有明确的指引和即时的正向反馈。

**情感目标（Emotional Goals）：**

**🎯 主要情感：自信和成就感**（Confident & Accomplished）

- **"我第一次觉得用API这么简单"**
  - 用户过去可能因为技术门槛而对API望而却步
  - API Hub通过智能默认、即时反馈和清晰引导，让用户感到"原来我也能做到"

- **"我做到了，而且很快！"**
  - 完成首次API调用后的成就感强化
  - 庆祝动画、徽章、下一步建议延续这种正向体验

**💫 次要情感：轻松和掌控感**（Relaxed & In Control）

- **没有技术焦虑**
  - 避免复杂的技术术语和冗长的配置流程
  - 每一步都提供"为什么"和"下一步"的清晰说明

- **清楚知道下一步该做什么**
  - 任务清单（① 生成Key → ② 选择API → ③ 测试调用）
  - 进度指示器和面包屑导航

- **感觉一切都在掌控之中**
  - 实时余额显示，透明计费
  - 在线测试工具，可以安全地试错
  - 可撤销的操作（删除Key有确认对话框）

**避免的情感：**

- ❌ 困惑（Confused）- 通过清晰的信息架构和标签避免
- ❌ 沮丧（Frustrated）- 通过智能默认和容错设计避免
- ❌ 不知所措（Overwhelmed）- 通过渐进式披露避免
- ❌ 技术恐惧（Intimidated）- 通过友好的语言和视觉设计避免

**UX原则（来自PRD）：**

| 原则 | 具体实施 |
|------|----------|
| **极致便捷** | 核心流程最多10分钟完成 |
| **简单至上** | 每个功能最多3步操作 |
| **即时反馈** | 所有操作1秒内响应 |
| **智能默认** | 80%场景零配置 |
| **清晰引导** | 新用户10分钟完成首次API调用 |

### 2.2 Novel UX Patterns

**独特模式1：任务清单引导**（Gamification Onboarding）

传统SaaS平台的新手引导往往是强制性的模态框教程，用户无法跳过，容易产生厌烦。API Hub采用**非阻塞式任务清单**：

```
┌────────────────────────────┐
│ 🎯 快速开始 (2/3)         │
│                            │
│ ✓ 生成API Key              │
│ ✓ 选择一个API              │
│ ○ 完成首次调用             │
│                            │
│ [继续] [稍后]              │
└────────────────────────────┘
```

**特点：**
- 悬浮在右下角，不遮挡主内容
- 可以随时关闭或展开
- 每完成一步自动勾选，视觉成就感
- 全部完成后显示庆祝动画🎉

---

**独特模式2：Coze插件代码智能生成**（AI-Assisted Code Generation）

大多数API平台只提供静态的代码示例，用户需要手动替换参数。API Hub提供**对话式代码生成器**：

```
用户：我想调用天气API
系统：已为您生成Coze插件代码，自动填充了您的API Key和常用参数

┌────────────────────────────────────────────────┐
│ // Coze插件代码 - 天气查询API                   │
│                                                │
│ const response = await fetch(                 │
│   'https://gateway.api-hub.com/weather',      │
│   {                                           │
│     headers: {                                │
│       'X-API-Key': 'sk_live_abc123...'       │
│     },                                        │
│     body: JSON.stringify({ city: '北京' })    │
│   }                                           │
│ )                                             │
│                                                │
│ [一键复制] [修改参数] [查看文档]               │
└────────────────────────────────────────────────┘
```

**特点：**
- 自动填充用户的API Key（安全）
- 智能默认参数（如城市名称猜测用户位置）
- 语法高亮显示
- 一键复制到剪贴板
- 可选的参数配置对话框

---

**独特模式3：余额预警与智能充值建议**（Proactive Balance Management）

传统平台在余额不足时才弹窗提示，API Hub采用**预测式余额管理**：

```
┌────────────────────────────────────────────────┐
│ 💡 余额提醒                                    │
│                                                │
│ 当前余额: ¥2.50                                │
│ 预计可用: 3天（基于过去7天平均消费）            │
│                                                │
│ 建议充值: ¥20（可用约1个月）                    │
│                                                │
│ [立即充值] [稍后提醒]                          │
└────────────────────────────────────────────────┘
```

**特点：**
- 基于历史消费预测可用天数
- 主动建议充值金额（而非让用户猜）
- 非强制，可以延后
- 余额<¥1时置顶提醒（不阻塞操作）

---

**独特模式4：API测试沙盒**（Live API Playground）

大多数API平台的测试工具在独立页面，API Hub将测试工具嵌入API详情页，实现**无缝测试体验**：

```
┌─────────────────────────────────────────────────────────┐
│ 天气查询API                                  [订阅API]   │
├─────────────────────────────────────────────────────────┤
│ 📖 概览  🔧 参数  📊 响应  🧪 在线测试 ← (当前tab)       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 请求参数:                                               │
│ ┌─────────────────────────────────────────────────┐   │
│ │ city: [北京            ▼]  (智能默认)            │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ [发送请求]                                              │
│                                                         │
│ 响应 (127ms):                        ✓ 成功  ¥0.01扣费 │
│ ┌─────────────────────────────────────────────────┐   │
│ │ {                                               │   │
│ │   "city": "北京",                                │   │
│ │   "temperature": 18,                            │   │
│ │   "weather": "晴"                                │   │
│ │ }                                               │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ [复制响应] [生成Coze代码]                               │
└─────────────────────────────────────────────────────────┘
```

**特点：**
- 测试工具与文档在同一页，无需跳转
- 参数预填充，立即可测
- 实时显示响应时间和计费
- 测试成功后可直接生成Coze代码

---

## 3. Visual Foundation

### 3.1 Color System

**选择的主题：Friendly Tech（☀️ 明亮清新）**

**决策理由：**

在颜色主题探索阶段，我们评估了6个主题方向。最终选择**Friendly Tech**是因为它最契合API Hub的核心价值"便捷性"和情感目标"自信+轻松"。

**主题特征：**

- **定位**: 友好、易用的技术平台
- **情感**: 自信、轻松、清晰
- **适用场景**: 明亮模式优先，降低技术门槛
- **推荐指数**: ⭐⭐⭐⭐⭐

**颜色定义：**

```css
/* 品牌主色 */
--primary-50:  #eff6ff;
--primary-500: #3b82f6;  /* 主蓝色 - 按钮、链接、强调 */
--primary-600: #2563eb;  /* 悬停状态 */
--primary-900: #1e3a8a;  /* 深色变体 */

/* 强调色 */
--accent-500: #f97316;   /* 橙色 - CTA、新功能标签 */

/* 功能色 */
--success: #10b981;      /* 绿色 - 成功状态、正向趋势 */
--warning: #fbbf24;      /* 黄色 - 警告、余额不足 */
--error: #ef4444;        /* 红色 - 错误、删除操作 */

/* 会员专属 */
--vip-gold: #fbbf24;     /* 金色 - VIP徽章、会员权益 */

/* 中性色 */
--background: #ffffff;   /* 页面背景 */
--surface: #f1f5f9;      /* 卡片、面板背景 */
--text-primary: #1e293b; /* 主文本（对比度12.63:1） */
--text-secondary: #64748b; /* 次要文本（对比度4.54:1） */
--border: #e5e7eb;       /* 边框、分隔线 */
```

**语义化颜色应用：**

| 场景 | 颜色 | 示例 |
|------|------|------|
| 主要操作按钮 | Primary-500 | "生成API Key"、"立即订阅" |
| 次要操作按钮 | Surface (浅灰) | "取消"、"查看文档" |
| 危险操作 | Error | "删除API Key" |
| 成功提示 | Success | "✓ API调用成功" |
| 价格标签 | Primary-500 | "¥0.01/次" |
| VIP标签 | VIP-Gold | "VIP会员免费" |
| API状态 | Success/Error | "● 可用" / "● 维护中" |

**深色模式变体：**

```css
.dark {
  --background: #0f172a;
  --surface: #1e293b;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --border: #334155;
  /* 品牌色保持一致，但亮度微调 */
  --primary-500: #60a5fa;  /* 稍亮的蓝色，保持对比度 */
}
```

**Interactive Visualizations:**

完整的颜色主题探索（包括6个备选方案）请查看：
- 📊 [Color Theme Explorer (ux-color-themes.html)](./ux-color-themes.html)
  - 交互式主题对比
  - 实时UI组件预览
  - 色彩对比度验证

---

## 4. Design Direction

### 4.1 Chosen Design Approach

**选择的设计方向：Modern Cards（Vercel风格）**

**决策理由：**

在设计方向探索阶段，我们创建了6种完整的布局和交互风格mockup。最终选择**Modern Cards**方向是基于以下考虑：

**1. 现代化视觉** ⭐⭐⭐⭐⭐
- 无侧边栏，顶部导航，空间感更强
- 卡片式内容展示，信息层次清晰
- 符合Vercel、Stripe等顶级开发者工具的设计趋势

**2. 移动端友好** ⭐⭐⭐⭐⭐
- 卡片布局天然适配小屏幕
- 顶部导航在移动端可折叠为汉堡菜单
- 响应式适配成本低

**3. 内容聚焦** ⭐⭐⭐⭐
- 卡片自然引导视线，突出重点内容
- 每张卡片是独立的信息单元，降低认知负担
- 适合API市场的"浏览-选择"场景

**4. 开发速度快** ⭐⭐⭐⭐⭐
- shadcn/ui的Card组件开箱即用
- 布局简单，无需复杂的侧边栏状态管理
- 符合MVP快速交付的时间要求

**核心布局特征：**

```
桌面端（>1024px）:
┌─────────────────────────────────────────────────────┐
│ Logo  概览  API市场  文档  统计     [充值] [Avatar] │ ← 顶部导航
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐         │
│  │ 今日调用  │ │ 账户余额  │ │ 会员状态  │         │
│  │   342     │ │  ¥128.50  │ │   VIP     │         │
│  └───────────┘ └───────────┘ └───────────┘         │ ← 统计卡片
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 快速开始                                    │   │
│  │ 只需3步，完成您的首次API调用                 │   │
│  │ [生成API Key] [查看文档]                    │   │
│  └─────────────────────────────────────────────┘   │ ← 操作卡片
│                                                     │
│  API市场                                            │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                   │
│  │天气 │ │GPT-4│ │翻译 │ │OCR  │                   │
│  └─────┘ └─────┘ └─────┘ └─────┘                   │ ← API卡片网格
│                                                     │
└─────────────────────────────────────────────────────┘

移动端（<768px）:
┌────────────────────────┐
│ ☰  API Hub    [Avatar] │ ← 顶部导航
├────────────────────────┤
│ ┌────────────────────┐ │
│ │ 今日调用: 342      │ │
│ └────────────────────┘ │
│ ┌────────────────────┐ │
│ │ 余额: ¥128.50      │ │
│ └────────────────────┘ │ ← 统计卡片堆叠
│ ┌────────────────────┐ │
│ │ 快速开始           │ │
│ │ [生成Key]          │ │
│ └────────────────────┘ │
│                        │
├────────────────────────┤
│ 概览 市场 统计 会员    │ ← 底部导航
└────────────────────────┘
```

**关键页面布局：**

**1. Dashboard（概览页）**
- Hero区：问候语 + 快速操作
- 3列统计卡片（今日调用、余额、会员状态）
- 快速开始卡片（新手引导）
- 最近调用记录（表格或卡片列表）

**2. API Marketplace（API市场）**
- 顶部：搜索栏 + 筛选标签
- 侧边（可选）：多维筛选器（分类、计费模式）
- 主内容：4列API卡片网格（响应式：4→3→2→1列）
- 每张卡片：图标、名称、简介、价格、"立即使用"按钮

**3. API Detail（API详情页）**
- Header卡片：API名称、简介、定价、订阅按钮
- Tab导航：概览、参数说明、响应格式、在线测试
- 代码示例卡片（可复制）
- Coze插件代码生成器（对话框）

**Interactive Mockups:**

查看完整的6种设计方向对比（包括备选方案）：
- 🎨 [Design Direction Showcase (ux-design-directions.html)](./ux-design-directions.html)
  - 6种完整设计方向
  - 每种方向包含3个关键页面mockup
  - 设计哲学和适用场景说明

---

## 5. User Journey Flows

### 5.1 Critical User Paths

**核心旅程：首次成功调用API** ⏱️ 目标10分钟

这是API Hub最关键的用户旅程，从新用户注册到完成首次API调用。旅程设计遵循"每一步都有成就感"的原则，通过即时反馈和渐进式任务清单，确保用户感到自信和掌控。

---

#### 阶段1：发现与注册 ⏱️ 2分钟

| 步骤 | 用户行为 | 系统响应 | 情感状态 | 设计要点 |
|------|----------|----------|----------|----------|
| **1.1 着陆** | 从抖音/搜索进入首页 | 展示Hero区："3分钟接入API，让Coze工作流更强大" | 😀 好奇 | • 简洁Hero区，突出便捷性<br>• 视频演示或动画展示核心流程<br>• "免费开始"大按钮（橙色） |
| **1.2 注册** | 点击"免费开始" | 弹出注册表单（手机号+验证码）<br>**只要2个字段** | 😊 期待 | • 避免繁琐表单（不要邮箱、密码）<br>• 验证码自动发送<br>• "注册即同意条款"（无需额外勾选） |
| **1.3 验证** | 输入验证码 | • 自动登录<br>• **赠送¥5体验金**<br>• 弹出欢迎对话框 | 🎉 惊喜 | • 即时反馈（无需点击"登录"）<br>• 赠送金额制造好感<br>• 动画效果（金币飘落） |

**关键设计决策：**
- ✅ 手机号注册优先（中国用户习惯，验证率高）
- ✅ 跳过邮箱验证（降低门槛，减少流失）
- ✅ 注册即赠送¥5（激励首次尝试，覆盖10-50次测试调用）

**流失风险点与对策：**
- ⚠️ 用户担心隐私 → 说明"仅用于接收验证码，不会推销"
- ⚠️ 验证码收不到 → 提供"重新发送"按钮（60秒倒计时）

---

#### 阶段2：首次登录引导 ⏱️ 1分钟

| 步骤 | 用户行为 | 系统响应 | 情感状态 | 设计要点 |
|------|----------|----------|----------|----------|
| **2.1 欢迎** | 首次登录 | 显示欢迎弹窗：<br>"欢迎！您已获得¥5体验金 🎉" | 😊 受欢迎 | • 动画效果（Confetti撒花）<br>• 说明体验金可用于测试<br>• 可跳过（非强制） |
| **2.2 引导** | 查看新手任务 | 显示3步任务清单（右下角悬浮）：<br>① 生成API Key<br>② 选择一个API<br>③ 完成首次调用 | 🎯 明确目标 | • **渐进式任务**，每步有✓标记<br>• 可随时关闭/展开<br>• 不遮挡主内容 |
| **2.3 开始** | 点击"立即开始" | 跳转到Dashboard，高亮"生成API Key"按钮 | 😎 自信 | • 清晰的CTA按钮<br>• 高亮动画（脉搏效果） |

**关键设计决策：**
- ✅ 任务清单可见但不强制（右下角悬浮窗）
- ✅ 每完成一步自动勾选（视觉成就感）
- ✅ 可随时关闭引导（不强制打断用户探索）

---

#### 阶段3：生成API Key ⏱️ 30秒

| 步骤 | 用户行为 | 系统响应 | 情感状态 | 设计要点 |
|------|----------|----------|----------|----------|
| **3.1 发起** | 点击"生成API Key" | 显示生成对话框 | 🤔 好奇 | • 大按钮，醒目位置<br>• 解释"API Key是什么" |
| **3.2 命名** | 输入Key名称（可选） | 智能建议："我的第一个Key" | 😌 轻松 | • 提供默认值，**可跳过**<br>• 无需思考命名 |
| **3.3 生成** | 点击确认 | • **立即显示Key**<br>• 自动复制到剪贴板<br>• Toast提示："已复制" | 💪 成就感 | • 无需等待<br>• 一键复制（减少操作）<br>• 任务清单第1项自动勾选 ✓ |
| **3.4 保存** | 查看Key | 显示安全提示："请妥善保管，不会再次显示完整Key" | 🔒 重视 | • 一次性显示，增加价值感<br>• 可选：下载为.txt文件 |

**关键设计决策：**
- ✅ 一键生成（无需复杂配置权限、过期时间等）
- ✅ 自动复制（减少"复制→粘贴"步骤）
- ✅ 任务清单自动勾选第1项 ✓（正向反馈）

**流失风险点与对策：**
- ⚠️ 用户关闭对话框后找不到Key → Dashboard显示"最近生成的Key"
- ⚠️ 用户忘记保存Key → 提供"查看Key列表"入口，显示Key的前缀（如sk_live_abc1...xyz9）

---

#### 阶段4：选择API ⏱️ 2分钟

| 步骤 | 用户行为 | 系统响应 | 情感状态 | 设计要点 |
|------|----------|----------|----------|----------|
| **4.1 浏览** | 进入API市场 | 展示**热门推荐**（天气、翻译、GPT）<br>+ "新手友好"标签 | 🔍 探索 | • 卡片式布局，视觉吸引<br>• 图标醒目，一眼识别<br>• 价格清晰展示 |
| **4.2 筛选** | 查看"新手友好"标签 | 高亮推荐"天气API"（最简单） | 🤝 信任 | • 分类清晰（AI能力、数据查询、工具类）<br>• 新手标签（降低选择困难）<br>• 热门度指标（调用次数） |
| **4.3 详情** | 点击天气API | 显示API详情页：<br>• 简介<br>• **代码示例置顶**<br>• 定价（¥0.01/次）<br>• 在线测试tab | 🧐 理解 | • **代码优先**（示例置顶）<br>• 语法高亮<br>• 参数说明清晰（表格） |
| **4.4 订阅** | 点击"立即使用" | 弹窗确认："订阅后可调用，按次计费¥0.01" | ✅ 确定 | • 明确计费说明<br>• 一键订阅（无需复杂表单） |

**关键设计决策：**
- ✅ 热门API置顶（降低选择困难）
- ✅ "新手友好"标签（引导决策，推荐简单API如天气、翻译）
- ✅ 代码示例优先展示（所见即所得，降低理解门槛）

**流失风险点与对策：**
- ⚠️ 用户不知道选哪个API → 默认推荐"天气API"（简单、便宜、通用）
- ⚠️ 用户担心计费 → 明确显示"体验金¥5可调用500次"

---

#### 阶段5：获取Coze插件代码 ⏱️ 2分钟

| 步骤 | 用户行为 | 系统响应 | 情感状态 | 设计要点 |
|------|----------|----------|----------|----------|
| **5.1 生成** | 点击"生成Coze插件代码" | 显示代码生成对话框 | 🤩 期待 | • 明显的按钮位置（API详情页顶部）<br>• Icon：</>（代码图标） |
| **5.2 配置** | 选择参数（城市名称） | **智能默认**：已填充"北京"（猜测用户位置） | 😌 轻松 | • 预填充示例值<br>• 可选修改<br>• 80%场景零配置 |
| **5.3 生成** | 点击"生成" | **立即显示完整插件代码**<br>（包含API Key、参数、错误处理） | 🤯 兴奋 | • 语法高亮（Shiki）<br>• 专业感<br>• 代码可折叠（显示关键部分） |
| **5.4 复制** | 点击"一键复制" | • 代码复制到剪贴板<br>• Toast提示："已复制到剪贴板" | 😎 满足 | • 一键操作<br>• 即时反馈 |
| **5.5 说明** | 查看使用说明 | 显示3步集成指南：<br>① 打开Coze工作流编辑器<br>② 粘贴代码到"代码块"<br>③ 测试运行 | 💡 掌控 | • 图文并茂的指引<br>• 截图+步骤编号<br>• 可选：视频教程链接 |

**关键设计决策：**
- ✅ 智能默认参数（80%场景零配置）
- ✅ 代码模板预生成（即拿即用，无需手动替换API Key）
- ✅ 集成说明清晰（截图+步骤，降低理解门槛）

**流失风险点与对策：**
- ⚠️ 用户不知道怎么用代码 → 提供视频教程（30秒演示）
- ⚠️ 代码报错 → 生成的代码包含错误处理和注释

---

#### 阶段6：在线测试 ⏱️ 2分钟

| 步骤 | 用户行为 | 系统响应 | 情感状态 | 设计要点 |
|------|----------|----------|----------|----------|
| **6.1 测试** | 点击"在线测试"tab | 展开测试面板，**预填参数**（城市：北京） | 🧪 好奇 | • 侧边抽屉式面板<br>• 参数预填充（无需思考） |
| **6.2 执行** | 点击"发送请求" | **<1秒**返回结果：<br>```json<br>{"city":"北京","temp":18}```<br>显示"✓ 成功" | 🎉 成就感 | • 即时响应（<1秒）<br>• 成功提示（绿色✓）<br>• 响应时间显示（127ms） |
| **6.3 扣费** | 查看余额变化 | Toast提示："扣费¥0.01，余额¥4.99"<br>顶部余额数字动画更新 | 💰 明确 | • 透明的计费提示<br>• 实时余额更新（动画） |
| **6.4 完成** | - | **任务清单全部勾选 ✓✓✓**<br>弹出庆祝动画 | 🏆 兴奋 | • 成就动画（Confetti撒花）<br>• 任务清单标记"已完成" |

**关键设计决策：**
- ✅ 在线测试工具内置（无需离开页面或使用Postman）
- ✅ <1秒响应（即时反馈原则）
- ✅ 实时余额更新（透明计费，消除顾虑）

**流失风险点与对策：**
- ⚠️ API调用失败 → 显示详细错误信息和解决方案（如"参数错误：city不能为空"）
- ⚠️ 用户担心扣费 → 测试前显示预估费用（"本次测试将扣费¥0.01"）

---

#### 阶段7：成功庆祝 ⏱️ 30秒

| 步骤 | 用户行为 | 系统响应 | 情感状态 | 设计要点 |
|------|----------|----------|----------|----------|
| **7.1 庆祝** | 完成首次调用 | 🎉 **庆祝动画**：<br>"恭喜完成首次API调用！"<br>+ 徽章解锁（"API新手"徽章） | 🥳 自豪 | • Confetti撒花动画<br>• 成就徽章（可收藏）<br>• 音效（可选） |
| **7.2 建议** | 查看下一步 | 显示推荐：<br>• 集成到Coze工作流<br>• 探索更多API<br>• 邀请好友得¥10奖励 | 🚀 持续动力 | • 清晰的下一步CTA<br>• 3个选项，任选其一<br>• 邀请机制（裂变） |
| **7.3 分享** | 可选：分享成就 | 生成分享卡片（带邀请码）<br>可分享到微信/抖音 | 😊 满足 | • 社交传播机制<br>• 邀请奖励（双方各得¥10）<br>• 分享卡片设计精美 |

**关键设计决策：**
- ✅ 成就感强化（动画+徽章+音效）
- ✅ 引导持续使用（推荐下一步，而非让用户迷失）
- ✅ 社交裂变（分享奖励，激励传播）

---

### 用户旅程时间分配

```
注册登录: ████████ 2分钟 (20%)
首次引导: ████ 1分钟 (10%)
生成Key:  ██ 0.5分钟 (5%)
选择API:  ████████ 2分钟 (20%)
获取代码: ████████ 2分钟 (20%)
在线测试: ████████ 2分钟 (20%)
成功庆祝: ██ 0.5分钟 (5%)
─────────────────────────────
总计:     10分钟 (100%)
```

---

### 潜在障碍与解决方案

| 障碍 | 影响 | 解决方案 |
|------|------|----------|
| 注册表单太复杂 | 流失率高 | ✅ 只要手机号+验证码（2个字段） |
| 不知道选哪个API | 选择困难 | ✅ "新手友好"标签 + 热门推荐（默认推天气API） |
| 不会配置参数 | 卡住放弃 | ✅ 智能默认值 + 示例预填充 |
| 担心计费不透明 | 不敢测试 | ✅ 实时余额提示 + 明确价格（"本次¥0.01"） |
| 不知道下一步做什么 | 流失 | ✅ 任务清单 + 完成后的下一步建议 |
| API调用失败 | 挫败感 | ✅ 详细错误信息 + 解决方案（"参数city不能为空"） |

---

### 情感曲线设计

```
情感强度
高 ↑     惊喜(赠¥5)         成就感(测试成功)  🎉庆祝
   |         ↗               ↗              ↗
   |       ↗   期待       ↗    兴奋      ↗
   |     ↗       (选API)↗       (代码) ↗
   | 好奇                ↗
   |   ↗              ↗
   | ↗  自信        ↗
低 └──────────────────────────────────→ 时间
   注册  引导  Key  选择  代码  测试  完成
```

**设计原则：**
- ✅ 持续的正向反馈（每一步都有成就感）
- ✅ 避免挫折低谷（智能默认、容错设计、清晰错误提示）
- ✅ 高潮在结尾（测试成功 + 庆祝动画 + 徽章解锁）

---

## 6. Component Library

### 6.1 Component Strategy

**组件架构：Atomic Design（原子设计）**

我们采用Brad Frost的Atomic Design方法论，将UI组件分为4个层级：原子（Atoms）、分子（Molecules）、有机体（Organisms）和模板（Templates）。这种分层确保组件的可复用性、一致性和可维护性。

---

### 组件分层清单

**Level 1: 原子组件（Atoms）** - 最小UI单元

✅ **从shadcn/ui直接复用（35个）：**

| 组件 | 用途 | 变体 |
|------|------|------|
| Button | 操作按钮 | primary, secondary, ghost, destructive |
| Input | 文本输入 | text, email, number, tel, password |
| Label | 表单标签 | - |
| Badge | 状态标签 | default, success, warning, destructive, vip |
| Avatar | 用户头像 | 圆形，支持图片/字母缩写 |
| Separator | 分隔线 | horizontal, vertical |
| Skeleton | 加载占位 | 匹配目标组件形状 |
| Tooltip | 提示气泡 | top, bottom, left, right |
| Checkbox | 多选框 | checked, unchecked, indeterminate |
| Radio | 单选框 | - |
| Switch | 开关 | on, off |
| Slider | 滑块 | - |

⚙️ **自定义原子组件（3个）：**

| 组件 | 用途 | Props |
|------|------|-------|
| Logo | API Hub品牌标志 | size: sm, md, lg |
| Icon | Lucide Icons包装器 | name: string, size, color |
| CodeSnippet | 语法高亮代码块 | code: string, language: string, copyable: boolean |

---

**Level 2: 分子组件（Molecules）** - 组合原子，业务无关

✅ **从shadcn/ui复用（20个）：**

| 组件 | 用途 | 组成 |
|------|------|------|
| Card | 内容容器 | CardHeader + CardContent + CardFooter |
| Form | 表单容器 | Label + Input + ErrorMessage |
| Dialog | 模态对话框 | DialogTrigger + DialogContent + DialogFooter |
| Select | 下拉选择器 | SelectTrigger + SelectContent + SelectItem |
| Tabs | 标签页 | TabsList + TabsTrigger + TabsContent |
| Alert | 通知提示 | AlertTitle + AlertDescription + Icon |
| Progress | 进度条 | - |
| Toast | 浮动通知 | ToastTitle + ToastDescription + ToastClose |
| Popover | 弹出层 | PopoverTrigger + PopoverContent |
| DropdownMenu | 下拉菜单 | DropdownMenuTrigger + DropdownMenuContent |

🔧 **自定义分子组件（10个）：**

| 组件 | 用途 | Props | 组成 |
|------|------|-------|------|
| SearchBar | 搜索栏 | placeholder, onChange, onSubmit | Icon + Input + Button |
| PriceTag | 价格标签 | mode, price, unit, vipFree | Badge + Text |
| StatCard | 统计卡片 | icon, value, label, trend | Icon + Text + Badge |
| CopyButton | 一键复制按钮 | text, onCopy | Button + ClipboardIcon + Toast |
| ApiStatus | API状态指示器 | status: 'available' \| 'maintenance' \| 'error' | Badge + PulseAnimation |
| BalanceDisplay | 余额显示 | balance, unit, trend | Text + Icon + Tooltip |
| MembershipBadge | 会员徽章 | tier: 'free' \| 'vip' \| 'enterprise' | Badge + Icon |
| ApiIcon | API图标容器 | src, alt, fallback | Avatar（圆角正方形变体） |
| LoadingSpinner | 加载动画 | size, text | Spinner + Text |
| EmptyState | 空状态占位 | icon, title, description, action | Icon + Text + Button |

---

**Level 3: 有机体组件（Organisms）** - 业务相关

🎨 **完全自定义（30个）：**

**导航系列（5个）：**

| 组件 | 用途 | 响应式行为 |
|------|------|-----------|
| TopNav | 顶部导航栏 | 桌面：全展开；移动：汉堡菜单 |
| Sidebar | 侧边栏导航 | 桌面：固定；移动：隐藏 |
| BottomNav | 底部导航栏 | 仅移动端显示 |
| MobileMenu | 移动端菜单 | 抽屉式（从左滑出） |
| Breadcrumb | 面包屑导航 | 溢出时显示"..." |

**API组件系列（8个）：**

| 组件 | 用途 | 关键功能 |
|------|------|----------|
| ApiCard | API预览卡片 | 显示图标、名称、简介、价格、状态、CTA |
| ApiDetailHeader | API详情头部 | 名称、简介、定价、订阅按钮、分享 |
| ApiDocumentation | API文档展示 | Tabs（概览/参数/响应/示例） |
| ApiTester | 在线测试面板 | 参数表单 + 发送请求 + 响应展示 |
| ApiParamsTable | 参数说明表格 | 参数名、类型、必填、说明、示例 |
| ApiResponsePreview | 响应预览 | JSON格式化 + 语法高亮 + 复制 |
| CozeCodeGenerator | Coze插件代码生成器 | 对话框 + 参数配置 + 代码生成 + 复制 |
| ApiCategoryFilter | API分类筛选器 | 多选Checkbox + 标签快选 |

**Dashboard组件系列（7个）：**

| 组件 | 用途 | 数据可视化 |
|------|------|-----------|
| UsageChart | 使用量趋势图 | Recharts折线图/柱状图 |
| BalanceWidget | 余额展示组件 | 数值 + 趋势 + 充值按钮 |
| RecentCallsTable | 最近调用记录表格 | Table + Badge（状态） |
| QuickStartGuide | 快速开始引导 | 步骤列表 + 勾选状态 + CTA |
| TaskChecklist | 任务清单（悬浮） | 可折叠 + 进度指示 + 勾选 |
| ApiUsageBreakdown | API使用量拆解 | 饼图/环形图（按API分组） |
| MembershipCard | 会员卡片 | 等级、到期时间、权益列表、续费 |

**计费组件系列（5个）：**

| 组件 | 用途 | 功能 |
|------|------|------|
| PricingCard | 定价卡片 | 会员等级对比（Free/VIP/Enterprise） |
| TopUpDialog | 充值对话框 | 金额选择器 + 支付方式 + 确认 |
| InvoiceTable | 账单记录表格 | 时间、API、消费、余额 |
| UsageAlertBanner | 用量预警横幅 | 余额不足提醒 + 预估可用天数 |
| PaymentMethodSelector | 支付方式选择器 | 微信/支付宝/余额 + Radio |

**其他业务组件（5个）：**

| 组件 | 用途 |
|------|------|
| UserMenu | 用户菜单（下拉） |
| NotificationCenter | 通知中心（抽屉） |
| FeedbackModal | 反馈对话框 |
| ShareDialog | 分享对话框（邀请码） |
| SuccessCelebration | 成功庆祝动画（Confetti） |

---

**Level 4: 模板（Templates）** - 完整页面布局

📄 **页面模板（5个）：**

| 模板 | 用途 | 布局结构 |
|------|------|----------|
| DashboardLayout | Dashboard通用布局 | TopNav + Sidebar + MainContent + TaskChecklist |
| MarketplaceLayout | API市场布局 | TopNav + SearchBar + FilterSidebar + ApiGrid |
| ApiDetailLayout | API详情页布局 | TopNav + Sidebar(导航) + DetailContent + Tester |
| AuthLayout | 认证页面布局 | 居中Card（注册/登录） |
| SettingsLayout | 设置页面布局 | TopNav + TabNavigation + SettingsContent |

---

### 组件复用比例

```
总计100个组件：
┌───────────────────────────────────────┐
│ shadcn/ui直接使用:  35个 (35%)  ████  │
│ shadcn/ui修改样式:  20个 (20%)  ███   │
│ 完全自定义组件:     45个 (45%)  █████ │
└───────────────────────────────────────┘

原则：
✅ 通用UI组件（Button、Input等） → 优先shadcn/ui
✅ 业务特定组件（ApiCard等） → 自定义开发
✅ 样式修改 → 通过Tailwind覆盖，不fork shadcn/ui源码
```

---

### 组件定制策略

**策略1：Tailwind主题配置**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        accent: { 500: '#f97316' },
        success: '#10b981',
        vip: '#fbbf24',
      },
      borderRadius: {
        'api-card': '12px',
        'modal': '16px',
      },
      boxShadow: {
        'card-hover': '0 4px 12px rgba(0,0,0,0.08)',
      },
      animation: {
        'confetti': 'confetti 3s ease-in-out',
      }
    }
  }
}
```

**策略2：shadcn/ui组件样式覆盖**

```typescript
// components/ui/button.tsx（shadcn/ui生成后修改）
const buttonVariants = cva(
  "base-styles...",
  {
    variants: {
      variant: {
        default: "bg-primary-500 hover:bg-primary-600",
        // 新增：VIP专属variant
        vip: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
      }
    }
  }
)
```

**策略3：自定义组件模板**

```tsx
// components/api-hub/ApiCard.tsx
export function ApiCard({ api }: ApiCardProps) {
  return (
    <Card className="hover:shadow-card-hover transition-all">
      <CardHeader>
        <div className="flex items-center gap-3">
          <ApiIcon src={api.icon} alt={api.name} />
          <div>
            <CardTitle>{api.name}</CardTitle>
            <ApiStatus status={api.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{api.description}</p>
        <PriceTag
          mode={api.billingMode}
          price={api.price}
          vipFree={api.vipFree}
        />
      </CardContent>
      <CardFooter>
        <Button variant="default" className="w-full">
          立即使用
        </Button>
      </CardFooter>
    </Card>
  )
}
```

---

### 组件文档规范

**每个组件必须包含：**

**1. TypeScript接口定义**
```typescript
interface ApiCardProps {
  api: {
    id: string
    name: string
    description: string
    icon: string
    status: 'available' | 'maintenance' | 'error'
    billingMode: 'per-call' | 'usage-based' | 'membership'
    price: number
    vipFree?: boolean
  }
  onSelect?: (apiId: string) => void
}
```

**2. 使用示例**
```tsx
<ApiCard
  api={{
    id: 'weather',
    name: '天气查询API',
    description: '实时天气数据查询服务',
    icon: '/api-icons/weather.svg',
    status: 'available',
    billingMode: 'per-call',
    price: 0.01
  }}
  onSelect={(id) => console.log('Selected:', id)}
/>
```

**3. 变体展示**
```tsx
// 普通API卡片
<ApiCard api={weatherApi} />

// VIP免费API卡片
<ApiCard api={{ ...gptApi, vipFree: true }} />

// 维护中状态
<ApiCard api={{ ...weatherApi, status: 'maintenance' }} />
```

---

### 组件开发工作流

**阶段1：初始化shadcn/ui**（第1周）
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card form dialog
npx shadcn-ui@latest add select tabs alert badge avatar
npx shadcn-ui@latest add table toast popover dropdown-menu
```

**阶段2：主题定制**（第1周）
- 配置Tailwind品牌色（Primary、Accent、VIP）
- 调整shadcn/ui组件默认样式（圆角、阴影、动画）
- 创建全局CSS变量（深色模式）

**阶段3：自定义分子组件**（第2-3周）
- PriceTag
- StatCard
- CopyButton
- SearchBar
- BalanceDisplay

**阶段4：业务有机体组件**（第4-8周）
- **Week 4**: ApiCard、ApiDetailHeader、TopNav
- **Week 5**: ApiTester、CozeCodeGenerator
- **Week 6**: Sidebar、BottomNav、MobileMenu
- **Week 7**: UsageChart、BalanceWidget、QuickStartGuide
- **Week 8**: PricingCard、TopUpDialog、TaskChecklist

**阶段5：页面模板**（第9-10周）
- DashboardLayout
- MarketplaceLayout
- ApiDetailLayout
- AuthLayout

---

### 组件性能优化策略

**策略1：代码分割（懒加载）**
```tsx
// 懒加载重型组件
const ApiTester = lazy(() => import('@/components/api-hub/ApiTester'))
const CozeCodeGenerator = lazy(() => import('@/components/api-hub/CozeCodeGenerator'))
const UsageChart = lazy(() => import('@/components/dashboard/UsageChart'))
```

**策略2：虚拟滚动**（API列表）
```tsx
import { VirtualList } from '@tanstack/react-virtual'

<VirtualList
  items={apis}  // 假设有500个API
  itemHeight={150}  // 每个ApiCard高度
  renderItem={(api) => <ApiCard api={api} />}
/>
// 只渲染可见区域的卡片，性能提升10x
```

**策略3：Memo优化**
```tsx
export const ApiCard = memo(({ api }: ApiCardProps) => {
  // ...组件实现
}, (prevProps, nextProps) => {
  // 自定义比较函数：只在api.id变化时重新渲染
  return prevProps.api.id === nextProps.api.id
})
```

**策略4：图片懒加载**
```tsx
<img
  src={api.icon}
  alt={api.name}
  loading="lazy"  // 原生懒加载
  decoding="async"  // 异步解码
/>
```

---

### 组件清单（优先级排序）

| 组件类别 | 组件名称 | 来源 | 优先级 | 预计工时 |
|---------|---------|------|--------|---------|
| **原子** | Button | shadcn/ui | P0 | 0.5天 |
| | Input | shadcn/ui | P0 | 0.5天 |
| | Badge | shadcn/ui | P0 | 0.5天 |
| | CodeSnippet | 自定义 | P1 | 1天 |
| **分子** | Card | shadcn/ui | P0 | 0.5天 |
| | Form | shadcn/ui | P0 | 1天 |
| | PriceTag | 自定义 | P1 | 1天 |
| | StatCard | 自定义 | P1 | 1.5天 |
| | CopyButton | 自定义 | P1 | 0.5天 |
| | SearchBar | 自定义 | P1 | 1天 |
| **有机体** | TopNav | 自定义 | P0 | 2天 |
| | ApiCard | 自定义 | P0 | 2天 |
| | Sidebar | 自定义 | P0 | 2天 |
| | ApiTester | 自定义 | P1 | 3天 |
| | CozeCodeGenerator | 自定义 | P1 | 3天 |
| | ApiDetailHeader | 自定义 | P1 | 1.5天 |
| | UsageChart | 自定义 | P2 | 2天 |
| | QuickStartGuide | 自定义 | P1 | 1.5天 |
| **模板** | DashboardLayout | 自定义 | P0 | 2天 |
| | MarketplaceLayout | 自定义 | P0 | 1.5天 |
| | ApiDetailLayout | 自定义 | P1 | 1.5天 |
| | AuthLayout | 自定义 | P0 | 1天 |

**总计预估工时：** 约30-35天（1.5人月）

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules

定义API Hub的核心交互模式和一致性规则，确保用户在不同场景下获得可预期的体验。

---

### 导航模式

**模式决策：混合导航**（桌面：侧边栏 + 顶栏；移动：底部导航）

**桌面端（>768px）：**

```
┌─────────────────────────────────────┐
│  [Logo]  充值 余额¥128.5  [Avatar] │ ← 顶部导航（全局操作）
├──────┬──────────────────────────────┤
│ 📊概览│                              │
│ 🔌市场│    主内容区                  │
│ 🔑Keys│                              │
│ 📈统计│                              │ ← 左侧边栏（主导航）
│ 💰充值│                              │
│ 👤会员│                              │
│ ⚙️设置│                              │
└──────┴──────────────────────────────┘
```

**移动端（<768px）：**

```
┌─────────────────────────────────────┐
│  [☰]  API Hub        余额  [Avatar] │ ← 顶部导航
│                                     │
│         主内容区                    │
│                                     │
├─────────────────────────────────────┤
│ 概览  市场  统计  会员  更多         │ ← 底部导航
└─────────────────────────────────────┘
```

**决策理由：**
- ✅ 桌面端侧边栏 = 功能直达（符合开发者习惯，参考GitHub、Vercel）
- ✅ 移动端底部导航 = 拇指可达（易操作，符合移动端人体工学）
- ✅ 顶部保留全局操作（充值、余额、头像）

**一致性规则：**
- 侧边栏/底部导航最多7个一级入口（符合7±2记忆规律）
- 当前页面高亮显示（蓝色背景 + 粗体）
- 导航项图标+文字组合（降低认知负担）

---

### 反馈模式

**模式1：Toast通知**（非阻塞式反馈）

**使用场景：**
- ✅ 操作成功提示（复制、保存、删除）
- ✅ 轻量级错误（网络超时、参数错误）
- ✅ 后台任务完成（充值成功、API订阅成功）

**示例：**
```tsx
// 成功
toast.success("API Key已复制到剪贴板")

// 错误
toast.error("余额不足，请先充值")

// 信息
toast.info("您有1个新的系统通知")

// 加载
toast.loading("正在生成API Key...")
```

**位置：** 右上角（桌面）/ 顶部（移动）
**持续时间：** 3秒自动消失（可手动关闭）
**动画：** 从右侧滑入，淡出消失

---

**模式2：内联验证**（表单即时反馈）

**使用场景：**
- ✅ 表单输入验证（注册、充值、API配置）
- ✅ 实时错误提示（输入时验证，而非提交时）

**示例：**
```tsx
<Input
  type="email"
  value={email}
  onChange={handleChange}
  error={errors.email}  // "请输入有效的邮箱地址"
  success={!errors.email && email}  // 绿色✓
/>
```

**视觉：**
- 错误 = 红色边框 + ❌图标 + 提示文字（下方）
- 成功 = 绿色边框 + ✓图标
- 警告 = 黄色边框 + ⚠️图标

**一致性规则：**
- 错误信息必须明确指出问题和解决方法
- 不使用技术术语（如"400 Bad Request"），改用"请输入有效的手机号"
- 验证触发时机：失去焦点（onBlur）或实时验证（onChange，防抖300ms）

---

**模式3：确认对话框**（重要操作）

**使用场景：**
- ⚠️ 删除API Key（不可逆操作）
- ⚠️ 取消订阅（影响API调用）
- ⚠️ 清空余额（财务操作）

**示例：**
```tsx
<AlertDialog>
  <AlertDialogTitle>确认删除API Key？</AlertDialogTitle>
  <AlertDialogDescription>
    删除后无法恢复，使用该Key的应用将无法调用API
  </AlertDialogDescription>
  <AlertDialogAction variant="destructive">确认删除</AlertDialogAction>
  <AlertDialogCancel>取消</AlertDialogCancel>
</AlertDialog>
```

**一致性规则：**
- 标题：疑问句（"确认删除？"）
- 描述：说明后果（"删除后无法恢复"）
- 确认按钮：红色（destructive）+ 动词（"确认删除"）
- 取消按钮：灰色 + 置于左侧

---

### 错误处理模式

**级别1：字段级错误**（内联显示）
```tsx
<Input error="手机号格式不正确（应为11位数字）" />
```

**级别2：表单级错误**（Alert组件）
```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>注册失败</AlertTitle>
  <AlertDescription>
    该手机号已被注册，请<Link href="/login">直接登录</Link>
  </AlertDescription>
</Alert>
```

**级别3：页面级错误**（Error Boundary）
```tsx
// 500错误、网络错误
<ErrorPage
  code={500}
  title="服务暂时不可用"
  description="我们正在紧急修复，请稍后再试"
  action={<Button onClick={retry}>重试</Button>}
  secondaryAction={<Button variant="ghost" href="/">返回首页</Button>}
/>
```

**级别4：全局错误**（Modal）
```tsx
// API调用失败、余额不足
<Dialog>
  <DialogTitle>余额不足</DialogTitle>
  <DialogContent>
    <p>当前余额：¥0.50，本次调用需要¥1.00</p>
    <p className="text-sm text-muted-foreground">
      建议充值¥20，可调用约2000次
    </p>
  </DialogContent>
  <DialogFooter>
    <Button variant="primary">立即充值</Button>
    <Button variant="ghost">取消</Button>
  </DialogFooter>
</Dialog>
```

**错误恢复策略：**
- ✅ 提供明确的下一步操作（充值、重试、返回）
- ✅ 保留用户已输入的数据（表单错误后不清空）
- ✅ 自动重试（网络错误最多重试3次）
- ✅ 错误日志（发送到后端，便于排查）

---

### 加载状态模式

**模式1：Skeleton占位**（内容加载）

**使用场景：**
- ✅ 页面初次加载（Dashboard、API市场）
- ✅ 列表/表格加载

**示例：**
```tsx
{isLoading ? (
  <div className="grid grid-cols-3 gap-4">
    {[1,2,3,4,5,6].map(i => <ApiCardSkeleton key={i} />)}
  </div>
) : (
  <div className="grid grid-cols-3 gap-4">
    {apis.map(api => <ApiCard key={api.id} api={api} />)}
  </div>
)}
```

---

**模式2：Spinner + 文字**（操作反馈）

**使用场景：**
- ✅ 按钮操作（生成Key、提交表单）
- ✅ 短时间异步操作（<3秒）

**示例：**
```tsx
<Button disabled={isGenerating}>
  {isGenerating ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      生成中...
    </>
  ) : (
    "生成API Key"
  )}
</Button>
```

---

**模式3：Progress Bar**（明确进度）

**使用场景：**
- ✅ 文件上传
- ✅ 数据导出（大量数据）
- ✅ 批量操作（删除多个Key）

**示例：**
```tsx
<Progress value={progress} />
<p className="text-sm text-muted-foreground">
  {progress}% 完成（{completed}/{total}）
</p>
```

**加载时间原则：**
- <100ms = 无需提示（即时操作）
- 100ms-1s = Spinner（无需文字）
- 1s-3s = Spinner + 文字（"加载中..."）
- \>3s = Skeleton或Progress（可选：允许取消）

**一致性规则：**
- Spinner颜色 = Primary-500（蓝色）
- Skeleton颜色 = Surface（浅灰）
- 加载文字使用"..."而非动画省略号
- 禁用状态按钮降低透明度（opacity-50）

---

### 表单交互模式

**模式1：渐进式表单**（分步填写）

**示例：注册流程**
```
步骤1: 手机号 + 验证码（核心字段）
     ↓
步骤2: 设置密码（可选，跳过则使用验证码登录）
     ↓
步骤3: 完成！
```

**一致性规则：**
- 每步最多3个字段
- 必填字段标记*（红色）
- 可选字段说明"（可选）"或提供跳过按钮
- 进度指示器显示"步骤1/3"

---

**模式2：智能默认值**（减少输入）

**示例：**
```tsx
// API Key命名
<Input
  defaultValue={`我的第一个Key ${new Date().toLocaleDateString()}`}
  placeholder="为Key命名（可选）"
/>

// API测试参数（猜测用户城市）
<Input
  defaultValue="北京"  // 基于IP或上次输入
  label="城市名称"
/>
```

**一致性规则：**
- 80%场景提供默认值
- 默认值必须是合理的示例（而非空值或占位符）
- 用户可以修改默认值

---

**模式3：即时验证**（实时反馈）

**示例：**
```tsx
<Input
  type="text"
  label="API Key名称"
  value={keyName}
  onChange={(e) => {
    setKeyName(e.target.value)
    // 即时验证（防抖300ms）
    debounce(() => {
      if (e.target.value.length > 50) {
        setError("名称不能超过50个字符")
      } else if (e.target.value.length === 0) {
        setError("名称不能为空")
      } else {
        setError(null)
      }
    }, 300)
  }}
  error={error}
/>
```

**一致性规则：**
- 验证触发时机：onChange（防抖300ms）或onBlur
- 成功状态显示绿色✓（但不显示文字）
- 错误状态显示红色边框+图标+文字

---

### 搜索和筛选模式

**模式1：即时搜索**（无需点击搜索按钮）

```tsx
<SearchBar
  placeholder="搜索API名称、分类、关键词..."
  onChange={(query) => {
    // 防抖300ms后执行搜索
    debounce(() => searchApis(query), 300)
  }}
  // 无需搜索按钮
/>
```

**一致性规则：**
- 搜索框宽度：桌面≥400px，移动100%
- 防抖延迟：300ms（平衡性能和即时性）
- 搜索结果数量提示："找到23个API"
- 空结果状态：显示EmptyState组件（推荐相关API）

---

**模式2：多维筛选**（侧边栏 + 标签）

```tsx
<div className="flex gap-6">
  {/* 左侧筛选器 */}
  <aside className="w-64">
    <FilterSection title="计费模式">
      <Checkbox label="按次计费" count={45} />
      <Checkbox label="按量计费" count={23} />
      <Checkbox label="会员免费" count={12} />
    </FilterSection>

    <FilterSection title="分类">
      <Checkbox label="AI能力" count={30} />
      <Checkbox label="数据查询" count={40} />
      <Checkbox label="工具类" count={20} />
    </FilterSection>
  </aside>

  {/* 右侧结果 */}
  <main className="flex-1">
    {/* 快速标签筛选 */}
    <div className="flex gap-2 mb-4">
      <Badge variant="outline" onClick={() => filter('hot')}>
        🔥 热门
      </Badge>
      <Badge variant="outline" onClick={() => filter('new')}>
        ✨ 新上线
      </Badge>
      <Badge variant="outline" onClick={() => filter('beginner')}>
        👶 新手友好
      </Badge>
    </div>

    <ApiGrid apis={filteredApis} />
  </main>
</div>
```

**一致性规则：**
- 筛选器显示每个选项的数量（如"按次计费 (45)"）
- 选中的筛选项高亮显示（蓝色边框）
- 清空筛选按钮（显示在筛选器顶部）
- 快速标签使用Emoji增强识别性

---

### 数据展示模式

**模式1：卡片式展示**（API列表）

**使用场景：**
- ✅ API市场（浏览和选择）
- ✅ Dashboard概览卡片

**一致性规则：**
- 卡片圆角：12px
- 卡片阴影：hover时显示（0 4px 12px rgba(0,0,0,0.08)）
- 卡片内边距：20px
- 卡片间距：16-24px

---

**模式2：表格展示**（使用统计）

**使用场景：**
- ✅ 使用统计（API调用记录）
- ✅ 账单记录
- ✅ API Key列表

**一致性规则：**
- 表头：粗体 + 浅灰背景
- 行高：48px（足够点击区域）
- 斑马纹：奇数行白色，偶数行浅灰
- 悬停：整行高亮（浅蓝背景）
- 操作列：右对齐，固定宽度

---

**模式3：图表可视化**（趋势数据）

**使用场景：**
- ✅ 7天/30天使用量趋势
- ✅ API使用量分布（饼图）

**一致性规则：**
- 图表颜色：Primary-500（蓝色主色）
- 网格线：浅灰色虚线
- Tooltip：白色背景 + 阴影
- 图表高度：300px（桌面），200px（移动）

---

### 关键UX决策总结

| 场景 | 模式选择 | 理由 |
|------|----------|------|
| 导航 | 桌面侧边栏 + 移动底部导航 | 功能直达 + 拇指可达 |
| 成功反馈 | Toast通知（3秒消失） | 非阻塞，不打断用户 |
| 错误提示 | 内联 + Alert + Dialog分级 | 严重程度分层处理 |
| 加载状态 | Skeleton占位 | 感知速度更快 |
| 表单输入 | 智能默认 + 即时验证 | 减少输入 + 快速反馈 |
| 搜索 | 即时搜索（防抖300ms） | 无需点击按钮 |
| 筛选 | 侧边栏 + 快速标签 | 多维度 + 快捷访问 |
| 数据展示 | 卡片为主 + 表格/图表辅助 | 视觉友好 + 信息密度平衡 |

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy

**响应式断点定义（Tailwind默认）：**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // 手机横屏/小平板
      'md': '768px',   // 平板
      'lg': '1024px',  // 笔记本
      'xl': '1280px',  // 桌面显示器
      '2xl': '1536px', // 大屏显示器
    }
  }
}
```

---

**布局适配策略：**

| 屏幕尺寸 | 布局策略 | 导航方式 | 网格列数 |
|---------|---------|----------|---------|
| **手机** <640px | 单列布局 | 顶部栏 + 底部导航 | 1列 |
| **平板** 640-1024px | 两列布局 | 顶部栏 + 侧边栏（可收起） | 2列 |
| **笔记本** 1024-1280px | 侧边栏 + 主内容 | 固定侧边栏 | 3列 |
| **桌面** >1280px | 侧边栏 + 主内容 + 边栏（可选） | 固定侧边栏 | 4列 |

---

**关键组件适配示例：**

**1. API卡片网格**
```tsx
<div className="
  grid
  grid-cols-1        /* 手机：1列 */
  sm:grid-cols-2     /* 小屏：2列 */
  lg:grid-cols-3     /* 笔记本：3列 */
  xl:grid-cols-4     /* 桌面：4列 */
  gap-4 sm:gap-6
">
  {apis.map(api => <ApiCard key={api.id} api={api} />)}
</div>
```

**2. 导航栏**
```tsx
{/* 桌面：侧边栏 */}
<aside className="hidden lg:block w-64 fixed left-0 top-0 h-full">
  <Sidebar />
</aside>

{/* 移动：底部导航 */}
<nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t">
  <BottomNav />
</nav>

{/* 移动：汉堡菜单 */}
<button className="lg:hidden" onClick={toggleMobileMenu} aria-label="打开菜单">
  <Menu />
</button>
```

**3. 表格 → 卡片（移动端降级）**
```tsx
{/* 桌面：表格 */}
<Table className="hidden md:table">
  <TableHeader>...</TableHeader>
  <TableBody>...</TableBody>
</Table>

{/* 移动：卡片列表 */}
<div className="md:hidden space-y-4">
  {stats.map(stat => (
    <Card key={stat.id}>
      <div className="flex justify-between">
        <span className="font-semibold">{stat.apiName}</span>
        <Badge>{stat.calls}次</Badge>
      </div>
      <div className="text-sm text-muted-foreground">
        成功率: {stat.successRate}% · 费用: ¥{stat.cost}
      </div>
    </Card>
  ))}
</div>
```

---

**触摸优化（移动端）：**

```tsx
// 按钮最小点击区域：44×44px（Apple HIG标准）
<Button className="
  min-h-[44px]
  min-w-[44px]
  touch-manipulation  /* 禁用双击缩放 */
">
  立即使用
</Button>

// 增大表单输入区域
<Input className="
  h-12           /* 手机：更高的输入框 */
  md:h-10        /* 桌面：正常高度 */
  text-base      /* 手机：16px防止自动缩放 */
  md:text-sm
" />

// 增大间距（拇指点击更容易）
<div className="space-y-4 md:space-y-3">
  {/* 移动端间距更大 */}
</div>
```

---

**图片和媒体响应式：**

```tsx
{/* 响应式图片 */}
<img
  src={api.icon}
  srcSet={`
    ${api.icon_small} 320w,
    ${api.icon_medium} 768w,
    ${api.icon_large} 1280w
  `}
  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
  alt={api.name}
  loading="lazy"
/>

{/* 视频自适应 */}
<div className="aspect-video">
  <iframe src={tutorialVideo} className="w-full h-full" />
</div>
```

---

### 8.2 Accessibility Strategy（WCAG 2.1 AA级）

**原则1：可感知（Perceivable）**

**1.1 文本替代**
```tsx
{/* 图片必须有alt */}
<img src={api.icon} alt="天气查询API图标" />

{/* 图标按钮必须有aria-label */}
<button aria-label="关闭对话框">
  <X className="h-4 w-4" />
</button>

{/* 装饰性图标标记为aria-hidden */}
<Icon aria-hidden="true" decorative />
```

**1.2 色彩对比度**（至少4.5:1）
```css
/* 主文本 vs 白色背景 */
.text-primary {
  color: #1e293b;  /* 对比度：12.63:1 ✓ */
}

/* 次要文本 vs 白色背景 */
.text-secondary {
  color: #64748b;  /* 对比度：4.54:1 ✓ */
}

/* 链接文本 vs 白色背景 */
.text-link {
  color: #2563eb;  /* 对比度：4.98:1 ✓ */
}

/* 禁止使用纯色区分状态，必须加图标 */
.status-success {
  color: #10b981;
  &::before {
    content: '✓';  /* 加图标辅助 */
  }
}
```

**验证工具：**
- Chrome Lighthouse（无障碍评分）
- axe DevTools（自动扫描）
- Contrast Checker（对比度验证）

---

**原则2：可操作（Operable）**

**2.1 键盘可访问**
```tsx
{/* 所有交互元素必须可键盘访问 */}
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
>
  自定义按钮
</div>

{/* 跳过导航链接（首个可聚焦元素） */}
<a href="#main-content" className="sr-only focus:not-sr-only">
  跳过导航，直达主内容
</a>
```

**2.2 焦点管理**
```tsx
{/* 焦点可见指示器 */}
<Button className="
  focus:outline-none
  focus:ring-2
  focus:ring-primary-500
  focus:ring-offset-2
">
  生成API Key
</Button>

{/* 模态框打开时，焦点移至模态框 */}
const dialogRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (isOpen) {
    dialogRef.current?.focus()
  }
}, [isOpen])

<Dialog ref={dialogRef} tabIndex={-1}>
  ...
</Dialog>
```

**键盘导航快捷键：**
- Tab：下一个可聚焦元素
- Shift + Tab：上一个可聚焦元素
- Enter / Space：激活按钮/链接
- Esc：关闭对话框/菜单
- Arrow Keys：在列表/菜单中导航

---

**原则3：可理解（Understandable）**

**3.1 语义化HTML**
```tsx
{/* 使用正确的HTML元素 */}
<nav aria-label="主导航">
  <ul>
    <li><a href="/dashboard">概览</a></li>
    <li><a href="/marketplace">API市场</a></li>
  </ul>
</nav>

<main id="main-content">
  <h1>API市场</h1>
  <section aria-labelledby="hot-apis">
    <h2 id="hot-apis">热门API</h2>
    ...
  </section>
</main>

<aside aria-label="筛选器">
  <h2>筛选条件</h2>
  ...
</aside>
```

**3.2 表单标签和说明**
```tsx
<Label htmlFor="phone">手机号</Label>
<Input
  id="phone"
  type="tel"
  aria-describedby="phone-help"
  aria-required="true"
  aria-invalid={!!errors.phone}
/>
<p id="phone-help" className="text-sm text-muted-foreground">
  用于接收验证码
</p>
{errors.phone && (
  <p role="alert" className="text-sm text-destructive">
    {errors.phone}
  </p>
)}
```

**3.3 错误提示清晰**
```tsx
{/* 错误必须明确指出问题和解决方法 */}
<Alert variant="destructive" role="alert">
  <AlertCircle />
  <AlertTitle>余额不足</AlertTitle>
  <AlertDescription>
    当前余额¥0.50，本次调用需要¥1.00。
    <Button variant="link" className="ml-2">立即充值</Button>
  </AlertDescription>
</Alert>
```

---

**原则4：健壮（Robust）**

**4.1 ARIA标签**
```tsx
{/* 动态内容更新通知 */}
<div aria-live="polite" aria-atomic="true">
  余额：¥{balance}
</div>

{/* 加载状态 */}
<Button disabled={isLoading} aria-busy={isLoading}>
  {isLoading ? '生成中...' : '生成API Key'}
</Button>

{/* 展开/折叠状态 */}
<button
  aria-expanded={isExpanded}
  aria-controls="api-details"
  onClick={toggle}
>
  查看详情 {isExpanded ? '▲' : '▼'}
</button>
<div id="api-details" hidden={!isExpanded}>
  ...
</div>
```

**4.2 屏幕阅读器优化**
```tsx
{/* 视觉隐藏但屏幕阅读器可读 */}
<span className="sr-only">当前页面：API市场</span>

{/* 复杂组件的说明 */}
<div role="region" aria-label="使用量图表">
  <UsageChart data={usageData} />
  {/* 提供表格形式的替代数据 */}
  <table className="sr-only">
    <caption>过去7天API调用数据</caption>
    <thead>
      <tr>
        <th>日期</th>
        <th>调用次数</th>
      </tr>
    </thead>
    <tbody>
      {usageData.map(d => (
        <tr key={d.date}>
          <td>{d.date}</td>
          <td>{d.calls}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

### 无障碍测试清单

**自动化测试：**
- [ ] 使用axe DevTools扫描（Chrome插件）
- [ ] 使用WAVE工具检测
- [ ] Lighthouse无障碍评分 ≥90分
- [ ] Pa11y CI集成（自动化测试）

**手动测试：**
- [ ] 仅用键盘完成所有操作（Tab、Enter、Esc）
- [ ] 使用屏幕阅读器测试（NVDA/JAWS/VoiceOver）
- [ ] 200%缩放下界面可用
- [ ] 强制深色模式测试
- [ ] 禁用JavaScript后核心功能可用（渐进增强）

---

### 深色模式策略

**实现方案：CSS Variables + class切换**

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  /* ... */
}
```

```tsx
// ThemeProvider
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class" defaultTheme="system">
  <App />
</ThemeProvider>

// 主题切换器
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={`切换到${theme === 'dark' ? '明亮' : '深色'}模式`}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  )
}
```

**无障碍要求：**
- ✅ 主题切换按钮有 `aria-label="切换深色模式"`
- ✅ 深色模式下对比度仍需满足4.5:1
- ✅ 支持系统主题自动切换（`prefers-color-scheme`）
- ✅ 主题偏好保存到localStorage

---

### 响应式和无障碍关键指标

| 指标 | 目标值 | 验证方法 |
|------|--------|----------|
| 色彩对比度 | ≥4.5:1（WCAG AA） | axe DevTools |
| 键盘可访问 | 100%可操作 | 手动Tab测试 |
| 屏幕阅读器 | 100%可理解 | NVDA/VoiceOver测试 |
| Lighthouse无障碍 | ≥90分 | Chrome Lighthouse |
| 移动端可用性 | Google Mobile-Friendly | PageSpeed Insights |
| 触摸目标最小尺寸 | 44×44px | Chrome DevTools |
| 页面加载速度 | <3秒（首屏） | Lighthouse Performance |
| 核心Web Vitals | 全部通过 | Google Search Console |

---

## 9. Implementation Guidance

### 9.1 Completion Summary

**UX设计规范已完成，包括以下核心交付物：**

✅ **1. 设计系统选择**
- 技术栈：shadcn/ui + Tailwind CSS
- 理由：现代化、高效、可定制
- 预计节省开发时间：40%

✅ **2. 视觉基础**
- 颜色主题：Friendly Tech（明亮清新）
- 交互式可视化：[ux-color-themes.html](./ux-color-themes.html)
- 6个备选主题已探索

✅ **3. 设计方向**
- 选择：Modern Cards（Vercel风格）
- 交互式Mockup：[ux-design-directions.html](./ux-design-directions.html)
- 6种完整设计方向已评估

✅ **4. 核心用户旅程**
- 主旅程：10分钟从注册到成功调用API
- 7个阶段，详细交互设计
- 情感曲线优化，避免挫折点

✅ **5. 组件库策略**
- 100个组件清单（原子→分子→有机体→模板）
- 35%复用shadcn/ui，45%自定义
- 预计开发时间：30-35天

✅ **6. UX模式决策**
- 导航、反馈、错误处理、加载、表单、搜索、数据展示
- 一致性规则明确
- 8大核心模式定义

✅ **7. 响应式和无障碍**
- 4个断点策略（手机→平板→笔记本→桌面）
- WCAG 2.1 AA级标准
- 深色模式支持

---

### 开发实施路线图

**阶段1：基础设施（Week 1）**
- [ ] 初始化Next.js项目
- [ ] 配置shadcn/ui + Tailwind CSS
- [ ] 设置品牌颜色（Primary、Accent、VIP）
- [ ] 配置深色模式（next-themes）
- [ ] 安装图表库（Recharts）、代码高亮（Shiki）

**阶段2：原子和分子组件（Week 2-3）**
- [ ] 从shadcn/ui添加基础组件（Button、Input、Card等）
- [ ] 创建自定义分子组件（PriceTag、StatCard、CopyButton）
- [ ] 编写组件文档（Storybook或README）

**阶段3：布局和导航（Week 4）**
- [ ] 实现TopNav（桌面和移动）
- [ ] 实现Sidebar（可收起）
- [ ] 实现BottomNav（移动端）
- [ ] 实现页面模板（DashboardLayout、MarketplaceLayout）

**阶段4：核心业务组件（Week 5-7）**
- [ ] ApiCard（P0）
- [ ] ApiDetailHeader（P1）
- [ ] ApiTester（P1）
- [ ] CozeCodeGenerator（P1）
- [ ] QuickStartGuide（P1）

**阶段5：Dashboard组件（Week 8）**
- [ ] UsageChart（P2）
- [ ] BalanceWidget（P1）
- [ ] TaskChecklist（P1）
- [ ] RecentCallsTable（P2）

**阶段6：计费组件（Week 9）**
- [ ] PricingCard（P2）
- [ ] TopUpDialog（P1）
- [ ] UsageAlertBanner（P1）

**阶段7：优化和测试（Week 10）**
- [ ] 响应式测试（各断点）
- [ ] 无障碍测试（键盘、屏幕阅读器、Lighthouse）
- [ ] 性能优化（懒加载、虚拟滚动）
- [ ] 浏览器兼容性测试

**阶段8：集成和联调（Week 11-12）**
- [ ] 与后端API集成
- [ ] 真实数据测试
- [ ] 边缘情况处理
- [ ] UAT（用户验收测试）

---

### 设计移交清单

**交付给开发团队的文档：**

- ✅ UX设计规范（本文档）
- ✅ 颜色主题可视化（HTML）
- ✅ 设计方向Mockup（HTML）
- ✅ 组件清单（100个组件 + 优先级）
- ✅ 用户旅程地图（7个阶段详细交互）
- ✅ UX模式决策（8大模式）
- ✅ 响应式和无障碍标准

**Figma设计稿（可选，根据需要）：**
- 高保真Mockup（基于HTML转换）
- 组件库（Design System）
- 原型交互（点击式演示）

---

### 成功指标

**UX质量指标：**

| 指标 | 目标值 | 验证方法 |
|------|--------|----------|
| 首次调用时间 | ≤10分钟 | 用户测试 |
| 任务完成率 | ≥90% | 用户测试 |
| NPS评分 | ≥50 | 用户调研 |
| Lighthouse无障碍 | ≥90分 | 自动化测试 |
| 移动端可用性 | Pass | Google Mobile-Friendly |
| 色彩对比度 | ≥4.5:1 | axe DevTools |
| 键盘可访问性 | 100% | 手动测试 |

**开发效率指标：**

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 组件复用率 | ≥55% | shadcn/ui复用35% + 修改样式20% |
| 开发时间节省 | ≥40% | vs 从零搭建UI |
| 代码质量 | A级 | 基于shadcn/ui的最佳实践 |

---

### 后续优化建议

**Phase 2增强（MVP后）：**

1. **AI对话式配置**
   - 通过自然语言配置API参数
   - 智能推荐API组合

2. **个性化推荐**
   - 基于使用历史推荐API
   - 机器学习优化定价

3. **协作功能**
   - 团队共享API Key
   - 使用量按成员拆分

4. **高级可视化**
   - 实时监控Dashboard
   - 自定义图表和报表

5. **白标店铺**（B2B2C模式）
   - 创作者开设API商店
   - 自定义域名和品牌

---

## Appendix

### Related Documents

- **Product Requirements**: `docs/PRD.md`（105个功能需求）
- **Product Brief**: `docs/product-brief-api-hub-2025-11-15.md`（产品愿景和市场定位）
- **Brainstorming**: `docs/bmm-brainstorming-session-2025-11-15.md`（75+创意想法）

### Core Interactive Deliverables

本UX设计规范通过视觉化协作创建，包含以下交互式交付物：

- **颜色主题可视化**: [ux-color-themes.html](./ux-color-themes.html)
  - 6种完整颜色主题方案
  - 实时UI组件预览（按钮、卡片、徽章）
  - 并排对比和语义化颜色应用
  - 主题推荐指数和适用场景说明

- **设计方向Mockup**: [ux-design-directions.html](./ux-design-directions.html)
  - 6种完整设计方向（Classic Dashboard、Modern Cards、Compact Pro、Visual Explorer、Command Center、Zen Minimal）
  - 每种方向包含3个关键页面的全屏mockup（Dashboard、API市场、API详情）
  - 设计哲学和适用场景详细说明
  - 交互式切换和对比

---

### Next Steps & Follow-Up Workflows

本UX设计规范可作为以下后续工作流的输入：

- **架构设计工作流** - 基于UX定义技术架构（下一步推荐）
- **Wireframe生成工作流** - 从用户旅程创建详细线框图
- **Figma设计工作流** - 通过MCP集成生成Figma设计稿
- **交互原型工作流** - 构建可点击的HTML原型
- **组件Showcase工作流** - 创建交互式组件库文档
- **AI前端提示工作流** - 生成用于v0、Lovable、Bolt等工具的提示词
- **前端开发启动** - 基于组件清单和设计系统开始编码

**推荐下一步：进入架构设计阶段**

UX设计已完成，建议立即启动架构设计工作流（`/bmad:bmm:workflows:architecture`），定义技术架构、数据模型、API设计和技术选型，为开发阶段做好准备。

---

### Version History

| Date       | Version | Changes                           | Author |
| ---------- | ------- | --------------------------------- | ------ |
| 2025-11-15 | 1.0     | Initial UX Design Specification   | BMad   |

---

_本UX设计规范通过协作式设计引导创建，而非模板填充。所有决策均基于项目需求、用户研究和最佳实践，并附有明确的理由说明。_