package com.sportbooking.api.repository.areas;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sportbooking.api.entity.areas.Area;

public interface AreaRepository extends JpaRepository<Area, String> {
}
