# Quy trình Làm việc Git & Pull Request (Review cùng Copilot)

> **QUY TẮC BẮT BUỘC**: Toàn bộ quy trình commit, tạo nhánh và kiểm soát chất lượng phải tuân thủ bản hợp đồng gốc tại [PROJECT RULES](../.antigravity/project_rules.md).

---

## 1. Quy trình phát triển theo tính năng (Branch & PR Workflow)

Mỗi tính năng hoặc sửa lỗi độc lập được triển khai trên một nhánh riêng và mở Pull Request để GitHub Copilot tự động review:

```bash
# 1. Tạo nhánh mới từ main
git checkout main
git pull
git checkout -b feature/TJB-xxx-ten-tinh-nang

# 2. Phát triển và kiểm tra chất lượng tại local
npm run check

# 3. Commit theo chuẩn Conventional Commits
git add .
git commit -m "feat(led): add color picker component"

# 4. Đẩy nhánh lên GitHub và mở Pull Request
git push -u origin feature/TJB-xxx-ten-tinh-nang

# 5. Trên GitHub:
# - Điền thông tin theo mẫu .github/pull_request_template.md
# - Chờ CI chạy xanh toàn bộ
# - Nhận xét và kiểm tra các góp ý từ GitHub Copilot Reviewer
# - Thực hiện Squash and Merge vào nhánh main sau khi CI Quality Gate đã xanh 100%
```

---

## 2. Quy ước Commit (Conventional Commits)

Định dạng bắt buộc:

```text
<type>(<scope>): <mô tả ngắn>
```

**Bảng tra cứu 10 Type hợp lệ (khớp hoàn toàn với commitlint):**

| Type       | Ý nghĩa                                                          |
| ---------- | ---------------------------------------------------------------- |
| `feat`     | Thêm tính năng mới                                               |
| `fix`      | Sửa lỗi logic hoặc lỗi giao diện                                 |
| `refactor` | Cải tổ cấu trúc code mà không thay đổi hành vi bên ngoài         |
| `style`    | Chỉnh CSS/SCSS, khoảng cách, format mà không đổi logic           |
| `docs`     | Thêm hoặc cập nhật tài liệu Markdown                             |
| `test`     | Thêm hoặc chỉnh sửa các kịch bản kiểm thử                        |
| `build`    | Thay đổi cấu hình build, Vite, TypeScript, hoặc gói dependencies |
| `ci`       | Thay đổi kịch bản GitHub Actions (`ci.yml`)                      |
| `chore`    | Các công việc lặt vặt khác không ảnh hưởng mã nguồn chính        |
| `perf`     | Tối ưu hóa hiệu năng, giảm bộ nhớ, tăng tốc độ                   |

**Các scope hợp lệ:**
`arm`, `led`, `audio`, `mic`, `camera`, `wifi`, `askme`, `gym`, `intro`, `mqtt`, `ai`, `storage`, `i18n`, `styles`, `core`, `app`, `layout`, `deps`, `ci`, `docs`, `client`, `server`

**Ví dụ thực tế:**

```bash
git commit -m "feat(arm): add canvas dial for servo angle control"
git commit -m "fix(mqtt): handle reconnect on broker timeout"
git commit -m "style(led): apply BEM class names to rainbow buttons"
git commit -m "docs: update monorepo structure in readme and conventions"
```

---

## 3. Tuyệt đối không được commit

- File `.env` (chứa mật khẩu MQTT hoặc API Key) → đã được `.gitignore` chặn tự động.
- Thư mục `dist/` (ở cả `client/` và `server/`) → đã được `.gitignore` và `.prettierignore` chặn tự động.
- File `*.tsbuildinfo` → đã được `.gitignore` chặn tự động.
