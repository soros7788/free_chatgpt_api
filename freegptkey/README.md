# freegptkey - 免费 GPT API 技能

> 基于 [free_chatgpt_api](https://github.com/popjane/free_chatgpt_api) 提供的免费 ChatGPT API，实现 MCP 服务器，提供标准 OpenAI 兼容接口。

## 功能特点

- 🎯 **完全免费** - 无需购买，领取免费 KEY 即可使用
- 🚀 **标准接口** - OpenAI 兼容，无缝接入各类应用
- 💬 **多模型支持** - gpt-4o-mini、gpt-3.5-turbo 系列、联网模型
- 🎨 **图像生成** - dall-e-2 图像生成支持
- 🔊 **语音转文字** - whisper-1 语音识别支持
- 🌐 **联网搜索** - net-gpt-3.5-turbo 支持联网搜索
- ⚡ **MCP 协议** - 标准 MCP (Model Context Protocol) 服务器

## 快速开始

### 第 1 步：领取免费 API KEY

访问以下网址，使用 GitHub 账号登录并授权：

```
https://free.v36.cm/github
```

登录成功后系统会自动生成免费 API KEY，复制并保存。

### 第 2 步：设置环境变量（可选）

```bash
# Linux / macOS
export FREE_GPT_API_KEY=你的免费API_KEY

# Windows (PowerShell)
$env:FREE_GPT_API_KEY="你的免费API_KEY"

# 或者创建 .env 文件（见 .env.example）
```

> 💡 也可以不设置环境变量，在调用工具时通过 `api_key` 参数传入。

### 第 3 步：安装依赖

```bash
cd freegptkey
npm install
```

### 第 4 步：启动 MCP 服务器

```bash
# 方式 1：使用 npm
npm start

# 方式 2：直接运行
node index.js
```

服务器启动后将通过 stdio 协议提供 MCP 工具。

## 免费可用模型

### 聊天模型

| 模型名称 | 说明 |
|---------|------|
| `gpt-4o-mini` | GPT-4o 轻量版，速度一般，推荐使用 |
| `gpt-3.5-turbo` | 标准 GPT-3.5，平衡速度与质量 |
| `gpt-3.5-turbo-0125` | GPT-3.5 优化版本 |
| `gpt-3.5-turbo-1106` | GPT-3.5 1106 版本 |
| `gpt-3.5-turbo-16k` | GPT-3.5 16K 上下文版本 |
| `net-gpt-3.5-turbo` | **联网搜索模型**，可获取实时信息 |

### 图像生成模型

| 模型名称 | 说明 |
|---------|------|
| `dall-e-2` | DALL-E 2 图像生成模型 |

### 语音识别模型

| 模型名称 | 说明 |
|---------|------|
| `whisper-1` | Whisper 语音转文字模型 |

## 使用限制

- **RPM (每分钟请求数)**: 96 次
- 仅供个人学习使用
- 免费 API 不提供技术支持
- 如需稳定高并发，请使用付费 API

## 可用 MCP 工具

### 1. `get_key_guide`

获取免费 API KEY 领取指引和使用说明。

```json
{
  "name": "get_key_guide",
  "arguments": {}
}
```

### 2. `validate_key`

验证 API KEY 是否有效。

```json
{
  "name": "validate_key",
  "arguments": {
    "api_key": "sk-xxxxxx (可选，也可使用环境变量 FREE_GPT_API_KEY)"
  }
}
```

### 3. `list_models`

列出可用模型列表。

```json
{
  "name": "list_models",
  "arguments": {
    "api_key": "sk-xxxxxx (可选)",
    "free_only": true
  }
}
```

### 4. `chat`

发送聊天补全请求，支持多轮对话。

```json
{
  "name": "chat",
  "arguments": {
    "api_key": "sk-xxxxxx (可选)",
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "你是一个有帮助的助手。"
      },
      {
        "role": "user",
        "content": "你好，请介绍一下自己。"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 2048
  }
}
```

### 5. `quick_chat`

简化版聊天，只需提供 prompt 即可快速获得回复。

```json
{
  "name": "quick_chat",
  "arguments": {
    "api_key": "sk-xxxxxx (可选)",
    "prompt": "用 Python 写一个快速排序算法",
    "model": "gpt-4o-mini",
    "system_prompt": "你是一个专业的编程助手。",
    "temperature": 0.7,
    "max_tokens": 2048
  }
}
```

### 6. `generate_image`

使用 dall-e-2 模型生成图像。

```json
{
  "name": "generate_image",
  "arguments": {
    "api_key": "sk-xxxxxx (可选)",
    "prompt": "a cute cat sitting on a rainbow, digital art style",
    "size": "512x512",
    "n": 1
  }
}
```

### 7. `get_api_info`

获取 Free GPT API 的完整配置信息和接口说明。

```json
{
  "name": "get_api_info",
  "arguments": {}
}
```

## API 配置信息

| 配置项 | 值 |
|-------|----|
| API 地址 (BASE_URL) | `https://free.v36.cm/v1/` |
| API 主机地址 | `https://free.v36.cm` |
| KEY 领取地址 | `https://free.v36.cm/github` |
| 接口格式 | 标准 OpenAI 兼容 |

## 与其他应用集成

由于使用标准 OpenAI 接口，freegptkey 可以与以下应用无缝集成：

### 方式 1：ChatGPT.好友 (utools 插件)

在插件设置中填入：
- API 地址: `https://free.v36.cm`
- API KEY: 你领取的免费 KEY

### 方式 2：ChatGPT-Next-Web

在自定义接口设置中：
- BaseURL: `https://free.v36.cm/v1/`
- API KEY: 你领取的免费 KEY

### 方式 3：Lobe-chat

在 Lobe-chat 配置中设置：
- API 地址: `https://free.v36.cm`
- API KEY: 你领取的免费 KEY

### 方式 4：OpenAI 官方 Python 库

```python
import openai

openai.api_key = "你的APIKEY"
openai.base_url = "https://free.v36.cm/v1/"

completion = openai.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Hello world!"}],
)
print(completion.choices[0].message.content)
```

### 方式 5：OpenAI 官方 Node.js 库

```javascript
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: "你的apikey",
  baseURL: "https://free.v36.cm/v1",
});

const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Hello world" }],
});
console.log(completion.choices[0].message.content);
```

## 项目结构

```
freegptkey/
├── index.js              # MCP 服务器主入口
├── package.json          # Node.js 项目配置
├── skill.json            # 技能元数据配置
├── README.md             # 使用说明文档
├── .env.example          # 环境变量示例
├── tools/                # MCP 工具描述文件
│   ├── SERVER_METADATA.json
│   ├── get_key_guide.json
│   ├── validate_key.json
│   ├── list_models.json
│   ├── chat.json
│   ├── quick_chat.json
│   ├── generate_image.json
│   └── get_api_info.json
└── node_modules/         # 依赖包
```

## 技术栈

- **运行时**: Node.js >= 18
- **协议**: MCP (Model Context Protocol)
- **SDK**: @modelcontextprotocol/sdk
- **通信**: Stdio Server Transport
- **接口**: OpenAI 兼容 REST API

## 常见问题

### Q1: 如何获取免费 API KEY？

A: 访问 https://free.v36.cm/github，使用 GitHub 账号登录授权后即可自动获取免费 KEY。

### Q2: 为什么 KEY 验证失败？

A: 请检查：
1. KEY 是否正确复制（不要有多余的空格）
2. KEY 是否过期或被禁用
3. 网络是否能访问 `free.v36.cm`

### Q3: 请求被限制怎么办？

A: 免费 API 的 RPM 限制为 96 次/分钟，超过此限制会被 CC 拦截。请降低请求频率。

### Q4: gpt-4 模型可用吗？

A: 免费版只支持 gpt-4o-mini 和 gpt-3.5 系列。完整 gpt-4 支持需要使用付费 API：https://api.v36.cm

### Q5: 可以用于商业用途吗？

A: 免费 API 仅供个人学习使用，不得用于商业用途。

### Q6: API 不稳定怎么办？

A: 免费服务不保证稳定性。如果需要稳定高并发服务，请使用付费 API。

## 注意事项

1. 请遵守 OpenAI 的使用条款和相关法律法规
2. 免费 API 仅供个人学习研究使用
3. 不得将免费 API 用于任何违法违规用途
4. 当前 RPM 限制为 96，请勿恶意刷取 KEY
5. 已发现大量机器号自动领取 KEY 的行为，这类行为会影响正常用户使用

## 付费 API

如需稳定、高并发、支持 130+ 模型的完整服务，请前往：

```
https://api.v36.cm
```

付费 API 特点：
- gpt-4 价格仅为官网的 2.8-3 折
- gpt-3.5 系列价格为官网的 1.4-2 折
- 支持 130+ 模型
- 不限时间，按量计费

## 开发者信息

- 项目名称: freegptkey
- 版本: 1.0.0
- 类型: MCP Server
- 许可证: MIT
- 依赖: @modelcontextprotocol/sdk

## 相关链接

- 项目主页: https://github.com/popjane/free_chatgpt_api
- 免费 KEY 领取: https://free.v36.cm/github
- 付费 API: https://api.v36.cm

---

**祝您使用愉快！** 🎉
