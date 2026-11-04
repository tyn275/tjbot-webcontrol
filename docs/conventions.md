# Quy ước Lập trình (Conventions)

---

## 1. Quy tắc Giới hạn Kích thước & Độ phức tạp (Bắt buộc bởi ESLint)

- **Hàm `.ts`**: Tối đa **20 dòng** (không tính dòng trống và chú thích).
- **Hàm / Component `.tsx`**: Tối đa **40 dòng**.
- **Kích thước file**: Tối đa **150 dòng** cho mỗi file.
- **Tham số hàm**: Tối đa **3 tham số**. Nếu cần nhiều hơn, gom thành một `interface Options`.
- **Độ lồng nhau (max-depth)**: Tối đa **3 cấp**.
- **Độ phức tạp (cyclomatic complexity)**: Tối đa **8**.
- **Không dùng `any`**: Sử dụng kiểu cụ thể hoặc `unknown` có type guard.

---

## 2. Kiến trúc Luồng Dữ liệu

1. **Phân tách module**: Các thư mục tính năng trong `src/features/` tuyệt đối **không** import lẫn nhau. Tài nguyên dùng chung phải đặt tại `src/core/` hoặc `src/services/`.
2. **Component không gọi MQTT trực tiếp**: Component chỉ tương tác qua Hook chuyên biệt (`useLed`, `useArm`,...). Hook gọi file lệnh `*.commands.ts`, và file này sử dụng `buildCommand()`.
3. **Quản lý kết nối**: Thực thể kết nối MQTT được quản lý tập trung trong `MqttProvider`, các component lấy dữ liệu qua `useMqtt()`.
4. **Giải phóng tài nguyên**: Mọi timer (`setInterval`), luồng camera (`hls.destroy()`), và đăng ký sự kiện MQTT phải được dọn dẹp trong hàm return của `useEffect`.
5. **Truy cập lưu trữ**: Đọc/ghi `localStorage` luôn đi qua `src/services/storage/storage.ts` có khối `try/catch` và giá trị mặc định.

---

## 3. Quy ước Sass & Giao diện

- Toàn bộ style viết bằng SCSS (`.scss`). Tuyệt đối không dùng file `.css` hay inline `style={{...}}`.
- Mỗi tính năng có một file `<feature>.scss` riêng và được gom lại tại `src/styles/main.scss` bằng `@use`.
- Tuân thủ quy tắc đặt tên class theo chuẩn **BEM**:
  - Khối: `.led`
  - Phần tử con: `.led__swatch`
  - Trạng thái thay đổi: `.led__swatch--active`
- Không viết cứng mã màu trong component hay scss con; sử dụng biến từ `abstracts/_variables.scss`.

---

## 4. Quy ước Đa ngôn ngữ (i18n)

- Không viết chữ hiển thị cứng trong file `.tsx`. Sử dụng `t('key')` từ `useTranslation()`.
- Mỗi tính năng có file `<feature>.i18n.ts` xuất khẩu đối tượng gồm hai bộ ngôn ngữ song song `vi` và `en`.
- Từ ngữ dùng chung (Kết nối, Ngắt kết nối, Đang tải...) nằm trong `src/i18n/common.i18n.ts`.
