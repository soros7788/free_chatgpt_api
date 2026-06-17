#!/bin/bash
# ========================================
# freegptkey 一键配置和快速开始脚本
# ========================================
# 使用方法:
#   1. 先访问 https://free.v36.cm/github 获取免费 API KEY
#   2. 复制 KEY 后运行: bash quickstart.sh sk-你的KEY
#   3. 或者设置环境变量: export FREE_GPT_API_KEY=sk-你的KEY
# ========================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

echo ""
echo -e "${CYAN}${BOLD}========================================${RESET}"
echo -e "${CYAN}${BOLD}   🚀 freegptkey 技能快速配置脚本${RESET}"
echo -e "${CYAN}${BOLD}========================================${RESET}"
echo ""

# 步骤 1: 检查参数或环境变量
API_KEY="${1:-$FREE_GPT_API_KEY}"

if [ -z "$API_KEY" ]; then
  echo -e "${YELLOW}⚠️  未检测到 API KEY${RESET}"
  echo ""
  echo -e "请先访问以下网址领取免费 KEY:"
  echo -e "${BLUE}   🔗 https://free.v36.cm/github${RESET}"
  echo ""
  echo -e "然后运行: ${GREEN}bash quickstart.sh sk-你的KEY${RESET}"
  echo -e "或设置环境变量: ${GREEN}export FREE_GPT_API_KEY=sk-你的KEY${RESET}"
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ 已检测到 API KEY${RESET}"
echo -e "   KEY 长度: ${#API_KEY} 字符"
echo ""

# 步骤 2: 验证 KEY
echo -e "${PURPLE}🔍 正在验证 API KEY...${RESET}"
echo ""

VALIDATE_RESPONSE=$(curl -s -X GET "https://free.v36.cm/v1/models" \
  -H "Authorization: Bearer $API_KEY" 2>&1)

if echo "$VALIDATE_RESPONSE" | grep -q "error"; then
  echo -e "${RED}❌ KEY 验证失败${RESET}"
  echo -e "   错误信息: $(echo "$VALIDATE_RESPONSE" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)"
  echo ""
  echo -e "请检查 KEY 是否正确，或重新领取: ${BLUE}https://free.v36.cm/github${RESET}"
  echo ""
  exit 1
fi

MODEL_COUNT=$(echo "$VALIDATE_RESPONSE" | grep -o '"id":"[^"]*"' | wc -l)
echo -e "${GREEN}✅ KEY 验证成功!${RESET}"
echo -e "   可用模型数量: $MODEL_COUNT"
echo ""

# 步骤 3: 测试聊天功能
echo -e "${PURPLE}💬 测试聊天功能 (gpt-4o-mini)...${RESET}"
echo ""

CHAT_RESPONSE=$(curl -s -X POST "https://free.v36.cm/v1/chat/completions" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "你好，请用一句话介绍一下你自己"}], "max_tokens": 100}' 2>&1)

if echo "$CHAT_RESPONSE" | grep -q '"content":'; then
  AI_REPLY=$(echo "$CHAT_RESPONSE" | grep -o '"content":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo -e "${GREEN}✅ 聊天测试成功!${RESET}"
  echo ""
  echo -e "${CYAN}🤖 AI 回复:${RESET}"
  echo -e "   $AI_REPLY"
  echo ""
else
  echo -e "${YELLOW}⚠️  聊天响应解析失败，但 API 正常工作${RESET}"
  echo -e "   原始响应: $(echo "$CHAT_RESPONSE" | cut -c1-200)..."
  echo ""
fi

# 步骤 4: 保存配置
echo -e "${PURPLE}💾 保存配置...${RESET}"
echo ""

if [ ! -f "/workspace/freegptkey/.env" ]; then
  cat > "/workspace/freegptkey/.env" << EOF
# freegptkey 配置文件
# 自动生成于: $(date)

FREE_GPT_API_KEY=$API_KEY
FREE_GPT_API_URL=https://free.v36.cm/v1
FREE_GPT_DEFAULT_MODEL=gpt-4o-mini
FREE_GPT_TEMPERATURE=0.7
FREE_GPT_MAX_TOKENS=2048
EOF
  echo -e "${GREEN}✅ 配置已保存到 /workspace/freegptkey/.env${RESET}"
else
  echo -e "${YELLOW}⚠️  .env 文件已存在，跳过保存${RESET}"
fi
echo ""

# 步骤 5: 显示使用信息
echo -e "${CYAN}${BOLD}========================================${RESET}"
echo -e "${CYAN}${BOLD}   🎯 您已准备好使用 freegptkey!${RESET}"
echo -e "${CYAN}${BOLD}========================================${RESET}"
echo ""

echo -e "=== ${BOLD}快速命令${RESET} ==="
echo ""
echo -e "启动 MCP 服务器:"
echo -e "  ${GREEN}cd /workspace/freegptkey && node index.js${RESET}"
echo ""
echo -e "=== ${BOLD}推荐的使用流程${RESET} ==="
echo ""
echo -e "1. ${BOLD}编程助手${RESET}:"
echo -e "   工具: quick_chat | model: gpt-4o-mini"
echo -e "   prompt: \"用 Python 写一个 xxx 函数\""
echo ""
echo -e "2. ${BOLD}联网搜索${RESET}:"
echo -e "   工具: chat | model: net-gpt-3.5-turbo"
echo -e "   可获取实时信息"
echo ""
echo -e "3. ${BOLD}AI 绘图${RESET}:"
echo -e "   工具: generate_image | model: dall-e-2"
echo -e "   prompt: \"a beautiful sunset over mountains\""
echo ""
echo -e "4. ${BOLD}文本分析${RESET}:"
echo -e "   工具: chat | model: gpt-3.5-turbo-16k"
echo -e "   支持 16K 上下文窗口"
echo ""

echo -e "=== ${BOLD}文件位置${RESET} ==="
echo ""
echo -e "📁 技能目录: ${BLUE}/workspace/freegptkey${RESET}"
echo -e "📄 主程序: ${BLUE}/workspace/freegptkey/index.js${RESET}"
echo -e "📄 使用文档: ${BLUE}/workspace/freegptkey/README.md${RESET}"
echo -e "📄 配置文件: ${BLUE}/workspace/freegptkey/.env${RESET}"
echo -e "📄 演示脚本: ${BLUE}/workspace/freegptkey/demo.js${RESET}"
echo ""

echo -e "=== ${BOLD}环境变量已设置${RESET} ==="
echo ""
export FREE_GPT_API_KEY=$API_KEY
echo -e "FREE_GPT_API_KEY=$API_KEY"
echo -e "${YELLOW}(已设置为当前会话的环境变量)${RESET}"
echo ""

echo -e "=== ${BOLD}快速测试命令${RESET} ==="
echo ""
echo -e "列出可用模型:"
echo -e "  ${GREEN}curl -s -X GET 'https://free.v36.cm/v1/models' -H 'Authorization: Bearer $API_KEY' | python3 -m json.tool | head -30${RESET}"
echo ""
echo -e "发送聊天请求:"
echo -e "  ${GREEN}curl -s -X POST 'https://free.v36.cm/v1/chat/completions' -H 'Authorization: Bearer $API_KEY' -H 'Content-Type: application/json' -d '{\"model\": \"gpt-4o-mini\", \"messages\": [{\"role\": \"user\", \"content\": \"Hello!\"}]}'${RESET}"
echo ""

echo -e "${CYAN}${BOLD}========================================${RESET}"
echo -e "${GREEN}${BOLD}   🎉 freegptkey 技能配置完成!${RESET}"
echo -e "${CYAN}${BOLD}========================================${RESET}"
echo ""
echo -e "💡 提示: 将 ${GREEN}export FREE_GPT_API_KEY=$API_KEY${RESET} 添加到你的"
echo -e "   ${BLUE}~/.bashrc${RESET} 或 ${BLUE}~/.zshrc${RESET} 中，以便永久保存。"
echo ""
