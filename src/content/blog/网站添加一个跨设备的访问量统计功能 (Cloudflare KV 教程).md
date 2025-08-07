---
title: 网站添加一个跨设备的访问量统计功能 (Cloudflare KV 教程)
date: 2025-08-08 00:00:00
categories: Code
tags:
  - WebAnalytics
  - Cloudflare Workers
  - KV

id: "erhrehtrjtr"
cover: "https://iili.io/FitsZSS.png"
recommend: true
---


## 如何为你的网站添加一个跨设备的访问量统计功能 (Cloudflare KV 教程)

本教程将指导你如何为任何网站添加一个精准、稳定、且跨设备共享的访问量统计功能。我们将使用 Cloudflare Workers 和 KV 数据库来实现这个功能，完全免费。

最终效果如下：

### 第一步：添加 HTML 结构

首先，在你想要显示访问统计的地方（比如页脚` <footer>`），粘贴以下 HTML 代码。

```
<!-- 访问统计显示区域 -->
<div class="visitor-stats">
    <div class="stats-container">
        <span class="stat-item">
            本日访问量 <span class="stat-number" id="dailyVisits">-</span> 次
        </span>
        <span class="stat-separator">|</span>
        <span class="stat-item">
            本日访客数 <span class="stat-number" id="dailyVisitors">-</span> 人
        </span>
        <span class="stat-separator">|</span>
        <span class="stat-item">
            本站总访问量 <span class="stat-number" id="totalVisits">-</span> 次
        </span>
        <span class="stat-separator">|</span>
        <span class="stat-item">
            总访客数 <span class="stat-number" id="totalVisitors">-</span> 人
        </span>
    </div>
</div>
```

### 第二步：添加 CSS 样式

接下来，将下面的 CSS 代码添加到你的网站样式表 `<style> `标签中，用于美化统计信息的显示。

```
/* --- 访问统计样式 --- */
.visitor-stats {
    text-align: center;
    margin: 20px 0;
}

.stats-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.stat-item {
    color: #ff4747; /* 标签文字颜色 (高亮红色) */
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-shadow: 0 0 5px rgba(255, 71, 71, 0.7);
}

.stat-number {
    color: #8de2e0; /* 数字颜色 */
    font-weight: 600;
    text-shadow: 0 0 8px rgba(141, 226, 224, 0.6);
}

.stat-separator {
    color: #53a8b6; /* 分隔符颜色 */
    font-weight: 300;
}

/* 简单的响应式调整 */
@media (max-width: 480px) {
    .stats-container {
        flex-direction: column;
        gap: 8px;
    }
    .stat-separator {
        display: none;
    }
}
```

### 第三步：创建 Cloudflare 后端服务

这是最关键的一步，我们将创建一个免费的后端服务来存储和计算访问数据。

- 登录 Cloudflare 仪表盘，在左侧菜单进入 Workers & Pages。
- 点击 创建应用程序 > 创建 Worker。可以给它取一个你喜欢的名字（例如 my-site-counter），然后点击 部署。
- 部署成功后，点击 编辑代码。将编辑器里原有的代码全部删除，然后粘贴以下完整的 Worker 脚本。这个版本已经配置为按北京时间重置。

```
/**
 * Cloudflare Worker for a simple, privacy-friendly site view counter. (Version 3 - Beijing Time)
 *
 * - Expects POST requests to / to increment stats.
 * - Responds to GET requests to / with the current stats.
 * - Uses Cloudflare KV to store statistics.
 *
 * Required KV Namespace Binding:
 * - STATS_KV: The namespace where stats are stored.
 */

const STATS_KEY = "site_stats";

const defaultStats = {
  totalVisits: 0,
  totalVisitors: 0,
  dailyVisits: 0,
  dailyVisitors: 0,
  lastResetDate: "1970-01-01",
};

export default {
  async fetch(request, env, ctx) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/") {
      return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers });
    }

    try {
      if (request.method === "GET") {
        const stats = await getStats(env.STATS_KV);
        return new Response(JSON.stringify(stats), { headers });
      }

      if (request.method === "POST") {
        const payload = await request.json();
        const updatedStats = await updateStats(env.STATS_KV, payload);
        return new Response(JSON.stringify(updatedStats), { headers });
      }

      return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers });
    } catch (e) {
      console.error("Worker error:", e);
      return new Response(JSON.stringify({ error: "Internal Server Error", message: e.message }), { status: 500, headers });
    }
  },
};

async function getStats(kv) {
  let stats = await kv.get(STATS_KEY, { type: "json" });
  return stats || { ...defaultStats };
}

async function updateStats(kv, payload) {
  let stats = await getStats(kv);

  // 获取北京时间 (UTC+8) 的日期
  const beijingTimeNow = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
  const today = beijingTimeNow.toISOString().split("T")[0];

  // 如果日期已更改，则重置每日计数
  if (stats.lastResetDate !== today) {
    stats.dailyVisits = 0;
    stats.dailyVisitors = 0;
    stats.lastResetDate = today;
  }

  // 总是增加总访问量和每日访问量 (每次 POST 请求都算一次)
  stats.totalVisits = (stats.totalVisits || 0) + 1;
  stats.dailyVisits = (stats.dailyVisits || 0) + 1;

  // 仅当标志为 true 时增加总访客数
  if (payload.isNewTotalVisitor) {
    stats.totalVisitors = (stats.totalVisitors || 0) + 1;
  }

  // 仅当标志为 true 时增加每日访客数
  if (payload.isNewDailyVisitor) {
    stats.dailyVisitors = (stats.dailyVisitors || 0) + 1;
  }

  // 将更新后的统计数据保存回 KV
  await kv.put(STATS_KEY, JSON.stringify(stats));
  return stats;
}
```

4.创建并绑定 KV 数据库：

- 回到你的 Worker 页面，点击 设置 > 变量。
- 找到 KV Namespace 绑定，点击 添加绑定。
- 变量名称 必须填写 STATS_KV。
- 在 KV namespace 栏位，点击下拉框并选择 创建新的命名空间。给它起个名字，比如 SITE_STATS，然后点击创建。
- 最后，点击页面底部的 保存并部署。

5.获取你的 Worker URL：回到你的 Worker 主页，URL 会显示在顶部（格式为 你的worker名.你的子域.workers.dev）。复制这个 URL，下一步要用。

### 第四步：添加前端 JavaScript 逻辑

最后，将下面的 JavaScript 代码添加到你网站的 <script> 标签中。

重要提示： 请务必将代码中的 `CF_WORKER_URL` 变量的值替换为你上一步复制的你自己的 `Worker URL`。

```
// === 访问统计功能 (Cloudflare Worker 版本) ===
class BlogVisitorStats {
    constructor(workerUrl) {
        this.workerUrl = workerUrl; 
        // 使用 v2 版本的 key 来避免旧数据冲突
        this.visitorIdKey = 'ikun-blog-visitor-id-v2';
        this.lastVisitKey = 'ikun-blog-last-visit-v2';
        
        if (!this.workerUrl) {
            console.error("Worker URL 未设置。访客统计功能将无法工作。");
            return;
        }
        this.init();
    }

    async init() {
        // 页面加载时，总是尝试追踪访问并更新统计
        this.trackVisit();
    }

    // 从 worker 获取最新统计数据并更新 UI (作为备用)
    async displayStatsFallback() {
        try {
            // 添加时间戳作为查询参数以防止缓存
            const url = `${this.workerUrl}?t=${new Date().getTime()}`;
            const response = await fetch(url, { method: 'GET' });
            if (!response.ok) throw new Error(`Worker 响应状态: ${response.status}`);
            const stats = await response.json();
            this.updateUi(stats);
        } catch (error) {
            console.error("获取访客统计失败:", error);
        }
    }

    // 通过向 worker 发送数据来追踪访问
    async trackVisit() {
        const visitorId = this.getVisitorId();
        const lastVisitDate = localStorage.getItem(this.lastVisitKey);
        const today = new Date().toISOString().split('T')[0];

        // 确定访客状态
        const isNewTotalVisitor = !localStorage.getItem(this.visitorIdKey);
        const isNewDailyVisitor = lastVisitDate !== today;

        try {
            // 添加时间戳作为查询参数以防止缓存
            const url = `${this.workerUrl}?t=${new Date().getTime()}`;
            // 每次页面加载都发送 POST 请求
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isNewTotalVisitor, isNewDailyVisitor }),
            });

            if (!response.ok) throw new Error(`Worker 响应状态: ${response.status}`);
            
            const stats = await response.json();
            this.updateUi(stats); // 使用来自 worker 的最新数据更新 UI

            // 成功请求后，更新 localStorage
            if (isNewTotalVisitor) {
                localStorage.setItem(this.visitorIdKey, visitorId);
            }
            localStorage.setItem(this.lastVisitKey, today);

        } catch (error) {
            console.error("追踪访问失败:", error);
            // 如果追踪失败，至少尝试获取并显示当前的统计数据
            this.displayStatsFallback();
        }
    }
    
    // 从 localStorage 获取或创建一个唯一的浏览器 ID
    getVisitorId() {
        let id = localStorage.getItem(this.visitorIdKey);
        if (!id) {
            id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        return id;
    }

    // 统一的 UI 更新函数
    updateUi(stats) {
        this.updateElement('dailyVisits', stats.dailyVisits || 0);
        this.updateElement('dailyVisitors', stats.dailyVisitors || 0);
        this.updateElement('totalVisits', stats.totalVisits || 0);
        this.updateElement('totalVisitors', stats.totalVisitors || 0);
    }

    // 更新页面元素的文本内容的辅助函数
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value.toLocaleString();
        }
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // !!! 在这里粘贴你自己的 Worker URL !!!
    const CF_WORKER_URL = "https://你的worker名.你的子域.workers.dev";
    new BlogVisitorStats(CF_WORKER_URL);
});

```

恭喜！完成以上所有步骤后，你的网站就拥有了一个功能完善的、并按北京时间重置的访问量统计器。

