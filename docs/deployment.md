# Hướng dẫn Triển khai Hệ thống (Deployment Guide)

> **QUY TẮC BẮT BUỘC**: Cấu hình môi trường và quy trình build deploy phải tuân thủ nghiêm ngặt Điều khoản 1 (ENV Rule) của [PROJECT RULES](../.antigravity/project_rules.md).

---

## 1. Kiến trúc Triển khai: Client tĩnh thuần túy (Static Client SPA)

Dự án được thiết kế theo kiến trúc Client tĩnh hoàn toàn (Static SPA), không cần máy chủ Backend trung gian:

- **Frontend tĩnh**: Ứng dụng React 19 + Vite đóng gói thành các file tĩnh (`dist/`) được deploy trực tiếp lên **GitHub Pages** hoặc bất kỳ máy chủ tĩnh / CDN nào (Nginx, Cloudflare Pages, Vercel).
- **Giao tiếp phần cứng**: Trình duyệt kết nối WSS (`wss://mqtt.toolhub.app:8084/mqtt`) trực tiếp tới Mosquitto Broker và sử dụng Web Serial API cho chế độ ngoại tuyến.
- **Trí tuệ nhân tạo (AI)**: Gọi trực tiếp API Gemini từ trình duyệt với API Key được quản lý an toàn trong `sessionStorage`.

---

## 2. Quy trình Triển khai tự động lên GitHub Pages

Dự án đã tích hợp workflow tự động tại `.github/workflows/deploy.yml`:

1. Khi code được merge vào nhánh `main`, GitHub Actions sẽ tự động:
   - Cài đặt môi trường Node.js.
   - Nạp các biến môi trường từ GitHub Secrets / Variables (`MQTT_HOST`, `MQTT_PORT`, `MQTT_PATH`, `HLS_BASE_URL`, `DEFAULT_BOT_ID`).
   - Chạy kiểm tra Quality Gate toàn diện: `npm run check`.
   - Đóng gói ứng dụng vào thư mục `./dist`.
   - Deploy trực tiếp lên GitHub Pages.

---

## 3. Quy trình Triển khai Thủ công trên Máy chủ Nginx riêng

1. Đóng gói ứng dụng:
   ```bash
   npm run build
   ```
2. Toàn bộ file tĩnh được tạo ra tại thư mục `dist/`.
3. Chép toàn bộ nội dung thư mục `dist/` vào thư mục web của Nginx (ví dụ: `/var/www/tjbot-web`).

### Mẫu cấu hình Nginx phục vụ Single Page App:

```nginx
server {
    listen 80;
    server_name tjbot.lab.local;

    root /var/www/tjbot-web;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 4. Quy tắc Mạng & Mixed Content

Khi ứng dụng chạy trên HTTPS (bao gồm cả GitHub Pages):

- **MQTT**: Bắt buộc kết nối qua WebSocket bảo mật (`wss://`).
- **Camera HLS**: URL phát luồng (`HLS_BASE_URL`) bắt buộc phải là `https://`, không dùng `http://` để tránh lỗi trình duyệt chặn nội dung hỗn hợp (Mixed Content).
