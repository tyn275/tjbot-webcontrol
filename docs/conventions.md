# Quy ước Lập trình (Conventions)

> **QUY TẮC BẮT BUỘC**: Toàn bộ quy chuẩn phát triển trong tài liệu này được quản lý và đối chiếu theo bản hợp đồng gốc tại [PROJECT RULES](../.antigravity/project_rules.md). Mọi dòng code phải tuân thủ nghiêm ngặt 10 điều khoản trong hợp đồng.

---

## 1. Cấu trúc Thư mục Dự án

```text
tjbot-web/
├── .antigravity/
│   └── project_rules.md       # Bản hợp đồng phát triển tối cao (10 điều khoản)
├── .github/
│   ├── workflows/
│   │   ├── ci.yml             # Tự động test, lint khi mở PR / push
│   │   └── deploy.yml         # Tự động deploy GitHub Pages khi vào main
│   └── pull_request_template.md # Mẫu kiểm tra chất lượng khi tạo PR để Copilot review
├── docs/
│   ├── mqtt-commands.md       # Hợp đồng lệnh và trạng thái MQTT
│   ├── conventions.md         # Quy ước code (dòng, file, BEM, i18n, structure)
│   ├── git-workflow.md        # Quy trình commit, conventional commits
│   └── deployment.md          # Hướng dẫn deploy Pages / Server riêng
├── public/
│   └── vite.svg               # Icon ứng dụng
├── .env.example               # Mẫu cấu hình môi trường
├── .gitignore                 # Chặn .env, node_modules, dist, tsbuildinfo
├── .nvmrc                     # Ghim Node.js LTS (v24)
├── commitlint.config.js       # Cấu hình chuẩn Conventional Commits
├── eslint.config.js           # Chặn any, giới hạn 20/40/150 dòng
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

### 1.1. Mẫu cấu trúc chuẩn bên trong một tính năng (Feature Module Pattern)

Mỗi tính năng trong thư mục `src/features/<feature>/` phải tự chứa đầy đủ các thành phần sau:

```text
features/led/
├── LedPanel.tsx           # Component chính của tính năng
├── components/            # Các component con nhỏ
│   ├── ColorPicker.tsx
│   ├── BlinkControl.tsx
│   └── RainbowButtons.tsx
├── hooks/                 # Custom hook quản lý logic & vòng đời
│   └── useLed.ts
├── led.commands.ts        # Định nghĩa các lệnh gửi MQTT qua buildCommand
├── led.i18n.ts            # Từ điển đa ngôn ngữ (vi, en) của tính năng
└── led.scss               # Style SCSS riêng của tính năng (chuẩn BEM)
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
2. **Component không gọi MQTT trực tiếp**: Component chỉ tương tác qua Hook chuyên biệt (`useLed`, `useArm`,...). Hook gọi file lệnh `*.commands.ts`, và file này sử dụng `buildCommand()`.
3. **Quản lý kết nối**: Thực thể kết nối MQTT được quản lý tập trung trong `MqttProvider`, các component lấy dữ liệu qua `useMqtt()`.
4. **Giải phóng tài nguyên**: Mọi timer (`setInterval`), luồng camera (`hls.destroy()`), và đăng ký sự kiện MQTT phải được dọn dẹp trong hàm return của `useEffect`.
5. **Truy cập lưu trữ**: Đọc/ghi `localStorage` luôn đi qua `src/services/storage/storage.ts` có khối `try/catch` và giá trị mặc định.

---

## 4. Quy ước Sass & Giao diện

- Toàn bộ style viết bằng SCSS (`.scss`). Tuyệt đối không dùng file `.css` hay inline `style={{...}}`.
- Mỗi tính năng có một file `<feature>.scss` riêng và được gom lại tại `src/styles/main.scss` bằng `@use`.
- Tuân thủ quy tắc đặt tên class theo chuẩn **BEM**:
  - Khối: `.led`
  - Phần tử con: `.led__swatch`
  - Trạng thái thay đổi: `.led__swatch--active`
- Không viết cứng mã màu trong component hay scss con; sử dụng biến từ `abstracts/_variables.scss`.

---

## 5. Quy ước Đa ngôn ngữ (i18n)

- Không viết chữ hiển thị cứng trong file `.tsx`. Sử dụng `t('key')` từ `useTranslation()`.
- Mỗi tính năng có file `<feature>.i18n.ts` xuất khẩu đối tượng gồm hai bộ ngôn ngữ song song `vi` và `en`.
- Từ ngữ dùng chung (Kết nối, Ngắt kết nối, Đang tải...) nằm trong `src/i18n/common.i18n.ts`.
