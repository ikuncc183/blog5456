---
title: 博客动态樱花特效+访客ip信息+目录组件
date: 2025-07-30 12:00:00
categories: code
tags:
  - 博客
  - 代码

id: 博客动态樱花特效+访客ip信息+目录组件
cover: '/assets/images/banner/072c12ec85d2d3b5.webp'
recommend: true
---

# 前言

暑假闲在家，无聊给自己博客美化了一下，包括了动态特效，侧边栏美化，文章目录识别等，一直修bug，现在终于解决了，下面是核心组件，适配了astro主题，想更新到自己博客可以问一下ai怎么迁移到你的博客,还有就是得根据自己的布局要求等修改配置，最好问ai怎么部署到自己博客，要到相应文件引入组件。

## 代码

### 一、樱花特效`SakuraEffect.astro`

```
<!-- 
  This is the final version of the SakuraEffect component.
  - Features multiple, randomized petal shapes based on user reference.
  - Petal size has been adjusted to be 5x larger than the previous version.
  - Code has been refactored for shape variation.
  - Removed circular shape and doubled the density.
  - Trajectory is now a natural, random fall from the top of the screen.
  - Density increased again by another factor of two.
-->
<canvas id="sakura-canvas"></canvas>

<style>
  #sakura-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Allows clicks to pass through the canvas */
    z-index: 9999;
  }
</style>

<script>
  const canvas = document.getElementById('sakura-canvas') as HTMLCanvasElement;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let petals: Petal[] = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // --- NEW: Array of functions to draw different petal shapes ---
    const petalShapes = [
      // Shape 1: Classic notched petal
      (ctx, s) => {
        ctx.beginPath();
        const scale = s / 10;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(scale, -scale*2, scale*2, -scale*2, scale*2, 0);
        ctx.bezierCurveTo(scale*2, scale*2, scale, scale*2, 0, scale*4);
        ctx.bezierCurveTo(-scale, scale*2, -scale*2, scale*2, -scale*2, 0);
        ctx.bezierCurveTo(-scale*2, -scale*2, -scale, -scale*2, 0, 0);
        ctx.fill();
        ctx.closePath();
      },
      // Shape 2: Simple, slightly curved petal
      (ctx, s) => {
        ctx.beginPath();
        const scale = s / 10;
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(scale * 2, scale * 2, scale * 4, 0);
        ctx.quadraticCurveTo(scale * 2, -scale * 2, 0, 0);
        ctx.fill();
        ctx.closePath();
      },
      // Shape 3: Fuller, more rounded petal
      (ctx, s) => {
        ctx.beginPath();
        const scale = s / 10;
        ctx.arc(0, 0, scale * 2, 0, Math.PI);
        ctx.quadraticCurveTo(-scale * 2, -scale * 2, 0, 0);
        ctx.fill();
        ctx.closePath();
      },
      // Shape 4: Long, thin, stretched petal
      (ctx, s) => {
        ctx.beginPath();
        const scale = s / 10;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(scale * 3, scale, scale * 3, -scale * 2, scale * 5, -scale * 3);
        ctx.bezierCurveTo(scale * 2, -scale, 0, 0, 0, 0);
        ctx.fill();
        ctx.closePath();
      },
      // Shape 5: A slightly twisted petal
      (ctx, s) => {
        ctx.beginPath();
        const scale = s / 10;
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(scale, -scale * 2, scale * 3, -scale * 2);
        ctx.quadraticCurveTo(scale * 2, 0, 0, 0);
        ctx.fill();
        ctx.closePath();
      }
      // Shape 6 (circular) has been removed.
    ];

    class Petal {
      x: number;
      y: number;
      size: number;
      speedY: number;
      angle: number;
      spin: number;
      sway: number;
      color: string;
      depth: number;
      shapeId: number; // To store which shape this petal is

      constructor() {
        this.depth = Math.random();
        // Adjusted size to be 5x larger than the previous version
        this.size = ((this.depth * 8) + 5) * 7.5; 
        // Start from a random horizontal position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height; // Start above the screen
        this.speedY = (this.depth * 0.8) + 0.7;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() < 0.5 ? -1 : 1;
        // Increased sway for more horizontal movement
        this.sway = Math.random() * 1.5 + 0.5;
        this.color = `rgba(255, 192, 203, ${this.depth * 0.5 + 0.5})`;
        // Assign a random shape to each petal
        this.shapeId = Math.floor(Math.random() * petalShapes.length);
      }

      update() {
        // Only vertical speed is fixed
        this.y += this.speedY;
        // Horizontal movement is now a gentle, random sway
        this.x += Math.sin(this.angle) * this.sway;
        this.angle += 0.03 * this.spin;

        // Reset petal if it goes off screen (bottom, left, or right)
        if (this.y > canvas.height + this.size || this.x < -this.size || this.x > canvas.width + this.size) {
          // Reset to a random position at the top
          this.x = Math.random() * canvas.width;
          this.y = -this.size; // Start just above the screen
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
        ctx.shadowBlur = 5; // Reduced blur for smaller petals

        ctx.fillStyle = this.color;
        
        // Call the specific shape drawing function
        petalShapes[this.shapeId](ctx, this.size);
        
        ctx.restore();
      }
    }

    function init() {
      // Density increased again by another factor of two.
      const numberOfPetals = Math.floor(window.innerWidth / 38);
      for (let i = 0; i < numberOfPetals; i++) {
        petals.push(new Petal());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw();
      }
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      petals = [];
      init();
    });

    init();
    animate();
  }
</script>
```
### 二、访客ip信息`VisitorInfo.astro`
```
---
// src/components/VisitorInfo.astro
// 这是一个新的组件，用于显示访客信息
---

<section class="vh-aside-item">

    <!-- 标题，样式参考了主题中的“公告”块 -->
    <span class="visitor-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        欢迎来访!
    </span>
    <!-- 新增的欢迎信息块 -->
    <div class="welcome-message">
        <p>👋 我是𝙄𝙆𝙐𝙉，一个技术爱好者，喜欢分享经验。😊</p>
        <p>❓ 有问题欢迎提问，确保内容有意义，详情请见<a href="/message/" target="_message" rel="noopener noreferrer">提问的智慧</a>。如需联系我，欢迎通过<a href="mailto:admin@204090.xyz">邮箱联系我</a>！📧</p>
    </div>

    <!-- 信息内容 -->
    <div class="visitor-content">
        <div class="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7M10.5 14h3a5.5 5.5 0 0 1 5.5 5.5v1h-14v-1A5.5 5.5 0 0 1 10.5 14M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2S2 6.477 2 12"></path></svg>
            <span>IP 地址:</span>
            <span id="ip-address">正在加载...</span>
        </div>
        <div class="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"></path></svg>
            <span>地理位置:</span>
            <span id="location">正在加载...</span>
        </div>
        <div class="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="19" r="3"/><path d="M10.4 16.38L15 10l-2.42-2.42"/></svg>
            <span>与博主距离:</span>
            <span id="distance">正在计算...</span>
        </div>
        <div class="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
            <span>运 营 商:</span>
            <span id="isp">正在加载...</span>
        </div>
        <div class="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M2 6v12h20V6zm18 10H4V8h16z"></path></svg>
            <span>操作系统:</span>
            <span id="os">正在加载...</span>
        </div>
        <div class="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m-4-8a4 4 0 0 1 4-4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4Z"></path></svg>
            <span>浏 览 器:</span>
            <span id="browser">正在加载...</span>
        </div>
    </div>

</section>

<style>
    .vh-aside-item .welcome-message {
        padding-bottom: 0.75rem;
        margin-bottom: 0.75rem;
        border-bottom: 1px solid var(--border-color, #e5e7eb);
        font-size: 0.875rem;
        color: var(--text-color, #374151);
    }
    .vh-aside-item .welcome-message p {
        margin: 0.5rem 0;
        line-height: 1.6;
    }
    .vh-aside-item .welcome-message a {
        color: var(--theme-color, #3eaf7c);
        text-decoration: none;
        font-weight: 600;
    }
    .vh-aside-item .welcome-message a:hover {
        text-decoration: underline;
    }
    .vh-aside-item .visitor-title {
        display: flex;
        align-items: center;
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--border-color, #e5e7eb);
    }
    .vh-aside-item .visitor-title svg {
        margin-right: 0.5rem;
    }
    .vh-aside-item .visitor-content {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    .vh-aside-item .info-item {
        display: flex;
        align-items: center;
        font-size: 0.875rem;
        color: var(--text-color-light, #6b7280);
    }
    .vh-aside-item .info-item svg {
        margin-right: 0.75rem;
        flex-shrink: 0;
    }
    .vh-aside-item .info-item span:nth-of-type(1) {
        min-width: 60px;
        color: var(--text-color, #374151);
    }
    .vh-aside-item .info-item span:last-child {
        word-break: break-all;
        overflow-wrap: break-word;
    }
</style>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const BLOGGER_LAT = 23.0575;
    const BLOGGER_LON = 112.4536;

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 0.5 - Math.cos(dLat) / 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos(dLon)) / 2;
        return Math.round(R * 2 * Math.asin(Math.sqrt(a)));
    };

    const getOS = () => {
      const ua = navigator.userAgent;
      if (ua.includes('Win')) return 'Windows';
      if (ua.includes('Mac')) return 'MacOS';
      if (ua.includes('Linux')) return 'Linux';
      if (ua.includes('Android')) return 'Android';
      if (ua.includes('like Mac')) return 'iOS';
      return 'Unknown';
    };

    const getBrowser = () => {
      const ua = navigator.userAgent;
      if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
      if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
      if (ua.includes('Firefox')) return 'Firefox';
      if (ua.includes('Edg')) return 'Edge';
      return 'Unknown';
    };
    
    const setInfo = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    
    const setAllToFailure = () => {
        setInfo('ip-address', '获取失败');
        setInfo('location', '获取失败');
        setInfo('isp', '获取失败');
        setInfo('distance', '获取失败');
    };

    // 定义所有API端点和它们的数据解析器，优先使用国内API
    const apiEndpoints = [
        { name: 'ip.sb', url: 'https://api.ip.sb/geoip', parser: data => ({ ip: data.ip, location: `${data.country || ''}, ${data.city || ''}`, isp: data.organization, lat: data.latitude, lon: data.longitude }) },
        {
            name: 'api.vore.top',
            url: 'https://api.vore.top/api/IPdata',
            parser: (data) => {
                if(data.code !== 200 || !data.ipinfo) return null;
                return {
                    ip: data.ipinfo.ip,
                    location: `${data.ipinfo.info.country || ''}, ${data.ipinfo.info.province || ''}, ${data.ipinfo.info.city || ''}`.replace(/, $/, ''),
                    isp: data.ipinfo.info.isp,
                    lat: data.ipinfo.adcode.lat,
                    lon: data.ipinfo.adcode.lng,
                }
            }
        },
        {
            name: 'api.oioweb.cn',
            url: 'https://api.oioweb.cn/api/ip/ipaddress',
            parser: (data) => {
                if(data.code !== 200 || !data.result) return null;
                return {
                    ip: data.result.ip,
                    location: `${data.result.country || ''}, ${data.result.province || ''}, ${data.result.city || ''}`.replace(/, $/, ''),
                    isp: data.result.isp,
                };
            }
        },
        { name: 'ipapi.co', url: 'https://ipapi.co/json/', parser: data => ({ ip: data.ip, location: `${data.country_name || ''}, ${data.city || ''}`, isp: data.org, lat: data.latitude, lon: data.longitude }) },
        { name: 'vvhan.com', url: 'https://api.vvhan.com/api/ipInfo?type=json', parser: data => data.success ? { ip: data.ip, location: `${data.info.country || ''}, ${data.info.city || ''}`, isp: data.info.isp } : null },
        { name: 'ip-api.com', url: 'https://ip-api.com/json', parser: data => data.status === 'success' ? { ip: data.query, location: `${data.country || ''}, ${data.city || ''}`, isp: data.isp, lat: data.lat, lon: data.lon } : null }
    ];

    const fetchIpInfo = async () => {
        setInfo('os', getOS());
        setInfo('browser', getBrowser());

        let finalData = {};

        for (const api of apiEndpoints) {
            if (finalData.lat && finalData.lon) break;
            
            try {
                const response = await fetch(api.url);
                if (!response.ok) throw new Error(`Response not OK for ${api.name}`);
                const data = await response.json();
                const parsed = api.parser(data);
                if (parsed) {
                    finalData = { ...finalData, ...parsed };
                }
            } catch (error) {
                console.error(`Error from ${api.name}:`, error);
            }
        }

        if (finalData.ip && !finalData.lat) {
            console.log(`Have IP (${finalData.ip}) but no coordinates. Trying final lookup.`);
            try {
                const response = await fetch(`https://ip-api.com/json/${finalData.ip}`);
                if (!response.ok) throw new Error('Final lookup failed');
                const data = await response.json();
                if (data.status === 'success') {
                    finalData.lat = data.lat;
                    finalData.lon = data.lon;
                }
            } catch (error) {
                console.error('Error during final coordinate lookup:', error);
            }
        }

        if (finalData.ip) {
            setInfo('ip-address', finalData.ip);
            setInfo('location', finalData.location || 'N/A');
            setInfo('isp', finalData.isp || 'N/A');
            
            if (finalData.lat && finalData.lon) {
                const dist = calculateDistance(BLOGGER_LAT, BLOGGER_LON, finalData.lat, finalData.lon);
                setInfo('distance', `约 ${dist} 公里`);
            } else {
                setInfo('distance', '无法计算');
            }
        } else {
            setAllToFailure();
        }
    };

    fetchIpInfo();
  });
</script>
```
### 三、目录组件有两个文件`TocManager.astro`和`TableOfContents.less`
```
---
// src/components/TocManager.astro
// 这个组件是"目录"功能的大脑，它只包含客户端脚本，
// 负责在每次页面切换后，动态地生成和管理目录。
---
<script>
    // 函数：添加滚动监听，实现当前章节高亮
    function addScrollListener() {
        const tocLinks = document.querySelectorAll('#toc-placeholder .toc-list a');
        if (tocLinks.length === 0) return;

        let currentActiveId = null;
        
        // 清理之前的观察器
        if (window.tocObserver) {
            window.tocObserver.disconnect();
        }
        
        window.tocObserver = new IntersectionObserver(entries => {
            let topmostEntry = null;
            let topmostTop = Infinity;
            
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const top = entry.boundingClientRect.top;
                    if (top < topmostTop) {
                        topmostTop = top;
                        topmostEntry = entry;
                    }
                }
            });

            if (topmostEntry) {
                const id = topmostEntry.target.getAttribute('id');
                if (id && id !== currentActiveId) {
                    // 移除所有激活状态
                    const allActiveLinks = document.querySelectorAll('#toc-placeholder .toc-list a.active');
                    allActiveLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // 添加新的激活状态
                    const newActiveLink = document.querySelector(`#toc-placeholder .toc-list a[href="#${id}"]`);
                    if (newActiveLink) {
                        newActiveLink.classList.add('active');
                        currentActiveId = id;
                        
                        // 调试信息 - 可以在部署前删除
                        console.log('TOC: Active section changed to:', id);
                    }
                }
            }
        }, { 
            rootMargin: '-10% 0px -70% 0px', 
            threshold: [0, 0.25, 0.5, 0.75, 1]
        });

        // 观察所有标题元素 - 适配vhAstro-Theme的文章结构
        const headingSelector = '.main-inner-content h1[id], .main-inner-content h2[id], .main-inner-content h3[id], .main-inner-content h4[id], .main-inner-content h5[id], .main-inner-content h6[id], article h1[id], article h2[id], article h3[id], article h4[id], article h5[id], article h6[id]';
        const headings = document.querySelectorAll(headingSelector);
        
        headings.forEach(heading => {
            window.tocObserver.observe(heading);
        });
        
        // 初始化时设置第一个标题为激活状态
        if (headings.length > 0 && !currentActiveId) {
            const firstHeadingId = headings[0].getAttribute('id');
            if (firstHeadingId) {
                const firstLink = document.querySelector(`#toc-placeholder .toc-list a[href="#${firstHeadingId}"]`);
                if (firstLink) {
                    firstLink.classList.add('active');
                    currentActiveId = firstHeadingId;
                }
            }
        }
    }

    // 函数：根据扫描到的标题，构建目录的 HTML
    function buildTocHtml(headings) {
        const listItems = headings.map(heading => `
            <li class="toc-item depth-${heading.depth}">
                <a href="#${heading.slug}" data-toc-link="${heading.slug}">
                    <span class="toc-text">${heading.text}</span>
                </a>
            </li>
        `).join('');

        return `
            <div class="toc-wrapper">
                <h3 class="toc-title">目录</h3>
                <ul class="toc-list">${listItems}</ul>
            </div>
        `;
    }

    // 主函数：管理目录的显示与隐藏
    function manageToc() {
        const placeholder = document.getElementById('toc-placeholder');
        if (!placeholder) return;

        const isArticlePage = window.location.pathname.startsWith('/article/');
        if (!isArticlePage) {
            placeholder.innerHTML = '';
            placeholder.style.display = 'none';
            // 清理观察器
            if (window.tocObserver) {
                window.tocObserver.disconnect();
                window.tocObserver = null;
            }
            return;
        }

        const headingElements = document.querySelectorAll('.main-inner-content h1[id], .main-inner-content h2[id], .main-inner-content h3[id], .main-inner-content h4[id], .main-inner-content h5[id], .main-inner-content h6[id], article h1[id], article h2[id], article h3[id], article h4[id], article h5[id], article h6[id]');
        
        if (headingElements.length === 0) {
            placeholder.innerHTML = '';
            placeholder.style.display = 'none';
            return;
        }

        const headings = Array.from(headingElements).map(el => ({
            depth: parseInt(el.tagName.substring(1), 10),
            text: (el.textContent || '').trim(),
            slug: el.id
        }));
        
        const validHeadings = headings.filter(h => h.text && h.slug && h.depth >= 1 && h.depth <= 6);

        if (validHeadings.length > 0) {
            const tocHtml = buildTocHtml(validHeadings);
            placeholder.innerHTML = tocHtml;
            placeholder.style.display = 'block';
            
            // 延迟执行滚动监听，确保DOM完全渲染
            setTimeout(() => {
                addScrollListener();
            }, 100);
        } else {
            placeholder.innerHTML = '';
            placeholder.style.display = 'none';
        }
    }

    // 页面加载完成后初始化
    document.addEventListener('astro:after-swap', manageToc);
    document.addEventListener('DOMContentLoaded', manageToc);
    
    // 清理函数
    document.addEventListener('astro:before-swap', () => {
        if (window.tocObserver) {
            window.tocObserver.disconnect();
            window.tocObserver = null;
        }
    });
</script>
```
```
/* src/components/TableOfContents.less */
/* 使用主题自带的CSS变量，与vhAstro-Theme保持一致 */

/* 添加全局样式，确保在vhAstro-Theme中正常工作 */
:global(#toc-placeholder) {
  /* 确保目录容器样式不被主题覆盖 */
}

/* 使用 #toc-placeholder ID 来提高所有规则的优先级 */
#toc-placeholder .toc-wrapper {
  position: sticky;
  top: 80px;
}

#toc-placeholder .toc-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* 字母间距 */
  color: var(--vh-main-color, #01C4B6); /* 使用主题主色 */
  margin: 0 0 1rem 0;
  padding: 0;
}

#toc-placeholder .toc-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
}

#toc-placeholder .toc-item a {
  display: block;
  text-decoration: none;
  padding: 4px 0; /* 调整垂直内边距 */
  border-left: 2px solid transparent;
  transition: all 0.2s ease-in-out;
  padding-left: 1rem;
  font-size: 14px;
  font-weight: 400;
  color: var(--vh-font-color, #34495e); /* 使用主题字体颜色 */
}

#toc-placeholder .toc-text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease-in-out;
}

/* --- 层级样式：缩进和字体粗细 --- */
#toc-placeholder .toc-item.depth-1 a {
    font-weight: 500;
}

#toc-placeholder .toc-item.depth-2 a {
    /* 保持默认样式 */
}

#toc-placeholder .toc-item.depth-3 a {
    padding-left: 2rem;
}

#toc-placeholder .toc-item.depth-4 a {
    padding-left: 3rem;
}

#toc-placeholder .toc-item.depth-5 a {
    padding-left: 4rem;
}

/* --- 悬浮效果：仅改变文字颜色 --- */
#toc-placeholder .toc-item a:hover {
  color: var(--vh-main-color, #01C4B6) !important;
}

/* --- 激活效果：改变文字颜色并显示左侧竖线 --- */
/* 使用更高优先级的选择器并添加 !important */
#toc-placeholder .toc-list .toc-item a.active,
#toc-placeholder .toc-item a.active {
  color: var(--vh-main-color, #01C4B6) !important; /* 激活时文字变主题色 */
  font-weight: 500 !important; /* 激活时字体加粗一点 */
  border-left-color: var(--vh-main-color, #01C4B6) !important; /* 显示主题色的竖线 */
}

/* 确保激活状态的文字颜色优先级最高 */
#toc-placeholder .toc-list .toc-item a.active .toc-text,
#toc-placeholder .toc-item a.active .toc-text {
  color: inherit !important;
}
```
