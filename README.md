# 🎭 AI 智能体模板库

> **一站式中文AI智能体模板库，支持Claude/Cursor/Aider，开箱即用**

<p align="center">
  <a href="https://github.com/xfengyin/ai-trend-publish/stargazers">
    <img src="https://img.shields.io/github/stars/xfengyin/ai-trend-publish?style=social" alt="Stars">
  </a>
  <a href="https://github.com/xfengyin/ai-trend-publish/network/members">
    <img src="https://img.shields.io/github/forks/xfengyin/ai-trend-publish?style=social" alt="Forks">
  </a>
  <a href="https://github.com/xfengyin/ai-trend-publish/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/xfengyin/ai-trend-publish" alt="Contributors">
  </a>
  <a href="https://github.com/xfengyin/ai-trend-publish/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/xfengyin/ai-trend-publish" alt="License">
  </a>
  <a href="https://github.com/xfengyin/ai-trend-publish/commits/main">
    <img src="https://img.shields.io/github/last-commit/xfengyin/ai-trend-publish" alt="Last Commit">
  </a>
</p>

<p align="center">
  <a href="#-快速开始">🚀 快速开始</a> •
  <a href="#-智能体目录">📚 智能体</a> •
  <a href="#-工具支持">🔧 工具</a> •
  <a href="#-常见问题">❓ FAQ</a> •
  <a href="#-参与贡献">🤝 贡献</a>
</p>

---

## 👀 快速预览

<!-- GIF预览区 - 待添加演示视频/GIF -->
<p align="center">
  <img src="https://via.placeholder.com/800x400/3178c6/ffffff?text=AI智能体演示+待添加" alt="演示预览" width="800">
  <br>
  <sub>💡 在 Claude Code 中激活前端开发专家，一句话生成完整组件</sub>
</p>

---

## 🚀 这是什么？

**AI 智能体模板库** 是一套精心设计的 AI 智能体角色定义集合，专为中文开发者优化：

- **🎯 专业定位** - 深耕特定领域（不是通用助手）
- **🧠 性格鲜明** - 独特的沟通风格和个性
- **📋 交付导向** - 实际的代码、流程和可衡量成果
- **✅ 开箱即用** - 一条命令完成安装配置
- **🇨🇳 中文优化** - 针对国内开发者场景深度定制

**类比**：组建你的梦之队，只不过他们是永不休息、永不抱怨、永远交付的 AI 专家。

---

## ⚡ 快速开始

### 1️⃣ 克隆仓库
```bash
git clone https://github.com/xfengyin/ai-trend-publish.git
cd ai-trend-publish
```

### 2️⃣ 一键安装
```bash
# macOS/Linux
./scripts/install.sh

# Windows (PowerShell)
.\scripts\install.ps1
```

### 3️⃣ 开始对话
```bash
# 启动 Claude Code
claude

# 激活智能体
"激活前端开发专家，帮我创建一个登录表单"
```

> 💡 **Windows 用户?** 查看 [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) 获取详细配置指南

---

## 🔧 工具支持

| 工具 | 状态 | 安装命令 |
|------|------|----------|
| **Claude Code** | ✅ 完全支持 | `npm i -g @anthropic-ai/claude-code` |
| **Cursor** | ✅ 支持 | [下载安装](https://cursor.com) |
| **Aider** | ✅ 支持 | `pip install aider-chat` |
| **Windsurf** | ⚠️ 部分支持 | [下载安装](https://codeium.com/windsurf) |
| **DeepSeek** | ⚠️ 实验性 | API 接入 |
| **豆包** | ⚠️ 实验性 | 网页版 |

> 📖 详细配置方法请查看 [TOOLS_COMPATIBILITY.md](./TOOLS_COMPATIBILITY.md)

---

## 🎨 智能体目录

### 💻 工程开发部

| 智能体 | 难度 | 场景 | 说明 |
|--------|:----:|:----:|------|
| 🎨 [前端开发专家](engineering/engineering-frontend-developer.md) | 🟡 | Web | React/Vue/Angular、UI实现、性能优化 |
| 🏗️ [后端架构师](engineering/engineering-backend-architect.md) | 🔴 | 后端 | API设计、数据库架构、可扩展性 |
| 🤖 [AI 工程师](engineering/engineering-ai-engineer.md) | 🔴 | AI | ML模型、部署、AI集成 |
| 🚀 [DevOps 自动化专家](engineering/engineering-devops-automator.md) | 🟡 | 运维 | CI/CD、基础设施自动化、云运维 |
| 👁️ [代码审查员](engineering/engineering-code-reviewer.md) | 🟡 | 工程 | 建设性代码审查、安全、可维护性 |
| 🔗 [飞书集成开发者](engineering/engineering-feishu-integration-developer.md) | 🟡 | Web | 飞书开放平台、机器人、工作流 |
| 🐋 [DeepSeek适配工程师](engineering/engineering-deepseek-adapter.md) | 🟡 | AI | DeepSeek模型集成与优化 |

### 🎨 设计创意部

| 智能体 | 难度 | 场景 | 说明 |
|--------|:----:|:----:|------|
| 🎨 [品牌守护者](design/design-brand-guardian.md) | 🟢 | 设计 | 品牌一致性、视觉规范 |
| 🖼️ [图像提示工程师](design/design-image-prompt-engineer.md) | 🟡 | AI | Midjourney/DALL-E 提示词优化 |

### 📈 营销增长部

| 智能体 | 难度 | 场景 | 说明 |
|--------|:----:|:----:|------|
| 📝 [SEO 内容专家](marketing/marketing-seo-content-writer.md) | 🟡 | Web | SEO优化、内容策略、关键词研究 |
| 📱 [微信公众号运营](marketing/marketing-wechat-operator.md) | 🟢 | 移动 | 公众号内容策划、排版、涨粉策略 |
| 🎵 [抖音内容创作者](marketing/marketing-douyin-creator.md) | 🟡 | 移动 | 短视频脚本、热点追踪、运营策略 |

### 📦 产品管理部

| 智能体 | 难度 | 场景 | 说明 |
|--------|:----:|:----:|------|
| 📋 [产品经理](product/product-product-manager.md) | 🟡 | 产品 | 产品规划、用户需求、路线图 |
| 🔗 [钉钉集成产品专家](product/product-dingtalk-integration.md) | 🟡 | Web | 钉钉生态产品设计与集成 |

### 🧪 测试质量部

| 智能体 | 难度 | 场景 | 说明 |
|--------|:----:|:----:|------|
| 🧪 [自动化测试工程师](testing/testing-automation-engineer.md) | 🟡 | 工程 | 测试自动化、CI集成 |

> 🏷️ **难度说明**: 🟢 初级 | 🟡 中级 | 🔴 高级

---

## 📋 智能体模板结构

每个智能体都遵循统一的标准结构：

```yaml
---
name: 智能体名称
description: 一句话描述
color: "#十六进制色值"
difficulty: 初级|中级|高级
tags: [标签1, 标签2]
---

# 🧠 身份与记忆
- **角色**: 清晰的角色描述
- **性格**: 性格特点与沟通风格

# 🎯 核心使命
- 核心职责与交付物
- 成功指标

# 📋 技术交付物
- 代码示例
- 工作模板

# 🔄 工作流程
1. 步骤一
2. 步骤二
3. 步骤三
```

> 📖 创建新智能体? 参考 [TEMPLATE.md](./TEMPLATE.md)

---

## ❓ 常见问题

### 安装失败怎么办？
```bash
# 检查环境
./scripts/check.sh

# 查看详细错误日志
cat logs/install.log
```

### 智能体不生效？
1. 确认工具版本符合要求
2. 检查智能体文件是否正确复制到目录
3. 查看 [FAQ.md](./FAQ.md) 获取更多解决方案

### 支持哪些 AI 工具？
目前完全支持 Claude Code、Cursor、Aider，实验性支持 Windsurf、DeepSeek、豆包。详见 [TOOLS_COMPATIBILITY.md](./TOOLS_COMPATIBILITY.md)

> 🔍 更多问题? 查看 [FAQ.md](./FAQ.md)

---

## 🤝 参与贡献

欢迎贡献新的智能体或改进现有模板！

### 5步极简贡献流程

1. **Fork** 本仓库
2. **创建** 新分支 `git checkout -b add-agent-name`
3. **添加** 智能体文件（遵循 [TEMPLATE.md](./TEMPLATE.md)）
4. **测试** 在真实场景验证
5. **提交** Pull Request

### 智能体提交检查清单
- [ ] 包含 Front Matter (name/description/color)
- [ ] 定义清晰的身份与性格
- [ ] 提供至少 2 个代码/模板示例
- [ ] 包含可量化的成功指标
- [ ] 经过真实场景测试

> 📖 详细指南请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📚 资源

| 文档 | 说明 |
|------|------|
| [FAQ.md](./FAQ.md) | 常见问题解答 |
| [TOOLS_COMPATIBILITY.md](./TOOLS_COMPATIBILITY.md) | 工具兼容性说明 |
| [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) | Windows 安装指南 |
| [TEMPLATE.md](./TEMPLATE.md) | 智能体标准模板 |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | 贡献指南 |

---

## 🎉 致谢

本项目基于 [agency-agents](https://github.com/msitarzewski/agency-agents) 项目汉化改编。

感谢所有贡献者让这个智能体库变得更好！

<a href="https://github.com/xfengyin/ai-trend-publish/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=xfengyin/ai-trend-publish" alt="Contributors" />
</a>

---

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

---

<p align="center">
  <sub>🌟 如果这个项目对你有帮助，请点亮 Star 支持我们！</sub>
</p>

<p align="center">
  <a href="https://github.com/xfengyin/ai-trend-publish">🏠 GitHub 仓库</a> •
  <a href="https://github.com/xfengyin/ai-trend-publish/issues">🐛 提交 Issue</a> •
  <a href="https://github.com/xfengyin/ai-trend-publish/discussions">💬 社区讨论</a>
</p>

---

_每个智能体都是一个独特的角色，为你的项目带来专业能力和个性。选择你需要的，开始构建！_
