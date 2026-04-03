# ❓ 常见问题解答 (FAQ)

> 使用 AI 智能体模板库时可能遇到的问题及解决方案

---

## 📥 安装相关问题

### Q1: 执行安装命令提示"Permission denied"

**问题**: 运行 `./scripts/install.sh` 时提示权限不足

**解决方案**:
```bash
# 添加执行权限
chmod +x scripts/install.sh

# 再次运行
./scripts/install.sh
```

**Windows用户**: 使用 PowerShell 运行 `install.ps1` 脚本

---

### Q2: 安装后智能体没有生效

**问题**: 安装完成后，在 Claude Code 或其他工具中无法识别智能体

**可能原因及解决方案**:

1. **路径问题**
   ```bash
   # 检查 Claude Code 目录
   ls -la ~/.claude/agents/
   
   # 如果目录不存在，手动创建
   mkdir -p ~/.claude/agents/
   ```

2. **文件格式问题**
   - 确保智能体文件使用 `.md` 扩展名
   - 检查文件是否包含有效的 Front Matter

3. **工具版本问题**
   ```bash
   # 检查 Claude Code 版本
   claude --version
   
   # 更新到最新版本
   npm update -g @anthropic-ai/claude-code
   ```

---

### Q3: Windows 系统如何安装

**问题**: Windows 用户不知道如何使用

**解决方案**:
1. 使用 PowerShell 执行安装脚本：
   ```powershell
   .\scripts\install.ps1
   ```
2. 或手动复制智能体文件到对应目录
3. 详见 [WINDOWS_SETUP.md](./WINDOWS_SETUP.md)

---

## 🛠️ 工具兼容性问题

### Q4: 哪些 AI 工具支持这些智能体

| 工具 | 支持状态 | 说明 |
|------|----------|------|
| Claude Code | ✅ 完全支持 | 推荐首选 |
| Cursor | ✅ 支持 | 需手动配置 |
| Aider | ✅ 支持 | 配置方式不同 |
| Windsurf | ⚠️ 部分支持 | 功能有限 |
| DeepSeek | ⚠️ 部分支持 | 需适配 |
| 豆包 | ⚠️ 实验性支持 | 持续更新中 |

详见 [TOOLS_COMPATIBILITY.md](./TOOLS_COMPATIBILITY.md)

---

### Q5: 智能体在不同工具中表现不一致

**问题**: 同一个智能体在 Claude Code 中工作正常，但在其他工具中效果不佳

**原因**: 不同工具对智能体提示词的解析方式略有差异

**解决方案**:
1. 使用本仓库提供的格式转换脚本：
   ```bash
   ./scripts/convert.sh cursor    # 转换为 Cursor 格式
   ./scripts/convert.sh aider     # 转换为 Aider 格式
   ```
2. 根据目标工具的文档手动调整提示词格式

---

## 📝 智能体使用问题

### Q6: 如何选择合适的智能体

**建议流程**:
1. 明确你的需求场景（开发/设计/营销/产品/测试）
2. 根据部门分类浏览智能体目录
3. 查看智能体的"使用场景"描述
4. 从 [engineering-frontend-developer](./engineering/engineering-frontend-developer.md) 等示例开始

**难度参考**:
- 🟢 初级：通用型智能体，适合新手
- 🟡 中级：需要一定领域知识
- 🔴 高级：专业领域，需要深入理解

---

### Q7: 智能体的输出不符合预期

**可能原因**:
1. **上下文不足** - 提供更多信息给 AI
2. **需求不明确** - 使用智能体建议的提问格式
3. **超出能力范围** - 检查智能体的专长描述

**改进建议**:
- 参考智能体文档中的"示例话术"
- 提供更具体的背景信息
- 分步骤提问，而非一次性提出复杂需求

---

### Q8: 可以修改智能体的性格或规则吗

**回答**: 可以！智能体模板是起点，你可以：
1. 复制模板到本地后修改
2. 在对话中要求 AI 调整风格
3. 创建自己的变体版本并提交 PR

---

## 🤝 贡献相关问题

### Q9: 如何提交新的智能体

**步骤**:
1. Fork 本仓库
2. 在对应分类目录创建 `.md` 文件
3. 遵循 [TEMPLATE.md](./TEMPLATE.md) 格式
4. 提交 Pull Request

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)

---

### Q10: 提交 PR 后多久会被合并

**时间线**:
- 一般审查：3-5 个工作日
- 简单修复：1-2 个工作日
- 复杂新功能：5-10 个工作日

**加速技巧**:
- 确保通过所有 CI 检查
- 提供详细的测试说明
- 附上使用截图或示例

---

## 🔧 技术问题

### Q11: 如何更新到最新版本

```bash
# 方法1: 使用更新脚本
./scripts/update.sh

# 方法2: 手动更新
cd ai-trend-publish
git pull origin main
./scripts/install.sh
```

---

### Q12: 如何卸载智能体

```bash
# 使用卸载脚本
./scripts/uninstall.sh

# 或手动删除
rm -rf ~/.claude/agents/*
```

---

### Q13: 环境检查命令是什么

```bash
# 运行环境检查
./scripts/check.sh

# 检查内容:
# - 支持的 AI 工具是否安装
# - 智能体目录是否正确配置
# - 文件权限是否正常
```

---

## 🌐 其他问题

### Q14: 是否支持英文或其他语言

**当前状态**: 本仓库主打中文智能体，但：
- 智能体可以与英文内容交互
- 欢迎提交其他语言版本的 PR
- 部分智能体支持多语言输出

---

### Q15: 如何获取帮助

**渠道**:
1. 查看本文档和项目 Wiki
2. 在 GitHub Issues 中搜索类似问题
3. 创建新的 Issue 并贴上详细描述
4. 加入社区讨论区交流

---

## 🐛 已知问题

| 问题 | 状态 | 预计修复 |
|------|------|----------|
| Windsurf 工具集成不完善 | 🔧 进行中 | v1.2.0 |
| Windows 路径处理偶尔异常 | 🔧 进行中 | v1.1.5 |
| 部分智能体响应过长 | 📋 计划 | v1.3.0 |

---

> 💡 **还有问题？** 欢迎在 [GitHub Issues](https://github.com/xfengyin/ai-trend-publish/issues) 提问！
