# 腾讯云 COS 图片存储部署说明

本项目现在会在保存房源前，把装修照片上传到腾讯云 COS，然后把图片 URL 保存到 Supabase 的 `properties.decoration_images` 字段。

## 1. 前端环境变量

构建前需要配置：

```bash
VITE_COS_BUCKET=kanfang-1377314373
VITE_COS_REGION=ap-shanghai
VITE_COS_CREDENTIAL_PATH=/api/cos-credentials
```

如果你的 COS Bucket 不在上海地域，请把 `ap-shanghai` 改成实际地域。

## 2. 服务器环境变量

临时凭证服务只在服务器上保存腾讯云密钥，不要把 `COS_SECRET_ID` 或 `COS_SECRET_KEY` 写进前端代码。

```bash
export COS_SECRET_ID=你的腾讯云SecretId
export COS_SECRET_KEY=你的腾讯云SecretKey
export COS_BUCKET=kanfang-1377314373
export COS_REGION=ap-shanghai
export COS_CREDENTIAL_PORT=8787
```

## 3. 启动临时凭证服务

```bash
npm run cos:credentials
```

生产环境建议用 `pm2` 或 systemd 托管，让它常驻后台。

## 4. Nginx 转发接口

在 `kanfang.lupinyang.com.cn` 的 Nginx 配置里添加：

```nginx
location /api/cos-credentials {
    proxy_pass http://127.0.0.1:8787/api/cos-credentials;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

然后检查并重载 Nginx：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 5. COS 权限

临时凭证默认只允许上传 `property-images/*` 路径下的对象。COS Bucket 需要允许这些图片被 H5 页面读取。常见做法是：

- Bucket 设置为公有读私有写；或
- 保持私有读，用 CDN/签名 URL 方案读取。

当前代码保存的是公开访问 URL，因此推荐先使用“公有读私有写”。
