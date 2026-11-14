## Mục đích

<!-- Giải thích ngắn gọn mục tiêu kỹ thuật của Pull Request này -->

## Thay đổi chính

<!-- Liệt kê các thay đổi mã nguồn chính -->

-

## Checklist kiểm soát chất lượng (Quality Gates)

- [ ] Đã chạy npm run check thành công (0 lỗi, 0 cảnh báo).
- [ ] Tuân thủ giới hạn kích thước: hàm .ts <= 20 dòng, component .tsx <= 40 dòng, file <= 150 dòng.
- [ ] Không sử dụng kiểu dữ liệu any (Zero any).
- [ ] Không dùng inline style style={{...}} (100% SCSS BEM).
- [ ] Không hardcode chuỗi ký tự hiển thị (100% qua react-i18next).
- [ ] Đã dọn dẹp tài nguyên (stream, mic, timer, subscription) trong hàm return của useEffect.
- [ ] Không commit file .env hay thông tin bảo mật.
