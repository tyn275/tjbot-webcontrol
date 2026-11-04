# Quy trình Làm việc Git & Review

---

## 1. Chiến lược Nhánh (Branching Strategy)

- **`main`**: Nhánh chính bảo vệ, luôn luôn ở trạng thái chạy được và sạch lỗi. Cấm push trực tiếp lên `main`.
- **Nhánh tính năng / sửa lỗi**: Được tạo từ `main` theo quy tắc:
  `<loại>/<TASK-ID>-<mô-tả-ngắn>`
  * Ví dụ: `feature/TJB-009-led-panel`, `fix/TJB-010-arm-slider`.
- **Các tiền tố hợp lệ**: `feature`, `fix`, `refactor`, `docs`, `chore`, `test`.

---

## 2. Quy ước Commit (Conventional Commits)

Định dạng bắt buộc:
```text
<type>(<scope>): <subject>

Refs: <TASK-ID>
```

- **Độ dài tiêu đề**: Tối đa 72 ký tự, thể mệnh lệnh tiếng Anh, không có dấu chấm cuối câu.
- **Các type hợp lệ**: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `build`, `ci`, `chore`, `perf`.
- **Các scope hợp lệ**: `arm`, `led`, `audio`, `mic`, `camera`, `wifi`, `askme`, `gym`, `intro`, `mqtt`, `ai`, `storage`, `i18n`, `styles`, `core`, `app`, `deps`, `ci`, `docs`.

Ví dụ:
```text
feat(led): add rainbow effect selector

Refs: TJB-009
```

---

## 3. Quy trình Pull Request & Review

1. Mỗi task là một Pull Request (PR) độc lập.
2. Tiêu đề PR phải tuân thủ định dạng Conventional Commits.
3. Khi merge vào `main`, sử dụng tùy chọn **Squash and Merge** để giữ lịch sử commit của `main` luôn gọn gàng.
4. Bốn mức độ phản hồi khi review code:
   - **Must fix**: Bắt buộc phải sửa, chặn merge PR.
   - **Should fix**: Đề xuất cải tiến quan trọng.
   - **Nit**: Góp ý nhỏ, không chặn merge.
   - **Question**: Câu hỏi làm rõ thiết kế.
