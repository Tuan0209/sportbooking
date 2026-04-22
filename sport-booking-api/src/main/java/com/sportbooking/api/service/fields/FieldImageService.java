package com.sportbooking.api.service.fields;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.sportbooking.api.common.enums.FieldImageType;
import com.sportbooking.api.dto.request.fields.FieldImageUploadRequest;
import com.sportbooking.api.dto.response.fields.FieldImageResponse;
import com.sportbooking.api.entity.fields.Field;
import com.sportbooking.api.entity.fields.FieldImage;
import com.sportbooking.api.mapper.FieldImageMapper;
import com.sportbooking.api.repository.fields.FieldImageRepository;
import com.sportbooking.api.repository.fields.FieldRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class FieldImageService {

    FieldImageRepository fieldImageRepository;
    FieldRepository fieldRepository;
    FieldCloudinaryService fieldCloudinaryService;
    FieldImageMapper fieldImageMapper;

    // ─── COVER / THUMBNAIL: replace ảnh cũ nếu đã có ─────────────────────────

    @Transactional
    public FieldImageResponse replaceSingleImage(String fieldId, MultipartFile file,
            FieldImageType type) throws IOException {

        // cover và thumbnail mỗi loại chỉ có 1 ảnh
        if (type == FieldImageType.gallery) {
            throw new RuntimeException("Dùng uploadGallery cho loại gallery");
        }

        Field field = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new RuntimeException("Field not found with id: " + fieldId));

        // xoa anh cu tren cloudinary va database neu da co
        List<FieldImage> existing = fieldImageRepository
                .findByFieldIdAndTypeOrderBySortOrderAsc(fieldId, type);
        existing.forEach(img -> fieldCloudinaryService.deleteImage(img.getImageUrl()));
        fieldImageRepository.deleteAll(existing);

        // upload anh moi
        String imageId = fieldId + "_" + type.name() + "_" + System.currentTimeMillis();
        String imageUrl = fieldCloudinaryService.uploadImage(file, imageId);

        FieldImage saved = fieldImageRepository.save(FieldImage.builder()
                .field(field)
                .imageUrl(imageUrl)
                .type(type)
                .isPrimary(true) // cover va thumbnail luon la primary
                .sortOrder(0)
                .build());

        return fieldImageMapper.toFieldImageResponse(saved);
    }

    // ─── GALLERY: upload nhiều ảnh cùng lúc ───────────────────────────────────

    @Transactional
    public List<FieldImageResponse> uploadGallery(String fieldId,
            List<MultipartFile> files,
            FieldImageUploadRequest request) throws IOException {

        Field field = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new RuntimeException("Field not found with id: " + fieldId));

        // lay sort_order lon nhat hien tai de tiep tuc danh so
        int maxSortOrder = fieldImageRepository
                .findByFieldIdAndTypeOrderBySortOrderAsc(fieldId, FieldImageType.gallery)
                .stream()
                .mapToInt(FieldImage::getSortOrder)
                .max()
                .orElse(-1);

        List<FieldImage> newImages = new java.util.ArrayList<>();

        for (int i = 0; i < files.size(); i++) {
            String imageId = fieldId + "_gallery_" + System.currentTimeMillis() + "_" + i;
            String imageUrl = fieldCloudinaryService.uploadImage(files.get(i), imageId);

            // anh dau tien trong batch co the set isPrimary neu request yeu cau
            boolean isPrimary = (i == 0) && request.isPrimary();

            // neu set primary thi unset anh primary cu
            if (isPrimary)
                unsetCurrentPrimary(fieldId, FieldImageType.gallery);

            newImages.add(FieldImage.builder()
                    .field(field)
                    .imageUrl(imageUrl)
                    .type(FieldImageType.gallery)
                    .isPrimary(isPrimary)
                    .sortOrder(maxSortOrder + 1 + i) // tiep tuc sort_order
                    .build());
        }

        return fieldImageRepository.saveAll(newImages)
                .stream()
                .map(fieldImageMapper::toFieldImageResponse)
                .toList();
    }

    // ─── GET ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<FieldImageResponse> getImagesByFieldId(String fieldId) {
        if (!fieldRepository.existsById(fieldId)) {
            throw new RuntimeException("Field not found with id: " + fieldId);
        }
        return fieldImageRepository.findByFieldIdOrderBySortOrderAsc(fieldId)
                .stream()
                .map(fieldImageMapper::toFieldImageResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FieldImageResponse> getImagesByType(String fieldId, FieldImageType type) {
        if (!fieldRepository.existsById(fieldId)) {
            throw new RuntimeException("Field not found with id: " + fieldId);
        }
        return fieldImageRepository.findByFieldIdAndTypeOrderBySortOrderAsc(fieldId, type)
                .stream()
                .map(fieldImageMapper::toFieldImageResponse)
                .toList();
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @Transactional
    public String deleteImage(String imageId) {
        FieldImage fieldImage = fieldImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found with id: " + imageId));
        fieldCloudinaryService.deleteImage(fieldImage.getImageUrl());
        fieldImageRepository.delete(fieldImage);
        return "Image deleted successfully";
    }

    @Transactional
    public String deleteAllImages(String fieldId) {
        if (!fieldRepository.existsById(fieldId)) {
            throw new RuntimeException("Field not found with id: " + fieldId);
        }
        List<FieldImage> images = fieldImageRepository.findByFieldIdOrderBySortOrderAsc(fieldId);
        images.forEach(img -> fieldCloudinaryService.deleteImage(img.getImageUrl()));
        fieldImageRepository.deleteAllByFieldId(fieldId);
        return "All images deleted successfully";
    }

    // ─── HELPER ───────────────────────────────────────────────────────────────

    private void unsetCurrentPrimary(String fieldId, FieldImageType type) {
        fieldImageRepository.findByFieldIdAndTypeAndIsPrimaryTrue(fieldId, type)
                .ifPresent(img -> {
                    img.setPrimary(false);
                    fieldImageRepository.save(img);
                });
    }
}