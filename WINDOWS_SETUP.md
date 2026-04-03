# 🪟 Windows 安装指南

> AI 智能体模板库 Windows 系统完整配置教程

---

## 📋 前置要求

- Windows 10/11 (64位)
- PowerShell 5.1+ 或 PowerShell 7+
- Git for Windows (可选但推荐)

---

## 🚀 快速开始 (推荐)

### 方式1: PowerShell 脚本安装

```powershell
# 1. 克隆仓库
git clone https://github.com/xfengyin/ai-trend-publish.git
cd ai-trend-publish

# 2. 运行安装脚本
.\scripts\install.ps1

# 3. 根据提示完成配置
```

### 方式2: 手动安装

```powershell
# 1. 创建 Claude Code 目录 (如果存在)
$agentsDir = "$env:USERPROFILE\.claude\agents"
New-Item -ItemType Directory -Force -Path $agentsDir

# 2. 复制智能体文件
Copy-Item -Path ".\engineering\*.md" -Destination $agentsDir -Recurse
Copy-Item -Path ".\design\*.md" -Destination $agentsDir -Recurse
Copy-Item -Path ".\marketing\*.md" -Destination $agentsDir -Recurse
Copy-Item -Path ".\product\*.md" -Destination $agentsDir -Recurse
Copy-Item -Path ".\testing\*.md" -Destination $agentsDir -Recurse

# 3. 验证安装
Get-ChildItem $agentsDir
```

---

## 🛠️ 各工具 Windows 配置

### Claude Code

#### 安装
```powershell
# 需要 Node.js 16+
npm install -g @anthropic-ai/claude-code
```

#### 配置智能体目录
```powershell
# 默认路径
$env:CLAUDE_AGENTS_PATH = "$env:USERPROFILE\.claude\agents"

# 添加到环境变量 (永久)
[Environment]::SetEnvironmentVariable("CLAUDE_AGENTS_PATH", $env:CLAUDE_AGENTS_PATH, "User")
```

#### 验证
```powershell
claude --version
claude config get agentsPath
```

---

### Cursor

#### 安装
1. 下载: [cursor.com](https://cursor.com)
2. 运行安装程序
3. 登录账号

#### 配置项目规则
```powershell
# 在项目根目录创建 .cursorrules
@"
# 前端开发专家模式

## 身份
你是精通现代前端框架的界面实现专家

## 规则
1. 使用 TypeScript
2. 遵循 React 最佳实践
3. 确保组件可测试
"@ | Out-File -FilePath ".cursorrules" -Encoding UTF8
```

#### 全局配置
```powershell
# 配置文件路径
$cursorConfig = "$env:APPDATA\Cursor\User\globalStorage\state.vscdb"

# 使用转换脚本生成配置
.\scripts\convert.sh cursor | Out-File -FilePath "$env:USERPROFILE\.cursor\rules.md" -Encoding UTF8
```

---

### Aider

#### 安装
```powershell
# 方式1: pip
pip install aider-chat

# 方式2: pipx (推荐)
pipx install aider-chat

# 方式3: 独立安装
# 下载 Windows 二进制文件并添加到 PATH
```

#### 配置环境变量
```powershell
# 设置 OpenAI API Key
[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "your-api-key", "User")

# 或使用其他模型
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "your-key", "User")
```

#### 使用智能体
```powershell
# 读取智能体文件
$systemPrompt = Get-Content "engineering\engineering-frontend-developer.md" -Raw

# 启动 Aider 并加载智能体
$env:AIDER_SYSTEM_PROMPT = $systemPrompt
aider
```

---

### Windsurf

#### 安装
1. 下载: [codeium.com/windsurf](https://codeium.com/windsurf)
2. 运行安装程序
3. 使用 Codeium 账号登录

#### 配置
```powershell
# 创建项目规则文件
$windsurfRules = @"
# AI 智能体规则

## 前端开发专家
- 使用 React + TypeScript
- 遵循组件化设计
- 确保代码可维护
"@

$windsurfRules | Out-File -FilePath ".windsurfrules" -Encoding UTF8
```

---

## 🔧 环境检查

### 运行检查脚本
```powershell
.\scripts\check.ps1
```

### 手动检查
```powershell
# 检查必要工具
$tools = @("git", "node", "npm", "python", "pip")
foreach ($tool in $tools) {
    $exists = Get-Command $tool -ErrorAction SilentlyContinue
    if ($exists) {
        Write-Host "✅ $tool 已安装" -ForegroundColor Green
    } else {
        Write-Host "❌ $tool 未安装" -ForegroundColor Red
    }
}

# 检查 Claude Code
if (Get-Command "claude" -ErrorAction SilentlyContinue) {
    Write-Host "✅ Claude Code 已安装" -ForegroundColor Green
    claude --version
} else {
    Write-Host "❌ Claude Code 未安装" -ForegroundColor Red
}

# 检查智能体目录
$agentsDir = "$env:USERPROFILE\.claude\agents"
if (Test-Path $agentsDir) {
    $count = (Get-ChildItem $agentsDir -Filter "*.md").Count
    Write-Host "✅ 智能体目录存在，包含 $count 个智能体" -ForegroundColor Green
} else {
    Write-Host "❌ 智能体目录不存在" -ForegroundColor Red
}
```

---

## 📁 目录结构 (Windows)

```
%USERPROFILE%/
├── .claude/
│   └── agents/           # Claude Code 智能体
│       ├── engineering-frontend-developer.md
│       ├── engineering-backend-architect.md
│       └── ...
├── .cursor/
│   └── rules.md          # Cursor 规则文件
├── .aider/
│   └── prompts/          # Aider 提示词
└── .windsurf/
    └── rules/            # Windsurf 规则
```

---

## 🐛 常见问题

### 问题1: PowerShell 执行策略限制

**错误**: `无法加载文件，因为在此系统上禁止运行脚本`

**解决**:
```powershell
# 临时允许 (当前会话)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# 永久允许当前用户 (需管理员权限)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

### 问题2: 路径包含空格导致的问题

**解决**:
```powershell
# 使用引号包裹路径
$path = "C:\Users\User Name\.claude\agents"
Copy-Item "*.md" "$path"

# 或使用短路径
$shortPath = (Get-Item $path).FullName
```

---

### 问题3: 中文显示乱码

**解决**:
```powershell
# 设置 UTF-8 编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 或在脚本开头添加
chcp 65001
```

---

### 问题4: 找不到 Claude Code 配置目录

**解决**:
```powershell
# 手动创建目录
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\agents"

# 检查环境变量
Get-ChildItem Env: | Where-Object { $_.Name -like "*CLAUDE*" }
```

---

## 🔄 更新与卸载

### 更新智能体
```powershell
# 拉取最新代码
git pull origin main

# 重新安装
.\scripts\install.ps1
```

### 卸载
```powershell
# 使用卸载脚本
.\scripts\uninstall.ps1

# 或手动删除
Remove-Item -Recurse -Force "$env:USERPROFILE\.claude\agents"
```

---

## 💡 最佳实践

1. **使用 PowerShell 7+** - 性能更好，兼容性更佳
2. **保持路径简洁** - 避免中文和特殊字符
3. **定期备份** - 将自定义智能体保存到云盘
4. **使用 Git** - 跟踪智能体的修改历史

---

## 📞 获取帮助

- 📖 查看 [FAQ.md](./FAQ.md) 常见问题
- 🔧 参考 [TOOLS_COMPATIBILITY.md](./TOOLS_COMPATIBILITY.md) 工具兼容性
- 🐛 在 GitHub Issues 提交问题

---

> 💪 Windows 用户也能享受完整的 AI 智能体体验！
