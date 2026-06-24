package com.sportbooking.api.repository.service;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.common.enums.Status;
import com.sportbooking.api.entity.service.ServiceItem;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceItem, String> {

    List<ServiceItem> findByStatusOrderByName(Status status);

    List<ServiceItem> findAllByOrderByName();
}
