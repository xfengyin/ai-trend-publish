#!/bin/bash
#
# AI 智能体模板库 - 环境检查脚本
#

set -euo pipefail

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
header() { echo -e "${CYAN}$1${NC}"; }

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

# 检查命令是否存在
check_command() {
    local cmd="$1"
    local min_version="${2:-}"
    
    if command -v "$cmd" >/dev/null 2>&1; then
        local version="unknown"
        
        case "$cmd" in
            claude)
                version=$(claude --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
                ;;
            aider)
                version=$(aider --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
                ;;
            node|npm)
                version=$($cmd --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
                ;;
            python|python3)
                version=$($cmd --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
                ;;
            git)
                version=$(git --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
                ;;
        esac
        
        if [[ -n "$min_version" && "$version" != "unknown" ]]; then
            version_compare "$version" "$min_version"
            local result=$?
            if [[ $result -eq 2 ]]; then
                warning "$cmd 已安装 (v$version)，但建议版本 >= $min_version"
            else
                success "$cmd 已安装 (v$version)"
            fi
        else
            success "$cmd 已安装${version:+ (v$version)}"
        fi
        
        return 0
    else
        error "$cmd 未安装"
        return 1
    fi
}

# 检查目录
check_directory() {
    local dir="$1"
    local name="$2"
    
    if [[ -d "$dir" ]]; then
        local count=$(find "$dir" -name "*.md" -type f 2>/dev/null | wc -l)
        if [[ $count -gt 0 ]]; then
            success "$name: $dir ($count 个文件)"
        else
            warning "$name: $dir (空目录)"
        fi
    else
        error "$name: 目录不存在 ($dir)"
    fi
}

# 检查权限
check_permissions() {
    local dir="$1"
    
    if [[ -d "$dir" ]]; then
        if [[ -r "$dir" && -w "$dir" ]]; then
            success "目录权限正常: $dir"
        else
            warning "目录权限受限: $dir"
            info "建议运行: chmod 755 $dir"
        fi
    fi
}

# 主函数
main() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════╗"
    echo "║        AI 智能体模板库 - 环境检查       ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    
    local issues=0
    
    # 检查基础工具
    header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    header "📦 基础工具"
    header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    check_command "git" "2.0.0" || ((issues++))
    check_command "node" "16.0.0" || ((issues++))
    check_command "npm" "8.0.0" || ((issues++))
    
    echo ""
    
    # 检查 AI 工具
    header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    header "🤖 AI 编程工具"
    header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    check_command "claude" "0.2.0"
    check_command "aider" "0.60.0"
    
    # 检查 GUI 工具
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if [[ -d "/Applications/Cursor.app" ]]; then
            success "Cursor 已安装 (macOS)"
        fi
        if [[ -d "/Applications/Windsurf.app" ]]; then
            success "Windsurf 已安装 (macOS)"
        fi
    fi
    
    echo ""
    
    # 检查智能体目录
    header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    header "📁 智能体目录"
    header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    check_directory "${HOME}/.claude/agents" "Claude Code"
    check_directory "${HOME}/.cursor/rules" "Cursor"
    check_directory "${HOME}/.aider/prompts" "Aider"
    check_directory "${HOME}/.windsurf/rules" "Windsurf"
    
    echo ""
    
    # 检查权限
    header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    header "🔐 权限检查"
    header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    check_permissions "${HOME}/.claude"
    check_permissions "${HOME}/.claude/agents" 2>/dev/null || true
    
    echo ""
    
    # 检查仓库
    header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    header "📚 仓库状态"
    header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    if [[ -f "README.md" ]] && [[ -d "engineering" ]]; then
        success "当前目录是有效的 ai-trend-publish 仓库"
        
        # 统计智能体数量
        local total=0
        for category in engineering design marketing product testing; do
            if [[ -d "$category" ]]; then
                local count=$(find "$category" -name "*.md" -type f 2>/dev/null | wc -l)
                info "$category: $count 个智能体"
                ((total += count))
            fi
        done
        echo ""
        success "总计: $total 个智能体"
        
        # Git 状态
        if git rev-parse --git-dir > /dev/null 2>&1; then
            echo ""
            local branch=$(git branch --show-current)
            local commit=$(git rev-parse --short HEAD)
            info "Git 分支: $branch"
            info "当前提交: $commit"
            
            # 检查是否有更新
            git fetch origin --quiet 2>/dev/null || true
            local behind=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo "0")
            if [[ "$behind" -gt 0 ]]; then
                warning "落后于远程 $behind 个提交，建议运行: ./scripts/update.sh"
                ((issues++))
            else
                success "已是最新代码"
            fi
        fi
    else
        error "当前目录不是有效的 ai-trend-publish 仓库"
        ((issues++))
    fi
    
    echo ""
    header "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # 总结
    echo ""
    if [[ $issues -eq 0 ]]; then
        success "🎉 环境检查通过！一切正常。"
    else
        warning "⚠️  发现 $issues 个问题，建议修复后再使用。"
    fi
    echo ""
}

main "$@"
