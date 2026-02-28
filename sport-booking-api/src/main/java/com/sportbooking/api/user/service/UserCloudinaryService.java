package com.sportbooking.api.user.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;
import com.sportbooking.api.common.configuration.CloudinaryConfig;
import com.sportbooking.api.common.enums.ErrorCode;
import java.io.File;
import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import java.util.Arrays;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserCloudinaryService {
    private final Cloudinary cloudinary;

    @Value("${app.avatar.max-size}")
    private long maxFileSize;

    private static final String FOLDER = "sport-booking/avatar";

    /* ================= UPLOAD FROM FILE ================= */

    public String uploadFromFile(MultipartFile file, String userId) throws IOException {

        validateFile(file);

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", FOLDER,
                        "public_id", userId, // mỗi user 1 ảnh
                        "overwrite", true,
                        "resource_type", "image",
                        "transformation",
                        new Transformation()
                                .width(300)
                                .height(300)
                                .crop("fill")
                                .quality("auto")
                                .fetchFormat("auto")));

        return uploadResult.get("secure_url").toString();
    }

    /* ================= UPLOAD FROM URL ================= */

    public String uploadFromUrl(String imageUrl, String userId) throws IOException {

        if (imageUrl == null || imageUrl.isBlank()) {
            throw new RuntimeException("imageUrl không hợp lệ");
        }

        Map uploadResult = cloudinary.uploader().upload(
                imageUrl, // ← truyền imageUrl, không phải file.getBytes()
                ObjectUtils.asMap(
                        "folder", FOLDER,
                        "public_id", userId,
                        "overwrite", true,
                        "resource_type", "image",
                        "transformation", new Transformation()
                                .width(300)
                                .height(300)
                                .crop("fill")
                                .quality("auto")
                                .fetchFormat("auto")));

        return uploadResult.get("secure_url").toString();
    }

    /* ================= DELETE OLD AVATAR ================= */

    public void deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank())
            return;

        try {
            String publicId = extractPublicId(imageUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Deleted old avatar: {}", publicId);
        } catch (Exception e) {
            log.error("Failed to delete old image", e);
        }
    }

    /* ================= VALIDATION ================= */

    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File không được để trống");
        }

        if (file.getSize() > maxFileSize) {
            throw new RuntimeException("File vượt quá 5MB");
        }

        if (file.getContentType() == null ||
                !file.getContentType().startsWith("image/")) {
            throw new RuntimeException("Chỉ cho phép file ảnh");
        }
    }

    /* ================= EXTRACT PUBLIC ID ================= */

    private String extractPublicId(String imageUrl) {
        // ví dụ:
        // https://res.cloudinary.com/xxx/image/upload/v123/sport-booking/avatar/userId.jpg
        String[] parts = imageUrl.split("/");
        String fileName = parts[parts.length - 1];
        String folder = parts[parts.length - 2];
        return folder + "/" + fileName.substring(0, fileName.lastIndexOf("."));
    }
}
