# Hướng dẫn Triển khai (Deployment Guide)

> **QUY TẮC BẮT BUỘC**: Cấu hình môi trường và quy trình build deploy phải tuân thủ nghiêm ngặt Điều khoản 1 (ENV Rule) của [PROJECT RULES](../.antigravity/project_rules.md).

---

## 1. Triển khai Tự động lên GitHub Pages (Mặc định)

Dự án đã được cấu hình CI/CD tự động trong `.github/workflows/deploy.yml`.

### Các bước thiết lập trên GitHub:

1. Vào mục **Settings** của repository trên GitHub.
2. Tại thanh bên trái, chọn **Pages**.
3. Trong mục **Build and deployment** > **Source**, chọn **GitHub Actions**.
4. Khi có commit được merge vào nhánh `main`, GitHub Actions sẽ tự động build và xuất bản trang web.

### Lưu ý về Base Path:

Khi chạy trên GitHub Pages dưới dạng `https://<user>.github.io/<repo>/`, biến `BASE_PATH` cần đặt là `/<repo>/`.

---

## 2. Triển khai lên Server riêng (Nginx / Raspberry Pi)

Nếu cần đưa bản build lên máy chủ của trường hoặc chạy trực tiếp trên Pi:

1. Thiết lập trong file `.env`:
   ```bash
   BASE_PATH=/
   ```
2. Chạy lệnh đóng gói:
   ```bash
   npm run build
   ```
3. Toàn bộ file tĩnh được tạo ra tại thư mục `dist/`. Chép toàn bộ nội dung thư mục này vào thư mục web của Nginx (ví dụ: `/var/www/tjbot-web`).

### Mẫu cấu hình Nginx (Hỗ trợ SPA):

```nginx
server {
    listen 80;
    server_name tjbot.local;

    root /var/www/tjbot-web;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 3. Quy tắc Mạng & Mixed Content

Do các trang web chạy qua giao thức HTTPS (như GitHub Pages) có cơ chế bảo mật nghiêm ngặt:

- **MQTT**: Bắt buộc kết nối qua WebSocket bảo mật (`wss://`).
- **Camera HLS**: URL phát luồng (`HLS_BASE_URL`) bắt buộc phải là `https://`, không được dùng `http://` để tránh lỗi trình duyệt chặn nội dung hỗn hợp (Mixed Content).
