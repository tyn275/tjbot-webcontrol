# Hướng dẫn Triển khai Hệ thống (Deployment Guide)

> **QUY TẮC BẮT BUỘC**: Cấu hình môi trường và quy trình build deploy phải tuân thủ nghiêm ngặt Điều khoản 1 (ENV Rule) của [PROJECT RULES](../.antigravity/project_rules.md).

---

## 1. Kiến trúc Triển khai Fullstack trên Máy chủ riêng

Dự án được triển khai trực tiếp trên máy chủ riêng:

- **Frontend (`client`)**: Ứng dụng web React 19 đóng gói thành các file tĩnh (`dist/`) và phục vụ qua Nginx.
- **Backend (`server`)**: Dịch vụ máy chủ Node.js xử lý các API trung gian, kết nối MQTT an toàn và gọi AI Gemini.

---

## 2. Quy trình Triển khai Frontend (Client)

1. Đóng gói ứng dụng:
   ```bash
   npm run build:client
   ```
2. Toàn bộ file tĩnh được tạo ra tại thư mục `client/dist/`.
3. Chép toàn bộ nội dung thư mục `client/dist/` vào thư mục web của Nginx (ví dụ: `/var/www/tjbot-web`).

### Mẫu cấu hình Nginx phục vụ Frontend và Reverse Proxy:

```nginx
server {
    listen 80;
    server_name tjbot.lab.local;

    # Phục vụ giao diện người dùng (SPA)
    root /var/www/tjbot-web;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Chuyển tiếp các yêu cầu API về máy chủ Backend
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 3. Quy trình Triển khai Backend (Server)

1. Cài đặt các gói phụ thuộc và build mã nguồn TypeScript:
   ```bash
   npm run build:server
   ```
2. Khởi chạy tiến trình nền trên máy chủ qua PM2:
   ```bash
   pm2 start server/dist/index.js --name tjbot-server
   pm2 save
   ```

---

## 4. Quy tắc Mạng & Mixed Content

Khi máy chủ kích hoạt giao thức bảo mật HTTPS:

- **MQTT**: Bắt buộc kết nối qua WebSocket bảo mật (`wss://`).
- **Camera HLS**: URL phát luồng (`HLS_BASE_URL`) bắt buộc phải là `https://`, không dùng `http://` để tránh lỗi trình duyệt chặn nội dung hỗn hợp (Mixed Content).
