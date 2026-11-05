# Quy trình Làm việc Git (Solo Developer)

> **QUY TẮC BẮT BUỘC**: Toàn bộ quy trình commit và kiểm soát chất lượng phải tuân thủ bản hợp đồng gốc tại [PROJECT RULES](../.antigravity/project_rules.md).

---

## 1. Workflow hàng ngày

```bash
# Làm xong một tính năng → kiểm tra → commit → push
npm run check
git add .
git commit -m "feat(led): add rainbow effect selector"
git push
```

GitHub Actions tự động build và deploy lên GitHub Pages sau khi push vào `main`.

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
| `ci`       | Thay đổi kịch bản GitHub Actions (`ci.yml`, `deploy.yml`)        |
| `chore`    | Các công việc lặt vặt khác không ảnh hưởng mã nguồn chính        |
| `perf`     | Tối ưu hóa hiệu năng, giảm bộ nhớ, tăng tốc độ                   |

**Các scope hợp lệ:**
`arm`, `led`, `audio`, `mic`, `camera`, `wifi`, `askme`, `gym`, `intro`, `mqtt`, `ai`, `storage`, `i18n`, `styles`, `core`, `app`, `deps`, `ci`, `docs`

**Ví dụ thực tế:**

```bash
git commit -m "feat(arm): add canvas dial for servo angle control"
git commit -m "fix(mqtt): handle reconnect on broker timeout"
git commit -m "style(led): apply BEM class names to rainbow buttons"
git commit -m "docs: link all doc files to project rules contract"
```

---

## 3. Tuyệt đối không được commit

- File `.env` (chứa mật khẩu MQTT) → đã được `.gitignore` chặn tự động.
- Thư mục `dist/` → đã được `.gitignore` chặn tự động, GitHub Actions lo phần build deploy.
- File `*.tsbuildinfo` → đã được `.gitignore` chặn tự động.
