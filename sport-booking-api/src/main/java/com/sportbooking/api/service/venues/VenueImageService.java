package com.sportbooking.api.service.venues;

import com.sportbooking.api.common.enums.VenueImageType;
import com.sportbooking.api.dto.response.venues.VenueImageResponse;
import com.sportbooking.api.entity.venues.Venue;
import com.sportbooking.api.entity.venues.VenueImage;
import com.sportbooking.api.mapper.VenueImageMapper;
import com.sportbooking.api.repository.venues.VenueImageRepository;
import com.sportbooking.api.repository.venues.VenueRepository;
import com.sportbooking.api.service.fields.FieldCloudinaryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class VenueImageService {

    VenueImageRepository venueImageRepository;
    VenueRepository venueRepository;
    FieldCloudinaryService cloudinaryService;
    VenueImageMapper venueImageMapper;

    // ─── COVER / THUMBNAIL ─────────────────────────
    @Transactional
    public VenueImageResponse replaceSingleImage(String venueId,
            MultipartFile file,
            VenueImageType type) throws IOException {

        if (type == VenueImageType.gallery) {
            throw new RuntimeException("Dùng uploadGallery cho gallery");
        }

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        // xoá ảnh cũ
        List<VenueImage> existing = venueImageRepository
                .findByVenueIdAndTypeOrderBySortOrderAsc(venueId, type);

        existing.forEach(img -> cloudinaryService.deleteImage(img.getImageUrl()));
        venueImageRepository.deleteAll(existing);

        // upload mới
        String imageId = venueId + "_" + type.name() + "_" + System.currentTimeMillis();
        String imageUrl = cloudinaryService.uploadImage(file, imageId);

        VenueImage saved = venueImageRepository.save(
                VenueImage.builder()
                        .venue(venue)
                        .imageUrl(imageUrl)
                        .type(type)
                        .isPrimary(true)
                        .sortOrder(0)
                        .build());

        return venueImageMapper.toResponse(saved);
    }

    // ─── GALLERY ─────────────────────────
    @Transactional
    public List<VenueImageResponse> uploadGallery(String venueId,
            List<MultipartFile> files,
            boolean isPrimary) throws IOException {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        int maxSort = venueImageRepository
                .findByVenueIdAndTypeOrderBySortOrderAsc(venueId, VenueImageType.gallery)
                .stream()
                .mapToInt(VenueImage::getSortOrder)
                .max()
                .orElse(-1);

        List<VenueImage> list = new java.util.ArrayList<>();

        for (int i = 0; i < files.size(); i++) {

            String imageId = venueId + "_gallery_" + System.currentTimeMillis() + "_" + i;
            String url = cloudinaryService.uploadImage(files.get(i), imageId);

            boolean primary = (i == 0 && isPrimary);

            if (primary) {
                unsetPrimary(venueId);
            }

            list.add(VenueImage.builder()
                    .venue(venue)
                    .imageUrl(url)
                    .type(VenueImageType.gallery)
                    .isPrimary(primary)
                    .sortOrder(maxSort + 1 + i)
                    .build());
        }

        return venueImageRepository.saveAll(list)
                .stream()
                .map(venueImageMapper::toResponse)
                .toList();
    }

    // ─── GET ─────────────────────────
    public List<VenueImageResponse> getByVenue(String venueId) {
        return venueImageRepository.findByVenueIdOrderBySortOrderAsc(venueId)
                .stream()
                .map(venueImageMapper::toResponse)
                .toList();
    }

    // ─── DELETE ─────────────────────────
    @Transactional
    public void delete(String imageId) {
        VenueImage img = venueImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        cloudinaryService.deleteImage(img.getImageUrl());
        venueImageRepository.delete(img);
    }

    // ─── HELPER ─────────────────────────
    private void unsetPrimary(String venueId) {
        venueImageRepository
                .findByVenueIdAndTypeAndIsPrimaryTrue(venueId, VenueImageType.gallery)
                .ifPresent(img -> {
                    img.setIsPrimary(false);
                    venueImageRepository.save(img);
                });
    }

    public List<VenueImageResponse> getByType(String venueId, VenueImageType type) {
        return venueImageRepository
                .findByVenueIdAndTypeOrderBySortOrderAsc(venueId, type)
                .stream()
                .map(venueImageMapper::toResponse)
                .toList();
    }

    public void deleteAll(String venueId) {
        List<VenueImage> images = venueImageRepository.findByVenueIdOrderBySortOrderAsc(venueId);
        images.forEach(img -> cloudinaryService.deleteImage(img.getImageUrl()));
        venueImageRepository.deleteAll(images);
    }

    @Transactional
    public VenueImageResponse replaceSingle(String venueId,
            MultipartFile file,
            VenueImageType type) throws IOException {

        if (type == VenueImageType.gallery) {
            throw new RuntimeException("Gallery dùng API riêng");
        }

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        // xoá ảnh cũ (cover / thumbnail chỉ có 1)
        List<VenueImage> existing = venueImageRepository
                .findByVenueIdAndTypeOrderBySortOrderAsc(venueId, type);

        existing.forEach(img -> cloudinaryService.deleteImage(img.getImageUrl()));
        venueImageRepository.deleteAll(existing);

        // upload ảnh mới
        String imageId = venueId + "_" + type.name() + "_" + System.currentTimeMillis();
        String imageUrl = cloudinaryService.uploadImage(file, imageId);

        VenueImage saved = venueImageRepository.save(
                VenueImage.builder()
                        .venue(venue)
                        .imageUrl(imageUrl)
                        .type(type)
                        .isPrimary(true)
                        .sortOrder(0)
                        .build());

        return venueImageMapper.toResponse(saved);
    }
}
