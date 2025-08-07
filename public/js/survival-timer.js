/**
 * 博客存活时间计时器脚本
 * 这个脚本会自动寻找页面上的计时器容器，并根据其 data-create-time 属性来实时计算运行时间。
 */
function initSurvivalTimer() {
  // 寻找计时器容器元素
  const container = document.getElementById('blog-survival-timer-container');
  if (!container) {
    // 如果当前页面没有这个容器，就什么也不做
    return;
  }

  // 从容器的 data-create-time 属性获取建站日期
  const siteStartDate = container.dataset.createTime;
  const timeElement = document.getElementById('blog-survival-time');

  // 确保建站日期和时间显示元素都存在
  if (!siteStartDate || !timeElement) {
    return;
  }

  // 更新时间的函数
  function updateSurvivalTime() {
    const now = new Date();
    // 将 'YYYY-MM-DD' 格式的日期字符串转换为 Date 对象
    const startDate = new Date(siteStartDate + 'T00:00:00');
    const diff = now - startDate;

    // 计算天、小时、分钟、秒
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // 格式化输出
    const timeString = `${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒`;
    timeElement.textContent = timeString;
  }

  // 立即运行一次，并设置为每秒更新
  updateSurvivalTime();
  setInterval(updateSurvivalTime, 1000);
}

// 这是关键一步：确保在 Astro 页面切换（客户端路由）后，计时器能重新初始化
document.addEventListener('DOMContentLoaded', initSurvivalTimer);
document.addEventListener('astro:after-swap', initSurvivalTimer);
