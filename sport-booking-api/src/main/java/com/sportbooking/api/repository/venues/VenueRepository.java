package com.sportbooking.api.repository.venues;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sportbooking.api.entity.venues.Venue;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface VenueRepository extends JpaRepository<Venue, String> {

    List<Venue> findByAreaId(String areaId);
}