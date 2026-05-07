package com.sportbooking.api.mapper;

import org.mapstruct.Mapper;
import com.sportbooking.api.dto.response.venues.VenueImageResponse;
import com.sportbooking.api.entity.venues.VenueImage;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VenueImageMapper {

    // @Mapping(target = "type", source = "type")
    // VenueImageResponse toResponse(VenueImage entity);
    @Mapping(target = "venueId", source = "venue.id")
    VenueImageResponse toResponse(VenueImage entity);
}