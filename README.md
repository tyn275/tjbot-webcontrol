# TJBot Web Control

Hệ thống Fullstack Web điều khiển robot **TJBot (Raspberry Pi 4)** phục vụ giáo dục STEM, lập trình tương tác và kết nối trí tuệ nhân tạo.

Dự án được xây dựng theo kiến trúc **Fullstack Monorepo (npm workspaces)** gồm hai phân hệ:

- **Frontend (`client/`)**: Xây dựng bằng **React 19**, **TypeScript**, **Vite**, **Sass (BEM)**, và **i18n** (Đa ngôn ngữ Tiếng Việt / Tiếng Anh).
- **Backend (`server/`)**: Xây dựng bằng **Node.js**, **TypeScript**, đóng vai trò máy chủ bảo mật trung gian quản lý bí mật hạ tầng, điều phối lệnh robot MQTT và cổng AI Gemini Proxy.

---

## 1. Sơ đồ Luồng Hoạt động Hệ thống

```text
┌─────────────────────────────────┐
│      Trình duyệt (Client)       │
│     React 19 + TypeScript       │
└────────────────┬────────────────┘
                 │
                 │ HTTP REST (/api/command)
                 │ Server-Sent Events (/api/logs/stream)
                 │ (Cổng 5000)
                 ▼
┌─────────────────────────────────┐
│     Backend Gateway (Node.js)   │  ◄── Quản lý bí mật an toàn (server/.env):
│    TypeScript Security Proxy    │      MQTT_PASSWORD, GEMINI_API_KEY
└────────┬───────────────┬────────┘
         │               │
         │ wss://        │ HTTPS
         ▼               ▼
┌─────────────────┐  ┌─────────────────────┐
│   MQTT Broker   │  │  Google Gemini API  │
└────────┬────────┘  └─────────────────────┘
         │
         │ commands / status
         ▼
┌─────────────────────────┐
│  Raspberry Pi 4 (Robot) │
└─────────────────────────┘
```

---

## 2. Yêu cầu Môi trường

- **Node.js**: Phiên bản LTS (`>= 24.0.0`, được ghim tại file [`.nvmrc`](.nvmrc))
- **Trình quản lý gói**: `npm` (`>= 11.0.0`)

---

## 3. Cài đặt và Chạy thử Dự án

```bash
# 1. Clone repository
git clone https://github.com/tyn275/tjbot-webcontrol.git
cd tjbot-webcontrol

# 2. Cài đặt toàn bộ dependencies cho cả Client và Server qua npm workspaces
npm ci

# 3. Thiết lập biến môi trường cho từng phân hệ
cp client/.env.example client/.env
cp server/.env.example server/.env

# 4. Khởi chạy môi trường phát triển
# Chạy đồng thời cả Backend (cổng 5000) và Frontend (cổng 5173)
npm run dev

# Hoặc khởi chạy riêng từng phân hệ
npm run dev:client     # Chạy riêng Frontend Vite Dev Server (http://localhost:5173)
npm run dev:server     # Chạy riêng Backend Node.js Server (http://localhost:5000)
```

---

## 4. Các Lệnh Scripts Quản lý Monorepo

| Script                 | Ý nghĩa thực thi                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `npm run dev`          | Khởi chạy đồng thời cả Backend (5000) và Frontend (5173) qua `concurrently`           |
| `npm run dev:client`   | Khởi chạy máy chủ phát triển Frontend (`client/`)                                     |
| `npm run dev:server`   | Khởi chạy máy chủ phát triển Backend (`server/`)                                      |
| `npm run build`        | Đóng gói ứng dụng Frontend production (`client/dist`)                                 |
| `npm run build:client` | Đóng gói ứng dụng Frontend production                                                 |
| `npm run build:server` | Biên dịch TypeScript cho Backend (`server/dist`)                                      |
| `npm run typecheck`    | **Kiểm tra kiểu dữ liệu toàn diện**: Chạy `tsc -b --noEmit` quét cả Client và Server  |
| `npm run lint`         | Quét quy tắc mã nguồn bằng ESLint (kiểm soát kích thước, cấm `any`, cấm inline style) |
| `npm run format:check` | Kiểm tra định dạng code toàn bộ dự án với Prettier                                    |
| `npm run format`       | Tự động chuẩn hóa định dạng toàn bộ file mã nguồn                                     |
| `npm run check`        | **Cổng chất lượng duy nhất**: Chạy tuần tự format:check, lint, typecheck và build     |

---

## 5. Cấu trúc Thư mục Dự án

```text
tjbot-webcontrol/
├── tsconfig.base.json       # Cấu hình TypeScript chuẩn chung toàn dự án (Strict Type-Checking)
├── tsconfig.json            # Solution điều phối TypeScript cho Client và Server
├── eslint.config.js         # Cấu hình ESLint thống nhất toàn Monorepo
├── .prettierrc              # Cấu hình chuẩn định dạng mã nguồn Prettier
├── .prettierignore          # Bỏ qua dist, node_modules khi format
├── package.json             # Root Workspace điều phối ["client", "server"]
├── client/                  # Phân hệ Frontend (React 19 + TypeScript + Vite + Sass)
│   ├── .env.example         # Mẫu biến môi trường công khai của trình duyệt
│   ├── index.html           # File HTML gốc
│   ├── vite.config.ts       # Cấu hình Vite, Sass, define __APP_ENV__
│   ├── tsconfig.json        # Cấu hình TypeScript cho Frontend (kế thừa base)
│   ├── package.json         # Thư viện runtime của Frontend (React, Bootstrap, Sass...)
│   └── src/
│       ├── main.tsx         # Điểm khởi đầu ứng dụng React
│       ├── vite-env.d.ts    # Khai báo kiểu môi trường __APP_ENV__
│       ├── app/             # App component & layout (Navbar, Sidebar, LogMonitor...)
│       ├── core/            # hardware-limits.ts, env.ts
│       ├── services/        # api (REST, SSE), logger, mqtt (command), storage
│       ├── features/        # gym, led, arm, audio, mic, camera, wifi, askme, intro...
│       ├── i18n/            # Cấu hình và từ điển song ngữ (vi/en)
│       └── styles/          # Sass BEM: variables, reset và layout
├── server/                  # Phân hệ Backend (Node.js + TypeScript cho máy chủ phòng Lab)
│   ├── .env.example         # Mẫu biến môi trường bảo mật (MQTT_PASSWORD, GEMINI_API_KEY...)
│   ├── tsconfig.json        # Cấu hình TypeScript cho Backend (kế thừa base)
│   ├── package.json         # Thư viện runtime của Backend
│   └── src/
│       ├── index.ts         # Điểm khởi động máy chủ Backend TypeScript
│       ├── config/          # Quản lý nạp biến môi trường server (env.ts)
│       ├── routes/          # Định tuyến API (command.route.ts...)
│       └── services/        # Dịch vụ MQTT Gateway, SSE Stream, Format trạng thái
├── docs/                    # Tài liệu kỹ thuật chuyên sâu (mqtt, conventions, deployment...)
├── .antigravity/            # Bản hợp đồng phát triển tối cao (project_rules.md)
└── ROADMAP.md               # Bảng theo dõi tiến độ chi tiết từng task
```

---

## 6. Tài liệu Kỹ thuật Chi tiết

- [Lộ trình phát triển & Bảng tiến độ](ROADMAP.md): Bảng theo dõi tiến độ chi tiết từng task theo 8 giai đoạn.
- [Hợp đồng Phát triển & Nguyên tắc cốt lõi](.antigravity/project_rules.md): **11 điều khoản bất di bất dịch** bắt buộc tuân thủ khi viết code (giới hạn 20/40/150 dòng, 0 any, 0 inline style, 100% BEM, 100% i18n).
- [Đặc tả Hợp đồng MQTT](docs/mqtt-commands.md): Cú pháp lệnh `buildCommand()`, bảng lệnh robot, cấu trúc gói tin phản hồi trạng thái từ Pi.
- [Quy ước lập trình](docs/conventions.md): Kiến trúc Feature Module Pattern, giới hạn kích thước hàm, quy chuẩn BEM Sass, i18n.
- [Quy trình Git (Solo Developer)](docs/git-workflow.md): Bảng tra cứu Conventional Commits, quy tắc nhánh `feature/*`.
- [Hướng dẫn Triển khai](docs/deployment.md): Hướng dẫn đóng gói và triển khai lên máy chủ riêng phòng Lab qua Nginx + Node.js.

---

## 7. Quy chuẩn Bảo mật Hệ thống

1. **Phân định ranh giới bí mật tuyệt đối**:
   - Mật khẩu kết nối MQTT Broker (`MQTT_PASSWORD`) chỉ được lưu tại `server/.env`. Trình duyệt Client tuyệt đối không nắm giữ mật khẩu này.
2. **Cơ chế quản lý Khóa Gemini AI trong môi trường giáo dục (BYOK & Fallback)**:
   - **Chế độ phòng Lab**: Giáo viên có thể cấu hình sẵn khóa tập trung tại `server/.env`.
   - **Chế độ cá nhân (Bring Your Own Key)**: Học sinh có thể nhập key riêng trên giao diện để lưu trong Storage trình duyệt có thời hạn sống (TTL 60 phút - hết 1 tiết học tự động xóa) và gửi kèm request lên Backend proxy.
3. **An toàn kiểm duyệt AI cho học sinh**:
   - Backend nắm giữ System Instruction và bộ lọc an toàn (Safety Settings), ngăn ngừa học sinh can thiệp hoặc thay đổi các quy tắc đạo đức/an toàn của AI từ DevTools.
4. **Tuyệt đối không commit file `.env`**:
   - Mọi file `.env` ở tất cả các cấp thư mục đều được chặn bởi [`.gitignore`](.gitignore).
