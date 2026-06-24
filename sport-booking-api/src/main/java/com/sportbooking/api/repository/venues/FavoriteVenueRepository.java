package com.sportbooking.api.repository.venues;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.entity.venues.FavoriteVenue;

@Repository
public interface FavoriteVenueRepository extends JpaRepository<FavoriteVenue, String> {

    Optional<FavoriteVenue> findByUserIdAndVenueId(String userId, String venueId);

    boolean existsByUserIdAndVenueId(String userId, String venueId);

    List<FavoriteVenue> findByUserIdOrderByCreatedAtDesc(String userId);
}
