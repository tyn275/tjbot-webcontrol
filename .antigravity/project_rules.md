# BẢN HỢP ĐỒNG PHÁT TRIỂN & NGUYÊN TẮC (PROJECT RULES)

> **LƯU Ý DÀNH CHO ANTIGRAVITY / AI ASSISTANT**:
> Đây là bản hợp đồng tối cao (Single Source of Truth) của repository `tjbot-webcontrol`.
> Trước khi viết, chỉnh sửa hoặc đề xuất bất kỳ dòng code nào, bạn BẮT BUỘC phải đọc và tự đối chiếu với 12 điều khoản dưới đây.
> Mọi vi phạm dù là nhỏ nhất đều bị coi là không hoàn thành nhiệm vụ.

---

## ĐIỀU KHOẢN 1: QUẢN LÝ BIẾN MÔI TRƯỜNG (ENV RULE)

1. **Tuyệt đối cấm**: Không được gõ `process.env` ở bất kỳ file nào bên trong thư mục `src/` (trình duyệt không hỗ trợ và sẽ gây lỗi `process is not defined`).
2. **Cổng truy cập duy nhất**: Mọi component, service, hook ở phía Frontend chỉ được đọc biến môi trường qua đối tượng có kiểu tại `src/core/env.ts`. Khóa AI API Key được quản lý bảo mật qua `sessionStorage`.
3. **Cơ chế nạp biến**:
   - `vite.config.ts` chạy trên môi trường Node.js, dùng `dotenv` nạp `.env` ở local hoặc nhận từ biến môi trường của CI.
   - `vite.config.ts` bắt buộc kiểm tra các biến bắt buộc phía client (`MQTT_HOST`, `MQTT_PORT`, `MQTT_PATH`, `HLS_BASE_URL`, `DEFAULT_BOT_ID`). Nếu thiếu, phải dừng build ngay lập tức và in lỗi rõ ràng.
   - Chỉ truyền các biến hợp lệ sang trình duyệt thông qua cơ chế `define: { __APP_ENV__: ... }`.

---

## ĐIỀU KHOẢN 2: MỘT CỔNG PHÁT LỆNH ROBOT DUY NHẤT (COMMAND GATE RULE)

1. **Hàm duy nhất**: Mọi lệnh điều khiển robot gửi qua MQTT bắt buộc phải được tạo bởi hàm `buildCommand(name, ...args)` trong `src/services/mqtt/command.ts`.
2. **Cấm ghép chuỗi**: Tuyệt đối cấm ghép chuỗi string thủ công dạng `Arm(${angle})` hay `Head(" + color + ")` ở bất kỳ component hay hook nào.
3. **Quy tắc chuỗi tham số**: Số để nguyên; Chuỗi ký tự bắt buộc được escape trong nháy kép thông qua `JSON.stringify` để đảm bảo phía Raspberry Pi giải mã `ast.literal_eval` không bao giờ bị lỗi.

---

## ĐIỀU KHOẢN 3: GIỚI HẠN KÍCH THƯỚC & ĐỘ PHỨC TẠP (SIZE CONSTRAINT RULE)

1. **Hàm TypeScript thuần (.ts)**: Tối đa **20 dòng** (không tính dòng trống và comment).
2. **Component / Hook (.tsx)**: Tối đa **40 dòng**.
3. **Tổng kích thước file**: Tối đa **150 dòng** cho mỗi file.
4. **Tham số hàm**: Tối đa **3 tham số** (nếu cần nhiều hơn, bắt buộc gom thành object interface).
5. **Độ lồng nhau (max-depth)**: Tối đa **3 cấp**.
6. **Độ phức tạp (complexity)**: Tối đa **8**.

---

## ĐIỀU KHOẢN 4: AN TOÀN KIỂU DỮ LIỆU - ZERO ANY (STRICT TYPES RULE)

1. **Cấm `any`**: Tuyệt đối không dùng `any` ở bất kỳ đâu trong dự án.
2. **TypeScript Strict**: Luôn tuân thủ `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`, `noUnusedLocals: true`.
3. Mọi dữ liệu trả về từ MQTT payload hoặc API AI đều phải có type/interface và type guard cụ thể.

---

## ĐIỀU KHOẢN 5: CÔ LẬP MODULE TÍNH NĂNG (ISOLATION RULE)

1. **Không import chéo**: Các thư mục tính năng trong `src/features/*` (ví dụ: `arm`, `led`, `camera`...) tuyệt đối KHÔNG được import trực tiếp lẫn nhau.
2. **Chia sẻ tài nguyên**: Nếu cần dùng chung dữ liệu hoặc logic, phải đưa vào `src/core/` hoặc `src/services/`.
3. **Phân tầng gọi lệnh**: Component $\rightarrow$ Feature Hook $\rightarrow$ Feature Commands $\rightarrow$ `buildCommand()`. Component không được tương tác trực tiếp với MQTT Client.

---

## ĐIỀU KHOẢN 6: GIAO DIỆN & SASS BEM (UI & STYLE RULE)

1. **100% SCSS**: Toàn bộ style phải viết bằng `.scss`. Tuyệt đối cấm file `.css`, cấm thẻ `<style>`.
2. **Cấm inline style**: Tuyệt đối cấm thuộc tính `style={{...}}` trong JSX.
3. **Chuẩn BEM**: Mọi class phải đặt theo chuẩn BEM có tiền tố tính năng (ví dụ: `.led__swatch--active`).
4. **Quản lý biến màu**: Cấm gõ cứng mã màu hex trong component hay scss con; bắt buộc dùng biến từ `src/styles/abstracts/_variables.scss`.

---

## ĐIỀU KHOẢN 7: ĐA NGÔN NGỮ BẮT BUỘC (I18N RULE)

1. **Cấm hardcode chữ**: Tuyệt đối không viết trực tiếp chuỗi ký tự hiển thị (tiếng Việt hay tiếng Anh) vào các file `.tsx`.
2. **Truy cập qua key**: Mọi chữ hiển thị phải qua hàm `t('key')` của `react-i18next`.
3. **Từ điển song song**: Mỗi tính năng có file `<feature>.i18n.ts` chứa đầy đủ 2 ngôn ngữ `vi` và `en` với danh sách key đồng nhất 1-1.

---

## ĐIỀU KHOẢN 8: DỌN DẸP TÀI NGUYÊN TRIỆT ĐỂ (CLEANUP RULE)

Mọi tài nguyên bất đồng bộ hoặc kết nối phần cứng:

- Luồng video camera (`hls.destroy()`)
- Bộ ghi âm micro / AudioContext
- Bộ đếm thời gian (`setInterval`, `setTimeout`, `requestAnimationFrame`)
- Đăng ký lắng nghe sự kiện MQTT (`mqttClient.unsubscribe`)
  BẮT BUỘC phải được dọn dẹp và hủy hoàn toàn trong hàm `return () => { ... }` của `useEffect`. Không được để rò rỉ bộ nhớ khi người dùng chuyển trang.

---

## ĐIỀU KHOẢN 9: CỔNG KIỂM SOÁT CHẤT LƯỢNG (QUALITY GATE CHECK)

Trước khi bàn giao bất kỳ task nào cho người dùng:

1. Phải chạy lệnh kiểm tra toàn diện:
   ```bash
   npm run check
   ```
2. Cổng chỉ được coi là ĐẠT khi cả 4 bước đều xanh 100%:
   - `format:check`: Prettier không báo lỗi.
   - `lint`: ESLint 0 lỗi, 0 cảnh báo.
   - `typecheck`: TypeScript (`tsc -b --noEmit`) 0 lỗi.
   - `build`: Vite đóng gói production thành công.
3. Nếu có dù chỉ 1 lỗi hoặc 1 cảnh báo, AI KHÔNG ĐƯỢC PHÉP bàn giao và phải tự khắc phục trước.

---

## ĐIỀU KHOẢN 10: QUY ƯỚC CHÚ THÍCH & THÔNG ĐIỆP HỆ THỐNG (COMMENT & MESSAGE CONVENTIONS)

1. **Ngôn ngữ chú thích thuần nhất**:
   - Toàn bộ chú thích (comments) trong mã nguồn BẮT BUỘC phải viết bằng **tiếng Việt có dấu chuẩn mực, gãy gọn**.
   - TUYỆT ĐỐI CẤM viết nửa Anh nửa Việt (ví dụ: cấm viết `// Enforce rule`, `// Relaxed rules for test`, `// Specific function limits`).
   - Các thuật ngữ kỹ thuật chuyên ngành quốc tế được phép giữ nguyên dạng chuẩn (như MQTT, WebSocket, Broker, Payload, Topic, BEM, CSS, SCSS, DOM, API, Throttle, Cleanup).

2. **Phạm vi nội dung chú thích**:
   - Chú thích CHỈ ĐƯỢC giải thích thuần túy về **chức năng kỹ thuật** hoặc **lý do tại sao** cần đoạn mã đó (ràng buộc phần cứng, nguyên nhân xử lý ngoại lệ, logic nghiệp vụ).
   - TUYỆT ĐỐI CẤM trích dẫn tên hợp đồng hoặc số thứ tự điều khoản vào comment trong mã nguồn (ví dụ: CẤM viết `// theo điều khoản 6`, `// per spec section 8`, `// tuân thủ PROJECT_RULES`). Mã nguồn là sản phẩm kỹ thuật độc lập, không được biến thành văn bản dẫn luật.
   - Không viết chú thích để lặp lại những điều hiển nhiên mà tên hàm, tên biến đã thể hiện rõ.

3. **Tuyệt đối cấm icon / emoji**:
   - CẤM chèn icon, biểu tượng cảm xúc hoặc ký tự trang trí (ví dụ: `👉`, `🚀`, `⚡`, `❌`, `✅`, `🔥`...) vào:
     - Chú thích mã nguồn (code comments)
     - Thông báo lỗi (error messages / exceptions)
     - Thông điệp commit (commit messages)

4. **Chuẩn chú thích khi review / thảo luận**:
   - Khi viết nhận xét đánh giá code hoặc tạo ghi chú kỹ thuật trên pull request/issue, tuân thủ tiêu chuẩn [Conventional Comments](https://conventionalcomments.org/):
     `<label> [decorations]: <subject>`
     - Các label hợp lệ: `praise`, `nitpick`, `suggestion`, `issue`, `todo`, `question`, `thought`, `chore`.
     - Các decorations hợp lệ: `(blocking)`, `(non-blocking)`.

---

## ĐIỀU KHOẢN 11: QUY CHUẨN XUẤT NHẬP MODULE (MODULE EXPORT & IMPORT CONVENTION)

1. **100% Named Export cho mã nội bộ**:
   - Mọi component, hook, hàm tiện ích, đối tượng hằng số do dự án tự viết (trong `src/`) BẮT BUỘC sử dụng Named Export (`export const TenComponent = ...` hoặc `export { TenComponent }`).
   - TUYỆT ĐỐI CẤM sử dụng `export default` trong mã nguồn nội bộ.

2. **100% Named Import đồng bộ**:
   - Mọi import từ mã nội bộ BẮT BUỘC dùng ngoặc nhọn `{ TenComponent }` từ file nguồn.
   - Không được phép tự đặt tên khác tùy tiện lúc import.

3. **Ngoại lệ duy nhất cho Side-effect Import**:
   - Cú pháp `import './path/to/file'` chỉ được phép dùng cho:
     - Nạp file style: `import './styles/main.scss'`.
     - Nạp file cấu hình khởi tạo chạy ngầm một lần: `import './i18n/i18n'`.
   - Các gói thư viện bên ngoài (third-party packages) được phép tuân theo cách thức export mà thư viện đó quy định.

---

## ĐIỀU KHOẢN 12: QUY TRÌNH QUÉT HỢP ĐỒNG & DUYỆT PHƯƠNG ÁN (CONTRACT SCANNING & USER APPROVAL RULE)

1. **Bắt buộc quét toàn bộ hợp đồng (.md)**:
   - Trước khi đề xuất, lập kế hoạch hoặc bắt tay vào thực hiện bất kỳ nhiệm vụ nào (refactor, thêm tính năng, sửa đổi kiến trúc hay cấu trúc thư mục), AI Agent BẮT BUỘC phải chủ động đọc và rà soát toàn bộ các file contract định nghĩa dự án (`.antigravity/project_rules.md`, `ROADMAP.md`, `docs/conventions.md` và các tài liệu liên quan trong `docs/`).
   - Mọi hành động kỹ thuật phải được đối chiếu trực tiếp với các điều khoản trong hợp đồng để loại trừ triệt để nguy cơ vi phạm.

2. **Đề xuất phương án kỹ thuật & nêu ý kiến phân tích**:
   - Trước khi tiến hành chỉnh sửa hoặc tạo bất kỳ file code nào, AI Agent BẮT BUỘC phải trình bày kế hoạch làm việc rõ ràng cho Người dùng:
     - **Mục tiêu kỹ thuật & Phạm vi công việc**: Liệt kê cụ thể những file dự kiến thêm mới, sửa đổi hoặc xóa bỏ.
     - **Phương án thực hiện**: Phân tích giải pháp kỹ thuật, nêu rõ lý do tại sao chọn giải pháp đó cùng ưu/nhược điểm.
     - **Ý kiến đề xuất & Cảnh báo rủi ro**: Nhận định về tính khả thi, cảnh báo trước nếu phát hiện nguy cơ phát sinh phạm vi ngoài luồng (scope creep) hoặc xung đột với hợp đồng.

3. **Người dùng là người quyết định cuối cùng**:
   - AI Agent TUYỆT ĐỐI KHÔNG ĐƯỢC tự ý bắt tay vào viết code, sửa đổi file hay tự động triển khai khi chưa nhận được sự phê duyệt của Người dùng đối với phương án đề xuất.
   - Chỉ khi Người dùng xem xét, đưa ra ý kiến và CHÍNH THỨC ĐỒNG Ý / DUYỆT phương án, AI Agent mới được phép bắt đầu thực thi code.
   - Nếu Người dùng KHÔNG ĐỒNG Ý hoặc yêu cầu điều chỉnh, AI Agent phải ngay lập tức tiếp thu và điều chỉnh phương án theo đúng chỉ đạo của Người dùng.
