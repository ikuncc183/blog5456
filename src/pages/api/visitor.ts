// src/pages/api/visitor.ts

import type { APIContext } from 'astro';

// 关键：添加此行以禁用预渲染。
// 这告诉 Astro 该路由应该在服务器上动态处理，以便访问访客的 IP 地址。
export const prerender = false;

/**
 * 使用 Haversine 公式计算两个地理坐标之间的距离
 * @returns 两点之间的距离（公里）
 */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // 地球半径（公里）
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance);
}

// Astro 的 API 路由导出 GET, POST, etc. 函数
export async function GET({ request, clientAddress }: APIContext) {
    // --- 目标地点坐标 (默认为北京天安门) ---
    const targetLocation = {
        name: "北京",
        latitude: 39.9042,
        longitude: 116.4074
    };

    // 当部署到 Cloudflare 时，`request.cf` 对象会自动包含地理位置等信息
    const cf = (request as any).cf;

    const city = cf?.city ?? '未知';
    const country = cf?.country ?? '未知';
    const region = cf?.region ?? '未知';
    const timezone = cf?.timezone ?? '未知';
    const visitorLat = cf?.latitude ? parseFloat(cf.latitude) : null;
    const visitorLon = cf?.longitude ? parseFloat(cf.longitude) : null;
    const isp = cf?.asOrganization ?? '未知';

    // `clientAddress` 是 Astro 获取访客真实 IP 的标准方式
    const ip = clientAddress;

    const ua = request.headers.get('User-Agent') ?? '';

    // 计算距离
    let distance = null;
    if (visitorLat && visitorLon) {
        distance = getDistance(visitorLat, visitorLon, targetLocation.latitude, targetLocation.longitude);
    }

    // 解析操作系统和浏览器
    let os = '未知';
    if (/Windows/.test(ua)) os = 'Windows';
    else if (/Mac OS/.test(ua)) os = 'macOS';
    else if (/Linux/.test(ua)) os = 'Linux';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/iPhone|iPad/.test(ua)) os = 'iOS';

    let browser = '未知';
    if (/Edg/.test(ua)) browser = 'Edge';
    else if (/Chrome/.test(ua)) browser = 'Chrome';
    else if (/Firefox/.test(ua)) browser = 'Firefox';
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';

    const data = {
        ip: ip,
        address: `${country}, ${region}, ${city}`,
        os: os,
        browser: browser,
        isp: isp,
        distance: distance !== null ? `约 ${distance} 公里` : '未知',
        targetLocationName: targetLocation.name,
    };

    return new Response(JSON.stringify(data, null, 2), {
        headers: { 'Content-Type': 'application/json' },
    });
}
