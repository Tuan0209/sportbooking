package com.sportbooking.api.service.fields;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sportbooking.api.dto.request.fields.FieldTypeCreateRequest;
import com.sportbooking.api.dto.response.fields.FieldTypeResponse;
import com.sportbooking.api.entity.fields.FieldType;
import com.sportbooking.api.mapper.FieldTypeMapper;
import com.sportbooking.api.repository.fields.FieldTypeRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class FieldTypeService {

    FieldTypeRepository fieldTypeRepository;
    FieldTypeMapper fieldTypeMapper;

    public FieldTypeResponse createFieldType(FieldTypeCreateRequest request) {
        FieldType fieldType = fieldTypeMapper.toFieldType(request); // map request sang entity
        FieldType saved = fieldTypeRepository.save(fieldType); // luu vao database
        return fieldTypeMapper.toFieldTypeResponse(saved);
    }

    public FieldTypeResponse getFieldTypeById(String id) {
        FieldType fieldType = fieldTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FieldType not found with id: " + id));
        return fieldTypeMapper.toFieldTypeResponse(fieldType);
    }

    public List<FieldTypeResponse> getAllFieldTypes() {
        return fieldTypeRepository.findAll() // lay tat ca fieldType tu database
                .stream()
                .map(fieldTypeMapper::toFieldTypeResponse)
                .toList();
    }

    public FieldTypeResponse updateFieldType(String id, FieldTypeCreateRequest request) {
        FieldType fieldType = fieldTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FieldType not found with id: " + id));
        fieldType.setName(request.getName()); // cap nhat ten
        FieldType updated = fieldTypeRepository.save(fieldType);
        return fieldTypeMapper.toFieldTypeResponse(updated);
    }

    public String deleteFieldType(String id) {
        FieldType fieldType = fieldTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FieldType not found with id: " + id));
        fieldTypeRepository.delete(fieldType);
        return "FieldType deleted successfully";
    }
}