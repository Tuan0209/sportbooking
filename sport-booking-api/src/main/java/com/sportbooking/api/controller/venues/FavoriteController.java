package com.sportbooking.api.controller.venues;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sportbooking.api.common.ApiResponse;
import com.sportbooking.api.dto.response.venues.VenueResponse;
import com.sportbooking.api.service.venues.FavoriteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    /** Bật/tắt yêu thích 1 cơ sở. */
    @PostMapping("/{venueId}/toggle")
    public ApiResponse<Map<String, Boolean>> toggle(
            @PathVariable String venueId,
            Authentication authentication) {
        boolean favorited = favoriteService.toggle(authentication.getName(), venueId);
        return ApiResponse.<Map<String, Boolean>>builder()
                .code(0)
                .result(Map.of("favorited", favorited))
                .build();
    }

    /** Danh sách cơ sở đã yêu thích. */
    @GetMapping
    public ApiResponse<List<VenueResponse>> myFavorites(Authentication authentication) {
        return ApiResponse.<List<VenueResponse>>builder()
                .code(0)
                .result(favoriteService.listMyFavorites(authentication.getName()))
                .build();
    }

    /** Danh sách ID cơ sở đã yêu thích (để tô tim). */
    @GetMapping("/ids")
    public ApiResponse<List<String>> myFavoriteIds(Authentication authentication) {
        return ApiResponse.<List<String>>builder()
                .code(0)
                .result(favoriteService.myFavoriteVenueIds(authentication.getName()))
                .build();
    }
}
