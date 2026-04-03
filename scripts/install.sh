#!/bin/bash
#
# AI 智能体模板库 - 增强版安装脚本
# 支持: Claude Code, Cursor, Aider, Windsurf
#

set -euo pipefail

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志配置
LOG_DIR="${HOME}/.ai-trend-publish/logs"
LOG_FILE="${LOG_DIR}/install-$(date +%Y%m%d-%H%M%S).log"

# 版本信息
SCRIPT_VERSION="1.0.0"
MIN_CLAUDE_VERSION="0.2.0"

# 创建日志目录
mkdir -p "$LOG_DIR"

# 日志函数
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
    log "INFO" "$1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
    log "SUCCESS" "$1"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    log "WARNING" "$1"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    log "ERROR" "$1"
}

# 错误处理
error_exit() {
    error "$1"
    error "安装失败。查看日志: $LOG_FILE"
    exit 1
}

# 版本比较
version_compare() {
    local v1="$1"
    local v2="$2"
    
    if [[ "$v1" == "$v2" ]]; then
        return 0
    fi
    
    local IFS=.
    local i ver1=($v1) ver2=($v2)
    
    for ((i=0; i<${#ver1[@]}; i++)); do
        if [[ -z ${ver2[i]} ]]; then
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]})); then
            return 1
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]})); then
            return 2
        fi
    done
    return 0
}

# 检测操作系统
detect_os() {
    local os="unknown"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        os="macos"
    elif [[ "$OSTYPE" == "linux"* ]]; then
        os="linux"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        os="windows"
    fi
    echo "$os"
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查工具版本
check_tool_version() {
    local tool="$1"
    local min_version="$2"
    
    if ! command_exists "$tool"; then
        echo "not_installed"
        return
    fi
    
    local version
    case "$tool" in
        claude)
            version=$(claude --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
            ;;
        cursor)
            # Cursor 版本检查较复杂，简化处理
            version="installed"
            ;;
        aider)
            version=$(aider --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
            ;;
        *)
            version="unknown"
            ;;
    esac
    
    echo "${version:-unknown}"
}

# 打印欢迎信息
print_welcome() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║        AI 智能体模板库 - 安装程序 v${SCRIPT_VERSION}           ║"
    echo "║                                                        ║"
    echo "║   一站式中文AI智能体模板库，支持Claude/Cursor/Aider    ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

# 检测已安装的工具
detect_installed_tools() {
    info "检测已安装的 AI 工具..."
    
    local tools_detected=()
    
    if command_exists "claude"; then
        local version=$(check_tool_version "claude" "$MIN_CLAUDE_VERSION")
        tools_detected+=("Claude Code ($version)")
    fi
    
    if command_exists "cursor" || [[ -d "/Applications/Cursor.app" ]] || [[ -d "$HOME/Applications/Cursor.app" ]]; then
        tools_detected+=("Cursor (已安装)")
    fi
    
    if command_exists "aider"; then
        local version=$(check_tool_version "aider" "0.60.0")
        tools_detected+=("Aider ($version)")
    fi
    
    if command_exists "windsurf" || [[ -d "/Applications/Windsurf.app" ]]; then
        tools_detected+=("Windsurf (已安装)")
    fi
    
    if [[ ${#tools_detected[@]} -eq 0 ]]; then
        warning "未检测到任何支持的 AI 工具"
        info "推荐安装 Claude Code: npm install -g @anthropic-ai/claude-code"
    else
        success "检测到已安装的工具:"
        for tool in "${tools_detected[@]}"; do
            echo "   • $tool"
        done
    fi
    
    echo ""
}

# 获取安装目标目录
get_target_dir() {
    local tool="$1"
    local os=$(detect_os)
    local target_dir=""
    
    case "$tool" in
        claude)
            if [[ -n "${CLAUDE_AGENTS_PATH:-}" ]]; then
                target_dir="$CLAUDE_AGENTS_PATH"
            else
                target_dir="${HOME}/.claude/agents"
            fi
            ;;
        cursor)
            target_dir="${HOME}/.cursor/rules"
            ;;
        aider)
            target_dir="${HOME}/.aider/prompts"
            ;;
        windsurf)
            target_dir="${HOME}/.windsurf/rules"
            ;;
    esac
    
    echo "$target_dir"
}

# 安装智能体到指定工具
install_to_tool() {
    local tool="$1"
    local target_dir=$(get_target_dir "$tool")
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local source_dir="$(dirname "$script_dir")"
    
    info "安装智能体到 $tool..."
    info "目标目录: $target_dir"
    
    # 创建目标目录
    if ! mkdir -p "$target_dir"; then
        error_exit "无法创建目录: $target_dir"
    fi
    
    # 复制智能体文件
    local categories=("engineering" "design" "marketing" "product" "testing")
    local copied_count=0
    
    for category in "${categories[@]}"; do
        local category_path="${source_dir}/${category}"
        if [[ -d "$category_path" ]]; then
            # 复制 Markdown 文件
            for file in "$category_path"/*.md; do
                if [[ -f "$file" ]]; then
                    local filename=$(basename "$file")
                    if cp "$file" "${target_dir}/${filename}"; then
                        ((copied_count++))
                        log "COPY" "$category/$filename -> $target_dir/$filename"
                    else
                        warning "复制失败: $filename"
                    fi
                fi
            done
        fi
    done
    
    success "已复制 $copied_count 个智能体文件到 $tool"
    
    # 设置文件权限
    if [[ "$tool" == "claude" ]]; then
        chmod -R 644 "${target_dir}"/*.md 2>/dev/null || true
    fi
}

# 交互式选择工具
select_tools_interactive() {
    local options=()
    local selections=()
    
    echo "请选择要安装智能体的工具 (空格分隔，如 1 2 3):"
    echo ""
    
    local idx=1
    if command_exists "claude"; then
        echo "  $idx) Claude Code (推荐)"
        options+=("claude")
        ((idx++))
    fi
    
    if command_exists "cursor" || [[ -d "/Applications/Cursor.app" ]]; then
        echo "  $idx) Cursor"
        options+=("cursor")
        ((idx++))
    fi
    
    if command_exists "aider"; then
        echo "  $idx) Aider"
        options+=("aider")
        ((idx++))
    fi
    
    if command_exists "windsurf" || [[ -d "/Applications/Windsurf.app" ]]; then
        echo "  $idx) Windsurf"
        options+=("windsurf")
        ((idx++))
    fi
    
    echo "  $idx) 全部安装"
    echo "  0) 跳过 (仅复制文件到当前目录)"
    echo ""
    
    read -p "请输入选项 [1-$idx 或 0]: " choice
    
    if [[ "$choice" == "0" ]]; then
        return
    elif [[ "$choice" == "$idx" ]]; then
        selections=("${options[@]}")
    else
        for num in $choice; do
            if [[ "$num" =~ ^[0-9]+$ ]] && ((num >= 1 && num < idx)); then
                selections+=("${options[$((num-1))]}")
            fi
        done
    fi
    
    for tool in "${selections[@]}"; do
        install_to_tool "$tool"
    done
}

# 验证安装
verify_installation() {
    info "验证安装..."
    
    local claude_dir="${HOME}/.claude/agents"
    local issues=0
    
    if [[ -d "$claude_dir" ]]; then
        local count=$(find "$claude_dir" -name "*.md" | wc -l)
        if [[ $count -gt 0 ]]; then
            success "Claude Code: 已安装 $count 个智能体"
        else
            warning "Claude Code: 目录存在但无智能体文件"
            ((issues++))
        fi
    fi
    
    if [[ $issues -eq 0 ]]; then
        success "安装验证通过！"
    else
        warning "安装验证发现 $issues 个问题"
    fi
}

# 打印使用说明
print_usage() {
    echo ""
    echo -e "${GREEN}🎉 安装完成！${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📖 快速开始:"
    echo ""
    
    if command_exists "claude"; then
        echo "  Claude Code:"
        echo "    $ claude"
        echo "    > 激活前端开发专家"
        echo ""
    fi
    
    echo "📚 相关文档:"
    echo "  • FAQ: ./FAQ.md"
    echo "  • 工具兼容性: ./TOOLS_COMPATIBILITY.md"
    echo "  • Windows指南: ./WINDOWS_SETUP.md"
    echo ""
    echo "🤝 参与贡献:"
    echo "  查看 CONTRIBUTING.md 了解如何提交新智能体"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    success "日志文件: $LOG_FILE"
}

# 主函数
main() {
    print_welcome
    
    # 检查是否在正确的目录
    if [[ ! -f "README.md" ]] || [[ ! -d "engineering" ]]; then
        error_exit "请在 ai-trend-publish 仓库根目录运行此脚本"
    fi
    
    # 检测已安装的工具
    detect_installed_tools
    
    # 交互式选择或自动安装
    if [[ -t 0 ]]; then
        select_tools_interactive
    else
        # 非交互模式，自动安装到 Claude Code
        if command_exists "claude"; then
            install_to_tool "claude"
        fi
    fi
    
    # 验证安装
    verify_installation
    
    # 打印使用说明
    print_usage
}

# 处理命令行参数
case "${1:-}" in
    --help|-h)
        echo "AI 智能体模板库 - 安装脚本"
        echo ""
        echo "用法: $0 [选项]"
        echo ""
        echo "选项:"
        echo "  --help, -h     显示帮助信息"
        echo "  --version, -v  显示版本信息"
        echo "  claude         仅安装到 Claude Code"
        echo "  cursor         仅安装到 Cursor"
        echo "  aider          仅安装到 Aider"
        echo "  all            安装到所有检测到的工具"
        echo ""
        exit 0
        ;;
    --version|-v)
        echo "v${SCRIPT_VERSION}"
        exit 0
        ;;
    claude|cursor|aider|windsurf)
        print_welcome
        install_to_tool "$1"
        verify_installation
        print_usage
        exit 0
        ;;
    all)
        print_welcome
        for tool in claude cursor aider windsurf; do
            if command_exists "$tool" || [[ -d "/Applications/$(echo $tool | sed 's/.*/\u&/').app" ]]; then
                install_to_tool "$tool"
            fi
        done
        verify_installation
        print_usage
        exit 0
        ;;
esac

# 运行主函数
main
