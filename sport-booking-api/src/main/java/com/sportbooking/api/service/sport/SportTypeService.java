package com.sportbooking.api.service.sport;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import com.sportbooking.api.dto.request.sport.SportTypeRequest;
import com.sportbooking.api.dto.response.sport.SportTypeResponse;
import com.sportbooking.api.repository.sport.SportTypeRepository;
import com.sportbooking.api.mapper.SportTypeMapper;
import com.sportbooking.api.entity.sport.SportType;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class SportTypeService {

    private final SportTypeRepository repository;
    private final SportTypeMapper mapper;

    public SportTypeResponse create(SportTypeRequest request) {
        SportType entity = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entity));
    }

    public List<SportTypeResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public SportTypeResponse getById(String id) {
        SportType entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("SportType not found"));
        return mapper.toResponse(entity);
    }

    public SportTypeResponse update(String id, SportTypeRequest request) {
        SportType entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("SportType not found"));

        mapper.update(entity, request);
        return mapper.toResponse(repository.save(entity));
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}