package com.sportbooking.api.service.fields;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FieldCloudinaryService {

    private final Cloudinary cloudinary;

    private static final String FOLDER = "sport-booking/fields";

    public String uploadImage(MultipartFile file, String imageId) throws IOException {
        validateFile(file);

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", FOLDER,
                        "public_id", imageId, // dung imageId lam ten file tren cloudinary
                        "overwrite", true,
                        "resource_type", "image",
                        "transformation", new Transformation()
                                .quality("auto")
                                .fetchFormat("auto")));

        return uploadResult.get("secure_url").toString();
    }

    public void deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank())
            return;

        try {
            String publicId = extractPublicId(imageUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Deleted field image: {}", publicId);
        } catch (Exception e) {
            log.error("Failed to delete field image", e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File không được để trống");
        }
        if (file.getSize() > 5 * 1024 * 1024) { // 5MB
            throw new RuntimeException("File vượt quá 5MB");
        }
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new RuntimeException("Chỉ cho phép file ảnh");
        }
    }

    private String extractPublicId(String imageUrl) {
        // https://res.cloudinary.com/xxx/image/upload/v123/sport-booking/fields/imageId.jpg
        String[] parts = imageUrl.split("/");
        String fileName = parts[parts.length - 1];
        String folder = parts[parts.length - 2];
        return folder + "/" + fileName.substring(0, fileName.lastIndexOf("."));
    }
}