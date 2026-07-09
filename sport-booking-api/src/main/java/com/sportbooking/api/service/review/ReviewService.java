package com.sportbooking.api.service.review;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportbooking.api.common.enums.ErrorCode;
import com.sportbooking.api.common.exception.AppException;
import com.sportbooking.api.dto.request.review.CreateReviewRequest;
import com.sportbooking.api.dto.response.review.ReviewResponse;
import com.sportbooking.api.dto.response.review.VenueReviewsResponse;
import com.sportbooking.api.entity.booking.Booking;
import com.sportbooking.api.entity.review.Review;
import com.sportbooking.api.entity.user.User;
import com.sportbooking.api.entity.venues.Venue;
import com.sportbooking.api.repository.booking.BookingRepository;
import com.sportbooking.api.repository.review.ReviewRepository;
import com.sportbooking.api.repository.user.UserRepository;
import com.sportbooking.api.repository.venues.VenueRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VenueRepository venueRepository;

    @Transactional
    public ReviewResponse create(CreateReviewRequest request, Authentication authentication) {
        String userId = authentication.getName();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!booking.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        // Nếu đã đánh giá đơn này rồi thì cập nhật lại thay vì báo lỗi
        Review review = reviewRepository.findByBookingId(booking.getId())
                .orElseGet(() -> Review.builder()
                        .user(user)
                        .field(booking.getField())
                        .booking(booking)
                        .build());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        reviewRepository.save(review);

        // Cập nhật điểm trung bình + số lượt đánh giá cho cơ sở
        Venue venue = booking.getField().getVenue();
        double avg = reviewRepository.avgRatingByVenue(venue.getId());
        long count = reviewRepository.countByVenue(venue.getId());
        venue.setRating(BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP));
        venue.setTotalReviews((int) count);
        venueRepository.save(venue);

        return toResponse(review);
    }

    public VenueReviewsResponse getByVenue(String venueId) {
        List<Review> reviews = reviewRepository.findByField_Venue_IdOrderByCreatedAtDesc(venueId);
        double avg = reviewRepository.avgRatingByVenue(venueId);
        return VenueReviewsResponse.builder()
                .averageRating(Math.round(avg * 10) / 10.0)
                .totalReviews(reviews.size())
                .items(reviews.stream().map(this::toResponse).toList())
                .build();
    }

    /** [ADMIN] Tất cả đánh giá để kiểm duyệt. */
    public List<ReviewResponse> adminListAll() {
        return reviewRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    /** [ADMIN] Xoá 1 đánh giá và cập nhật lại điểm cơ sở. */
    @Transactional
    public void adminDelete(String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST));
        Venue venue = review.getField().getVenue();
        reviewRepository.delete(review);

        double avg = reviewRepository.avgRatingByVenue(venue.getId());
        long count = reviewRepository.countByVenue(venue.getId());
        venue.setRating(BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP));
        venue.setTotalReviews((int) count);
        venueRepository.save(venue);
    }

    private ReviewResponse toResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .userName(r.getUser().getName())
                .userAvatar(r.getUser().getAvatarUrl())
                .rating(r.getRating())
                .comment(r.getComment())
                .fieldName(r.getField().getName())
                .venueName(r.getField().getVenue().getName())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
