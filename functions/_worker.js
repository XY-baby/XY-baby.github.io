export default {
  async fetch(request, env, ctx) {
    // ====================== 在这里添加白名单UDID ======================
    const allowedUDIDs = new Set([
      "00008120-001171690E63C01E", // 我的设备
    ]);
    // =====================================================================

    const url = new URL(request.url);

    // 只拦截源文件请求，网页、图标、按钮都正常显示
    if (url.pathname === "/Release" || url.pathname === "/Packages" || url.pathname === "/Packages.zst") {
      // 自动读取Sileo发送的设备UDID
      const udid = request.headers.get("X-Unique-ID");

      // 检查是否在白名单里
      if (udid && allowedUDIDs.has(udid)) {
        // 白名单设备：正常返回源文件
        return env.ASSETS.fetch(request);
      } else {
        // 非白名单设备：返回404，加不上源
        return new Response("404 Not Found", { status: 404 });
      }
    }

    // 其他所有请求都正常放行
    return env.ASSETS.fetch(request);
  },
};
