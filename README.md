# TJBot Web Control

Hệ thống Web điều khiển robot **TJBot (Raspberry Pi 4)** phục vụ giáo dục STEM, lập trình tương tác và kết nối trí tuệ nhân tạo.

Dự án được xây dựng theo kiến trúc **Static Single-Page Application (SPA)** thuần túy, deploy trực tiếp lên **GitHub Pages**:

- **Frontend**: Xây dựng bằng **React 19**, **TypeScript Strict**, **Vite**, **Sass (BEM)**, và **i18n** (Đa ngôn ngữ Tiếng Việt / Tiếng Anh).
- **Kết nối trực tiếp**: Trình duyệt kết nối WebSocket Secure (WSS) trực tiếp tới Mosquitto Broker (`wss://mqtt.toolhub.app:8084/mqtt`) và tương tác ngoại tuyến qua Web Serial API.
- **Trí tuệ nhân tạo**: Gọi API Google Gemini trực tiếp từ trình duyệt với API Key quản lý an toàn qua `sessionStorage`.

---

## 1. Sơ đồ Luồng Hoạt động Hệ thống

```text
┌─────────────────────────────────┐
│      Trình duyệt (Client)       │
│     React 19 + TypeScript       │
└────────┬───────────────┬────────┘
         │               │
         │ wss:// (WSS)  │ HTTPS (API Key trong sessionStorage)
         ▼               ▼
┌─────────────────┐  ┌─────────────────────┐
│ Mosquitto Broker│  │  Google Gemini API  │
│(mqtt.toolhub.app│  └─────────────────────┘
│     :8084)      │
└────────┬────────┘
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

# 2. Cài đặt toàn bộ dependencies
npm ci

# 3. Thiết lập biến môi trường
cp .env.example .env

# 4. Khởi chạy môi trường phát triển
npm run dev
# Mở trình duyệt tại http://localhost:5173
```

---

## 4. Các Lệnh Scripts Phát triển

| Script                 | Ý nghĩa thực thi                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `npm run dev`          | Khởi chạy máy chủ phát triển Vite Dev Server (`http://localhost:5173`)                |
| `npm run build`        | Đóng gói ứng dụng production vào thư mục `dist/`                                      |
| `npm run preview`      | Xem trước bản đóng gói production tại local                                           |
| `npm run typecheck`    | **Kiểm tra kiểu dữ liệu toàn diện**: Chạy `tsc -b --noEmit`                           |
| `npm run lint`         | Quét quy tắc mã nguồn bằng ESLint (kiểm soát kích thước, cấm `any`, cấm inline style) |
| `npm run format:check` | Kiểm tra định dạng code toàn bộ dự án với Prettier                                    |
| `npm run format`       | Tự động chuẩn hóa định dạng toàn bộ file mã nguồn                                     |
| `npm run check`        | **Cổng chất lượng duy nhất**: Chạy tuần tự format:check, lint, typecheck và build     |

---

## 5. Cấu trúc Thư mục Dự án

```text
tjbot-webcontrol/
├── .antigravity/            # Bản hợp đồng phát triển tối cao (project_rules.md)
├── .github/workflows/       # Luồng CI (ci.yml) và Deploy GitHub Pages (deploy.yml)
├── docs/                    # Tài liệu kỹ thuật chuyên sâu (mqtt, conventions, deployment...)
├── public/                  # Tài nguyên tĩnh công khai (favicon, svg...)
├── src/                     # Toàn bộ mã nguồn ứng dụng Frontend (React 19 + TypeScript + Vite + Sass)
│   ├── main.tsx             # Điểm khởi đầu ứng dụng React
│   ├── App.tsx              # Component gốc của ứng dụng (Root Shell)
│   ├── app.scss             # Style bố cục tổng thể (.app-root)
│   ├── vite-env.d.ts        # Khai báo kiểu môi trường __APP_ENV__
│   ├── layout/              # Khung giao diện: navbar/, sidebar/, log-monitor/, Icons.tsx
│   ├── hooks/               # Custom hooks toàn cục (useMqttConnection, useLogStream, useAiKey)
│   ├── core/                # hardware-limits.ts, env.ts
│   ├── services/            # logger, mqtt (command & client), storage
│   ├── features/            # gym, led, arm, audio, mic, camera, wifi, askme, intro...
│   ├── i18n/                # Cấu hình và từ điển song ngữ (vi/en)
│   └── styles/              # Sass BEM: biến toàn cục (abstracts), reset và main.scss
├── .env.example             # Mẫu biến môi trường công khai của trình duyệt
├── .gitattributes           # Khóa chuẩn ký tự xuống dòng LF cho toàn bộ text files
├── .gitignore               # Danh sách bỏ qua của git
├── .prettierrc              # Cấu hình chuẩn định dạng mã nguồn Prettier
├── .prettierignore          # Bỏ qua dist, node_modules khi format
├── commitlint.config.js     # Chuẩn Conventional Commits
├── eslint.config.js         # Cấu hình ESLint thống nhất toàn dự án
├── index.html               # File HTML gốc
├── package.json             # Quản trị thư viện & script toàn diện
├── ROADMAP.md               # Bảng theo dõi tiến độ chi tiết từng task
├── tsconfig.base.json       # Cấu hình TypeScript chuẩn chung
├── tsconfig.json            # Cấu hình TypeScript biên dịch src/ và vite.config.ts
└── vite.config.ts           # Cấu hình Vite, Sass, define __APP_ENV__
```

---

## 6. Tài liệu Kỹ thuật Chi tiết

- [Lộ trình phát triển & Bảng tiến độ](ROADMAP.md): Bảng theo dõi tiến độ chi tiết từng task theo 8 giai đoạn.
- [Hợp đồng Phát triển & Nguyên tắc cốt lõi](.antigravity/project_rules.md): **12 điều khoản bất di bất dịch** bắt buộc tuân thủ khi viết code (giới hạn 20/40/150 dòng, 0 any, 0 inline style, 100% BEM, 100% i18n, quy trình quét contract & duyệt phương án).
- [Đặc tả Hợp đồng MQTT](docs/mqtt-commands.md): Cú pháp lệnh `buildCommand()`, bảng lệnh robot, cấu trúc gói tin phản hồi trạng thái từ Pi.
- [Quy ước lập trình](docs/conventions.md): Kiến trúc Feature Module Pattern, giới hạn kích thước hàm, quy chuẩn BEM Sass, i18n.
- [Quy trình Git (Solo Developer)](docs/git-workflow.md): Bảng tra cứu Conventional Commits, quy tắc nhánh `feature/*`.
- [Hướng dẫn Triển khai](docs/deployment.md): Hướng dẫn deploy tự động lên GitHub Pages hoặc máy chủ tĩnh Nginx.

---

## 7. Quy chuẩn Bảo mật Hệ thống

1. **Không lưu trữ bí mật trong bundle client**:
   - Khóa API AI Gemini do người dùng tự cung cấp (BYOK) và chỉ được lưu trong `sessionStorage` của phiên làm việc hiện tại, tự động hủy khi đóng trình duyệt.
2. **Tuyệt đối không commit file `.env`**:
   - Mọi file `.env` ở tất cả các cấp thư mục đều được chặn bởi [`.gitignore`](.gitignore).
