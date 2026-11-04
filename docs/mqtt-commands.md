# Đặc tả Hợp đồng MQTT (TJBot)

Tài liệu này quy định giao thức và định dạng dữ liệu trao đổi giữa Web Control và Raspberry Pi 4 chạy `tjbot_client.py`.

---

## 1. Kết nối Broker

- **Giao thức**: WebSocket bảo mật (`wss://`)
- **URL**: `wss://<MQTT_HOST>:<MQTT_PORT><MQTT_PATH>` (mặc định cấu hình trong `.env`)
- **Tài khoản**: Username là `botId`, mật khẩu từ cấu hình.
- **Client ID của Web**: `web-client-<botId>-<4 ký tự ngẫu nhiên>`
- **Timeout kết nối**: 5 giây
- **Topic gửi lệnh**: `<botId>/commands`
- **Topic nhận trạng thái**: `<botId>/status`
- **Mã robot mặc định**: `tjbot1` (chọn nhanh `tjbot1`, `tjbot2`)

---

## 2. Định dạng Lệnh gửi xuống Robot

1. Mỗi lệnh là **một chuỗi duy nhất** dạng `Tên(tham số 1, tham số 2, ...)`.
2. Phía Raspberry Pi dùng regex `^(\w+)\((.*)\)$` để bóc tách tên hàm và tham số.
3. Tham số được Pi giải mã bằng `ast.literal_eval`, do đó **chuỗi phải nằm trong dấu nháy kép (`"`)** và **số để nguyên**.
4. **Quy tắc vàng**: Mọi lệnh gửi đi bắt buộc phải tạo thông qua hàm duy nhất `buildCommand(name, ...args)` trong `services/mqtt/command.ts`. Tuyệt đối không tự ghép chuỗi thủ công trong component.

---

## 3. Bảng Lệnh Chi tiết

| Lệnh | Tham số | Giá trị hợp lệ / Mặc định | Chức năng |
|---|---|---|---|
| `Arm(angle)` | `angle` (số) | `-90` đến `90` | Quay góc cánh tay servo |
| `Muscle(state)` | `state` (chuỗi) | `"on"` / `"off"` | Khóa / thả lỏng servo cánh tay |
| `Wavehand(speed, times)` | `speed`, `times` | `"fast"`, `"slow"`, `"off"`; số lần (mặc định `fast`, 3) | Vẫy tay. `Wavehand("off")` để dừng |
| `Head(state, color)` | `state`, `color` | `"on"` / `"off"`; tên màu hoặc mã hex `#rrggbb` | Bật/tắt đèn LED đầu |
| `HeadBlink(times, speed, color)` | `times`, `speed`, `color` | số lần, `"fast"` / `"slow"`, màu | Nhấp nháy đèn LED đầu |
| `Rainbow(effect)` | `effect` (chuỗi) | `"rg"`, `"rw"`, `"gw"`, `"7color"`, `"breath"` | Hiệu ứng LED (dừng bằng `Head("off", "black")`) |
| `Play(filename)` | `filename` (chuỗi) | tên file âm thanh có sẵn trên Pi (vd: `hello.mp3`) | Phát file âm thanh |
| `TextToSpeak(text, lang, voice, service)` | chuỗi, ngôn ngữ, giọng, dịch vụ | tối đa 200 từ; mặc định `vi`, rỗng, `Google` | Phát giọng nói từ văn bản |
| `Silent()` | không có | không | Dừng phát toàn bộ âm thanh |
| `Record(state, timeout)` | `state`, `timeout` | `"on"` / `"off"`; số giây (mặc định 5) | Bật/tắt ghi âm |
| `Listen(state, timeout, lang)` | `state`, `timeout`, `lang` | `"on"` / `"off"`; số giây; ngôn ngữ (mặc định `vi-VN`) | Lắng nghe và nhận diện giọng nói |
| `Camera(state, resolution)` | `state`, `resolution` | `"on"` / `"off"`; `"320x240"` hoặc `"640x480"` | Bật/tắt camera |
| `SetStreamingServer(url)` | `url` (chuỗi) | URL RTSP đẩy luồng (vd: `rtsp://<host>:8554/live/<botId>/eye`) | Đặt server nhận luồng RTSP |
| `SetVideoStream(url)` | `url` (chuỗi) | URL HLS xem luồng (vd: `https://<host>/<botId>/video.m3u8`) | Đặt server xem luồng camera HLS |
| `CheckCamera()` | không có | không | Yêu cầu Pi báo trạng thái cam (`cam=on/off`) |

Hai lệnh đặc biệt không có dấu ngoặc:
- `help`: Yêu cầu Pi trả về danh sách các lệnh hỗ trợ.
- `info`: Yêu cầu Pi trả về thông tin kết nối và mạng.

---

## 4. Gói tin Trạng thái từ Robot (`<botId>/status`)

| Dữ liệu nhận được | Ý nghĩa | Web xử lý |
|---|---|---|
| `s2t=<văn bản>` | Kết quả Speech-to-Text | Cập nhật giao diện nhận diện giọng nói / chuyển cho AI nếu bật |
| `cam=on` / `cam=off` | Trạng thái camera | Cập nhật nút bấm và trình phát video HLS |
| Báo cáo khởi động / `help` | Báo cáo mạng / danh sách lệnh | Hiển thị vào khung LogMonitor dưới dạng văn bản thuần |
| Khác | Tin nhắn log từ Pi | Render text thuần (không chèn HTML) |
