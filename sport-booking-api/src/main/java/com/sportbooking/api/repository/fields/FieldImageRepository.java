package com.sportbooking.api.repository.fields;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.common.enums.FieldImageType;
import com.sportbooking.api.entity.fields.FieldImage;

@Repository
public interface FieldImageRepository extends JpaRepository<FieldImage, String> {

    // lay tat ca anh cua 1 san, sap xep theo sort_order
    List<FieldImage> findByFieldIdOrderBySortOrderAsc(String fieldId);

    // lay anh theo type, sap xep theo sort_order
    List<FieldImage> findByFieldIdAndTypeOrderBySortOrderAsc(String fieldId, FieldImageType type);

    // lay anh chinh theo type (is_primary = true)
    Optional<FieldImage> findByFieldIdAndTypeAndIsPrimaryTrue(String fieldId, FieldImageType type);

    // xoa tat ca anh cua 1 san
    void deleteAllByFieldId(String fieldId);
}