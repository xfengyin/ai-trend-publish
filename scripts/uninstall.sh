#!/bin/bash
#
# AI 智能体模板库 - 卸载脚本
#

set -euo pipefail

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }

# 显示帮助
show_help() {
    echo "AI 智能体模板库 - 卸载脚本"
    echo ""
    echo "用法: $0 [选项] [工具]"
    echo ""
    echo "工具:"
    echo "  claude    卸载 Claude Code 的智能体"
    echo "  cursor    卸载 Cursor 的规则"
    echo "  aider     卸载 Aider 的提示词"
    echo "  windsurf  卸载 Windsurf 的规则"
    echo "  all       卸载所有 (默认)"
    echo ""
    echo "选项:"
    echo "  --help, -h     显示帮助信息"
    echo "  --dry-run      模拟运行，不实际删除"
    echo ""
}

# 获取目标目录
get_target_dir() {
    local tool="$1"
    case "$tool" in
        claude)
            echo "${CLAUDE_AGENTS_PATH:-${HOME}/.claude/agents}"
            ;;
        cursor)
            echo "${HOME}/.cursor/rules"
            ;;
        aider)
            echo "${HOME}/.aider/prompts"
            ;;
        windsurf)
            echo "${HOME}/.windsurf/rules"
            ;;
    esac
}

# 统计文件数量
count_files() {
    local dir="$1"
    if [[ -d "$dir" ]]; then
        find "$dir" -name "*.md" -type f 2>/dev/null | wc -l
    else
        echo "0"
    fi
}

# 卸载指定工具
uninstall_tool() {
    local tool="$1"
    local dry_run="${2:-false}"
    local target_dir=$(get_target_dir "$tool")
    
    info "检查 $tool 智能体..."
    
    if [[ ! -d "$target_dir" ]]; then
        warning "$tool: 目录不存在 ($target_dir)"
        return
    fi
    
    local count=$(count_files "$target_dir")
    
    if [[ $count -eq 0 ]]; then
        warning "$tool: 未找到智能体文件"
        return
    fi
    
    echo "  位置: $target_dir"
    echo "  文件数: $count"
    
    if [[ "$dry_run" == "true" ]]; then
        info "[模拟] 将删除: $target_dir/*.md"
        return
    fi
    
    # 确认删除
    read -p "  确认删除? [y/N] " confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        rm -f "$target_dir"/*.md
        success "$tool: 已删除 $count 个智能体文件"
        
        # 如果目录为空，询问是否删除目录
        if [[ -z "$(ls -A "$target_dir" 2>/dev/null)" ]]; then
            read -p "  目录为空，是否删除目录? [y/N] " remove_dir
            if [[ "$remove_dir" =~ ^[Yy]$ ]]; then
                rmdir "$target_dir"
                success "已删除空目录: $target_dir"
            fi
        fi
    else
        info "$tool: 已取消删除"
    fi
}

# 主函数
main() {
    local dry_run="false"
    local target="all"
    
    # 解析参数
    for arg in "$@"; do
        case "$arg" in
            --help|-h)
                show_help
                exit 0
                ;;
            --dry-run)
                dry_run="true"
                info "模拟运行模式 - 不会实际删除文件"
                ;;
            claude|cursor|aider|windsurf|all)
                target="$arg"
                ;;
        esac
    done
    
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════╗"
    echo "║        AI 智能体模板库 - 卸载程序       ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    
    # 执行卸载
    if [[ "$target" == "all" ]]; then
        for tool in claude cursor aider windsurf; do
            uninstall_tool "$tool" "$dry_run"
            echo ""
        done
    else
        uninstall_tool "$target" "$dry_run"
    fi
    
    success "卸载操作完成！"
}

main "$@"
