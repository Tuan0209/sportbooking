package com.sportbooking.api.mapper;

import org.mapstruct.*;
import com.sportbooking.api.dto.request.venues.VenueCreateRequest;
import com.sportbooking.api.dto.request.venues.VenueUpdateRequest;
import com.sportbooking.api.dto.response.venues.VenueResponse;
import com.sportbooking.api.entity.venues.Venue;
import com.sportbooking.api.common.enums.VenueImageType;
import com.sportbooking.api.entity.venues.VenueImage;

@Mapper(componentModel = "spring")
public interface VenueMapper {

    @Mapping(target = "areaId", source = "area.id")
    @Mapping(target = "areaName", source = "area.name")

    @Mapping(target = "thumbnailUrl", expression = "java(getImageUrl(venue, com.sportbooking.api.common.enums.VenueImageType.thumbnail))")

    @Mapping(target = "coverUrl", expression = "java(getImageUrl(venue, com.sportbooking.api.common.enums.VenueImageType.cover))")

    VenueResponse toResponse(Venue venue);

    default String getImageUrl(Venue venue, VenueImageType type) {
        if (venue.getImages() == null)
            return null;

        return venue.getImages().stream()
                .filter(img -> img.getType() == type)
                .map(VenueImage::getImageUrl)
                .findFirst()
                .orElse(null);
    }

    Venue toEntity(VenueCreateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "area", ignore = true)
    void update(VenueUpdateRequest request, @MappingTarget Venue venue);
}