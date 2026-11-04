# TJBot Web Control

Web điều khiển robot **TJBot (Raspberry Pi 4)** qua **MQTT** (WebSocket bảo mật). Dự án được xây dựng lại bằng **React 19**, **TypeScript**, **Vite**, **Sass**, và **i18n**.

---

## 1. Sơ đồ luồng hoạt động

```text
Trình duyệt (Web) ──wss──► MQTT Broker ◄──mqtt── Raspberry Pi 4 (tjbot_client.py)
   gửi lệnh vào  <botId>/commands          Pi canh hộp thư này, chạy lệnh
   đọc trạng thái từ <botId>/status        Pi trả lời vào hộp thư này
```

---

## 2. Yêu cầu môi trường

- **Node.js**: Phiên bản LTS (được ghim tại `.nvmrc`, `>= 24.0.0`)
- **Trình quản lý gói**: `npm`

---

## 3. Cài đặt và Chạy thử

```bash
# 1. Clone repo
git clone https://github.com/<user>/tjbot-web.git
cd tjbot-web

# 2. Cài đặt dependencies đúng theo package-lock
npm ci

# 3. Tạo file môi trường từ mẫu
cp .env.example .env

# 4. Chạy môi trường phát triển
npm run dev
```

---

## 4. Các Scripts chính

| Script | Ý nghĩa |
|---|---|
| `npm run dev` | Chạy máy chủ phát triển (Vite Dev Server) |
| `npm run build` | Kiểm tra kiểu dữ liệu (`tsc`) và đóng gói (`vite build`) |
| `npm run preview` | Xem thử sản phẩm sau khi build |
| `npm run format:check` | Kiểm tra định dạng code với Prettier |
| `npm run lint` | Quét quy tắc code bằng ESLint (cấm `any`, kiểm soát kích thước hàm/file) |
| `npm run typecheck` | Kiểm tra lỗi TypeScript không phát sinh file |
| `npm run test` | Chạy bộ kiểm thử tự động với Vitest |
| `npm run check` | **Cổng chất lượng duy nhất**: Chạy tuần tự format, lint, typecheck, test, build |

---

## 5. Tài liệu chi tiết (`docs/`)

- [Đặc tả lệnh MQTT](docs/mqtt-commands.md): Cú pháp lệnh, bảng lệnh, gói tin trạng thái Pi.
- [Quy ước lập trình](docs/conventions.md): Giới hạn dòng (20/40/150), kiến trúc thư mục, BEM Sass, i18n.
- [Quy trình Git & Review](docs/git-workflow.md): Quy ước đặt tên nhánh, Conventional Commits, mẫu PR.
- [Hướng dẫn Triển khai](docs/deployment.md): Cấu hình deploy tự động lên GitHub Pages hoặc server riêng.

---

## 6. Cảnh báo bảo mật quan trọng

1. **Mọi biến môi trường nhúng vào frontend đều công khai**: File `.env` chứa mật khẩu MQTT sẽ được đưa vào mã JavaScript tải về trình duyệt. Do đó, tài khoản MQTT cho web chỉ nên có quyền truy cập topic riêng của robot.
2. **Khóa Gemini AI**: Không lưu khóa API Gemini vào `.env`. Khóa được người dùng nhập trực tiếp trên giao diện và lưu trong `localStorage` của trình duyệt.
3. **Tuyệt đối không commit file `.env`**: `.gitignore` đã chặn file này ngay từ commit đầu tiên.
