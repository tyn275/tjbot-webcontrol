# Quy ước Lập trình (Conventions)

> **QUY TẮC BẮT BUỘC**: Toàn bộ quy chuẩn phát triển trong tài liệu này được quản lý và đối chiếu theo bản hợp đồng gốc tại [PROJECT RULES](../.antigravity/project_rules.md). Mọi dòng code phải tuân thủ nghiêm ngặt 11 điều khoản trong hợp đồng.

---

## 1. Cấu trúc Thư mục Dự án (Monorepo)

```text
tjbot-webcontrol/
├── tsconfig.base.json       # Cấu hình TypeScript chuẩn chung toàn dự án
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
│   ├── package.json         # Thư viện & scripts cho Frontend
│   └── src/
│       ├── main.tsx         # Điểm khởi đầu ứng dụng React
│       ├── vite-env.d.ts    # Khai báo kiểu môi trường __APP_ENV__
│       ├── app/             # App component & layout (Navbar, Sidebar, LogMonitor...)
│       ├── core/            # hardware-limits.ts, env.ts
│       ├── services/        # mqtt, storage...
│       ├── features/        # gym, arm, led, audio, mic, camera, wifi, askme, intro...
│       ├── i18n/            # Cấu hình và từ điển song ngữ
│       └── styles/          # Sass BEM: variables, reset và layout
├── server/                  # Phân hệ Backend (Node.js + TypeScript cho máy chủ riêng)
│   ├── .env.example         # Mẫu biến môi trường bảo mật: PORT, GEMINI_API_KEY...
│   ├── tsconfig.json        # Cấu hình TypeScript cho Backend (kế thừa base)
│   ├── package.json         # Thư viện & scripts cho Backend
│   └── src/
│       ├── index.ts         # Điểm khởi động máy chủ Backend TypeScript
│       ├── config/          # Quản lý nạp biến môi trường server (env.ts)
│       ├── routes/          # Định tuyến API lệnh robot (command.route.ts)
│       └── services/        # Dịch vụ MQTT Gateway, SSE Stream, Format trạng thái
├── docs/                    # Tài liệu kỹ thuật chuyên sâu (mqtt, conventions, deployment...)
├── .antigravity/            # Bản hợp đồng phát triển tối cao (project_rules.md)
├── .github/workflows/ci.yml # Luồng kiểm tra chất lượng tự động CI
├── commitlint.config.js     # Chuẩn Conventional Commits
└── ROADMAP.md               # Bảng theo dõi tiến độ chi tiết từng task
```

### 1.1. Mẫu cấu trúc chuẩn bên trong một tính năng (Feature Module Pattern)

Mỗi tính năng trong thư mục `client/src/features/<feature>/` phải tự chứa đầy đủ các thành phần sau:

```text
features/led/
├── LedHexCard.tsx           # Component card chính tích hợp 3 phân hệ LED
├── components/              # Các component con nhỏ (<= 40 dòng)
│   ├── ColorPickerHex.tsx   # Khối LED 1: Chọn màu Palette & Hex
│   ├── RgbInputGroup.tsx    # Khối LED 2: Nhập R-G-B (0..255)
│   ├── LedSectionLayout.tsx # Layout lớp cha chuẩn hóa LED 1 & 2
│   ├── BlinkControl.tsx     # Khối cấu hình chớp sáng
│   ├── RainbowButtons.tsx   # Khối LED 3: Các nút hiệu ứng dải màu
│   ├── RainbowStopButton.tsx # Nút tắt hiệu ứng LED 3
│   ├── WandSim.tsx          # Cây đũa phép mô phỏng hiệu ứng LED 3
│   └── LedBulbSim.tsx       # Bóng đèn mô phỏng phát sáng LED 1 & 2
├── hooks/                   # Custom hooks chuyên biệt (<= 40 dòng)
│   ├── useLedHex.ts
│   ├── useLedRgb.ts
│   ├── useLedRainbow.ts
│   └── useLedActions.ts
├── led.commands.ts          # Định nghĩa các lệnh gửi MQTT qua buildCommand
├── led.i18n.ts              # Từ điển đa ngôn ngữ (vi, en) của tính năng
└── led.scss                 # Style SCSS riêng của tính năng (chuẩn BEM)
```

---

## 2. Quy tắc Giới hạn Kích thước & Độ phức tạp (Bắt buộc bởi ESLint)

- **Hàm `.ts`**: Tối đa **20 dòng** (không tính dòng trống và chú thích).
- **Hàm / Component `.tsx`**: Tối đa **40 dòng**.
- **Kích thước file**: Tối đa **150 dòng** cho mỗi file.
- **Tham số hàm**: Tối đa **3 tham số**. Nếu cần nhiều hơn, gom thành một `interface Options`.
- **Độ lồng nhau (max-depth)**: Tối đa **3 cấp**.
- **Độ phức tạp (cyclomatic complexity)**: Tối đa **8**.
- **Không dùng `any`**: Sử dụng kiểu cụ thể hoặc `unknown` có type guard.

---

## 3. Kiến trúc Luồng Dữ liệu

1. **Phân tách module**: Các thư mục tính năng trong `client/src/features/` tuyệt đối **không** import lẫn nhau. Tài nguyên dùng chung phải đặt tại `client/src/core/` hoặc `client/src/services/`.
2. **Component không gọi MQTT trực tiếp**: Component chỉ tương tác qua Hook chuyên biệt (`useLedHex`, `useArm`,...). Hook gọi file lệnh `*.commands.ts`, và file này sử dụng `buildCommand()`.
3. **Quản lý kết nối**: Kết nối MQTT Broker được duy trì bảo mật tại Backend Gateway (`server/src/services/mqtt.service.ts`). Client điều phối kết nối qua hook `useMqttConnection()` và nhận log realtime qua `useLogStream()` (Server-Sent Events).
4. **Giải phóng tài nguyên**: Mọi timer (`setInterval`), luồng camera (`hls.destroy()`), và đăng ký sự kiện MQTT phải được dọn dẹp trong hàm return của `useEffect`.
5. **Truy cập lưu trữ**: Đọc/ghi `localStorage` luôn đi qua `client/src/services/storage/storage.ts` có khối `try/catch` và giá trị mặc định.

---

## 4. Quy ước Sass & Giao diện

- Toàn bộ style viết bằng SCSS (`.scss`). Tuyệt đối không dùng file `.css` hay inline `style={{...}}`.
- Mỗi tính năng có một file `<feature>.scss` riêng và được gom lại tại `client/src/styles/main.scss` bằng `@use`.
- Tuân thủ quy tắc đặt tên class theo chuẩn **BEM**:
  - Khối: `.led`
  - Phần tử con: `.led__swatch`
  - Trạng thái thay đổi: `.led__swatch--active`
- Không viết cứng mã màu trong component hay scss con; sử dụng biến từ `client/src/styles/abstracts/_variables.scss`.

---

## 5. Quy ước Đa ngôn ngữ (i18n)

- Không viết chữ hiển thị cứng trong file `.tsx`. Sử dụng `t('key')` từ `useTranslation()`.
- Mỗi tính năng có file `<feature>.i18n.ts` xuất khẩu đối tượng gồm hai bộ ngôn ngữ song song `vi` và `en`.
- Từ ngữ dùng chung (Kết nối, Ngắt kết nối, Đang tải...) nằm trong `client/src/i18n/common.i18n.ts`.
