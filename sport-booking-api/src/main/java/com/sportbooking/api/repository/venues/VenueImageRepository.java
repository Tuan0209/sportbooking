package com.sportbooking.api.repository.venues;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sportbooking.api.common.enums.VenueImageType;
import com.sportbooking.api.entity.venues.VenueImage;

@Repository
public interface VenueImageRepository extends JpaRepository<VenueImage, String> {

    List<VenueImage> findByVenueIdOrderBySortOrderAsc(String venueId);

    List<VenueImage> findByVenueIdAndTypeOrderBySortOrderAsc(String venueId, VenueImageType type);

    Optional<VenueImage> findByVenueIdAndTypeAndIsPrimaryTrue(String venueId, VenueImageType type);
}
