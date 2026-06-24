package com.sportbooking.api.service.venues;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportbooking.api.common.enums.ErrorCode;
import com.sportbooking.api.common.exception.AppException;
import com.sportbooking.api.dto.response.venues.VenueResponse;
import com.sportbooking.api.entity.user.User;
import com.sportbooking.api.entity.venues.FavoriteVenue;
import com.sportbooking.api.entity.venues.Venue;
import com.sportbooking.api.mapper.VenueMapper;
import com.sportbooking.api.repository.user.UserRepository;
import com.sportbooking.api.repository.venues.FavoriteVenueRepository;
import com.sportbooking.api.repository.venues.VenueRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteVenueRepository favoriteVenueRepository;
    private final VenueRepository venueRepository;
    private final UserRepository userRepository;
    private final VenueMapper venueMapper;

    /** Bật/tắt yêu thích cơ sở. Trả về true nếu đang yêu thích sau thao tác. */
    @Transactional
    public boolean toggle(String userId, String venueId) {
        var existing = favoriteVenueRepository.findByUserIdAndVenueId(userId, venueId);
        if (existing.isPresent()) {
            favoriteVenueRepository.delete(existing.get());
            return false;
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Venue not found"));
        favoriteVenueRepository.save(FavoriteVenue.builder()
                .user(user)
                .venue(venue)
                .build());
        return true;
    }

    public List<VenueResponse> listMyFavorites(String userId) {
        return favoriteVenueRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(fav -> {
                    VenueResponse res = venueMapper.toResponse(fav.getVenue());
                    res.setIsFavorite(true);
                    return res;
                })
                .toList();
    }

    public List<String> myFavoriteVenueIds(String userId) {
        return favoriteVenueRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(fav -> fav.getVenue().getId())
                .toList();
    }
}
