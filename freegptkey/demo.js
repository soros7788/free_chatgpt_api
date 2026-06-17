#!/usr/bin/env node
/**
 * freegptkey 技能使用演示脚本
 * 
 * 演示如何直接通过 HTTP API 调用免费 GPT 服务
 * 注意: 实际生产环境建议使用 MCP 服务器方式 (node index.js)
 */

import http from 'http';

const API_BASE_URL = 'https://free.v36.cm/v1';
const API_KEY = process.env.FREE_GPT_API_KEY || '';

console.log('========================================');
console.log('   🚀 freegptkey 技能使用演示');
console.log('========================================');
console.log('');

// 1. 检查 KEY 配置
console.log('=== 第 1 步: 检查 API KEY ===');
if (!API_KEY) {
  console.log('⚠️  未检测到 FREE_GPT_API_KEY 环境变量');
  console.log('');
  console.log('请先按以下步骤获取 KEY:');
  console.log('');
  console.log('  1) 访问: https://free.v36.cm/github');
  console.log('  2) 使用 GitHub 账号登录并授权');
  console.log('  3) 复制生成的免费 API KEY');
  console.log('  4) 设置环境变量: export FREE_GPT_API_KEY=sk-你的KEY');
  console.log('');
  console.log('或者在调用工具时直接传入 api_key 参数');
  console.log('');
} else {
  console.log('✅ 已检测到 API KEY (长度: ' + API_KEY.length + ' 字符)');
  console.log('');
  console.log('=== 第 2 步: 验证 API KEY ===');
  try {
    const response = await fetch(API_BASE_URL + '/models', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
      },
    });
    const data = await response.json();
    if (response.ok && data.data) {
      console.log('✅ KEY 验证成功! 可用模型数量: ' + data.data.length);
      console.log('');
      console.log('=== 第 3 步: 可用模型列表 ===');
      const freeModels = ['gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-3.5-turbo-0125',
        'gpt-3.5-turbo-1106', 'gpt-3.5-turbo-16k', 'net-gpt-3.5-turbo',
        'whisper-1', 'dall-e-2'];
      freeModels.forEach((m, i) => {
        const available = data.data.some(d => d.id === m);
        const icon = available ? '✅' : '⚠️';
        const pad = '    ';
        console.log((i+1).toString().padStart(2) + '. ' + icon + ' ' + m);
      });
      console.log('');
    } else {
      console.log('❌ KEY 验证失败: ' + (data.error?.message || '未知错误'));
      console.log('');
    }
  } catch (e) {
    console.log('❌ 网络错误: ' + e.message);
    console.log('');
  }
}

console.log('========================================');
console.log('   📝 使用代码示例');
console.log('========================================');
console.log('');

console.log('=== 示例 1: 使用 curl 发送聊天请求 ===');
console.log('');
console.log('curl -X POST https://free.v36.cm/v1/chat/completions \\');
console.log('  -H "Authorization: Bearer $FREE_GPT_API_KEY" \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "你好，请介绍一下自己"}]}\'');
console.log('');

console.log('=== 示例 2: MCP 工具 quick_chat 参数 ===');
console.log('');
console.log('名称: quick_chat');
console.log('参数:');
console.log('  api_key: "sk-你的KEY" (可选，或使用环境变量)');
console.log('  prompt: "用 Python 写一个快速排序算法"');
console.log('  model: "gpt-4o-mini" (可选，默认 gpt-4o-mini)');
console.log('  system_prompt: "你是一个专业的编程助手" (可选)');
console.log('  temperature: 0.7 (可选，默认 0.7)');
console.log('  max_tokens: 2048 (可选，默认 2048)');
console.log('');

console.log('=== 示例 3: MCP 工具 chat 参数 (多轮对话) ===');
console.log('');
console.log('名称: chat');
console.log('参数:');
console.log('  model: "gpt-3.5-turbo"');
console.log('  messages: [');
console.log('    {"role": "system", "content": "你是一个有帮助的助手"}');
console.log('    {"role": "user", "content": "你好"}');
console.log('    {"role": "assistant", "content": "你好！我能帮你什么？"}');
console.log('    {"role": "user", "content": "帮我写一个快速排序"}');
console.log('  ]');
console.log('');

console.log('=== 示例 4: MCP 工具 generate_image 参数 ===');
console.log('');
console.log('名称: generate_image');
console.log('参数:');
console.log('  prompt: "a cute cat sitting on a rainbow, digital art"');
console.log('  size: "512x512" (可选: 256x256, 512x512, 1024x1024)');
console.log('  n: 1 (生成数量，默认 1)');
console.log('');

console.log('=== 示例 5: MCP 工具 list_models 参数 ===');
console.log('');
console.log('名称: list_models');
console.log('参数:');
console.log('  free_only: true (只显示免费可用模型，默认 true)');
console.log('');

console.log('========================================');
console.log('   💡 快速开始命令');
console.log('========================================');
console.log('');
console.log('1. 领取免费 KEY:');
console.log('   浏览器访问: https://free.v36.cm/github');
console.log('');
console.log('2. 设置环境变量:');
console.log('   export FREE_GPT_API_KEY=sk-你的KEY');
console.log('');
console.log('3. 进入技能目录:');
console.log('   cd /workspace/freegptkey');
console.log('');
console.log('4. 启动 MCP 服务器:');
console.log('   node index.js');
console.log('');
console.log('5. 验证 KEY:');
console.log('   调用 validate_key 工具');
console.log('');
console.log('6. 开始聊天:');
console.log('   调用 quick_chat 工具并传入你的问题');
console.log('');

console.log('========================================');
console.log('   🎯 推荐使用场景');
console.log('========================================');
console.log('');
console.log('场景 1: 代码编写/调试 → quick_chat, model=gpt-4o-mini');
console.log('场景 2: 文档翻译 → quick_chat, model=gpt-3.5-turbo');
console.log('场景 3: 实时信息查询 → chat, model=net-gpt-3.5-turbo');
console.log('场景 4: 创意写作 → quick_chat, temperature=1.2');
console.log('场景 5: AI 图像生成 → generate_image, model=dall-e-2');
console.log('场景 6: 语音转文字 → 直接使用 whisper-1 API');
console.log('');
console.log('========================================');
console.log('   ⚠️ 重要提醒');
console.log('========================================');
console.log('');
console.log('• RPM 限制: 每分钟 96 次请求');
console.log('• 仅供个人学习使用');
console.log('• 免费 API 不提供技术支持');
console.log('• 如需稳定服务，请使用付费 API: https://api.v36.cm');
console.log('• 请遵守 OpenAI 使用条款和相关法律法规');
console.log('');
console.log('========================================');
console.log('   📚 更多信息');
console.log('========================================');
console.log('');
console.log('完整 README: /workspace/freegptkey/README.md');
console.log('技能配置: /workspace/freegptkey/skill.json');
console.log('环境变量示例: /workspace/freegptkey/.env.example');
console.log('');
console.log('========================================');
console.log('   🎉 开始使用 freegptkey 技能吧!');
console.log('========================================');
