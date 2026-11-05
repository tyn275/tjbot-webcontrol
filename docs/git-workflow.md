# Quy trình Làm việc Git (Solo Developer)

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

**Định dạng:**

```text
<type>(<scope>): <mô tả ngắn>
```

**Các type thường dùng:**

| Type       | Khi nào dùng                         |
| ---------- | ------------------------------------ |
| `feat`     | Thêm tính năng mới                   |
| `fix`      | Sửa lỗi                              |
| `refactor` | Cải tổ code không thay đổi chức năng |
| `style`    | Chỉnh CSS/SCSS, không thay đổi logic |
| `docs`     | Cập nhật tài liệu `.md`              |
| `chore`    | Cập nhật cấu hình, dependencies      |

**Các scope hợp lệ:**
`arm`, `led`, `audio`, `mic`, `camera`, `wifi`, `askme`, `gym`, `intro`, `mqtt`, `ai`, `storage`, `i18n`, `styles`, `core`, `app`, `deps`, `ci`, `docs`

**Ví dụ thực tế:**

```bash
git commit -m "feat(arm): add canvas dial for servo angle control"
git commit -m "fix(mqtt): handle reconnect on broker timeout"
git commit -m "style(led): apply BEM class names to rainbow buttons"
git commit -m "docs: simplify git-workflow for solo development"
```

---

## 3. Tuyệt đối không được commit

- File `.env` (chứa mật khẩu MQTT) → đã được `.gitignore` chặn tự động.
- Thư mục `dist/` → GitHub Actions lo việc này, không cần commit tay.
