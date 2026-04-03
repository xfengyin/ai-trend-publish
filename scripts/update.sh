#!/bin/bash
#
# AI 智能体模板库 - 更新脚本
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
    echo "AI 智能体模板库 - 更新脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --help, -h     显示帮助信息"
    echo "  --skip-git     跳过 git pull，仅重新安装"
    echo "  --force        强制更新，覆盖本地修改"
    echo ""
}

# 获取当前版本
get_current_version() {
    if git rev-parse --git-dir > /dev/null 2>&1; then
        git describe --tags --always 2>/dev/null || git rev-parse --short HEAD
    else
        echo "unknown"
    fi
}

# 获取远程版本
get_remote_version() {
    git fetch origin --quiet 2>/dev/null
    git describe --tags --always origin/main 2>/dev/null || echo "unknown"
}

# 检查更新
check_update() {
    local current=$(get_current_version)
    local remote=$(get_remote_version)
    
    info "当前版本: $current"
    info "远程版本: $remote"
    
    if [[ "$current" == "$remote" ]]; then
        success "已是最新版本！"
        return 1
    else
        info "发现新版本，准备更新..."
        return 0
    fi
}

# 主函数
main() {
    local skip_git=false
    local force=false
    
    # 解析参数
    for arg in "$@"; do
        case "$arg" in
            --help|-h)
                show_help
                exit 0
                ;;
            --skip-git)
                skip_git=true
                ;;
            --force)
                force=true
                ;;
        esac
    done
    
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════╗"
    echo "║        AI 智能体模板库 - 更新程序       ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    
    # 检查是否在 git 仓库中
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        error "当前目录不是 git 仓库"
        info "请确保在 ai-trend-publish 仓库根目录运行此脚本"
        exit 1
    fi
    
    # 检查更新
    if [[ "$skip_git" == false ]]; then
        if ! check_update; then
            exit 0
        fi
    fi
    
    # 拉取最新代码
    if [[ "$skip_git" == false ]]; then
        info "拉取最新代码..."
        if [[ "$force" == true ]]; then
            git reset --hard origin/main
        else
            git pull origin main
        fi
        success "代码更新完成"
    fi
    
    # 重新安装
    info "重新安装智能体..."
    if [[ -f "scripts/install.sh" ]]; then
        ./scripts/install.sh
    else
        error "安装脚本不存在"
        exit 1
    fi
    
    success "更新完成！"
    echo ""
    info "查看更新日志:"
    git log --oneline -5
}

main "$@"
