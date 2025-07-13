export default {
  // 网站标题
  Title: '𝐼𝐾𝑈𝑁的博客',
  // 网站地址
  Site: 'https://blog.marvel.qzz.io',
  // ... (其他配置保持不变) ...
  Subtitle: '唱跳𝓇𝒶𝓅打篮球，我是𝒾𝓀𝓊𝓃我最牛',
  Description: '𝐼𝐾𝑈𝑁博客 专注于前开发与相关技术的实战分享，涵盖𝑉𝑢𝑒框架、𝑁𝑜𝑑𝑒.𝑗𝑠、𝑆𝑒𝑟𝑣𝑒𝑟𝑙𝑒𝑠𝑠等，并涉及𝑁𝑜𝑑𝑒、𝑃𝑦𝑡ℎ𝑜𝑛、𝐿𝑖𝑛𝑢𝑥、𝐷𝑜𝑐𝑘𝑒𝑟等领域。同时，博客也分享作者的生活、音乐和旅行的热爱。',
  Author: '𝑰𝑲𝑼𝑵',
  Avatar: 'https://img.8888.vvvv.ee/file/图片/1751855752412.jpg',
  Motto: '莫愁天下无知己，天下谁人不识坤',
  Cover: '/assets/images/banner/xhj29.gif',

  // ==================== 已更新为新API的脚本 ====================
  head: [
    ['script', { src: 'https://cdn.jsdelivr.net/gh/TaylorLottner/Fork/sakura.js' }],
    // 这里是使用 vvhan API 的内联脚本
    ['script', {}, `
      document.addEventListener("DOMContentLoaded", function() {
        // 确保ID为 visitor-info 的元素存在于页面上
        if (document.getElementById('visitor-info')) {
          // 使用新的API地址
          fetch('https://api.vvhan.com/api/ipinfo')
            .then(response => response.json())
            .then(data => {
              const visitorInfoDiv = document.getElementById('visitor-info');
              // 检查API请求是否成功
              if (data.success && data.info) {
                // 根据新的数据结构 (data.info.xxx) 来构建HTML
                visitorInfoDiv.innerHTML = \`
                  <p style="margin: 5px 0;">🌍 <strong>来自:</strong> \${data.info.country} \${data.info.prov} \${data.info.city}</p>
                  <p style="margin: 5px 0;">🛰️ <strong>网络:</strong> \${data.info.isp}</p>
                \`;
              } else {
                // 如果API返回失败状态，显示错误信息
                throw new Error(data.message || '获取信息失败');
              }
            })
            .catch(error => {
              console.error('获取访客信息时出错:', error);
              const visitorInfoDiv = document.getElementById('visitor-info');
              visitorInfoDiv.innerHTML = "<p>抱歉，无法获取您的访客信息。</p>";
            });
        }
      });
    `]
  ],
  // ================================================================

  // 网站侧边栏公告 (显示区域保持不变)
  Tips: `<p>欢迎各位𝐼𝐾𝑈𝑁𝑆光临我的博客 🎉</p>
         <p>这里会分享我的日常和学习中的收集、整理及总结，希望能对你有所帮助:) 💖</p>
         <img src="https://img.8888.vvvv.ee/file/图片/1752036848067.webp" alt="welcome image" width="100%" />
         <div id="visitor-info" style="margin-top: 1rem; padding: 15px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9; text-align: left; font-size: 14px; line-height: 1.6;">
            <p>............</p>
         </div>`,

  // ... (后续所有其他配置保持不变) ...
  TypeWriteList: [
    '不曾与你分享的时间,我在进步.',
    "𝙄 𝙖𝙢 𝙢𝙖𝙠𝙞𝙣𝙜 𝙥𝙧𝙤𝙜𝙧𝙚𝙨𝙨 𝙞𝙣 𝙩𝙝𝙚 𝙩𝙞𝙢𝙚 𝙄 𝙝𝙖𝙫𝙚𝙣'𝙩 𝙨𝙝𝙖𝙧𝙚𝙙 𝙬𝙞𝙩𝙝 𝙮𝙤𝙪.",
  ],
  CreateTime: '2025-07-01',
  HomeBanner: {
    enable: true,
    HomeHeight: '54rem',
    PageHeight: '54rem',
    background: "url('/assets/images/www.alltoall.net_7月9日_4Z1MKq6eXI.gif') no-repeat center 60%/cover",
  },
  Theme: {
    "--vh-main-color": "#01C4B6",
    "--vh-font-color": "#34495e",
    "--vh-aside-width": "318px",
    "--vh-main-radius": "0.88rem",
    "--vh-main-max-width": "1458px",
  },
  Navs: [
    { text: '朋友', link: '/links', icon: 'Nav_friends' },
    { text: '动态', link: '/talking', icon: 'Nav_talking' },
    { text: '昔日', link: '/archives', icon: 'Nav_archives' },
    { text: '留言', link: '/message', icon: 'Nav_message' },
    { text: '关于', link: '/about', icon: 'Nav_about' },
  ],
  WebSites: [
    { text: 'Github', link: 'https://github.com/gdydg', icon: 'WebSite_github' },
    { text: '韩小韩API', link: 'https://api.vvhan.com', icon: 'WebSite_api' },
    { text: '每日热榜', link: 'https://new.idrive.qzz.io/', icon: 'WebSite_hot' },
    { text: 'ikun图床', link: 'https://img.8888.vvvv.ee/', icon: 'WebSite_img' },
    { text: 'HanAnalytics', link: 'https://analytic.idrive.qzz.io', icon: 'WebSite_analytics' },
  ],
  AsideShow: {
    WebSitesShow: true,
    CategoriesShow: true,
    TagsShow: true,
    recommendArticleShow: true
  },
  DNSOptimization: [
    'https://i0.wp.com',
    'https://cn.cravatar.com',
    'https://analytics.vvhan.com',
    'https://vh-api.4ce.cn',
    'https://registry.npmmirror.com',
    'https://pagead2.googlesyndication.com'
  ],
  vhMusicApi: 'https://vh-api.4ce.cn/blog/meting',
  Comment: {
    Twikoo: {
      enable: false,
      envId: ''
    },
    Waline: {
      enable: true,
      serverURL: 'https://comment.alina123.ggff.net'
    }
  },
  HanAnalytics: { enable: true, server: 'https://analytic.idrive.qzz.io', siteId: 'Hello-HanHexoBlog' },
  GoogleAds: {
    ad_Client: '',
    asideAD_Slot: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxx" data-ad-slot="xxxxxx" data-ad-format="auto" data-full-width-responsive="true"></ins>`,
    articleAD_Slot: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxx" data-ad-slot="xxxxxx" data-ad-format="auto" data-full-width-responsive="true"></ins>`
  },
  SeoPush: {
    enable: false,
    serverApi: '',
    paramsName: 'url'
  },
  ScrollSpeed: 666
}
