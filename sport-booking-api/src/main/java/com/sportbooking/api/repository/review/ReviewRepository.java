package com.sportbooking.api.repository.review;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.entity.review.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {

    List<Review> findByField_Venue_IdOrderByCreatedAtDesc(String venueId);

    List<Review> findAllByOrderByCreatedAtDesc();

    boolean existsByBookingId(String bookingId);

    Optional<Review> findByBookingId(String bookingId);

    @Query("select coalesce(avg(r.rating),0) from Review r where r.field.venue.id = :venueId")
    Double avgRatingByVenue(@Param("venueId") String venueId);

    @Query("select count(r) from Review r where r.field.venue.id = :venueId")
    long countByVenue(@Param("venueId") String venueId);
}
