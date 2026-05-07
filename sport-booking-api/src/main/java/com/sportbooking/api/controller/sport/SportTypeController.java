package com.sportbooking.api.controller.sport;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.sportbooking.api.dto.request.sport.SportTypeRequest;
import com.sportbooking.api.dto.response.sport.SportTypeResponse;
import com.sportbooking.api.service.sport.SportTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/sport-types")
@RequiredArgsConstructor
public class SportTypeController {
    private final SportTypeService service;

    @PostMapping
    public SportTypeResponse create(@RequestBody SportTypeRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<SportTypeResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public SportTypeResponse getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public SportTypeResponse update(@PathVariable String id,
            @RequestBody SportTypeRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
