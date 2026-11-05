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
git clone https://github.com/tyn275/tjbot-webcontrol.git
cd tjbot-webcontrol

# 2. Cài đặt dependencies đúng theo package-lock
npm ci

# 3. Tạo file môi trường từ mẫu
cp .env.example .env

# 4. Chạy môi trường phát triển
npm run dev
```

---

## 4. Các Scripts chính

| Script                 | Ý nghĩa                                                                   |
| ---------------------- | ------------------------------------------------------------------------- |
| `npm run dev`          | Chạy máy chủ phát triển (Vite Dev Server)                                 |
| `npm run build`        | Đóng gói ứng dụng production (`tsc -b && vite build`)                     |
| `npm run preview`      | Xem thử sản phẩm sau khi build                                            |
| `npm run format:check` | Kiểm tra định dạng code với Prettier                                      |
| `npm run format`       | Tự động chuẩn hóa định dạng toàn bộ file với Prettier                     |
| `npm run lint`         | Quét quy tắc code bằng ESLint (cấm `any`, kiểm soát kích thước hàm/file)  |
| `npm run typecheck`    | Kiểm tra toàn bộ kiểu dữ liệu TypeScript (`tsc -b --noEmit`)              |
| `npm run check`        | **Cổng chất lượng duy nhất**: Chạy tuần tự format, lint, typecheck, build |

---

## 5. Cấu trúc thư mục dự án

```text
tjbot-web/
├── .antigravity/
│   └── project_rules.md       # Bản hợp đồng phát triển tối cao (10 điều khoản)
├── .github/
│   └── workflows/
│       ├── ci.yml             # Tự động test, lint khi mở PR / push
│       └── deploy.yml         # Tự động deploy GitHub Pages khi vào main
├── docs/
│   ├── mqtt-commands.md       # Hợp đồng lệnh và trạng thái MQTT
│   ├── conventions.md         # Quy ước code (dòng, file, BEM, i18n, structure)
│   ├── git-workflow.md        # Quy trình solo Git, commitlint
│   └── deployment.md          # Hướng dẫn deploy Pages / Server riêng
├── public/
│   └── vite.svg               # Icon ứng dụng
├── .env.example               # Mẫu cấu hình môi trường
├── .gitignore                 # Chặn .env, node_modules, dist, tsbuildinfo
├── .nvmrc                     # Ghim Node.js LTS (v24)
├── commitlint.config.js       # Cấu hình chuẩn Conventional Commits
├── eslint.config.js           # Chặn any, giới hạn 20/40/150 dòng, cấm inline style
├── .prettierrc                # Chuẩn định dạng code
├── package.json               # Dependencies & scripts
├── tsconfig.json              # Cấu hình TypeScript Strict Project References
├── vite.config.ts             # Cấu hình Vite, Sass, dotenv, define __APP_ENV__
├── index.html                 # File HTML gốc
└── src/
    ├── main.tsx               # Điểm khởi đầu ứng dụng React
    ├── vite-env.d.ts          # Khai báo kiểu môi trường __APP_ENV__
    ├── app/
    │   ├── App.tsx            # Component gốc
    │   ├── routes.tsx         # Định tuyến trang (gym, actions, wifi, intro)
    │   └── layout/            # Khung giao diện (Navbar, Sidebar, LogMonitor...)
    ├── core/                  # Hằng số phần cứng, env loader, logger
    │   └── env.ts             # Cổng duy nhất đọc biến môi trường có kiểu
    ├── services/
    │   ├── mqtt/              # Kết nối MQTT, buildCommand, parser trạng thái
    │   ├── ai/                # Tích hợp Gemini AI
    │   └── storage/           # Wrapper an toàn cho localStorage
    ├── features/              # Từng khối tính năng độc lập (kèm commands, i18n, scss riêng)
    │   ├── gym/               # Trang tổng hợp (ghép 5 khối)
    │   ├── arm/               # Điều khiển cánh tay servo
    │   ├── led/               # Điều khiển LED đầu
    │   ├── audio/             # Phát âm thanh & Text-to-Speech
    │   ├── mic/               # Ghi âm và lắng nghe
    │   ├── camera/            # Xem video HLS từ Pi
    │   ├── wifi/              # Giao diện cấu hình
    │   ├── askme/             # Khối hội thoại AI
    │   └── intro/             # Trang giới thiệu
    ├── i18n/                  # File cấu hình và từ điển dùng chung
    └── styles/                # Sass: biến màu, reset và layout chung
```

---

## 6. Tài liệu chi tiết (`docs/` & `.antigravity/`)

- [Hợp đồng Phát triển & Nguyên tắc cốt lõi](.antigravity/project_rules.md): **10 điều khoản bất di bất dịch** bắt buộc Antigravity/AI tuân thủ khi viết code.
- [Đặc tả lệnh MQTT](docs/mqtt-commands.md): Cú pháp lệnh, bảng lệnh, gói tin trạng thái Pi.
- [Quy ước lập trình](docs/conventions.md): Giới hạn dòng (20/40/150), kiến trúc thư mục, BEM Sass, i18n.
- [Quy trình Git (Solo Developer)](docs/git-workflow.md): Bảng tra cứu Conventional Commits, danh sách cấm commit.
- [Hướng dẫn Triển khai](docs/deployment.md): Cấu hình deploy tự động lên GitHub Pages hoặc server riêng.

---

## 7. Cảnh báo bảo mật quan trọng

1. **Mọi biến môi trường nhúng vào frontend đều công khai**: File `.env` chứa mật khẩu MQTT sẽ được đưa vào mã JavaScript tải về trình duyệt. Do đó, tài khoản MQTT cho web chỉ nên có quyền truy cập topic riêng của robot.
2. **Khóa Gemini AI**: Không lưu khóa API Gemini vào `.env`. Khóa được người dùng nhập trực tiếp trên giao diện và lưu trong `localStorage` của trình duyệt.
3. **Tuyệt đối không commit file `.env`**: `.gitignore` đã chặn file này ngay từ commit đầu tiên.
