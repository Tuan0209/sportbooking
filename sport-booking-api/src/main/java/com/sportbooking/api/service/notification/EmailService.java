package com.sportbooking.api.service.notification;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

/** Gửi email thông báo qua Resend. Chạy bất đồng bộ, best-effort (không làm hỏng đặt sân). */
@Service
@Slf4j
public class EmailService {

    @Value("${resend.api-key:}")
    private String apiKey;

    @Value("${mail.from:SVĐ Booking <noreply@qlhtt.io.vn>}")
    private String from;

    @Value("${app.admin-notify-email:}")
    private String adminEmail;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    private static String money(BigDecimal v) {
        if (v == null) return "0đ";
        return NumberFormat.getNumberInstance(new Locale("vi", "VN")).format(v) + "đ";
    }

    /** Gửi email báo có đơn đặt sân mới cho admin. */
    public void sendNewBookingNotification(
            String bookingCode, String customerName, String customerPhone,
            String venueName, String fieldName, String date, String time,
            BigDecimal totalPrice, String paymentMethod) {

        if (apiKey == null || apiKey.isBlank() || adminEmail == null || adminEmail.isBlank()) {
            log.info("Bỏ qua gửi email (chưa cấu hình Resend/email nhận).");
            return;
        }

        String html = """
                <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #E4EAE3;border-radius:16px;overflow:hidden">
                  <div style="background:#0E8C4E;color:#fff;padding:18px 22px">
                    <h2 style="margin:0;font-size:18px">🟢 Đơn đặt sân mới</h2>
                  </div>
                  <div style="padding:22px">
                    <p style="margin:0 0 14px;color:#5B6B61">Bạn vừa có một đơn đặt sân mới. Vào trang quản trị để xác nhận nhé.</p>
                    <table style="width:100%%;border-collapse:collapse;font-size:14px;color:#06231A">
                      <tr><td style="padding:6px 0;color:#5B6B61">Mã đơn</td><td style="padding:6px 0;font-weight:700;text-align:right">%s</td></tr>
                      <tr><td style="padding:6px 0;color:#5B6B61">Khách hàng</td><td style="padding:6px 0;text-align:right">%s</td></tr>
                      <tr><td style="padding:6px 0;color:#5B6B61">Số điện thoại</td><td style="padding:6px 0;text-align:right">%s</td></tr>
                      <tr><td style="padding:6px 0;color:#5B6B61">Cơ sở</td><td style="padding:6px 0;text-align:right">%s</td></tr>
                      <tr><td style="padding:6px 0;color:#5B6B61">Sân</td><td style="padding:6px 0;text-align:right">%s</td></tr>
                      <tr><td style="padding:6px 0;color:#5B6B61">Ngày</td><td style="padding:6px 0;text-align:right">%s</td></tr>
                      <tr><td style="padding:6px 0;color:#5B6B61">Khung giờ</td><td style="padding:6px 0;text-align:right">%s</td></tr>
                      <tr><td style="padding:6px 0;color:#5B6B61">Thanh toán</td><td style="padding:6px 0;text-align:right">%s</td></tr>
                      <tr><td style="padding:10px 0 0;color:#5B6B61;font-weight:700">Tổng tiền</td><td style="padding:10px 0 0;text-align:right;font-weight:800;color:#0E8C4E;font-size:18px">%s</td></tr>
                    </table>
                  </div>
                  <div style="background:#F5F7F4;padding:14px 22px;color:#5B6B61;font-size:12px;text-align:center">SVĐ · Hệ thống đặt sân thể thao</div>
                </div>
                """
                .formatted(bookingCode, customerName, customerPhone, venueName, fieldName,
                        date, time, paymentMethod, money(totalPrice));

        CompletableFuture.runAsync(() -> {
            try {
                Map<String, Object> body = Map.of(
                        "from", from,
                        "to", List.of(adminEmail),
                        "subject", "Đơn đặt sân mới · " + bookingCode,
                        "html", html);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://api.resend.com/emails"))
                        .header("Authorization", "Bearer " + apiKey)
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(
                                objectMapper.writeValueAsString(body), StandardCharsets.UTF_8))
                        .build();

                HttpResponse<String> res = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                if (res.statusCode() >= 200 && res.statusCode() < 300) {
                    log.info("Đã gửi email báo đơn {} tới {}", bookingCode, adminEmail);
                } else {
                    log.warn("Gửi email thất bại ({}): {}", res.statusCode(), res.body());
                }
            } catch (Exception e) {
                log.warn("Lỗi gửi email báo đơn: {}", e.getMessage());
            }
        });
    }

    /** Gửi mã OTP đặt lại mật khẩu tới email người dùng. Trả về true nếu gửi thành công. */
    public boolean sendPasswordResetOtp(String toEmail, String otp) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Chưa cấu hình Resend, không gửi được OTP.");
            return false;
        }

        String html = """
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #E4EAE3;border-radius:16px;overflow:hidden">
                  <div style="background:#0E8C4E;color:#fff;padding:18px 22px">
                    <h2 style="margin:0;font-size:18px">🔐 Đặt lại mật khẩu</h2>
                  </div>
                  <div style="padding:24px;text-align:center">
                    <p style="margin:0 0 16px;color:#5B6B61;font-size:14px">Mã xác thực đặt lại mật khẩu của bạn là:</p>
                    <div style="font-size:34px;font-weight:800;letter-spacing:10px;color:#0E8C4E;margin:8px 0 16px">%s</div>
                    <p style="margin:0;color:#8A968E;font-size:12px">Mã có hiệu lực trong 5 phút. Không chia sẻ mã này cho bất kỳ ai.</p>
                    <p style="margin:14px 0 0;color:#8A968E;font-size:12px">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
                  </div>
                  <div style="background:#F5F7F4;padding:14px 22px;color:#5B6B61;font-size:12px;text-align:center">SVĐ · Hệ thống đặt sân thể thao</div>
                </div>
                """
                .formatted(otp);

        try {
            Map<String, Object> body = Map.of(
                    "from", from,
                    "to", List.of(toEmail),
                    "subject", "Mã đặt lại mật khẩu · SVĐ Booking",
                    "html", html);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(
                            objectMapper.writeValueAsString(body), StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> res = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() >= 200 && res.statusCode() < 300) {
                log.info("Đã gửi OTP đặt lại mật khẩu tới {}", toEmail);
                return true;
            }
            log.warn("Gửi OTP thất bại ({}): {}", res.statusCode(), res.body());
            return false;
        } catch (Exception e) {
            log.warn("Lỗi gửi OTP: {}", e.getMessage());
            return false;
        }
    }
}
