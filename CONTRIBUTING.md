# 🤝 贡献指南

> 感谢你愿意为 AI 智能体模板库贡献力量！

---

## 🚀 5步极简贡献流程

```bash
# 1. Fork 本仓库（点击右上角的 Fork 按钮）

# 2. 克隆你的 Fork
git clone https://github.com/YOUR_USERNAME/ai-trend-publish.git
cd ai-trend-publish

# 3. 创建分支
git checkout -b add-agent-name

# 4. 创建/修改智能体文件，提交更改
git add .
git commit -m "Add: [智能体名称] specialist"

# 5. 推送并提交 Pull Request
git push origin add-agent-name
# 然后在 GitHub 上点击 "Compare & pull request"
```

---

## 📋 智能体提交检查清单

在提交 Pull Request 前，请确保：

### ✅ 基础要求
- [ ] 智能体文件位于正确的分类目录（engineering/design/marketing/product/testing）
- [ ] 文件名格式：`领域缩写-角色名称.md`，如 `engineering-frontend-developer.md`
- [ ] 文件使用 UTF-8 编码
- [ ] 无语法错误和错别字

### ✅ Front Matter
- [ ] 包含 `name`、`description`、`color` 三个必填字段
- [ ] `name` 简洁有力（不超过10个字）
- [ ] `description` 一句话描述，30字以内
- [ ] `color` 使用有效的十六进制色值，如 `"#3178c6"`

### ✅ 内容质量
- [ ] 角色定义清晰，非通用型助手
- [ ] 有独特的性格特征
- [ ] 包含至少 2 个代码/模板示例
- [ ] 工作流程分步骤清晰
- [ ] 成功指标可量化

### ✅ 测试验证
- [ ] 在 Claude Code/Cursor/Aider 中测试过
- [ ] 智能体能按预期响应
- [ ] 代码示例可直接运行

---

## 🎨 智能体设计规范

### 文件结构

```yaml
---
name: 智能体名称
description: 一句话描述
color: "#十六进制色值"
---

# [图标] [智能体名称]

### 🧠 身份与记忆
- **角色**：清晰的定位
- **性格**：沟通风格
- **记忆**：需要记住的内容

### 🎯 核心使命
1. **职责一**：具体描述
2. **职责二**：具体描述

### 🚨 关键规则
- 规则一
- 规则二

### 📋 技术交付物
```代码示例```

### 🔄 工作流程
1. 步骤一
2. 步骤二

### 💭 沟通风格
- 典型话术一
- 典型话术二

### 🎯 成功指标
- 指标一
- 指标二
```

### 设计原则

1. 🎭 **鲜明性格** - 赋予独特语气和人设
2. 📋 **明确交付物** - 提供可落地的代码示例
3. ✅ **成功指标** - 包含具体、可量化的指标
4. 🔄 **验证工作流** - 分步流程清晰
5. 💡 **学习记忆** - 定义需要记住的上下文

### 优秀智能体标准

- ✅ 专精、深入的领域定位
- ✅ 独特性格与语气
- ✅ 具体的代码/模板示例
- ✅ 可量化的成功指标
- ✅ 分步工作流程
- ✅ 真实场景测试

**避免：**
- ❌ 通用型"有用助手"人设
- ❌ 模糊的"我会帮你"描述
- ❌ 无代码示例、无交付物
- ❌ 范围过宽

---

## 📁 文件命名规范

| 分类 | 目录 | 命名示例 |
|------|------|----------|
| 工程开发 | `engineering/` | `engineering-frontend-developer.md` |
| 设计创意 | `design/` | `design-brand-guardian.md` |
| 营销增长 | `marketing/` | `marketing-seo-content-writer.md` |
| 产品管理 | `product/` | `product-product-manager.md` |
| 测试质量 | `testing/` | `testing-automation-engineer.md` |

---

## 📝 空白模板文件

为方便快速创建，可以直接复制以下内容：

```markdown
---
name: 
description: 
color: "#000000"
difficulty: 初级
tags: []
---

# [图标] [智能体名称]

### 🧠 身份与记忆

- **角色**：
- **性格**：
- **记忆**：

### 🎯 核心使命

1. **职责一**：
2. **职责二**：

**默认要求**：

### 🚨 关键规则

-
-

### 📋 技术交付物

```
代码示例
```

### 🔄 工作流程

1. 
2. 
3. 

### 💭 沟通风格

-
-

### 🎯 成功指标

-
-

### 💡 使用示例

**场景**：

**用户输入**：
```
```

**智能体响应**：
```
```
```

---

## 🏷️ Good First Issue

如果你是第一次贡献，可以从以下类型开始：

| 标签 | 说明 | 难度 |
|------|------|:----:|
| `good first issue` | 适合新手的简单任务 | 🟢 |
| `documentation` | 文档改进 | 🟢 |
| `typo` | 错别字修复 | 🟢 |
| `enhancement` | 功能增强 | 🟡 |
| `new agent` | 新智能体 | 🟡 |

在 [Issues](https://github.com/xfengyin/ai-trend-publish/issues) 页面搜索这些标签！

---

## 🔄 Pull Request 流程

### 提交前

- **测试智能体**：在真实场景使用
- **遵循模板**：与现有结构保持一致
- **补充示例**：至少 2-3 个代码示例
- **定义指标**：包含具体成功标准
- **校对检查**：检查错别字、格式

### PR 标题规范

```
Add: [智能体名称] specialist
Update: [智能体名称] - 更新说明
Fix: [问题描述]
Docs: [文档更新说明]
```

### PR 描述模板

```markdown
## 描述
简要说明这个 PR 做了什么

## 变更类型
- [ ] 新增智能体
- [ ] 改进现有智能体
- [ ] 文档更新
- [ ] Bug 修复

## 检查清单
- [ ] 已测试智能体效果
- [ ] 包含代码示例
- [ ] 无错别字
- [ ] 遵循模板结构

## 截图（可选）
如有 UI 相关变更，附上截图
```

### 审查流程

1. **自动检查**：CI 会检查格式和链接
2. **人工审查**：维护者会审查内容质量
3. **反馈修改**：根据反馈修改
4. **合并发布**：通过审查后合并到 main 分支

---

## 📐 风格指南

### 写作风格

- **具体明确**：写"页面加载速度降低 60%"
- **落地务实**：写"用 TypeScript 编写 React 组件"
- **让人记住**：赋予性格，避免官话
- **实用可用**：提供真实代码

### 格式规范

- 统一使用 Markdown
- 章节标题使用表情符号 🎯🧠📋
- 代码块开启语法高亮
- 用表格对比选项
- 用**粗体**强调重点

---

## 💬 社区交流

- 💡 **有想法？** 在 [Discussions](https://github.com/xfengyin/ai-trend-publish/discussions) 分享
- 🐛 **发现问题？** 提交 [Issue](https://github.com/xfengyin/ai-trend-publish/issues)
- 🙋 **需要帮助？** 查看 [FAQ.md](./FAQ.md)

---

## 📄 行为准则

- **保持尊重**：友善对待每一个人
- **包容多元**：欢迎不同背景的参与者
- **乐于协作**：共同创造的成果远胜单打独斗
- **专业严谨**：聚焦于优化智能体

---

## 🎉 再次感谢！

你的每一份贡献都在让智能体库变得更好！

---

**准备好了？** [🚀 开始贡献](https://github.com/xfengyin/ai-trend-publish/fork)
