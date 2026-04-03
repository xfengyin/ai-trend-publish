#
# AI 智能体模板库 - Windows PowerShell 安装脚本
# 支持: Claude Code, Cursor, Aider, Windsurf
#

param(
    [string]$Target = "auto",
    [switch]$Help,
    [switch]$Version
)

# 版本信息
$ScriptVersion = "1.0.0"
$MinClaudeVersion = "0.2.0"

# 颜色输出
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }

# 日志配置
$LogDir = Join-Path $env:USERPROFILE ".ai-trend-publish\logs"
$LogFile = Join-Path $LogDir "install-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

# 创建日志目录
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Write-Log {
    param([string]$Level, [string]$Message)
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    "[$timestamp] [$Level] $Message" | Out-File -Append -FilePath $LogFile
}

# 欢迎信息
function Show-Welcome {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║        AI 智能体模板库 - Windows安装程序 v$ScriptVersion         ║" -ForegroundColor Cyan
    Write-Host "║                                                        ║" -ForegroundColor Cyan
    Write-Host "║   一站式中文AI智能体模板库，支持Claude/Cursor/Aider    ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

# 检测已安装的工具
function Get-InstalledTools {
    Write-Info "检测已安装的 AI 工具..."
    
    $tools = @()
    
    # Claude Code
    if (Get-Command "claude" -ErrorAction SilentlyContinue) {
        try {
            $version = & claude --version 2>$null | Select-String -Pattern '\d+\.\d+\.\d+' | ForEach-Object { $_.Matches[0].Value }
            $tools += "Claude Code ($version)"
        } catch {
            $tools += "Claude Code (已安装)"
        }
    }
    
    # Cursor
    $cursorPaths = @(
        "$env:LOCALAPPDATA\Programs\cursor\Cursor.exe",
        "$env:ProgramFiles\Cursor\Cursor.exe",
        "$env:USERPROFILE\AppData\Local\Programs\cursor\Cursor.exe"
    )
    $cursorInstalled = $cursorPaths | Where-Object { Test-Path $_ } | Select-Object -First 1
    if ($cursorInstalled) {
        $tools += "Cursor (已安装)"
    }
    
    # Aider
    if (Get-Command "aider" -ErrorAction SilentlyContinue) {
        try {
            $version = & aider --version 2>$null | Select-String -Pattern '\d+\.\d+\.\d+' | ForEach-Object { $_.Matches[0].Value }
            $tools += "Aider ($version)"
        } catch {
            $tools += "Aider (已安装)"
        }
    }
    
    # Windsurf
    $windsurfPaths = @(
        "$env:LOCALAPPDATA\Programs\windsurf\Windsurf.exe",
        "$env:ProgramFiles\Windsurf\Windsurf.exe"
    )
    $windsurfInstalled = $windsurfPaths | Where-Object { Test-Path $_ } | Select-Object -First 1
    if ($windsurfInstalled) {
        $tools += "Windsurf (已安装)"
    }
    
    if ($tools.Count -eq 0) {
        Write-Warning "未检测到任何支持的 AI 工具"
        Write-Info "推荐安装 Claude Code: npm install -g @anthropic-ai/claude-code"
    } else {
        Write-Success "检测到已安装的工具:"
        $tools | ForEach-Object { Write-Host "   • $_" }
    }
    
    Write-Host ""
    return $tools
}

# 获取目标目录
function Get-TargetDirectory {
    param([string]$Tool)
    
    switch ($Tool) {
        "claude" {
            if ($env:CLAUDE_AGENTS_PATH) {
                return $env:CLAUDE_AGENTS_PATH
            }
            return Join-Path $env:USERPROFILE ".claude\agents"
        }
        "cursor" {
            return Join-Path $env:USERPROFILE ".cursor\rules"
        }
        "aider" {
            return Join-Path $env:USERPROFILE ".aider\prompts"
        }
        "windsurf" {
            return Join-Path $env:USERPROFILE ".windsurf\rules"
        }
        default {
            return $null
        }
    }
}

# 安装智能体
function Install-Agents {
    param([string]$Tool)
    
    $targetDir = Get-TargetDirectory -Tool $Tool
    $scriptDir = Split-Path -Parent $MyInvocation.ScriptName
    $sourceDir = Split-Path -Parent $scriptDir
    
    Write-Info "安装智能体到 $Tool..."
    Write-Info "目标目录: $targetDir"
    Write-Log -Level "INFO" -Message "Installing to $Tool at $targetDir"
    
    # 创建目标目录
    try {
        New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    } catch {
        Write-Error "无法创建目录: $targetDir"
        Write-Log -Level "ERROR" -Message "Failed to create directory: $targetDir"
        return $false
    }
    
    # 复制智能体文件
    $categories = @("engineering", "design", "marketing", "product", "testing")
    $copiedCount = 0
    
    foreach ($category in $categories) {
        $categoryPath = Join-Path $sourceDir $category
        if (Test-Path $categoryPath) {
            $files = Get-ChildItem -Path $categoryPath -Filter "*.md" -File
            foreach ($file in $files) {
                $targetPath = Join-Path $targetDir $file.Name
                try {
                    Copy-Item -Path $file.FullName -Destination $targetPath -Force
                    $copiedCount++
                    Write-Log -Level "COPY" -Message "$category\$($file.Name) -> $targetPath"
                } catch {
                    Write-Warning "复制失败: $($file.Name)"
                    Write-Log -Level "ERROR" -Message "Failed to copy: $($file.Name)"
                }
            }
        }
    }
    
    Write-Success "已复制 $copiedCount 个智能体文件到 $Tool"
    return $true
}

# 交互式选择
function Select-ToolsInteractive {
    $options = @()
    
    # 检查各工具
    if (Get-Command "claude" -ErrorAction SilentlyContinue) {
        $options += @{ Name = "Claude Code (推荐)"; Tool = "claude" }
    }
    
    $cursorPaths = @(
        "$env:LOCALAPPDATA\Programs\cursor\Cursor.exe",
        "$env:ProgramFiles\Cursor\Cursor.exe"
    )
    if ($cursorPaths | Where-Object { Test-Path $_ }) {
        $options += @{ Name = "Cursor"; Tool = "cursor" }
    }
    
    if (Get-Command "aider" -ErrorAction SilentlyContinue) {
        $options += @{ Name = "Aider"; Tool = "aider" }
    }
    
    Write-Host "请选择要安装智能体的工具 (输入数字，多个用空格分隔):" -ForegroundColor Cyan
    Write-Host ""
    
    for ($i = 0; $i -lt $options.Count; $i++) {
        Write-Host "  $($i + 1)) $($options[$i].Name)"
    }
    Write-Host "  $($options.Count + 1)) 全部安装"
    Write-Host "  0) 跳过 (仅复制文件到当前目录)"
    Write-Host ""
    
    $choice = Read-Host "请输入选项"
    
    if ($choice -eq "0") {
        return
    }
    
    $selections = @()
    if ($choice -eq [string]($options.Count + 1)) {
        $selections = $options | ForEach-Object { $_.Tool }
    } else {
        $nums = $choice -split '\s+'
        foreach ($num in $nums) {
            $idx = [int]$num - 1
            if ($idx -ge 0 -and $idx -lt $options.Count) {
                $selections += $options[$idx].Tool
            }
        }
    }
    
    foreach ($tool in $selections) {
        Install-Agents -Tool $tool | Out-Null
    }
}

# 验证安装
function Test-Installation {
    Write-Info "验证安装..."
    
    $claudeDir = Join-Path $env:USERPROFILE ".claude\agents"
    $issues = 0
    
    if (Test-Path $claudeDir) {
        $count = (Get-ChildItem -Path $claudeDir -Filter "*.md" -File).Count
        if ($count -gt 0) {
            Write-Success "Claude Code: 已安装 $count 个智能体"
        } else {
            Write-Warning "Claude Code: 目录存在但无智能体文件"
            $issues++
        }
    }
    
    if ($issues -eq 0) {
        Write-Success "安装验证通过！"
    } else {
        Write-Warning "安装验证发现 $issues 个问题"
    }
}

# 显示使用说明
function Show-Usage {
    Write-Host ""
    Write-Success "安装完成！"
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Write-Host ""
    Write-Host "📖 快速开始:" -ForegroundColor Cyan
    Write-Host ""
    
    if (Get-Command "claude" -ErrorAction SilentlyContinue) {
        Write-Host "  Claude Code:"
        Write-Host "    PS> claude"
        Write-Host "    > 激活前端开发专家"
        Write-Host ""
    }
    
    Write-Host "📚 相关文档:" -ForegroundColor Cyan
    Write-Host "  • FAQ: .\FAQ.md"
    Write-Host "  • 工具兼容性: .\TOOLS_COMPATIBILITY.md"
    Write-Host "  • Windows指南: .\WINDOWS_SETUP.md"
    Write-Host ""
    Write-Host "🤝 参与贡献:" -ForegroundColor Cyan
    Write-Host "  查看 CONTRIBUTING.md 了解如何提交新智能体"
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Write-Host ""
    Write-Success "日志文件: $LogFile"
}

# 主函数
function Main {
    if ($Help) {
        Write-Host "AI 智能体模板库 - Windows 安装脚本" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "用法: .\install.ps1 [选项]" -ForegroundColor White
        Write-Host ""
        Write-Host "选项:" -ForegroundColor White
        Write-Host "  -Help          显示帮助信息"
        Write-Host "  -Version       显示版本信息"
        Write-Host "  -Target <tool> 指定安装目标 (claude|cursor|aider|all)"
        Write-Host ""
        exit 0
    }
    
    if ($Version) {
        Write-Host "v$ScriptVersion"
        exit 0
    }
    
    Show-Welcome
    
    # 检查目录
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $sourceDir = Split-Path -Parent $scriptDir
    if (-not (Test-Path (Join-Path $sourceDir "README.md"))) {
        Write-Error "请在 ai-trend-publish 仓库根目录运行此脚本"
        exit 1
    }
    
    # 检测工具
    Get-InstalledTools | Out-Null
    
    # 安装
    if ($Target -eq "auto") {
        Select-ToolsInteractive
    } else {
        $targets = switch ($Target) {
            "all" { @("claude", "cursor", "aider") }
            default { @($Target) }
        }
        foreach ($t in $targets) {
            Install-Agents -Tool $t | Out-Null
        }
    }
    
    # 验证
    Test-Installation
    
    # 显示使用说明
    Show-Usage
}

# 执行主函数
Main
