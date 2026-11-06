# TIẾN ĐỘ PHÁT TRIỂN DỰ ÁN (PROJECT ROADMAP & TASK TRACKER)

> **QUY TẮC SỬ DỤNG**:
>
> 1. File này là bảng theo dõi tiến độ chính thức của dự án `tjbot-webcontrol`.
> 2. Dự án phát triển theo hướng **Trực quan hóa (Visual-First)**: Dựng trước bộ khung giao diện hoàn chỉnh và lưới phòng tập với 5 thẻ giữ chỗ (Placeholder Cards), sau đó hoàn thiện từng khối tính năng để đắp trực tiếp vào màn hình.
> 3. Mỗi khi hoàn thành một task và vượt qua quality gate (`npm run check`), checkbox tương ứng sẽ được đánh dấu `[x]`.
> 4. Mỗi task được thực hiện trên một nhánh riêng, mở Pull Request để GitHub Copilot review trước khi Squash Merge vào nhánh `main`.

---

## GIAI ĐOẠN 0: KHỞI TẠO NỀN TẢNG & CƠ CHẾ KIỂM SOÁT (HOÀN THÀNH)

- [x] **T0.1: Khởi tạo dự án & Công cụ chất lượng**
  - [x] Khởi tạo Vite React 19 + TypeScript Strict Project References (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`).
  - [x] Cửa kiểm soát `npm run check` (format:check, lint, typecheck, build).
  - [x] Khóa phiên bản Node.js LTS (`.nvmrc`).
  - [x] Chặn bảo mật triệt để (`.gitignore` chặn `.env`, `node_modules`, `dist`, `*.tsbuildinfo`).
- [x] **T0.2: Thiết lập Hợp đồng & Ràng buộc (Project Rules)**
  - [x] Tạo `.antigravity/project_rules.md` gồm 10 điều khoản bất di bất dịch.
  - [x] Gắn liên kết hợp đồng từ tất cả các file tài liệu (`README.md`, `docs/*`).
  - [x] Cấu hình ESLint AST cấm inline style (`style={{...}}`) và chặn import chéo giữa các feature.
- [x] **T0.3: Luồng CI/CD & Deploy GitHub Pages**
  - [x] Cấu hình `.github/workflows/deploy.yml` deploy lên GitHub Pages từ `main`.
  - [x] Cấu hình `.github/workflows/ci.yml` quét quality gate và commitlint cho PR / push.
  - [x] Mẫu PR `.github/pull_request_template.md` hỗ trợ Copilot review.
  - [x] Giải quyết truyền biến môi trường an toàn qua `define: { __APP_ENV__ }` trong `vite.config.ts`.
  - [x] Tạo `src/core/env.ts` làm cổng đọc duy nhất các biến môi trường có kiểu.
  - [x] Tạo `public/vite.svg` tránh lỗi 404 favicon.

---

## GIAI ĐOẠN 1: BỘ KHUNG GIAO DIỆN & TRANG PHÒNG TẬP GIỮ CHỖ (VISUAL SHELL & SKELETON)

_Mục tiêu giai đoạn: Ngay sau khi xong giai đoạn này, chạy `npm run dev` sẽ nhìn thấy 100% hình hài giao diện Dashboard trực quan trên trình duyệt (thanh điều khiển, menu sườn, khung log, và lưới 2 cột chứa 5 khối phần cứng)._

- [x] **T1.1: Cấu hình i18n & Khung SCSS Layout**
  - [x] `src/i18n/i18n.ts` & `src/i18n/common.i18n.ts`: Cấu hình `i18next` và từ điển từ ngữ chung (Kết nối, Ngắt, Đang tải...).
  - [x] `src/styles/layout/`: Các file SCSS BEM cho navbar, sidebar, connection bar, log monitor.
- [x] **T1.2: Thanh điều hướng trên cùng & Thanh kết nối (Navbar & ConnectionBar)**
  - [x] `src/app/layout/ConnectionBar.tsx`: Giao diện chọn `botId`, chấm đèn trạng thái, nút Kết nối / Ngắt.
  - [x] `src/app/layout/Navbar.tsx`: Tiêu đề trung tâm điều khiển, nút thu gọn / mở rộng menu sườn.
- [x] **T1.3: Menu sườn & Khung giám sát log (Sidebar & LogMonitor)**
  - [x] `src/app/layout/Sidebar.tsx`: Menu sườn 4 tab (Giới thiệu, Phòng tập, Hành động, Cấu hình).
  - [x] `src/app/layout/LogMonitor.tsx`: Khung đen hiển thị log dưới đáy màn hình, tự động cuộn dòng mới.
- [x] **T1.4: Lưới Phòng tập giữ chỗ (GymPage Skeleton)**
  - [x] `src/features/gym/GymPage.tsx`: Lưới 2 cột Bootstrap chứa sẵn 5 thẻ giữ chỗ (Placeholder Cards) cho Đèn LED, Cánh tay, Âm thanh, Micro, và Camera y hệt giao diện cũ.
- [ ] **T1.5: Trang giới thiệu & Điều hướng tab (IntroPage & Router)**
  - [ ] `src/features/intro/IntroPage.tsx`: Nhúng iframe Toolhub.
  - [ ] `src/app/routes.tsx` & `src/app/App.tsx`: Lắp ráp layout và xử lý chuyển đổi giữa 4 tab.

---

## GIAI ĐOẠN 2: HẠ TẦNG KẾT NỐI MQTT & DỊCH VỤ CỐT LÕI (CORE & SERVICES)

_Mục tiêu giai đoạn: Xây dựng bộ não truyền nhận dữ liệu ngầm và đấu nối trực tiếp vào Thanh kết nối và Khung log._

- [ ] **T2.1: Giới hạn phần cứng & Bộ nhớ cục bộ**
  - [ ] `src/core/hardware-limits.ts`: Các hằng số vật lý (góc -90..90 độ, throttle 60ms, TTS tối đa 200 từ).
  - [ ] `src/services/storage/storage.ts`: Wrapper `localStorage` an toàn có `try/catch` và giá trị mặc định.
- [ ] **T2.2: Định nghĩa Topic & Cổng phát lệnh duy nhất**
  - [ ] `src/services/mqtt/topics.ts`: Topic gửi lệnh và nhận trạng thái theo `botId`.
  - [ ] `src/services/mqtt/command.ts`: Hàm duy nhất `buildCommand(name, ...args)` bọc nháy kép chuỗi qua `JSON.stringify`, giữ nguyên số.
- [ ] **T2.3: Giải mã trạng thái & Nhật ký hệ thống**
  - [ ] `src/services/mqtt/status-parser.ts`: Bóc tách `s2t=...`, `cam=on/off`, báo cáo mạng và log từ Pi.
  - [ ] `src/core/logger.ts`: Quản lý danh sách log tối đa 100 dòng, render text thuần túy (chống XSS 100%).
- [ ] **T2.4: Kết nối MQTT Client & Đấu nối giao diện**
  - [ ] `src/services/mqtt/mqtt-client.ts`: Quản lý WebSocket qua `mqtt.js`, tự động kết nối lại khi mất mạng.
  - [ ] `src/services/mqtt/MqttProvider.tsx` & `src/services/mqtt/useMqtt.ts`: Context và hook điều khiển kết nối.
  - [ ] Đấu nối `useMqtt` vào `ConnectionBar.tsx` và `LogMonitor.tsx` (bấm Kết nối / Ngắt chạy thật trên giao diện).

---

## GIAI ĐOẠN 3: TÍNH NĂNG ĐÈN LED ĐẦU (FEATURE: LED)

_Mục tiêu giai đoạn: Hoàn thiện và đắp trực tiếp vào ô Card LED của trang GymPage._

- [ ] **T3.1: Lệnh MQTT & Đa ngôn ngữ**
  - [ ] `src/features/led/led.commands.ts`: Các lệnh `Head`, `HeadBlink`, `Rainbow`.
  - [ ] `src/features/led/led.i18n.ts`: Từ điển song ngữ cho đèn LED.
  - [ ] `src/features/led/hooks/useLed.ts`: Hook điều khiển trạng thái màu và gửi lệnh.
- [ ] **T3.2: Khối chọn màu HEX & RGB**
  - [ ] `src/features/led/components/ColorPickerHex.tsx`: Ô nhập mã HEX, nút mở bảng màu, mô phỏng bóng đèn LED 1.
  - [ ] `src/features/led/components/ColorPickerRgb.tsx`: 3 ô nhập R, G, B (0..255), mô phỏng bóng đèn LED 2.
- [ ] **T3.3: Khối chớp sáng & Dải màu Rainbow**
  - [ ] `src/features/led/components/BlinkControl.tsx`: Cài đặt số lần và tốc độ chớp.
  - [ ] `src/features/led/components/RainbowButtons.tsx`: 5 nút hiệu ứng dải màu và nút tắt hiệu ứng.
- [ ] **T3.4: Lắp ráp Panel Đèn LED hoàn chỉnh**
  - [ ] `src/features/led/LedPanel.tsx` & `src/features/led/led.scss`: Card giao diện hoàn chỉnh.
  - [ ] Thay thế thẻ giữ chỗ LED trong `GymPage.tsx` bằng `LedPanel`.

---

## GIAI ĐOẠN 4: TÍNH NĂNG CÁNH TAY ROBOT (FEATURE: ARM)

_Mục tiêu giai đoạn: Hoàn thiện và đắp trực tiếp vào ô Card Cánh tay của trang GymPage._

- [ ] **T4.1: Lệnh MQTT & Đa ngôn ngữ**
  - [ ] `src/features/arm/arm.commands.ts`: Các lệnh `Arm`, `Muscle`, `Wavehand`.
  - [ ] `src/features/arm/arm.i18n.ts`: Từ điển song ngữ cánh tay.
  - [ ] `src/features/arm/hooks/useArm.ts`: Hook quản lý góc xoay và throttle 60ms cho chế độ Làm theo tôi.
- [ ] **T4.2: Đĩa xoay góc Canvas**
  - [ ] `src/features/arm/components/AngleDial.tsx`: Canvas vẽ đĩa tròn tương tác kéo/click chuột đổi góc (-90..90 độ).
- [ ] **T4.3: Khóa cơ bắp & Kịch bản vẫy tay**
  - [ ] `src/features/arm/components/MuscleToggle.tsx`: Công tắc Cơ bắp (`Muscle("on")`) và Nghỉ ngơi (`Muscle("off")`).
  - [ ] `src/features/arm/components/WavehandControl.tsx`: Cấu hình số lần, tốc độ vẫy tay và nút dừng.
- [ ] **T4.4: Lắp ráp Panel Cánh tay hoàn chỉnh**
  - [ ] `src/features/arm/ArmPanel.tsx` & `src/features/arm/arm.scss`: Card giao diện hoàn chỉnh.
  - [ ] Thay thế thẻ giữ chỗ Cánh tay trong `GymPage.tsx` bằng `ArmPanel`.

---

## GIAI ĐOẠN 5: HỆ THỐNG ÂM THANH & THU ÂM (FEATURES: AUDIO & MIC)

_Mục tiêu giai đoạn: Hoàn thiện và đắp trực tiếp vào 2 ô Card Âm thanh và Micro của trang GymPage._

- [ ] **T5.1: Phân hệ Âm thanh & Text-to-Speech (Audio)**
  - [ ] `src/features/audio/audio.commands.ts`: Các lệnh `Play`, `TextToSpeak`, `Silent`.
  - [ ] `src/features/audio/audio.i18n.ts`: Từ điển song ngữ âm thanh.
  - [ ] `src/features/audio/hooks/useAudio.ts`: Hook phát file và giới hạn đếm từ TTS (tối đa 200 từ).
  - [ ] `src/features/audio/components/SoundPicker.tsx`: Chọn file có sẵn (`hello.mp3`, `bye.mp3`...) và nút Suỵt.
  - [ ] `src/features/audio/components/TtsForm.tsx`: Textarea nhập văn bản, chọn ngôn ngữ và giọng đọc.
  - [ ] `src/features/audio/AudioPanel.tsx` & `src/features/audio/audio.scss`: Card giao diện hoàn chỉnh.
  - [ ] Thay thế thẻ giữ chỗ Âm thanh trong `GymPage.tsx` bằng `AudioPanel`.
- [ ] **T5.2: Phân hệ Thu âm & Nhận diện giọng nói (Mic)**
  - [ ] `src/features/mic/mic.commands.ts`: Các lệnh `Record`, `Listen`.
  - [ ] `src/features/mic/mic.i18n.ts`: Từ điển song ngữ micro.
  - [ ] `src/features/mic/hooks/useMic.ts`: Hook lắng nghe gói trạng thái `s2t=...` từ robot.
  - [ ] `src/features/mic/components/RecordControl.tsx`: Khối Nghe và nói nhại (`Record`).
  - [ ] `src/features/mic/components/ListenControl.tsx`: Khối Nghe hiểu AI (`Listen`) và khung hiển thị kết quả.
  - [ ] `src/features/mic/MicPanel.tsx` & `src/features/mic/mic.scss`: Card giao diện hoàn chỉnh.
  - [ ] Thay thế thẻ giữ chỗ Micro trong `GymPage.tsx` bằng `MicPanel`.

---

## GIAI ĐOẠN 6: THỊ GIÁC & CAMERA LIVE STREAM (FEATURE: CAMERA)

_Mục tiêu giai đoạn: Hoàn thiện và đắp trực tiếp vào ô Card Camera của trang GymPage._

- [ ] **T6.1: Vòng đời luồng HLS an toàn**
  - [ ] `src/features/camera/camera.commands.ts`: Các lệnh `Camera`, `SetStreamingServer`, `SetVideoStream`, `CheckCamera`.
  - [ ] `src/features/camera/camera.i18n.ts`: Từ điển song ngữ camera.
  - [ ] `src/features/camera/hooks/useHls.ts`: Hook khởi tạo và giải phóng triệt để (`hls.destroy()`) khi rời tab.
  - [ ] `src/features/camera/hooks/useCamera.ts`: Hook quản lý bật/tắt và độ phân giải camera.
- [ ] **T6.2: Màn hình video & Cấu hình luồng**
  - [ ] `src/features/camera/components/VideoPlayer.tsx`: Thẻ video HTML5 kèm lens mắt robot và badge trạng thái.
  - [ ] `src/features/camera/components/ResolutionSelect.tsx`: Chọn độ phân giải (320x240, 640x480, 1280x720).
  - [ ] `src/features/camera/components/StreamConfig.tsx`: Cấu hình địa chỉ RTSP đẩy đi và HLS kéo về.
- [ ] **T6.3: Lắp ráp Panel Camera hoàn chỉnh**
  - [ ] `src/features/camera/CameraPanel.tsx` & `src/features/camera/camera.scss`: Card giao diện hoàn chỉnh.
  - [ ] Thay thế thẻ giữ chỗ Camera trong `GymPage.tsx` bằng `CameraPanel`.

---

## GIAI ĐOẠN 7: TRỢ LÝ AI CHATBOT & CẤU HÌNH WIFI (ASKME & WIFI)

- [ ] **T7.1: Dịch vụ AI Gateway**
  - [ ] `src/services/ai/ai-provider.ts` & `src/services/ai/gemini-provider.ts`: Tích hợp Google Gemini API qua key lưu trong `localStorage`.
- [ ] **T7.2: Phân hệ Trợ lý AI (AskMe - Tab Hành động)**
  - [ ] `src/features/askme/hooks/useAskMe.ts`: Hook kết nối hội thoại, đọc câu trả lời (TTS) và lắng nghe (S2T).
  - [ ] `src/features/askme/components/ChatList.tsx`: Danh sách tin nhắn dạng bong bóng chat.
  - [ ] `src/features/askme/components/ChatInput.tsx`: Ô nhập text, nút gửi và nút micro.
  - [ ] `src/features/askme/components/KeySettings.tsx`: Ô nhập Gemini Key và 3 công tắc điều khiển.
  - [ ] `src/features/askme/AskMePanel.tsx` & `src/features/askme/askme.scss`: Giao diện Chatbot AI hoàn chỉnh.
- [ ] **T7.3: Giao diện cấu hình Wifi giữ chỗ (Wifi Placeholder - Tab Cấu hình)**
  - [ ] `src/features/wifi/WifiPanel.tsx` & `src/features/wifi/wifi.scss`: Giao diện card Wifi giữ chỗ theo đúng khuôn mẫu cũ, sẵn sàng nâng cấp sau.

---

## GIAI ĐOẠN 8: ĐỒNG BỘ, KIỂM TRA TOÀN DIỆN & NGHIỆM THU

- [ ] **T8.1: Kiểm tra toàn bộ Quality Gate**
  - [ ] `npm run check` chạy xanh 100% (format, lint, typecheck, build).
  - [ ] Không còn `any`, không còn inline style, không có lỗi ranh giới dòng hay module.
- [ ] **T8.2: Chạy thử nghiệm kết nối MQTT với Robot thực tế / Test Broker**
  - [ ] Gửi thành công ít nhất 1 lệnh của mỗi phân hệ xuống topic commands.
  - [ ] Nhận và bóc tách thành công phản hồi từ topic status.
