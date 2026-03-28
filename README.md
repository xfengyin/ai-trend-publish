# 🎭 AI 智能体模板库

> **各领域 AI 智能体模板集合** - 从前端开发专家到社区运营大师，从代码审查员到产品设计师。每个智能体都是经过精心设计、具备独特性格和专业能力的领域专家。

[![GitHub stars](https://img.shields.io/github/stars/xfengyin/ai-trend-publish?style=social)](https://github.com/xfengyin/ai-trend-publish)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![欢迎贡献](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

---

## 🚀 这是什么？

**AI 智能体模板库** 是一套精心设计的 AI 智能体角色定义集合。每个智能体：

- **🎯 专业定位**：深耕特定领域（不是通用助手）
- **🧠 性格鲜明**：独特的沟通风格和个性
- **📋 交付导向**：实际的代码、流程和可衡量成果
- **✅ 实战验证**：经过测试的工作流和成功指标

**类比**：组建你的梦之队，只不过他们是永不休息、永不抱怨、永远交付的 AI 专家。

---

## ⚡ 快速开始

### 方式 1：用于 Claude Code（推荐）

```bash
# 复制智能体到 Claude Code 目录
cp -r agent-templates-cn/* ~/.claude/agents/

# 在 Claude Code 中激活智能体：
# "嘿 Claude，激活前端开发模式，帮我构建一个 React 组件"
```

### 方式 2：作为参考使用

每个智能体文件包含：
- 身份与性格特征
- 核心使命与工作流程
- 技术交付物（含代码示例）
- 成功指标与沟通风格

浏览下方智能体列表，复制/适配你需要的！

### 方式 3：用于其他工具（Cursor、Aider、Windsurf 等）

```bash
# 生成各工具的集成文件
./scripts/convert.sh

# 交互式安装（自动检测已安装工具）
./scripts/install.sh
```

---

## 🎨 智能体目录

### 💻 工程开发部

构建未来，一次提交一个世界。

| 智能体 | 专长 | 使用场景 |
|--------|------|----------|
| 🎨 [前端开发专家](engineering/engineering-frontend-developer.md) | React/Vue/Angular、UI实现、性能优化 | 现代 Web 应用、像素级 UI、Core Web Vitals |
| 🏗️ [后端架构师](engineering/engineering-backend-architect.md) | API设计、数据库架构、可扩展性 | 服务端系统、微服务、云基础设施 |
| 📱 [移动端开发者](engineering/engineering-mobile-app-builder.md) | iOS/Android、React Native、Flutter | 原生和跨平台移动应用 |
| 🤖 [AI 工程师](engineering/engineering-ai-engineer.md) | ML模型、部署、AI集成 | 机器学习功能、数据管道、AI应用 |
| 🚀 [DevOps 自动化专家](engineering/engineering-devops-automator.md) | CI/CD、基础设施自动化、云运维 | 管道开发、部署自动化、监控 |
| ⚡ [快速原型师](engineering/engineering-rapid-prototyper.md) | 快速POC开发、MVP | 概念验证、黑客马拉松项目、快速迭代 |
| 🔒 [安全工程师](engineering/engineering-security-engineer.md) | 威胁建模、安全代码审查、安全架构 | 应用安全、漏洞评估、安全CI/CD |
| 👁️ [代码审查员](engineering/engineering-code-reviewer.md) | 建设性代码审查、安全、可维护性 | PR审查、代码质量门禁 |
| 🗄️ [数据库优化专家](engineering/engineering-database-optimizer.md) | Schema设计、查询优化、索引策略 | PostgreSQL/MySQL调优、慢查询调试 |
| 🌿 [Git 工作流大师](engineering/engineering-git-workflow-master.md) | 分支策略、规范提交、高级Git | Git工作流设计、历史清理 |
| 🏛️ [软件架构师](engineering/engineering-software-architect.md) | 系统设计、DDD、架构模式 | 架构决策、领域建模 |
| 🛡️ [SRE 专家](engineering/engineering-sre.md) | SLO、错误预算、可观测性 | 生产可靠性、容量规划 |
| 🔧 [数据工程师](engineering/engineering-data-engineer.md) | 数据管道、湖仓架构、ETL/ELT | 数据基础设施建设 |
| 🔗 [飞书集成开发者](engineering/engineering-feishu-integration-developer.md) | 飞书开放平台、机器人、工作流 | 飞书生态集成开发 |

### 🎨 设计创意部

让用户体验真正为人设计。

| 智能体 | 专长 | 使用场景 |
|--------|------|----------|
| 🎨 [品牌守护者](design/design-brand-guardian.md) | 品牌一致性、视觉规范 | 品牌资产管理、视觉审计 |
| 🖼️ [图像提示工程师](design/design-image-prompt-engineer.md) | AI图像生成、提示词优化 | Midjourney/DALL-E 图像创作 |
| 🎭 [趣味注入器](design/design-whimsy-injector.md) | 创意注入、用户体验惊喜 | 增加产品趣味性和个性 |
| 📐 [无障碍视觉专家](design/design-inclusive-visuals-specialist.md) | 无障碍设计、包容性体验 | WCAG合规、特殊用户群体 |
| 🧭 [UX 导航设计师](design/design-ux-navigation-designer.md) | 用户流程、导航架构 | 用户体验优化、交互设计 |

### 📈 营销增长部

驱动增长，建立连接。

| 智能体 | 专长 | 使用场景 |
|--------|------|----------|
| 📊 [Reddit 社区运营](marketing/marketing-reddit-community-builder.md) | Reddit生态、社区增长、内容策略 | 社区建设、karma增长 |
| 📝 [SEO 内容专家](marketing/marketing-seo-content-writer.md) | SEO优化、内容策略、关键词研究 | 搜索引擎优化、内容创作 |
| 🔗 [链接建设专家](marketing/marketing-link-builder.md) | 外链策略、合作伙伴关系 | SEO外链建设 |
| 📱 [社交媒体运营](marketing/marketing-social-media-manager.md) | 社媒策略、内容日历、互动管理 | 跨平台社交媒体运营 |
| 📧 [邮件营销专家](marketing/marketing-email-marketing-specialist.md) | 邮件序列、自动化、A/B测试 | 邮件营销 campaigns |

### 📦 产品管理部

从想法到产品。

| 智能体 | 专长 | 使用场景 |
|--------|------|----------|
| 📋 [产品经理](product/product-product-manager.md) | 产品规划、用户需求、路线图 | 产品全生命周期管理 |
| 📊 [数据分析师](product/product-data-analyst.md) | 数据分析、指标定义、报告 | 产品数据分析、用户洞察 |
| 🎯 [竞品分析师](product/product-competitive-analyst.md) | 竞品研究、市场定位 | 市场竞争分析 |
| 📝 [需求分析师](product/product-requirements-analyst.md) | 需求收集、规格定义 | 产品需求文档编写 |

### 🧪 测试质量部

质量是团队的责任。

| 智能体 | 专长 | 使用场景 |
|--------|------|----------|
| 🧪 [自动化测试工程师](testing/testing-automation-engineer.md) | 测试自动化、CI集成 | 自动化测试管道 |
| 🔍 [QA 分析师](testing/testing-qa-analyst.md) | 手动测试、Bug追踪、质量报告 | 功能测试、质量保证 |
| 📊 [性能测试专家](testing/testing-performance-engineer.md) | 性能基准、负载测试 | 性能优化验证 |

---

## 🤝 如何贡献

欢迎贡献新的智能体或改进现有模板！详见 [贡献指南](CONTRIBUTING.md)。

### 创建新智能体

1. Fork 本仓库
2. 选择合适的分类目录
3. 按照模板结构创建智能体文件
4. 在真实场景测试
5. 提交 Pull Request

### 智能体模板结构

```yaml
---
name: 智能体名称
description: 一句话描述
color: 颜色名或十六进制色值
---
```

## 智能体名称

### 🧠 身份与记忆
- **角色**：清晰的角色描述
- **性格**：性格特点与沟通风格
- **记忆**：需要记住的内容
- **经验**：领域专业能力

### 🎯 核心使命
- 核心职责（含明确交付物）
- **默认要求**：遵循最佳实践

### 🚨 关键规则
领域专属规则与约束

### 📋 技术交付物
代码示例、模板、框架、文档

### 🔄 工作流程
分步骤流程

### 💭 沟通风格
沟通方式和示例话术

### 🎯 成功指标
可量化的成果

---

## 📚 资源

- [贡献指南](CONTRIBUTING.md) - 如何贡献新智能体
- [示例：前端开发专家](engineering/engineering-frontend-developer.md) - 结构规范的智能体示例
- [示例：Reddit 社区运营](marketing/marketing-reddit-community-builder.md) - 性格塑造优秀示例

---

## 🎉 致谢

本项目基于 [agency-agents](https://github.com/msitarzewski/agency-agents) 项目汉化改编。

感谢所有贡献者让这个智能体库变得更好！

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

_每个智能体都是一个独特的角色，为你的项目带来专业能力和个性。选择你需要的，开始构建！_