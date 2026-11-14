# Đặc tả Hợp đồng MQTT (TJBot)

> **QUY TẮC BẮT BUỘC**: Mọi lệnh robot trong tài liệu này bắt buộc phải tạo thông qua hàm duy nhất `buildCommand()` theo đúng Điều khoản 2 của [PROJECT RULES](../.antigravity/project_rules.md).

Tài liệu này quy định giao thức và định dạng dữ liệu trao đổi giữa Web Control và Raspberry Pi 4 chạy `tjbot_client.py`.

---

## 1. Kết nối Broker trực tiếp (WSS Direct Client)

Hệ thống hoạt động theo mô hình Client tĩnh thuần túy (Static SPA), trình duyệt thiết lập kết nối WebSocket bảo mật (`wss://`) trực tiếp tới Mosquitto Broker thông qua `src/services/mqtt/mqtt-client.ts`:

- Toàn bộ thông số kết nối được nạp an toàn tại thời điểm build và truy xuất qua `src/core/env.ts` (tuân thủ Điều khoản 1):
  - **Giao thức**: WebSocket bảo mật (`wss://`)
  - **URL**: `wss://<MQTT_HOST>:<MQTT_PORT><MQTT_PATH>` (ví dụ: `wss://mqtt.toolhub.app:8084/mqtt`)
  - **Tài khoản**: Username là `botId`, mật khẩu `MQTT_PASSWORD` từ biến môi trường
  - **Client ID của Web Client**: `web-client-<botId>-<6 ký tự ngẫu nhiên>`
  - **Timeout kết nối**: 5 giây, tự động thử lại sau 3 giây (`reconnectPeriod: 3000`)
  - **Topic gửi lệnh**: `<botId>/commands`
  - **Topic nhận trạng thái**: `<botId>/status`
  - **Mã robot mặc định**: `tjbot1` (người dùng có thể nhập hoặc chuyển đổi trên thanh điều khiển)
- **Tự động kích hoạt thông tin**: Ngay khi đăng ký (subscribe) thành công kênh `<botId>/status`, Web Client tự động phát lệnh `info` tới kênh `<botId>/commands` để robot phản hồi cấu hình mạng thực tế.
- **Lọc gói tin lưu tạm**: Web Client chủ động bỏ qua các gói tin retain cũ (`packet.retain === true`) của Broker để đảm bảo chỉ hiển thị thông tin thời gian thực từ robot.

---

## 2. Định dạng Lệnh gửi xuống Robot

1. Mỗi lệnh là **một chuỗi duy nhất** dạng `Tên(tham số 1, tham số 2, ...)`.
2. Phía Raspberry Pi dùng regex `^(\w+)\((.*)\)$` để bóc tách tên hàm và tham số.
3. Tham số được Pi giải mã bằng `ast.literal_eval`, do đó **chuỗi phải nằm trong dấu nháy kép (`"`)** và **số để nguyên**.
4. **Quy tắc vàng**: Mọi lệnh gửi đi bắt buộc phải tạo thông qua hàm duy nhất `buildCommand(name, ...args)` trong `src/services/mqtt/command.ts`. Tuyệt đối không tự ghép chuỗi thủ công trong component.

---

## 3. Bảng Lệnh Chi tiết

| Lệnh                                      | Tham số                         | Giá trị hợp lệ / Mặc định                                                                                              | Chức năng                                       |
| ----------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `Arm(angle)`                              | `angle` (số)                    | `-90` đến `90`                                                                                                         | Quay góc cánh tay servo                         |
| `Muscle(state)`                           | `state` (chuỗi)                 | `"on"` / `"off"`                                                                                                       | Khóa / thả lỏng servo cánh tay                  |
| `Wavehand(speed, times)`                  | `speed`, `times`                | `"fast"`, `"slow"`, `"off"`; số lần (mặc định `fast`, 3)                                                               | Vẫy tay. `Wavehand("off")` để dừng              |
| `Head(state, color)`                      | `state`, `color`                | `"on"` / `"off"`; tên màu hoặc mã hex `#rrggbb`                                                                        | Bật/tắt đèn LED đầu                             |
| `HeadBlink(times, speed, color)`          | `times`, `speed`, `color`       | số lần, `"fast"` / `"slow"`, màu                                                                                       | Nhấp nháy đèn LED đầu                           |
| `Rainbow(effect)`                         | `effect` (chuỗi)                | `"rg"`/`"RG"`, `"rw"`/`"RW"`, `"gw"`/`"GW"`, `"7color"`/`"7Color"`, `"breath"`/`"Breath"` (không phân biệt hoa thường) | Hiệu ứng LED (dừng bằng `Head("off", "black")`) |
| `Play(filename)`                          | `filename` (chuỗi)              | tên file âm thanh có sẵn trên Pi (vd: `hello.mp3`)                                                                     | Phát file âm thanh                              |
| `TextToSpeak(text, lang, voice, service)` | chuỗi, ngôn ngữ, giọng, dịch vụ | tối đa 200 từ; mặc định `vi`, rỗng, `Google`                                                                           | Phát giọng nói từ văn bản                       |
| `Silent()`                                | không có                        | không                                                                                                                  | Dừng phát toàn bộ âm thanh                      |
| `Record(state, timeout)`                  | `state`, `timeout`              | `"on"` / `"off"`; số giây (mặc định 5)                                                                                 | Bật/tắt ghi âm                                  |
| `Listen(state, timeout, lang)`            | `state`, `timeout`, `lang`      | `"on"` / `"off"`; số giây; ngôn ngữ (mặc định `vi-VN`)                                                                 | Lắng nghe và nhận diện giọng nói                |
| `Camera(state, resolution)`               | `state`, `resolution`           | `"on"` / `"off"`; `"320x240"` hoặc `"640x480"`                                                                         | Bật/tắt camera                                  |
| `SetStreamingServer(url)`                 | `url` (chuỗi)                   | URL RTSP đẩy luồng (vd: `rtsp://<host>:8554/live/<botId>/eye`)                                                         | Đặt server nhận luồng RTSP                      |
| `SetVideoStream(url)`                     | `url` (chuỗi)                   | URL HLS xem luồng (vd: `https://<host>/<botId>/video.m3u8`)                                                            | Đặt server xem luồng camera HLS                 |
| `CheckCamera()`                           | không có                        | không                                                                                                                  | Yêu cầu Pi báo trạng thái cam (`cam=on/off`)    |

Hai lệnh đặc biệt không có dấu ngoặc:

- `help`: Yêu cầu Pi trả về danh sách các lệnh hỗ trợ.
- `info`: Yêu cầu Pi trả về thông tin kết nối và mạng.

---

## 4. Gói tin Trạng thái từ Robot (`<botId>/status`)

Khi nhận gói tin trạng thái từ robot, hệ thống áp dụng hàm chuẩn hóa âm thoại `normalizeStatusMessage` (chuyển đổi `ai pi` / `ai-pi` thành `IP`, chuyển đổi `chấm` / `dot` giữa các số thành dấu `.`) và hiển thị trực tiếp toàn bộ nội dung nguyên bản (raw text) lên khung nhật ký `LogMonitor` qua hàm `logStatusReceive()`:

| Dữ liệu nhận được                          | Ý nghĩa                                              | Web xử lý                                                  |
| ------------------------------------------ | ---------------------------------------------------- | ---------------------------------------------------------- |
| Phản hồi lệnh `info`                       | Báo cáo thông tin kết nối và địa chỉ IP mạng thực tế | Chuẩn hóa âm thoại và in toàn bộ chuỗi raw lên LogMonitor  |
| Báo cáo khởi động `[TJBOT STARTUP REPORT]` | Thông tin card mạng lúc robot vừa khởi động          | Chuẩn hóa âm thoại và in toàn bộ chuỗi raw lên LogMonitor  |
| `s2t=<văn bản>` hoặc âm thoại              | Kết quả nhận diện giọng nói Speech-to-Text           | Chuẩn hóa âm thoại và in toàn bộ chuỗi raw lên LogMonitor  |
| `cam=on` / `cam=off`                       | Trạng thái camera                                    | Cập nhật trạng thái camera và trình phát HLS               |
| Khác / tin nhắn log từ Pi                  | Nhật ký hoạt động của robot                          | Chuẩn hóa âm thoại và render text thuần túy lên LogMonitor |
