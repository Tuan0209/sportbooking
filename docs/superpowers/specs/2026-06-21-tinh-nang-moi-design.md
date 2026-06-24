# Thiết kế: Khám phá, Nổi bật, Đặt lịch theo tháng, Thanh toán thủ công & Hoàn tiền

- **Ngày:** 2026-06-21
- **Dự án:** sportbooking (Spring Boot API + React/Vite/Tailwind)
- **Cách làm:** 4 đợt độc lập, mỗi đợt chạy & test được trước khi sang đợt sau.

## Bối cảnh hiện trạng
- Backend: `POST /bookings` (đặt 1 lần, COIN→CONFIRMED, còn lại→PENDING_PAYMENT), `GET /fields/{id}/time-slots` (sinh khung giờ, **không** theo ngày, **không** biết slot đã đặt).
- DB đã có sẵn các bảng `payments`, `payment_proofs`, `refund_requests`, `wallet_transactions` nhưng **chưa có** entity/service/controller.
- Enum Java: `PaymentMethod{COIN,PAYOS,BANK_QR}`, `PaymentStatus{PENDING,PAID,FAILED,EXPIRED,REFUNDED}`, `BookingStatus{PENDING_PAYMENT,PENDING_CONFIRMATION,CONFIRMED,COMPLETED,CANCELED,REJECTED}`.
- **Lưu ý:** cột DB `bookings.status` hiện chỉ có `enum('PENDING','CONFIRMED','COMPLETED','CANCELED','REJECTED')` → thiếu `PENDING_PAYMENT`, `PENDING_CONFIRMATION`. Cần migration ở Đợt 3.
- JPA `ddl-auto: validate` → entity mới phải khớp bảng có sẵn.
- Cloudinary đã cấu hình (upload ảnh bill/proof).
- Frontend axiosClient → `http://127.0.0.1:8081/api`.

---

## Đợt 1 — Khám phá + Nổi bật (chỉ frontend)
Dùng API venue/field hiện có, không sửa backend.

- **`/explore` (Khám phá):** duyệt sân theo loại thể thao + khu vực, ô tìm kiếm + chip lọc, lưới `VenueCard` tái dùng. Lấy dữ liệu từ `venueService.getAllVenues()`; nhóm/lọc client-side.
- **`/trending` (Nổi bật):** xếp hạng theo `venue.rating` giảm dần, mục "Mới mở" (theo createdAt nếu có), huy hiệu top 1/2/3.
- Thay 2 placeholder `ComingSoon` trong `src/app/AppRoutes.jsx` bằng 2 trang thật; giữ bottom nav đã có.
- Tuân thủ design system pitch/ink/chalk đã thiết lập.

**Tiêu chí xong:** 2 trang render dữ liệu thật, lọc/tìm kiếm hoạt động, screenshot đẹp, không lỗi console.

---

## Đợt 2 — Đặt lịch theo tháng

### 2A. Lịch tháng chọn ngày (frontend + 1 API)
- Thêm lịch dạng tháng tại trang đặt sân; chọn ngày → tải khung giờ trống ngày đó.
- **API mới:** `GET /fields/{fieldId}/availability?date=YYYY-MM-DD` → trả danh sách `startTime` đã đặt của field trong ngày (truy vấn `booking_slots`). Frontend dùng để tô slot "đã đặt".

### 2B. Đặt cố định cả tháng — vé tháng (backend + frontend)
- **UI:** chọn field + khung giờ + các thứ trong tuần (daysOfWeek) + tháng áp dụng (month/year).
- **API mới:** `POST /bookings/monthly` body `{fieldId, slots[], daysOfWeek[], month, year, paymentMethod, customerName, customerPhone}`.
  - Sinh tất cả ngày trong tháng khớp daysOfWeek, bỏ ngày quá khứ.
  - Kiểm tra trùng từng (date, slot) qua `booking_slots`; bỏ qua ngày trùng và trả về danh sách bị bỏ.
  - Tạo loạt `Booking` + `BookingSlot` trong 1 transaction.
  - Trả `{tổng buổi tạo, tổng tiền, danh sách ngày bỏ qua}`.

**Tiêu chí xong:** chọn ngày trên lịch hiển thị đúng slot trống; tạo vé tháng tạo đúng số buổi, báo trùng chính xác.

---

## Đợt 3 — Thanh toán thủ công (BANK_QR + bill + admin duyệt)

**Entity mới** (map bảng có sẵn): `Payment`→payments, `PaymentProof`→payment_proofs.

**Migration (bắt buộc):** `ALTER TABLE bookings MODIFY status enum('PENDING','PENDING_PAYMENT','PENDING_CONFIRMATION','CONFIRMED','COMPLETED','CANCELED','REJECTED') ...` để khớp `BookingStatus`.

**Luồng:**
1. Đặt sân method `BANK_QR` → booking `PENDING_PAYMENT`; tạo `Payment(PENDING)` với `transaction_code` = mã booking, `expired_at` = +15 phút.
2. API trả thông tin để hiện **QR VietQR** (sinh từ cấu hình ngân hàng `app.bank.*`) + nội dung CK.
3. User chuyển khoản → `POST /payments/{id}/proof` upload ảnh (Cloudinary) → tạo `PaymentProof`, booking → `PENDING_CONFIRMATION`.
4. **Admin:** `GET /admin/payments?status=` danh sách chờ duyệt; `POST /admin/payments/{id}/approve` → Payment=PAID, booking=CONFIRMED; `POST /admin/payments/{id}/reject` → Payment=FAILED, booking=REJECTED.

**API:** `PaymentController` (user: lấy thông tin thanh toán của booking, upload proof) + `AdminPaymentController` (list/approve/reject). Màn admin "Duyệt thanh toán" + màn user "Thanh toán & upload bill".

**Tiêu chí xong:** đặt BANK_QR → hiện QR → upload bill → admin duyệt → booking CONFIRMED; ảnh bill xem được.

---

## Đợt 4 — PayOS + Hoàn tiền

**Entity mới:** `RefundRequest`→refund_requests, `WalletTransaction`→wallet_transactions.

### PayOS thanh toán
- `PayosService` tạo link thanh toán qua PayOS API (`create-payment-link`), trả checkout URL.
- Cấu hình `payos.client-id/api-key/checksum-key` **để trống** trong `application.yaml`; nếu trống → **chế độ mô phỏng**: trả URL nội bộ + endpoint `POST /payments/{id}/mock-success` để demo (đánh dấu PAID, booking CONFIRMED).
- Có endpoint webhook/return `POST /payments/payos/webhook` (xác thực checksum) để cập nhật khi dùng key thật.

### Hoàn tiền (admin duyệt thủ công — đúng cấu trúc bảng)
1. User huỷ booking đã `PAID`/`CONFIRMED` → `POST /refunds` tạo `RefundRequest(REQUESTED)` (chọn refund_method COIN hoặc BANK_TRANSFER + thông tin ngân hàng nếu BANK_TRANSFER).
2. **Admin** `GET /admin/refunds`, `POST /admin/refunds/{id}/approve`:
   - COIN → cộng ví user (`WalletTransaction ADD`, cập nhật `coin_balance`), Payment=REFUNDED, RefundRequest=DONE.
   - BANK_TRANSFER → admin nhập `transaction_code` + upload `proof_image` đã chuyển → RefundRequest=DONE, Payment=REFUNDED.
   - `POST /admin/refunds/{id}/reject` → REJECTED.
- PayOS auto-refund: để sẵn điểm mở rộng trong `RefundService` (chưa bật vì chưa có tài khoản).

**Tiêu chí xong:** huỷ booking đã thanh toán → tạo yêu cầu hoàn → admin duyệt → COIN cộng ví đúng / BANK_TRANSFER ghi nhận proof; trạng thái cập nhật đồng bộ.

---

## Quyết định kỹ thuật đã chốt
1. Entity mới map đúng bảng có sẵn; chỉ Đợt 3 cần 1 file SQL mở rộng enum `bookings.status`.
2. "Nổi bật" xếp theo rating (chưa đếm lượt đặt).
3. PayOS hoàn tiền = admin duyệt thủ công; auto-refund để điểm mở rộng.
4. PayOS thanh toán có chế độ mô phỏng khi chưa có key.
5. Mọi UI tuân thủ design system pitch/ink/chalk; verify bằng Playwright + screenshot mỗi đợt.

## Ngoài phạm vi (YAGNI)
- Đếm lượt đặt thật cho "Nổi bật".
- PayOS auto-refund qua API (chỉ để điểm mở rộng).
- Thông báo realtime/email khi duyệt thanh toán.
