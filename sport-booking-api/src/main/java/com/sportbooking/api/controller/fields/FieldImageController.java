package com.sportbooking.api.controller.fields;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.common.enums.FieldImageType;
import com.sportbooking.api.dto.request.fields.FieldImageUploadRequest;
import com.sportbooking.api.dto.response.fields.FieldImageResponse;
import com.sportbooking.api.service.fields.FieldImageService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping("/field-images")
@Slf4j
public class FieldImageController {

    FieldImageService fieldImageService;

    // GET /api/field-images/{fieldId}
    @GetMapping("/{fieldId}")
    ApiResponse<List<FieldImageResponse>> getImagesByFieldId(@PathVariable String fieldId) {
        return ApiResponse.<List<FieldImageResponse>>builder()
                .result(fieldImageService.getImagesByFieldId(fieldId))
                .build();
    }

    // GET /api/field-images/{fieldId}/type?type=cover|gallery|thumbnail
    @GetMapping("/{fieldId}/type")
    ApiResponse<List<FieldImageResponse>> getImagesByType(
            @PathVariable String fieldId,
            @RequestParam FieldImageType type) {
        return ApiResponse.<List<FieldImageResponse>>builder()
                .result(fieldImageService.getImagesByType(fieldId, type))
                .build();
    }

    // POST /api/field-images/{fieldId}/cover - upload cover lan dau
    // PUT /api/field-images/{fieldId}/cover - thay the cover cu
    // → dung chung 1 service: xoa cu (neu co) → upload moi
    @RequestMapping(value = "/{fieldId}/cover", method = { RequestMethod.POST,
            RequestMethod.PUT }, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<FieldImageResponse> uploadOrReplaceCover(
            @PathVariable String fieldId,
            @RequestParam("file") MultipartFile file) throws IOException {

        return ApiResponse.<FieldImageResponse>builder()
                .result(fieldImageService.replaceSingleImage(fieldId, file, FieldImageType.cover))
                .build();
    }

    // POST /api/field-images/{fieldId}/thumbnail - upload thumbnail lan dau
    // PUT /api/field-images/{fieldId}/thumbnail - thay the thumbnail cu
    @RequestMapping(value = "/{fieldId}/thumbnail", method = { RequestMethod.POST,
            RequestMethod.PUT }, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<FieldImageResponse> uploadOrReplaceThumbnail(
            @PathVariable String fieldId,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ApiResponse.<FieldImageResponse>builder()
                .result(fieldImageService.replaceSingleImage(fieldId, file, FieldImageType.thumbnail))
                .build();
    }

    // POST /api/field-images/{fieldId}/gallery - upload nhieu anh gallery
    @PostMapping(value = "/{fieldId}/gallery", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<List<FieldImageResponse>> uploadGallery(
            @PathVariable String fieldId,
            @RequestParam("file") List<MultipartFile> files,
            @RequestParam(defaultValue = "false") boolean isPrimary,
            @RequestParam(defaultValue = "0") int sortOrder) throws IOException {

        FieldImageUploadRequest request = new FieldImageUploadRequest(
                FieldImageType.gallery, isPrimary, sortOrder);

        return ApiResponse.<List<FieldImageResponse>>builder()
                .result(fieldImageService.uploadGallery(fieldId, files, request))
                .build();
    }

    // DELETE /api/field-images/image/{imageId} - xoa 1 anh
    @DeleteMapping("/image/{imageId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<String> deleteImage(@PathVariable String imageId) {
        return ApiResponse.<String>builder()
                .result(fieldImageService.deleteImage(imageId))
                .build();
    }

    // DELETE /api/field-images/{fieldId}/all - xoa tat ca anh
    @DeleteMapping("/{fieldId}/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<String> deleteAllImages(@PathVariable String fieldId) {
        return ApiResponse.<String>builder()
                .result(fieldImageService.deleteAllImages(fieldId))
                .build();
    }
}