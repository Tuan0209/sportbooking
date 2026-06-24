package com.sportbooking.api.service.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportbooking.api.common.enums.ErrorCode;
import com.sportbooking.api.common.enums.Status;
import com.sportbooking.api.common.exception.AppException;
import com.sportbooking.api.dto.request.service.ServiceRequest;
import com.sportbooking.api.dto.response.service.ServiceResponse;
import com.sportbooking.api.entity.service.ServiceItem;
import com.sportbooking.api.repository.service.ServiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public List<ServiceResponse> listActive() {
        return serviceRepository.findByStatusOrderByName(Status.ACTIVE)
                .stream().map(this::toResponse).toList();
    }

    public List<ServiceResponse> listAll() {
        return serviceRepository.findAllByOrderByName()
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public ServiceResponse create(ServiceRequest req) {
        ServiceItem s = ServiceItem.builder()
                .name(req.getName())
                .price(req.getPrice())
                .unit(req.getUnit() != null ? req.getUnit() : "lần")
                .status(req.getStatus() != null ? req.getStatus() : Status.ACTIVE)
                .build();
        return toResponse(serviceRepository.save(s));
    }

    @Transactional
    public ServiceResponse update(String id, ServiceRequest req) {
        ServiceItem s = serviceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST));
        if (req.getName() != null) s.setName(req.getName());
        if (req.getPrice() != null) s.setPrice(req.getPrice());
        if (req.getUnit() != null) s.setUnit(req.getUnit());
        if (req.getStatus() != null) s.setStatus(req.getStatus());
        return toResponse(serviceRepository.save(s));
    }

    @Transactional
    public void delete(String id) {
        serviceRepository.deleteById(id);
    }

    private ServiceResponse toResponse(ServiceItem s) {
        return ServiceResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .price(s.getPrice())
                .unit(s.getUnit())
                .status(s.getStatus().name())
                .build();
    }
}
