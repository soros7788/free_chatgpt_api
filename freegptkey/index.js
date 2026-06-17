#!/usr/bin/env node
/**
 * Free GPT Key MCP Server
 *
 * 基于 free_chatgpt_api (https://free.v36.cm) 提供的免费 ChatGPT API
 * 通过标准 OpenAI 接口格式提供以下模型:
 *   - gpt-4o-mini
 *   - gpt-3.5-turbo-0125 / gpt-3.5-turbo-1106 / gpt-3.5-turbo / gpt-3.5-turbo-16k
 *   - net-gpt-3.5-turbo (可联网搜索模型)
 *   - whisper-1 (语音转文字)
 *   - dall-e-2 (图像生成)
 *
 * 免费 API KEY 领取: https://free.v36.cm/github (需要 GitHub OAuth 登录)
 * API Base URL: https://free.v36.cm/v1/
 * RPM 限制: 96
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE_URL = "https://free.v36.cm/v1";
const KEY_GET_URL = "https://free.v36.cm/github";
const FREE_MODELS = [
  "gpt-4o-mini",
  "gpt-3.5-turbo-0125",
  "gpt-3.5-turbo-1106",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
  "net-gpt-3.5-turbo",
  "whisper-1",
  "dall-e-2",
];

// -------------------------
// 工具: 1. 获取免费 API KEY 指引
// -------------------------
async function tool_get_key_guide() {
  return {
    content: [
      {
        type: "text",
        text:
          "=== 免费 GPT API KEY 领取指引 ===\n\n" +
          "1. 打开领取页面: " + KEY_GET_URL + "\n" +
          "2. 使用 GitHub 账号登录授权（OAuth）\n" +
          "3. 登录后系统会自动生成免费 API KEY\n" +
          "4. 复制并妥善保管你的 API KEY\n\n" +
          "=== API 配置信息 ===\n" +
          "API Base URL (BASE_URL): https://free.v36.cm/v1/\n" +
          "API 地址（部分应用）: https://free.v36.cm\n\n" +
          "=== 免费支持的模型 ===\n" +
          FREE_MODELS.map((m) => "  - " + m).join("\n") +
          "\n\n" +
          "=== 使用限制 ===\n" +
          "  - RPM (每分钟请求数): 96\n" +
          "  - 仅供个人学习使用\n" +
          "  - 免费 API 不提供技术支持\n" +
          "  - 如需高并发/稳定服务，请使用付费 API: https://api.v36.cm\n\n" +
          "=== 快速测试 ===\n" +
          "  获取 KEY 后，可使用本技能的 validate_key 工具验证 KEY 是否有效",
      },
    ],
  };
}

// -------------------------
// 工具: 2. 验证 API KEY 是否有效
// -------------------------
async function tool_validate_key(args) {
  const apiKey = args.api_key || process.env.FREE_GPT_API_KEY;
  if (!apiKey) {
    return {
      content: [
        {
          type: "text",
          text:
            "错误: 未提供 API KEY。请通过 api_key 参数传入，或设置环境变量 FREE_GPT_API_KEY。\n" +
            "领取 KEY: " + KEY_GET_URL,
        },
      ],
      isError: true,
    };
  }

  try {
    const response = await fetch(API_BASE_URL + "/models", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.data) {
      const modelCount = data.data.length;
      return {
        content: [
          {
            type: "text",
            text:
              "✅ API KEY 验证成功!\n\n" +
              "状态: 有效\n" +
              "可用模型数量: " +
              modelCount +
              "\n" +
              "前 10 个模型:\n" +
              data.data
                .slice(0, 10)
                .map((m) => "  - " + m.id)
                .join("\n"),
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text:
              "❌ API KEY 验证失败\n\n" +
              "HTTP 状态码: " +
              response.status +
              "\n" +
              "错误信息: " +
              (data.error?.message || JSON.stringify(data)),
          },
        ],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: "❌ 网络请求失败: " + error.message,
        },
      ],
      isError: true,
    };
  }
}

// -------------------------
// 工具: 3. 获取可用模型列表
// -------------------------
async function tool_list_models(args) {
  const apiKey = args.api_key || process.env.FREE_GPT_API_KEY;
  if (!apiKey) {
    return {
      content: [
        {
          type: "text",
          text: "错误: 未提供 API KEY。请通过 api_key 参数传入，或设置环境变量 FREE_GPT_API_KEY。",
        },
      ],
      isError: true,
    };
  }

  try {
    const response = await fetch(API_BASE_URL + "/models", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + apiKey,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.data) {
      const freeOnly = args.free_only !== false;
      const models = freeOnly
        ? data.data.filter((m) => FREE_MODELS.includes(m.id))
        : data.data;

      return {
        content: [
          {
            type: "text",
            text:
              "📋 可用模型列表" +
              (freeOnly ? "（免费可用）" : "（全部）") +
              ":\n\n" +
              models
                .map((m, i) => (i + 1).toString().padStart(2) + ". " + m.id)
                .join("\n") +
              "\n\n共 " +
              models.length +
              " 个模型",
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text:
              "❌ 获取模型列表失败\n" +
              "HTTP: " +
              response.status +
              "\n" +
              (data.error?.message || JSON.stringify(data)),
          },
        ],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: "❌ 网络请求失败: " + error.message }],
      isError: true,
    };
  }
}

// -------------------------
// 工具: 4. 聊天补全 (Chat Completion)
// -------------------------
async function tool_chat(args) {
  const apiKey = args.api_key || process.env.FREE_GPT_API_KEY;
  if (!apiKey) {
    return {
      content: [
        {
          type: "text",
          text: "错误: 未提供 API KEY。请通过 api_key 参数传入，或设置环境变量 FREE_GPT_API_KEY。",
        },
      ],
      isError: true,
    };
  }

  const model = args.model || "gpt-3.5-turbo";
  const messages = args.messages || [];
  const temperature = args.temperature ?? 0.7;
  const maxTokens = args.max_tokens || 2048;

  if (messages.length === 0) {
    return {
      content: [{ type: "text", text: "错误: 请至少提供一条消息 (messages 参数)。" }],
      isError: true,
    };
  }

  try {
    const response = await fetch(API_BASE_URL + "/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
        stream: false,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.choices && data.choices.length > 0) {
      const choice = data.choices[0];
      const usage = data.usage || {};
      return {
        content: [
          {
            type: "text",
            text:
              "🤖 模型: " +
              model +
              "\n" +
              "角色: " +
              (choice.message?.role || "assistant") +
              "\n\n" +
              "---\n" +
              (choice.message?.content || "(空响应)") +
              "\n---\n\n" +
              "使用统计:\n" +
              "  Prompt tokens: " +
              (usage.prompt_tokens || 0) +
              "\n" +
              "  Completion tokens: " +
              (usage.completion_tokens || 0) +
              "\n" +
              "  Total tokens: " +
              (usage.total_tokens || 0),
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text:
              "❌ 聊天请求失败\n" +
              "HTTP: " +
              response.status +
              "\n" +
              (data.error?.message || JSON.stringify(data)),
          },
        ],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: "❌ 网络请求失败: " + error.message }],
      isError: true,
    };
  }
}

// -------------------------
// 工具: 5. 简化版聊天 (单轮对话)
// -------------------------
async function tool_quick_chat(args) {
  const apiKey = args.api_key || process.env.FREE_GPT_API_KEY;
  if (!apiKey) {
    return {
      content: [
        {
          type: "text",
          text: "错误: 未提供 API KEY。请通过 api_key 参数传入，或设置环境变量 FREE_GPT_API_KEY。",
        },
      ],
      isError: true,
    };
  }

  const model = args.model || "gpt-4o-mini";
  const prompt = args.prompt || "";
  const systemPrompt = args.system_prompt || "You are a helpful assistant.";

  if (!prompt) {
    return {
      content: [{ type: "text", text: "错误: 请提供 prompt 参数。" }],
      isError: true,
    };
  }

  try {
    const response = await fetch(API_BASE_URL + "/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: args.temperature ?? 0.7,
        max_tokens: args.max_tokens || 2048,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.choices && data.choices.length > 0) {
      return {
        content: [
          {
            type: "text",
            text: "🤖 " + model + " 回复:\n\n" + (data.choices[0].message?.content || "(空响应)"),
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text:
              "❌ 请求失败\n" +
              "HTTP: " +
              response.status +
              "\n" +
              (data.error?.message || JSON.stringify(data)),
          },
        ],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: "❌ 网络请求失败: " + error.message }],
      isError: true,
    };
  }
}

// -------------------------
// 工具: 6. 图像生成 (DALL-E 2)
// -------------------------
async function tool_generate_image(args) {
  const apiKey = args.api_key || process.env.FREE_GPT_API_KEY;
  if (!apiKey) {
    return {
      content: [
        {
          type: "text",
          text: "错误: 未提供 API KEY。请通过 api_key 参数传入，或设置环境变量 FREE_GPT_API_KEY。",
        },
      ],
      isError: true,
    };
  }

  const prompt = args.prompt || "";
  if (!prompt) {
    return {
      content: [{ type: "text", text: "错误: 请提供图像描述 prompt 参数。" }],
      isError: true,
    };
  }

  const size = args.size || "512x512";
  const n = args.n || 1;

  try {
    const response = await fetch(API_BASE_URL + "/images/generations", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-2",
        prompt: prompt,
        n: n,
        size: size,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.data && data.data.length > 0) {
      const images = data.data
        .map((img, i) => {
          if (img.url) {
            return "图像 " + (i + 1) + ": " + img.url;
          } else if (img.b64_json) {
            return "图像 " + (i + 1) + ": (已生成 base64 数据，长度 " + img.b64_json.length + ")";
          }
          return "图像 " + (i + 1) + ": 未知格式";
        })
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: "🎨 图像生成成功!\n\n描述: " + prompt + "\n尺寸: " + size + "\n数量: " + n + "\n\n" + images,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text:
              "❌ 图像生成失败\n" +
              "HTTP: " +
              response.status +
              "\n" +
              (data.error?.message || JSON.stringify(data)),
          },
        ],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: "❌ 网络请求失败: " + error.message }],
      isError: true,
    };
  }
}

// -------------------------
// 工具: 7. 获取 API 配置信息
// -------------------------
async function tool_get_api_info() {
  return {
    content: [
      {
        type: "text",
        text:
          "=== Free GPT API 配置信息 ===\n\n" +
          "项目地址: https://github.com/popjane/free_chatgpt_api\n\n" +
          "API Base URL: " +
          API_BASE_URL +
          "/\n" +
          "API 地址(简写): https://free.v36.cm\n" +
          "KEY 领取地址: " +
          KEY_GET_URL +
          "\n\n" +
          "免费模型:\n" +
          FREE_MODELS.map((m) => "  - " + m).join("\n") +
          "\n\n" +
          "接口格式: 标准 OpenAI 兼容\n" +
          "  - GET  " +
          API_BASE_URL +
          "/models\n" +
          "  - POST " +
          API_BASE_URL +
          "/chat/completions\n" +
          "  - POST " +
          API_BASE_URL +
          "/images/generations\n" +
          "  - POST " +
          API_BASE_URL +
          "/audio/transcriptions\n\n" +
          "使用限制:\n" +
          "  - RPM: 96 (每分钟请求数)\n" +
          "  - 仅供个人学习使用\n\n" +
          "付费 API (推荐用于生产环境):\n" +
          "  - 地址: https://api.v36.cm\n" +
          "  - gpt-4 价格为官网 2.8-3 折\n" +
          "  - 130+ 模型支持\n" +
          "  - 不限时间、按量计费",
      },
    ],
  };
}

// -------------------------
// MCP Server 初始化
// -------------------------
const server = new Server(
  {
    name: "freegptkey",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 注册工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_key_guide",
        description: "获取免费 GPT API KEY 的领取指引和使用说明",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "validate_key",
        description: "验证提供的 API KEY 是否有效（通过调用 /models 接口）",
        inputSchema: {
          type: "object",
          properties: {
            api_key: {
              type: "string",
              description: "免费 GPT API KEY。如果省略则尝试从 FREE_GPT_API_KEY 环境变量读取。",
            },
          },
        },
      },
      {
        name: "list_models",
        description: "列出 API 支持的可用模型列表",
        inputSchema: {
          type: "object",
          properties: {
            api_key: {
              type: "string",
              description: "免费 GPT API KEY。",
            },
            free_only: {
              type: "boolean",
              description: "是否只显示免费可用的模型（默认 true）",
              default: true,
            },
          },
        },
      },
      {
        name: "chat",
        description:
          "发送聊天补全请求。标准 OpenAI Chat Completions 接口，支持 gpt-4o-mini、gpt-3.5-turbo 等模型。",
        inputSchema: {
          type: "object",
          properties: {
            api_key: {
              type: "string",
              description: "免费 GPT API KEY。",
            },
            model: {
              type: "string",
              description: "模型名称，例如 gpt-4o-mini, gpt-3.5-turbo, net-gpt-3.5-turbo",
              default: "gpt-3.5-turbo",
            },
            messages: {
              type: "array",
              description:
                "消息数组，每条消息包含 role (system/user/assistant) 和 content 字段。例如: [{\"role\": \"user\", \"content\": \"你好\"}]",
              items: {
                type: "object",
                properties: {
                  role: { type: "string" },
                  content: { type: "string" },
                },
              },
            },
            temperature: {
              type: "number",
              description: "采样温度，0-2 之间，值越高越随机（默认 0.7）",
              default: 0.7,
            },
            max_tokens: {
              type: "number",
              description: "最大生成 token 数（默认 2048）",
              default: 2048,
            },
          },
          required: ["messages"],
        },
      },
      {
        name: "quick_chat",
        description: "简化版聊天：只需提供 prompt，即可快速获得回复",
        inputSchema: {
          type: "object",
          properties: {
            api_key: {
              type: "string",
              description: "免费 GPT API KEY。",
            },
            prompt: {
              type: "string",
              description: "用户输入的问题或对话内容",
            },
            model: {
              type: "string",
              description: "模型名称（默认 gpt-4o-mini）",
              default: "gpt-4o-mini",
            },
            system_prompt: {
              type: "string",
              description: "系统提示词（默认 'You are a helpful assistant.'）",
              default: "You are a helpful assistant.",
            },
            temperature: {
              type: "number",
              description: "采样温度（默认 0.7）",
              default: 0.7,
            },
            max_tokens: {
              type: "number",
              description: "最大生成 token 数（默认 2048）",
              default: 2048,
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "generate_image",
        description: "使用 dall-e-2 模型生成图像",
        inputSchema: {
          type: "object",
          properties: {
            api_key: {
              type: "string",
              description: "免费 GPT API KEY。",
            },
            prompt: {
              type: "string",
              description: "图像描述文本（英文效果更好）",
            },
            size: {
              type: "string",
              description: "图像尺寸: 256x256, 512x512, 或 1024x1024（默认 512x512）",
              default: "512x512",
            },
            n: {
              type: "number",
              description: "生成图像数量（默认 1）",
              default: 1,
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "get_api_info",
        description: "获取 Free GPT API 的完整配置信息、可用模型和使用限制",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// 注册工具调用处理
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "get_key_guide":
      return tool_get_key_guide();
    case "validate_key":
      return tool_validate_key(args || {});
    case "list_models":
      return tool_list_models(args || {});
    case "chat":
      return tool_chat(args || {});
    case "quick_chat":
      return tool_quick_chat(args || {});
    case "generate_image":
      return tool_generate_image(args || {});
    case "get_api_info":
      return tool_get_api_info();
    default:
      return {
        content: [{ type: "text", text: "未知工具: " + name }],
        isError: true,
      };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[freegptkey] MCP Server started.");
}

main().catch((error) => {
  console.error("[freegptkey] Server error:", error);
  process.exit(1);
});
