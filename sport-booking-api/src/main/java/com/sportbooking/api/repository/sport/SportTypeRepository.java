package com.sportbooking.api.repository.sport;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sportbooking.api.entity.sport.SportType;

public interface SportTypeRepository extends JpaRepository<SportType, String> {
}