## Muc dich

<!-- Giai thich ngan gon muc tieu ky thuat cua Pull Request nay -->

## Thay doi chinh

<!-- Liet ke cac thay doi ma nguon chinh -->

-

## Checklist kiem soat chat luong (Quality Gates)

- [ ] Da chay npm run check thanh cong (0 loi, 0 canh bao).
- [ ] Tuan thu gioi han kich thuoc: ham .ts <= 20 dong, component .tsx <= 40 dong, file <= 150 dong.
- [ ] Khong su dung kieu du lieu any (Zero any).
- [ ] Khong dung inline style style={{...}} (100% SCSS BEM).
- [ ] Khong hardcode chuoi ky tu hien thi (100% qua react-i18next).
- [ ] Da don dep tai nguyen (stream, mic, timer, subscription) trong useEffect return function.
- [ ] Khong commit file .env hay thong tin bao mat.
