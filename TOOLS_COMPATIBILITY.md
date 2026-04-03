# 🔧 工具兼容性说明

> AI 智能体模板库支持的开发工具及配置方法

---

## 📊 支持矩阵

| 工具 | 支持状态 | 版本要求 | 安装难度 | 推荐指数 |
|------|----------|----------|----------|----------|
| [Claude Code](#claude-code) | ✅ 完全支持 | ≥ 0.2.0 | ⭐ 简单 | ⭐⭐⭐⭐⭐ |
| [Cursor](#cursor) | ✅ 支持 | ≥ 0.45.0 | ⭐ 简单 | ⭐⭐⭐⭐ |
| [Aider](#aider) | ✅ 支持 | ≥ 0.60.0 | ⭐⭐ 中等 | ⭐⭐⭐⭐ |
| [Windsurf](#windsurf) | ⚠️ 部分支持 | ≥ 1.0.0 | ⭐ 简单 | ⭐⭐⭐ |
| [DeepSeek](#deepseek) | ⚠️ 实验性 | API 模式 | ⭐⭐ 中等 | ⭐⭐ |
| [豆包](#豆包) | ⚠️ 实验性 | 网页版 | ⭐⭐ 中等 | ⭐⭐ |

---

## 🤖 Claude Code (推荐)

### 简介
Anthropic 官方推出的 AI 编程助手，直接在终端中使用

### 安装
```bash
npm install -g @anthropic-ai/claude-code
```

### 配置智能体
```bash
# 一键安装
./scripts/install.sh

# 或手动复制
cp -r engineering/* ~/.claude/agents/
```

### 使用方法
```bash
# 启动 Claude Code
claude

# 在对话中激活智能体
"激活前端开发专家模式"
"切换到产品经理视角"
```

### 特性
- ✅ 原生支持智能体目录结构
- ✅ 支持动态加载/切换智能体
- ✅ 上下文保持最完整
- ✅ 支持多文件编辑

---

## ✨ Cursor

### 简介
基于 VS Code 的 AI 编程编辑器，集成 GPT-4/Claude 模型

### 安装
1. 下载: [cursor.com](https://cursor.com)
2. 安装并登录

### 配置智能体
```bash
# 生成 Cursor 格式
./scripts/convert.sh cursor

# 手动配置:
# 1. 打开 Cursor Settings
# 2. 进入 AI > Custom Rules
# 3. 粘贴转换后的规则
```

### 使用方法
在 `.cursorrules` 文件中定义项目级规则：
```bash
# 在项目根目录创建
cat > .cursorrules << 'EOF'
[粘贴转换后的智能体内容]
EOF
```

### 特性
- ✅ 良好的 IDE 集成
- ✅ 支持项目级规则配置
- ⚠️ 需手动转换格式
- ⚠️ 单文件规则限制

---

## 🔌 Aider

### 简介
终端中的 AI 结对编程工具，支持多文件编辑和 Git 集成

### 安装
```bash
pip install aider-chat
# 或
pipx install aider-chat
```

### 配置智能体
```bash
# 生成 Aider 格式
./scripts/convert.sh aider

# 配置方式1: 系统提示词
export AIDER_SYSTEM_PROMPT="$(cat engineering/engineering-frontend-developer.md)"

# 配置方式2: 会话中使用
aider --message "请扮演前端开发专家角色: $(cat engineering/engineering-frontend-developer.md | head -50)"
```

### 使用方法
```bash
# 启动时指定角色
aider --system-prompt-file path/to/agent.md

# 或在会话中切换
/add 添加相关文件
"作为后端架构师，设计这个 API"
```

### 特性
- ✅ 强大的 Git 集成
- ✅ 支持多文件编辑
- ✅ 可自定义系统提示词
- ⚠️ 需要手动配置

---

## 🌊 Windsurf

### 简介
Codeium 推出的 AI 编程工具，支持 Agent 模式

### 安装
1. 下载: [codeium.com/windsurf](https://codeium.com/windsurf)
2. 安装并登录

### 配置智能体
```bash
# 生成 Windsurf 格式
./scripts/convert.sh windsurf

# 在设置中配置
# Settings > AI > Custom Instructions
```

### 使用方法
```bash
# 创建 .windsurfrules 文件
cat > .windsurfrules << 'EOF'
[粘贴转换后的智能体内容]
EOF
```

### 特性
- ✅ Agent 模式支持
- ⚠️ 规则配置较简单
- ⚠️ 部分智能体特性不支持

---

## 🐋 DeepSeek

### 简介
深度求索推出的 AI 大模型，支持 API 调用

### 安装
无需安装，通过 API 调用：
```bash
pip install openai  # 使用 OpenAI 兼容接口
```

### 配置智能体
```python
import openai

client = openai.OpenAI(
    api_key="your-deepseek-api-key",
    base_url="https://api.deepseek.com"
)

# 读取智能体定义
with open("engineering/engineering-frontend-developer.md", "r") as f:
    system_prompt = f.read()

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "创建一个 React 按钮组件"}
    ]
)
```

### 使用方法
- 通过 API 将智能体内容作为 system prompt
- 或使用 DeepSeek 的网页版对话

### 特性
- ✅ 中文理解能力强
- ✅ 推理能力优秀
- ⚠️ 需通过 API 使用
- ⚠️ 工具集成有限

---

## 🟢 豆包

### 简介
字节跳动推出的 AI 助手，支持编程场景

### 安装
访问 [doubao.com](https://doubao.com) 网页版使用

### 配置智能体
1. 打开豆包网页版
2. 创建新对话
3. 在系统提示词区域粘贴智能体定义

### 使用方法
```
【系统提示词】
[粘贴智能体文件内容]

【用户输入】
请帮我设计一个登录页面
```

### 特性
- ✅ 中文优化良好
- ⚠️ 暂不支持文件操作
- ⚠️ 需要手动粘贴提示词

---

## 🔄 格式转换

### 转换脚本使用
```bash
# 查看支持的格式
./scripts/convert.sh --help

# 转换为 Cursor 格式
./scripts/convert.sh cursor < engineering/engineering-frontend-developer.md > frontend.cursor.md

# 转换为 Aider 格式  
./scripts/convert.sh aider < engineering/engineering-frontend-developer.md > frontend.aider.md

# 批量转换
./scripts/convert.sh cursor --batch engineering/
```

### 转换规则

| 原始格式 | Cursor | Aider | Windsurf |
|----------|--------|-------|----------|
| Front Matter | 注释 | YAML头部 | 注释 |
| Markdown 结构 | 保留 | 保留 | 简化 |
| 代码块 | 保留 | 保留 | 保留 |
| 表情符号 | 保留 | 保留 | 保留 |

---

## 🎯 选择建议

### 初学者
**推荐**: Claude Code → Cursor
- 安装简单
- 社区支持好
- 智能体原生支持

### 专业开发者
**推荐**: Claude Code + Aider
- 强大的代码编辑能力
- Git 工作流集成
- 多文件操作支持

### 国内用户
**推荐**: DeepSeek + 豆包
- 国内访问稳定
- 中文优化好
- 符合国内使用习惯

---

## 🐛 常见问题

### Q: 为什么我的工具不支持某些智能体特性

A: 不同工具的提示词解析能力不同，建议：
1. 使用转换脚本适配格式
2. 简化过于复杂的提示词
3. 查阅工具的官方文档

### Q: 可以同时使用多个工具吗

A: 可以！智能体定义是通用的，只需：
1. 为每个工具单独配置
2. 保持核心定义一致
3. 根据工具特性微调格式

### Q: 新增工具支持如何反馈

A: 欢迎提交 Issue 或 PR：
1. 描述工具的基本信息
2. 提供配置方法
3. 附上测试用例

---

> 📖 **详细配置示例** 请参考各工具官方文档及本仓库 examples/ 目录
