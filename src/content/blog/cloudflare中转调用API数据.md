---
title: "cloudflare中转调用API数据"
categories: Cloudflare
tags:
  - API
  - Cloudflare
id: "cloudflare中转调用API数据"
date: 2025-08-08 14:52:10
cover: "https://iili.io/FsMi4Dv.png"
---

:::note
使用`Cloudflare Workers`和中转调用API服务
:::

最近给博客加入了一个访客IP信息的组件，但是组件在调用ip.sb的API的时候被广告拦截工具拦截禁止访问了（ip.sb被拉黑了），但是这个广告拦截插件是不可能关的，于是探索了好几个办法，觉得用cloudflare中转网站对API数据请求是最好的，分享一下。在前端开发中，我们经常需要调用第三方 API。但这个过程总是伴随着各种烦恼：

- CORS 跨域问题：目标 API 不支持跨域，浏览器无情报错。

- API Key 泄露：将敏感的 API Key 直接写在前端代码中，无异于“裸奔”。

- 客户端拦截：用户的广告拦截插件（如 AdBlock）可能会将一些公共 API 的请求直接拦截，导致功能失效。

- API 不稳定：某些第三方 API 偶尔会超时或返回错误，影响用户体验。

为了解决这些问题，传统方法是自己搭建一个后端服务器做中转，但这无疑增加了开发和维护的成本。今天，我将向你介绍一个更优雅、更强大，而且几乎免费的解决方案——Cloudflare Workers。

## 什么是 Cloudflare Workers？

简单来说，Cloudflare Workers 是一个“无服务器（Serverless）”平台。它允许你将一段 JavaScript 代码部署到 Cloudflare 全球的边缘网络上。当有请求访问你指定的路由时，这段代码就会被执行。

### 它的核心优势在于：

- 离用户更近：代码在全球数百个节点上运行，响应极快，延迟极低。

- 绕过客户端限制：由于请求是从你的域名发出的，完美规避了浏览器的跨域和广告拦截问题。

- 安全可靠：可以将敏感的 API Key 安全地存储在云端，前端代码只与你自己的 Worker 通信。

- 强大的免费额度：每天 10 万次免费请求，对于绝大多数个人项目和中小型应用来说绰绰有余。

本文将以一个常见的场景为例——获取访客的 IP 地理位置信息——手把手教你如何搭建一个具备自动重试功能的、稳定可靠的 API 中转代理。

## 步骤一：创建并部署 Worker

1. 登录并创建
首先，登录到你的 Cloudflare 账户，在左侧菜单中找到并点击 Workers & Pages。然后，点击 `Create application` (创建应用程序)，在下一页选择 `Create Worker`。你可以为它自定义一个名称（例如 `api-proxy`），然后点击 Deploy (部署)。

2. 粘贴并编辑代码
部署成功后，点击 `Edit code` (编辑代码)。将下面这份我们精心准备的、带有重试逻辑的代码完整地复制并粘贴到 Cloudflare 的代码编辑器中，覆盖掉原来的模板。

```
/**
 * Cloudflare Worker - API 代理（内置重试逻辑）
 * * 工作原理:
 * 1. 部署到你域名下的一个路由 (例如 /api/proxy/*)。
 * 2. 读取真实访客的 IP 地址。
 * 3. 从云端重复请求一个指定的 API 服务商 (api.ip.sb)。
 * 4. 如果请求失败，它会自动延迟一小段时间后重试，直到达到最大次数。
 * 5. 它将 API 返回的原始、完整的 JSON 数据直接返回给前端。
 */

// --- 配置 ---
const MAX_RETRIES = 5; // 总共尝试5次，你可以根据需要调整
const RETRY_DELAY = 500; // 每次重试前的等待时间 (毫秒)

// --- 单一API服务提供商 ---
const API_PROVIDER = {
  name: 'ip.sb',
  getUrl: (ip) => `https://api.ip.sb/geoip/${ip}`,
};

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  async fetch(request, env, ctx) {
    // --- CORS 响应头 ---
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // 生产环境建议换成你的具体域名
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // --- 获取访客IP ---
    const visitorIp = request.headers.get('CF-Connecting-IP');
    if (!visitorIp) {
      return new Response(JSON.stringify({ message: '无法确定访客IP' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // --- 带重试逻辑的请求循环 ---
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      console.log(`--- 正在进行第 ${attempt} 次尝试: ${API_PROVIDER.name} ---`);
      try {
        const apiUrl = API_PROVIDER.getUrl(visitorIp);
        const response = await fetch(apiUrl, { signal: AbortSignal.timeout(3000) });

        if (!response.ok) {
          throw new Error(`响应失败 (状态码: ${response.status})`);
        }

        const data = await response.json();

        if (data && data.ip) {
          console.log(`成功获取数据: ${API_PROVIDER.name}`);
          // 成功！立即返回原始的、未经过滤的数据
          return new Response(JSON.stringify(data), {
            status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        throw new Error('收到的数据格式无效');

      } catch (error) {
        console.error(`第 ${attempt} 次尝试失败:`, error.message);
        if (attempt < MAX_RETRIES) {
          await delay(RETRY_DELAY);
        }
      }
    }

    // --- 所有重试都失败 ---
    console.error(`对 ${API_PROVIDER.name} 的所有 ${MAX_RETRIES} 次尝试均告失败。`);
    return new Response(JSON.stringify({ message: '多次重试后，GeoIP服务商仍无响应。' }), {
      status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  },
};
```

完成后，点击右上角的 `Save and deploy` (保存并部署)。

3. 设置触发路由(自定义域）
现在，我们需要告诉 Cloudflare，当用户访问哪个地址时应该触发这个 Worker。

- 回到 Worker 的主界面，切换到 Triggers (触发器) 选项卡。

- 在 Routes (路由) 部分，点击 Add route (添加路由)。

- 在 Route (路由) 输入框中，填入 *your-domain.com/api/geoip (请将 your-domain.com 换成你自己的域名)。

- 在 Zone (区域) 下拉菜单中，选择你对应的域名。

- 点击 `Add route` 保存。

恭喜！你的 API 中转站已经完全部署好了。

## 步骤二：前端集成

现在，改造你的前端代码，让它调用我们新建的这个稳定端点。这个过程非常简单。

以原生 JavaScript 为例，你的请求代码会是这样：

```
async function getVisitorInfo() {
  // ‼️ 注意：这里是你上一步设置的路由地址
  const workerApiUrl = '[https://your-domain.com/api/geoip](https://your-domain.com/api/geoip)';

  try {
    const response = await fetch(workerApiUrl);
    if (!response.ok) {
      throw new Error('请求Worker失败');
    }
    const data = await response.json();
    
    // 在这里使用 data，例如：
    console.log('访客IP:', data.ip);
    console.log('地理位置:', data.country, data.city);
    console.log('运营商:', data.organization);

  } catch (error) {
    console.error('获取访客信息失败:', error);
  }
}

getVisitorInfo();

```

## 举一反三：让它适配任何 API

这个 Worker 模板非常通用。你可以轻松地将它改造，用于代理任何第三方 API。

代理其他 GET 请求
只需修改 Worker 代码中的 `API_PROVIDER` 对象即可。例如，代理一个天气 API：

```
const API_PROVIDER = {
  name: 'WeatherAPI',
  // 假设天气API这样调用
  getUrl: () => `https://api.weather.com/v1/json?city=beijing&key=${env.WEATHER_API_KEY}`, 
};
```
代理 POST 请求并转发数据
如果需要转发 `POST` 请求体，可以这样修改 `fetch` 函数：

```
// ...
// 在 fetch 函数内部
const visitorIp = request.headers.get('CF-Connecting-IP');

// 检查请求方法
if (request.method === 'POST') {
    // 获取前端传来的JSON数据
    const body = await request.json();
    
    // 在请求第三方API时，将数据带上
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 如果需要，还可以转发其他头信息
        },
        body: JSON.stringify(body)
    });
    // ...后续逻辑不变
}
// ...
```

安全地处理 `API Key`

切勿将 API Key 硬编码在代码里！正确的做法是使用 Cloudflare Worker 的环境变量。

- 在 Worker 的设置页面，进入 `Settings` -> `Variables`。

- 点击 `Add variable`，设置一个变量名（如 `WEATHER_API_KEY`d），并填入你的密钥值，然后保存。

- 在代码中，通过 `env.变量名` 来访问它，如 `env.WEATHER_API_KEY`。

## 总结

通过 Cloudflare Workers，我们用极低的成本构建了一个强大、可靠且安全的 API 中转服务。它不仅解决了前端调用 API 时的各种痛点，还将复杂的重试和兜底逻辑封装在了云端，极大地简化了前端代码。

希望这篇教程能为你打开一扇新的大门。现在就开始动手，为你自己的项目也搭建一个这样的“超级代理”吧！
