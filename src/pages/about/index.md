---
title: "关于"
h1: "关于我"
desc: "Hi there, I’m IKUN 👋"
layout: "@/layouts/PageLayout/PageLayout.astro"
type: "about"
---

:::note{type="success"}
我是IKUN，一位对技术充满热情、涉猎广泛的探索者，同时也是一名热衷于探索前沿技术的实践者。

我始终保持对新技术的热情，并将我的知识与经验分享在我的博客中。

我的技术兴趣广泛，涵盖前端工程、云计算、自托管服务、AI 应用以及网络架构优化。我始终相信，优秀的技术人不仅要有深度，更要有广度，因此我不断学习新知识，并将其转化为实际解决方案。

我期待在这里与你分享我的见解、经验和最新的技术动态。
:::


**在 Web 开发方面**，我深耕 Vue.js 生态，并且关注了现代 CSS 框架如 Tailwind CSS。同时，对前端构建工具如 Webpack、Rollup 和 Vite 以及代码质量和规范工具如 ESLint 进行了研究，我还关注了前端性能优化。

**在后端开发和云计算领域**，我对 Node.js 生态系统非常熟悉，并积极探索 Serverless 架构。我长期使用 Cloudflare Workers、Vercel 和腾讯云 EdgeOne 等平台，优化边缘计算、KV 存储和全球 CDN 加速方案，确保应用的高可用性和低延迟。

**在自托管（Homelab）和个人服务器管理方面**，我对个人服务器运维充满热情，搭建了基于 Jellyfin 的媒体中心、Home Assistant 智能家居系统，并利用 OpenWrt 优化家庭网络。

**在人工智能与大型语言模型（LLMs）领域**，我密切关注 AI 领域的发展，尤其是 DeepSeek、Gemini 和 Claude 等大模型的应用。我尝试将 AI 能力整合到开发流程中，例如自动化文档生成、代码优化辅助，并且对 AI SDK 和相关工具保持关注。

**在网络与 DevOps 方面**，我熟悉 DNS 解析、CDN 加速、SSL 证书管理，并研究 TCP/IP、HTTP/3 等协议优化。我实践 Git 工作流、CI/CD 自动化（GitHub Actions / Cloudflare Pages），并利用 Docker 实现开发环境标准化。

**🚀 技术理念**

- **持续学习：** 技术日新月异，我始终保持开放心态，学习新框架、新工具，并评估其适用性。
- **实践驱动：** 无论是个人项目还是开源贡献，我都倾向于动手实践，而非仅停留在理论层面。
- **效率优先：** 我注重自动化与工具链优化，减少重复劳动，提升开发体验。

**🎯 未来方向**
未来，我计划进一步探索：

- **边缘计算与全球化部署**，优化分布式应用的性能。
- **AI 增强开发**，探索 LLM 在代码生成、调试和文档管理中的应用。
- **智能家居与自动化**，结合 Home Assistant 打造更高效的家庭 lab。

<!-- 引入 Font Awesome 图标库 -->   
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<style>
  body {
  .welcome-container {
    display: flex; /* 改为Flex布局 */
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    margin-top: 10px;
  }

  .welcome-gif {
    width: 200px;
    height: 40px;
    object-fit: contain;
    margin: 8px;
  }

  .welcome-text {
    font-size: 16px;
    color: #007bff;
    margin: 0 10px;
  }

  /* 新增三个图标/文字按钮的样式 */
  .top-icons {
    text-align: center;
    margin-bottom: 10px;
  }

  .top-icons a {
    margin: 0 12px;
    color: #444;
    font-size: 16px;        /* 字体大小适中 */
    text-decoration: none;
    transition: transform 0.3s, color 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;            /* 宽度变大，适合文字 */
    height: 40px;
    border: 2px solid #ccc;
    border-radius: 8px;
    background-color: white;
    font-weight: 600;
    user-select: none;
  }

  .top-icons a:hover {
    transform: scale(1.1);
  }

  /* 文字链接颜色区分 */
  .top-icons a.tempmail {
    color: #ff6600;
    border-color: #ff6600;
  }

  .top-icons a.tempmail:hover {
    color: white;
    background-color: #ff6600;
  }

  .top-icons a.tempmail2 {
    color: #3399ff;
    border-color: #3399ff;
  }

  .top-icons a.tempmail2:hover {
    color: white;
    background-color: #3399ff;
  }

  /* 图床图标+文字 */
  .top-icons a.imgsite {
    color: #6f42c1;
    border-color: #6f42c1;
    font-size: 18px;
    font-weight: 600;
  }

  .top-icons a.imgsite:hover {
    color: white;
    background-color: #6f42c1;
  }

  .top-icons a.imgsite i {
    margin-right: 6px;
  }

  /* 原有社交图标样式 */
  .social-icons {
    text-align: center;
    margin-top: 10px;
  }

  .social-icons a {
    margin: 0 12px;
    color: #444;
    font-size: 28px;
    text-decoration: none;
    transition: transform 0.3s, color 0.3s;
  }

  .social-icons a:hover {
    transform: scale(1.2);
  }

  .social-icons a.twitter:hover {
    color: #1da1f2;
  }

  .social-icons a.facebook:hover {
    color: #3b5998;
  }

  .social-icons a.email:hover {
    color: #d44638;
  }
</style>

<!-- 新增的两个文字邮箱服务和一个图床（图标+文字） -->
<div class="top-icons">
  <a href="https://mail1.8888.vvvv.ee/" class="tempmail" target="_blank" title="临时邮箱1">
    mail-1
  </a>
  <a href="https://mail.8888.vvvv.ee/" class="tempmail2" target="_blank" title="临时邮箱2">
    mail-2
  </a>
  <a href="https://img.8888.vvvv.ee/" class="imgsite" target="_blank" title="图床网站">
    <i class="fas fa-image"></i> 图床
  </a>
</div>

<!-- 修改后的欢迎区域 -->
<div class="welcome-container">
  <!-- 左侧新添加的GIF -->
  <img src="https://img.8888.vvvv.ee/file/图片/1750089446952.gif" alt="左侧GIF" class="welcome-gif" />
  
  <!-- 文本区域 -->
  <div class="welcome-text">欢迎各位IKUNS来到我的博客！</div>
  
  <!-- 原有的GIF -->
  <img src="https://img.8888.vvvv.ee/file/图片/1750064706928.gif" alt="右侧GIF" class="welcome-gif" />
</div>

<!-- Twitter, Facebook, Gmail 放在欢迎区域下面 -->
<div class="social-icons">
  <a href="https://twitter.com/ikun202491" class="twitter" target="_blank" title="Twitter">
    <i class="fab fa-twitter"></i>
  </a>
  <a href="https://facebook.com/profile.php?id=61552671213764" class="facebook" target="_blank" title="Facebook">
    <i class="fab fa-facebook"></i>
  </a>
  <a href="mailto:admin@ikun.x10.bz" class="email" title="发送邮件">
    <i class="fas fa-envelope"></i>
    
  </a>
</div>

