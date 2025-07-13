export default {
  // 网站标题
  Title: '𝐼𝐾𝑈𝑁的博客',
  // 网站地址
  Site: 'https://blog.marvel.qzz.io',
  // 网站副标题
  Subtitle: '唱跳𝓇𝒶𝓅打篮球，我是𝒾𝓀𝓊𝓃我最牛',
  // 网站描述
  Description: '𝐼𝐾𝑈𝑁博客 专注于前开发与相关技术的实战分享，涵盖𝑉𝑢𝑒框架、𝑁𝑜𝑑𝑒.𝑗𝑠、𝑆𝑒𝑟𝑣𝑒𝑟𝑙𝑒𝑠𝑠等，并涉及𝑁𝑜𝑑𝑒、𝑃𝑦𝑡ℎ𝑜𝑛、𝐿𝑖𝑛𝑢𝑥、𝐷𝑜𝑐𝑘𝑒𝑟等领域。同时，博客也分享作者的生活、音乐和旅行的热爱。',
  // 网站作者
  Author: '𝑰𝑲𝑼𝑵',
  // 作者头像
  Avatar: 'https://img.8888.vvvv.ee/file/图片/1751855752412.jpg',
  // 网站座右铭
  Motto: '莫愁天下无知己，天下谁人不识坤',
  // Cover 网站缩略图
  Cover: '/assets/images/banner/xhj29.gif',

  // ==================== 修改部分 1: 添加访客信息脚本 ====================
  /**
   * 向页面的 <head> 标签中添加额外的元数据或脚本。
   */
  head: [
    // [标签名, { 属性: 值 }]
    ['script', { src: 'https://cdn.jsdelivr.net/gh/TaylorLottner/Fork/sakura.js' }],
    // 这里添加了获取访客信息的内联脚本
    ['script', {}, `
      document.addEventListener("DOMContentLoaded", function() {
        if (document.getElementById('visitor-info')) {
          fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
              const visitorInfoDiv = document.getElementById('visitor-info');
              visitorInfoDiv.innerHTML = \`
                <p style="margin: 5px 0;">🌍 <strong>来自:</strong> \${data.city}, \${data.region}</p>
                <p style="margin: 5px 0;">📍 <strong>国家/地区:</strong> \${data.country_name}</p>
                <p style="margin: 5px 0;">🛰️ <strong>网络服务商:</strong> \${data.org}</p>
              \`;
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

  // 网站侧边栏公告 (不填写即不开启)
  // ==================== 修改部分 2: 更新Tips内容 ====================
  Tips: `<p>欢迎各位𝐼𝐾𝑈𝑁𝑆光临我的博客 🎉</p>
         <p>这里会分享我的日常和学习中的收集、整理及总结，希望能对你有所帮助:) 💖</p>
         <img src="https://img.8888.vvvv.ee/file/图片/1752036848067.webp" alt="welcome image" width="100%" />
         <div id="visitor-info" style="margin-top: 1rem; padding: 15px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9; text-align: left; font-size: 14px; line-height: 1.6;">
            <p>正在努力获取您的信息...</p>
         </div>`,
  // ================================================================

  // 首页打字机文案列表
  TypeWriteList: [
    '不曾与你分享的时间,我在进步.',
    "𝙄 𝙖𝙢 𝙢𝙖𝙠𝙞𝙣𝙜 𝙥𝙧𝙤𝙜𝙧𝙚𝙨𝙨 𝙞𝙣 𝙩𝙝𝙚 𝙩𝙞𝙢𝙚 𝙄 𝙝𝙖𝙫𝙚𝙣'𝙩 𝙨𝙝𝙖𝙧𝙚𝙙 𝙬𝙞𝙩𝙝 𝙮𝙤𝙪.",
  ],
  // 网站创建时间
  CreateTime: '2025-07-01',
  // 顶部 Banner 配置
  HomeBanner: {
    enable: true,
    HomeHeight: '54rem',
    PageHeight: '54rem',
    background: "url('/assets/images/www.alltoall.net_7月9日_4Z1MKq6eXI.gif') no-repeat center 60%/cover",
  },
  // 博客主题配置
  Theme: {
    "--vh-main-color": "#01C4B6",
    "--vh-font-color": "#34495e",
    "--vh-aside-width": "318px",
    "--vh-main-radius": "0.88rem",
    "--vh-main-max-width": "1458px",
  },
  // ... 后续其他配置保持不变 ...
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
