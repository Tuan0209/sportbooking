// // package com.sportbooking.api.service.fields;

// // import java.util.List;

// // import org.springframework.stereotype.Service;

// // import com.sportbooking.api.dto.request.fields.FieldCreateRequest;
// // import com.sportbooking.api.dto.request.fields.FieldUpdateRequest;
// // import com.sportbooking.api.dto.response.fields.FieldResponse;
// // import com.sportbooking.api.entity.areas.Area;
// // import com.sportbooking.api.entity.fields.Field;
// // import com.sportbooking.api.entity.fields.FieldType;
// // import com.sportbooking.api.mapper.FieldMapper;
// // import com.sportbooking.api.repository.areas.AreaRepository;
// // import com.sportbooking.api.repository.fields.FieldRepository;
// // import com.sportbooking.api.repository.fields.FieldTypeRepository;

// // import lombok.AccessLevel;
// // import lombok.RequiredArgsConstructor;
// // import lombok.experimental.FieldDefaults;
// // import lombok.extern.slf4j.Slf4j;

// // @Service
// // @RequiredArgsConstructor
// // @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
// // @Slf4j
// // public class FieldService {

// //     FieldRepository fieldRepository;
// //     AreaRepository areaRepository;
// //     FieldTypeRepository fieldTypeRepository;
// //     FieldMapper fieldMapper;

// //     public FieldResponse createField(FieldCreateRequest request) {
// //         Area area = areaRepository.findById(request.getAreaId())
// //                 .orElseThrow(() -> new RuntimeException("Area not found with id: " + request.getAreaId()));

// //         FieldType fieldType = fieldTypeRepository.findById(request.getFieldTypeId())
// //                 .orElseThrow(() -> new RuntimeException("FieldType not found with id: " + request.getFieldTypeId()));

// //         Field field = fieldMapper.toField(request); // map request sang entity
// //         field.setArea(area); // set quan he area
// //         field.setFieldType(fieldType); // set quan he fieldType

// //         Field savedField = fieldRepository.save(field);
// //         return fieldMapper.toFieldResponse(savedField);
// //     }

// //     public FieldResponse getFieldById(String id) {
// //         Field field = fieldRepository.findById(id)
// //                 .orElseThrow(() -> new RuntimeException("Field not found with id: " + id));
// //         return fieldMapper.toFieldResponse(field);
// //     }

// //     public List<FieldResponse> getAllFields() {
// //         List<Field> fields = fieldRepository.findAll(); // lay tat ca fields tu database
// //         return fields.stream()
// //                 .map(fieldMapper::toFieldResponse)
// //                 .toList();
// //     }

// //     public List<FieldResponse> getFields(String areaId, String fieldTypeId) {
// //         List<Field> fields;

// //         if (areaId != null && fieldTypeId != null) {
// //             fields = fieldRepository.findByAreaIdAndFieldTypeId(areaId, fieldTypeId);
// //         } else if (areaId != null) {
// //             fields = fieldRepository.findByAreaId(areaId);
// //         } else if (fieldTypeId != null) {
// //             fields = fieldRepository.findByFieldTypeId(fieldTypeId);
// //         } else {
// //             fields = fieldRepository.findAll(); // lay tat ca neu khong co filter
// //         }

// //         return fields.stream()
// //                 .map(fieldMapper::toFieldResponse)
// //                 .toList();
// //     }

// //     public List<FieldResponse> getFieldsByAreaId(String areaId) {
// //         if (!areaRepository.existsById(areaId)) {
// //             throw new RuntimeException("Area not found with id: " + areaId);
// //         }
// //         return fieldRepository.findByAreaId(areaId) // lay fields theo areaId
// //                 .stream()
// //                 .map(fieldMapper::toFieldResponse)
// //                 .toList();
// //     }

// //     public FieldResponse updateField(String id, FieldUpdateRequest request) {
// //         Field field = fieldRepository.findById(id)
// //                 .orElseThrow(() -> new RuntimeException("Field not found with id: " + id));

// //         // cap nhat area neu co truyen areaId
// //         if (request.getAreaId() != null) {
// //             Area area = areaRepository.findById(request.getAreaId())
// //                     .orElseThrow(() -> new RuntimeException("Area not found with id: " + request.getAreaId()));
// //             field.setArea(area);
// //         }

// //         // cap nhat fieldType neu co truyen fieldTypeId
// //         if (request.getFieldTypeId() != null) {
// //             FieldType fieldType = fieldTypeRepository.findById(request.getFieldTypeId())
// //                     .orElseThrow(
// //                             () -> new RuntimeException("FieldType not found with id: " + request.getFieldTypeId()));
// //             field.setFieldType(fieldType);
// //         }

// //         fieldMapper.updateFieldFromRequest(request, field); // partial update cac truong con lai
// //         Field updatedField = fieldRepository.save(field);
// //         return fieldMapper.toFieldResponse(updatedField);
// //     }

// //     public String deleteField(String id) {
// //         Field field = fieldRepository.findById(id)
// //                 .orElseThrow(() -> new RuntimeException("Field not found with id: " + id));
// //         fieldRepository.delete(field);
// //         return "Field deleted successfully";
// //     }
// // }
// package com.sportbooking.api.service.fields;

// import java.util.List;

// import org.springframework.stereotype.Service;

// import com.sportbooking.api.common.enums.FieldImageType;
// import com.sportbooking.api.dto.request.fields.FieldCreateRequest;
// import com.sportbooking.api.dto.request.fields.FieldUpdateRequest;
// import com.sportbooking.api.dto.response.fields.FieldResponse;
// import com.sportbooking.api.entity.areas.Area;
// import com.sportbooking.api.entity.fields.Field;
// import com.sportbooking.api.entity.fields.FieldType;
// import com.sportbooking.api.entity.venues.Venue;
// import com.sportbooking.api.mapper.FieldMapper;
// import com.sportbooking.api.repository.areas.AreaRepository;
// import com.sportbooking.api.repository.fields.FieldImageRepository;
// import com.sportbooking.api.repository.fields.FieldRepository;
// import com.sportbooking.api.repository.fields.FieldTypeRepository;
// import com.sportbooking.api.repository.venues.VenueRepository;
// import lombok.AccessLevel;
// import lombok.RequiredArgsConstructor;
// import lombok.experimental.FieldDefaults;
// import lombok.extern.slf4j.Slf4j;

// @Service
// @RequiredArgsConstructor
// @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
// @Slf4j
// public class FieldService {
//     VenueRepository venueRepository;
//     FieldRepository fieldRepository;
//     // AreaRepository areaRepository;
//     FieldTypeRepository fieldTypeRepository;
//     FieldImageRepository fieldImageRepository;
//     FieldMapper fieldMapper;

//     // lay url anh theo type (uu tien isPrimary, fallback lay cai dau tien)
//     private String getImageUrl(String fieldId, FieldImageType type) {
//         return fieldImageRepository
//                 .findByFieldIdAndTypeAndIsPrimaryTrue(fieldId, type)
//                 .map(img -> img.getImageUrl())
//                 .orElseGet(() -> fieldImageRepository
//                         .findByFieldIdAndTypeOrderBySortOrderAsc(fieldId, type)
//                         .stream()
//                         .findFirst()
//                         .map(img -> img.getImageUrl())
//                         .orElse(null));
//     }

//     // gan coverUrl va thumbnailUrl vao response
//     private FieldResponse enrichWithImages(FieldResponse response) {
//         response.setCoverUrl(getImageUrl(response.getId(), FieldImageType.cover));
//         response.setThumbnailUrl(getImageUrl(response.getId(), FieldImageType.thumbnail));
//         return response;
//     }

//     public FieldResponse createField(FieldCreateRequest request) {
//         // Area area = areaRepository.findById(request.getAreaId())
//         // .orElseThrow(() -> new RuntimeException("Area not found with id: " +
//         // request.getAreaId()));

//         FieldType fieldType = fieldTypeRepository.findById(request.getFieldTypeId())
//                 .orElseThrow(() -> new RuntimeException("FieldType not found with id: " + request.getFieldTypeId()));
//         Venue venue = venueRepository.findById(request.getVenueId())
//                 .orElseThrow(() -> new RuntimeException("Venue not found"));
//         Field field = fieldMapper.toField(request); // map request sang entity
//         // field.setArea(area); // set quan he area
//         field.setFieldType(fieldType); // set quan he fieldType
//         field.setVenue(venue); // set quan he venue
//         // nếu muốn kế thừa giờ từ venue (optional)
//         if (field.getOpenTime() == null) {
//             field.setOpenTime(venue.getOpenTime());
//         }
//         if (field.getCloseTime() == null) {
//             field.setCloseTime(venue.getCloseTime());
//         }
//         Field savedField = fieldRepository.save(field);
//         return fieldMapper.toFieldResponse(savedField); // moi tao chua co anh
//     }

//     public FieldResponse getFieldById(String id) {
//         Field field = fieldRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Field not found with id: " + id));
//         return enrichWithImages(fieldMapper.toFieldResponse(field)); // kem cover + thumbnail
//     }

//     public List<FieldResponse> getAllFields() {
//         List<Field> fields = fieldRepository.findAll(); // lay tat ca fields tu database
//         return fields.stream()
//                 .map(fieldMapper::toFieldResponse)
//                 .map(this::enrichWithImages) // kem cover + thumbnail cho tung san
//                 .toList();
//     }

//     public List<FieldResponse> getFields(String areaId, String fieldTypeId) {
//         List<Field> fields;

//         if (areaId != null && fieldTypeId != null) {
//             fields = fieldRepository.findByAreaIdAndFieldTypeId(areaId, fieldTypeId);
//         } else if (areaId != null) {
//             fields = fieldRepository.findByAreaId(areaId);
//         } else if (fieldTypeId != null) {
//             fields = fieldRepository.findByFieldTypeId(fieldTypeId);
//         } else {
//             fields = fieldRepository.findAll(); // lay tat ca neu khong co filter
//         }

//         return fields.stream()
//                 .map(fieldMapper::toFieldResponse)
//                 .map(this::enrichWithImages) // kem cover + thumbnail
//                 .toList();
//     }

//     public List<FieldResponse> getFieldsByAreaId(String areaId) {
//         if (!areaRepository.existsById(areaId)) {
//             throw new RuntimeException("Area not found with id: " + areaId);
//         }
//         return fieldRepository.findByAreaId(areaId) // lay fields theo areaId
//                 .stream()
//                 .map(fieldMapper::toFieldResponse)
//                 .map(this::enrichWithImages) // kem cover + thumbnail
//                 .toList();
//     }

//     public FieldResponse updateField(String id, FieldUpdateRequest request) {
//         Field field = fieldRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Field not found with id: " + id));

//         // cap nhat area neu co truyen areaId
//         if (request.getAreaId() != null) {
//             Area area = areaRepository.findById(request.getAreaId())
//                     .orElseThrow(() -> new RuntimeException("Area not found with id: " + request.getAreaId()));
//             field.setArea(area);
//         }

//         // cap nhat fieldType neu co truyen fieldTypeId
//         if (request.getFieldTypeId() != null) {
//             FieldType fieldType = fieldTypeRepository.findById(request.getFieldTypeId())
//                     .orElseThrow(
//                             () -> new RuntimeException("FieldType not found with id: " + request.getFieldTypeId()));
//             field.setFieldType(fieldType);
//         }

//         fieldMapper.updateFieldFromRequest(request, field); // partial update cac truong con lai
//         Field updatedField = fieldRepository.save(field);
//         return enrichWithImages(fieldMapper.toFieldResponse(updatedField)); // kem cover + thumbnail
//     }

//     public String deleteField(String id) {
//         Field field = fieldRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Field not found with id: " + id));
//         fieldRepository.delete(field);
//         return "Field deleted successfully";
//     }
// }

package com.sportbooking.api.service.fields;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sportbooking.api.common.enums.VenueImageType;
import com.sportbooking.api.dto.request.fields.FieldCreateRequest;
import com.sportbooking.api.dto.request.fields.FieldUpdateRequest;
import com.sportbooking.api.dto.response.fields.FieldResponse;
import com.sportbooking.api.entity.areas.Area;
import com.sportbooking.api.entity.fields.Field;
import com.sportbooking.api.entity.fields.FieldType;
import com.sportbooking.api.entity.venues.Venue;
import com.sportbooking.api.mapper.FieldMapper;
import com.sportbooking.api.repository.areas.AreaRepository;
import com.sportbooking.api.repository.fields.FieldRepository;
import com.sportbooking.api.repository.fields.FieldTypeRepository;
import com.sportbooking.api.repository.venues.VenueRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class FieldService {

    VenueRepository venueRepository;
    FieldRepository fieldRepository;
    FieldTypeRepository fieldTypeRepository;
    FieldMapper fieldMapper;

    // ─── CREATE ─────────────────────────────────────

    public FieldResponse createField(FieldCreateRequest request) {

        FieldType fieldType = fieldTypeRepository.findById(request.getFieldTypeId())
                .orElseThrow(() -> new RuntimeException(
                        "FieldType not found with id: " + request.getFieldTypeId()));

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new RuntimeException(
                        "Venue not found with id: " + request.getVenueId()));

        Field field = fieldMapper.toField(request);

        field.setFieldType(fieldType);
        field.setVenue(venue);

        // kế thừa giờ từ venue
        if (field.getOpenTime() == null) {
            field.setOpenTime(venue.getOpenTime());
        }
        if (field.getCloseTime() == null) {
            field.setCloseTime(venue.getCloseTime());
        }

        return fieldMapper.toFieldResponse(fieldRepository.save(field));
    }

    // ─── GET ─────────────────────────────────────

    public FieldResponse getFieldById(String id) {
        return fieldMapper.toFieldResponse(
                fieldRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Field not found")));
    }

    public List<FieldResponse> getAllFields() {
        return fieldRepository.findAll()
                .stream()
                .map(fieldMapper::toFieldResponse)
                .toList();
    }

    // FILTER theo venue

    public List<FieldResponse> getFields(String venueId, String fieldTypeId) {

        List<Field> fields;

        if (venueId != null && fieldTypeId != null) {
            fields = fieldRepository.findByVenueIdAndFieldTypeId(venueId, fieldTypeId);
        } else if (venueId != null) {
            fields = fieldRepository.findByVenueId(venueId);
        } else if (fieldTypeId != null) {
            fields = fieldRepository.findByFieldTypeId(fieldTypeId);
        } else {
            fields = fieldRepository.findAll();
        }

        return fields.stream()
                .map(fieldMapper::toFieldResponse)
                .toList();
    }

    // theo area (qua venue)

    public List<FieldResponse> getFieldsByAreaId(String areaId) {
        return fieldRepository.findByVenueAreaId(areaId)
                .stream()
                .map(fieldMapper::toFieldResponse)
                .toList();
    }

    // ─── UPDATE ─────────────────────────────────────

    public FieldResponse updateField(String id, FieldUpdateRequest request) {

        Field field = fieldRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Field not found"));

        if (request.getFieldTypeId() != null) {
            field.setFieldType(fieldTypeRepository.findById(request.getFieldTypeId())
                    .orElseThrow(() -> new RuntimeException("FieldType not found")));
        }

        if (request.getVenueId() != null) {
            field.setVenue(venueRepository.findById(request.getVenueId())
                    .orElseThrow(() -> new RuntimeException("Venue not found")));
        }

        fieldMapper.updateFieldFromRequest(request, field);

        return fieldMapper.toFieldResponse(fieldRepository.save(field));
    }

    // ─── DELETE ─────────────────────────────────────

    public String deleteField(String id) {
        fieldRepository.deleteById(id);
        return "Deleted";
    }
}