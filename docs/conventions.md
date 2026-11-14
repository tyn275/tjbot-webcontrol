# Quy ước Lập trình (Conventions)

> **QUY TẮC BẮT BUỘC**: Toàn bộ quy chuẩn phát triển trong tài liệu này được quản lý và đối chiếu theo bản hợp đồng gốc tại [PROJECT RULES](../.antigravity/project_rules.md). Mọi dòng code phải tuân thủ nghiêm ngặt 12 điều khoản trong hợp đồng.

---

## 1. Cấu trúc Thư mục Dự án

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
│   ├── i18n/                # Cấu hình và từ điển song ngữ
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

### 1.1. Mẫu cấu trúc chuẩn bên trong một tính năng (Feature Module Pattern)

Mỗi tính năng trong thư mục `src/features/<feature>/` phải tự chứa đầy đủ các thành phần sau:

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

1. **Phân tách module**: Các thư mục tính năng trong `src/features/` tuyệt đối **không** import lẫn nhau. Tài nguyên dùng chung phải đặt tại `src/core/` hoặc `src/services/`.
2. **Component không gọi MQTT trực tiếp**: Component chỉ tương tác qua Hook chuyên biệt (`useLedHex`, `useArm`,...). Hook gọi file lệnh `*.commands.ts`, và file này sử dụng `buildCommand()`.
3. **Quản lý kết nối**: Client kết nối WebSocket Secure (WSS) trực tiếp tới Mosquitto Broker qua `src/services/mqtt/mqtt-client.ts`. Trạng thái kết nối và log nhận được điều phối qua các hook `useMqttConnection()` và `useLogStream()`.
4. **Giải phóng tài nguyên**: Mọi timer (`setInterval`), luồng camera (`hls.destroy()`), và đăng ký sự kiện MQTT phải được dọn dẹp trong hàm return của `useEffect`.
5. **Truy cập lưu trữ**: Đọc/ghi `localStorage` luôn đi qua `src/services/storage/storage.ts` có khối `try/catch` và giá trị mặc định. Khóa AI API Key được quản lý riêng qua `src/services/storage/ai-key.storage.ts` trong `sessionStorage`.

---

## 4. Quy ước Sass & Giao diện

- Toàn bộ style viết bằng SCSS (`.scss`). Tuyệt đối không dùng file `.css` hay inline `style={{...}}`.
- Mỗi tính năng có một file `<feature>.scss` riêng và được gom lại tại `src/styles/main.scss` bằng `@use`.
- Tuân thủ quy tắc đặt tên class theo chuẩn **BEM**:
  - Khối: `.led`
  - Phần tử con: `.led__swatch`
  - Trạng thái thay đổi: `.led__swatch--active`
- Không viết cứng mã màu trong component hay scss con; sử dụng biến từ `src/styles/abstracts/_variables.scss`.

---

## 5. Quy ước Đa ngôn ngữ (i18n)

- Không viết chữ hiển thị cứng trong file `.tsx`. Sử dụng `t('key')` từ `useTranslation()`.
- Mỗi tính năng có file `<feature>.i18n.ts` xuất khẩu đối tượng gồm hai bộ ngôn ngữ song song `vi` và `en`.
- Từ ngữ dùng chung (Kết nối, Ngắt kết nối, Đang tải...) nằm trong `src/i18n/common.i18n.ts`.
