package com.sportbooking.api.controller.venues;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.common.enums.VenueImageType;
import com.sportbooking.api.dto.response.venues.VenueImageResponse;
import com.sportbooking.api.service.venues.VenueImageService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/venue-images")
@Slf4j
public class VenueImageController {

    VenueImageService venueImageService;

    // ─── GET ALL ─────────────────────────
    @GetMapping("/{venueId}")
    ApiResponse<List<VenueImageResponse>> getImagesByVenueId(@PathVariable String venueId) {
        return ApiResponse.<List<VenueImageResponse>>builder()
                .result(venueImageService.getByVenue(venueId))
                .build();
    }

    // ─── GET BY TYPE ─────────────────────────
    @GetMapping("/{venueId}/type")
    ApiResponse<List<VenueImageResponse>> getImagesByType(
            @PathVariable String venueId,
            @RequestParam VenueImageType type) {

        return ApiResponse.<List<VenueImageResponse>>builder()
                .result(venueImageService.getByType(venueId, type))
                .build();
    }

    // ─── COVER ─────────────────────────
    @RequestMapping(value = "/{venueId}/cover", method = { RequestMethod.POST,
            RequestMethod.PUT }, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<VenueImageResponse> uploadOrReplaceCover(
            @PathVariable String venueId,
            @RequestParam("file") MultipartFile file) throws IOException {

        return ApiResponse.<VenueImageResponse>builder()
                .result(venueImageService.replaceSingle(venueId, file, VenueImageType.cover))
                .build();
    }

    // ─── THUMBNAIL ─────────────────────────
    @RequestMapping(value = "/{venueId}/thumbnail", method = { RequestMethod.POST,
            RequestMethod.PUT }, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<VenueImageResponse> uploadOrReplaceThumbnail(
            @PathVariable String venueId,
            @RequestParam("file") MultipartFile file) throws IOException {

        return ApiResponse.<VenueImageResponse>builder()
                .result(venueImageService.replaceSingle(venueId, file, VenueImageType.thumbnail))
                .build();
    }

    // ─── GALLERY ─────────────────────────
    @PostMapping(value = "/{venueId}/gallery", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<List<VenueImageResponse>> uploadGallery(
            @PathVariable String venueId,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(defaultValue = "false") boolean isPrimary) throws IOException {

        return ApiResponse.<List<VenueImageResponse>>builder()
                .result(venueImageService.uploadGallery(venueId, files, isPrimary))
                .build();
    }

    // ─── DELETE 1 ─────────────────────────
    @DeleteMapping("/image/{imageId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<String> deleteImage(@PathVariable String imageId) {
        venueImageService.delete(imageId);
        return ApiResponse.<String>builder()
                .result("Deleted successfully")
                .build();
    }

    // ─── DELETE ALL ─────────────────────────
    @DeleteMapping("/{venueId}/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<String> deleteAllImages(@PathVariable String venueId) {
        venueImageService.deleteAll(venueId);
        return ApiResponse.<String>builder()
                .result("All images deleted")
                .build();
    }
}