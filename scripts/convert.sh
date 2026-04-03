#!/bin/bash
#
# AI 智能体模板库 - 格式转换脚本
# 支持转换为不同 AI 工具的格式
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

# 显示帮助
show_help() {
    echo "AI 智能体模板库 - 格式转换工具"
    echo ""
    echo "用法:"
    echo "  $0 <format> [input-file]        转换单个文件"
    echo "  $0 <format> --batch <dir>       批量转换目录"
    echo "  cat file.md | $0 <format>       从管道读取"
    echo ""
    echo "支持的格式:"
    echo "  cursor       Cursor IDE 格式 (.cursorrules)"
    echo "  aider        Aider 提示词格式"
    echo "  windsurf     Windsurf 规则格式"
    echo "  openai       OpenAI API 系统提示格式"
    echo "  clean        清理 Front Matter，仅保留内容"
    echo ""
    echo "示例:"
    echo "  $0 cursor engineering/engineering-frontend-developer.md"
    echo "  $0 aider --batch engineering/"
    echo "  cat agent.md | $0 cursor > agent.cursor.md"
    echo ""
}

# 转换为 Cursor 格式
convert_cursor() {
    local content="$1"
    local filename="$2"
    
    # 提取 Front Matter
    local name=$(echo "$content" | grep "^name:" | sed 's/name: //' | head -1)
    local description=$(echo "$content" | grep "^description:" | sed 's/description: //' | head -1)
    
    # 输出 Cursor 格式
    cat << EOF
# AI 角色: $name

> $description

## 角色定义

$content

## 使用说明

在对话开始时明确激活此角色：
"请以$name的身份帮助我..."
EOF
}

# 转换为 Aider 格式
convert_aider() {
    local content="$1"
    local filename="$2"
    
    # Aider 使用简单的系统提示词格式
    cat << EOF
# System Prompt

$content

# Instructions

Please act according to the role defined above. Maintain the specified personality and follow the workflows and rules outlined in the role definition.
EOF
}

# 转换为 Windsurf 格式
convert_windsurf() {
    local content="$1"
    local filename="$2"
    
    # Windsurf 格式较简单，主要是规则列表
    cat << EOF
# AI Rules

$content

Remember to always follow the guidelines and maintain the specified communication style.
EOF
}

# 转换为 OpenAI API 格式
convert_openai() {
    local content="$1"
    local filename="$2"
    
    # 提取关键信息
    local name=$(echo "$content" | grep "^name:" | sed 's/name: //' | head -1)
    
    # 清理后的内容（移除 YAML front matter 分隔符）
    local clean_content=$(echo "$content" | sed '/^---$/,/^---$/d')
    
    # 输出为适合 OpenAI API 的格式
    echo "$clean_content"
}

# 清理格式（仅保留内容）
convert_clean() {
    local content="$1"
    
    # 移除 Front Matter
    echo "$content" | sed '/^---$/,/^---$/d' | sed '/^name:/d' | sed '/^description:/d' | sed '/^color:/d'
}

# 处理单个文件
process_file() {
    local format="$1"
    local input_file="$2"
    local output_file="${3:-}"
    
    if [[ ! -f "$input_file" ]]; then
        error "文件不存在: $input_file"
        return 1
    fi
    
    local content=$(cat "$input_file")
    local filename=$(basename "$input_file")
    
    # 根据格式转换
    local result=""
    case "$format" in
        cursor)
            result=$(convert_cursor "$content" "$filename")
            ;;
        aider)
            result=$(convert_aider "$content" "$filename")
            ;;
        windsurf)
            result=$(convert_windsurf "$content" "$filename")
            ;;
        openai)
            result=$(convert_openai "$content" "$filename")
            ;;
        clean)
            result=$(convert_clean "$content")
            ;;
        *)
            error "不支持的格式: $format"
            return 1
            ;;
    esac
    
    # 输出结果
    if [[ -n "$output_file" ]]; then
        echo "$result" > "$output_file"
        success "已转换: $input_file -> $output_file"
    else
        echo "$result"
    fi
}

# 批量转换
batch_convert() {
    local format="$1"
    local input_dir="$2"
    local output_dir="${3:-${input_dir}/${format}}"
    
    if [[ ! -d "$input_dir" ]]; then
        error "目录不存在: $input_dir"
        return 1
    fi
    
    mkdir -p "$output_dir"
    
    local count=0
    for file in "$input_dir"/*.md; do
        if [[ -f "$file" ]]; then
            local filename=$(basename "$file" .md)
            local output_file="${output_dir}/${filename}.${format}.md"
            process_file "$format" "$file" "$output_file"
            ((count++))
        fi
    done
    
    success "批量转换完成: $count 个文件 -> $output_dir"
}

# 主函数
main() {
    # 检查参数
    if [[ $# -lt 1 ]] || [[ "$1" == "--help" ]] || [[ "$1" == "-h" ]]; then
        show_help
        exit 0
    fi
    
    local format="$1"
    shift
    
    # 支持的格式
    local valid_formats=("cursor" "aider" "windsurf" "openai" "clean")
    local valid=false
    for f in "${valid_formats[@]}"; do
        if [[ "$f" == "$format" ]]; then
            valid=true
            break
        fi
    done
    
    if [[ "$valid" == false ]]; then
        error "不支持的格式: $format"
        info "支持的格式: ${valid_formats[*]}"
        exit 1
    fi
    
    # 检查是否有管道输入
    if [[ ! -t 0 ]]; then
        # 从管道读取
        local content=$(cat)
        case "$format" in
            cursor) convert_cursor "$content" "stdin" ;;
            aider) convert_aider "$content" "stdin" ;;
            windsurf) convert_windsurf "$content" "stdin" ;;
            openai) convert_openai "$content" "stdin" ;;
            clean) convert_clean "$content" ;;
        esac
        exit 0
    fi
    
    # 检查是否是批量模式
    if [[ "${1:-}" == "--batch" ]]; then
        if [[ -z "${2:-}" ]]; then
            error "批量模式需要指定目录"
            exit 1
        fi
        batch_convert "$format" "$2" "${3:-}"
        exit 0
    fi
    
    # 处理单个文件
    if [[ -z "${1:-}" ]]; then
        error "需要指定输入文件或使用 --batch 模式"
        exit 1
    fi
    
    local input_file="$1"
    local output_file="${2:-}"
    
    # 如果没有指定输出文件，自动生成
    if [[ -z "$output_file" ]]; then
        local base=$(basename "$input_file" .md)
        output_file="${base}.${format}.md"
    fi
    
    process_file "$format" "$input_file" "$output_file"
}

main "$@"
