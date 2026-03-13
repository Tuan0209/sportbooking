package com.sportbooking.api.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import com.sportbooking.api.entity.areas.Area;
import com.sportbooking.api.dto.response.areas.AreasResponse;
import com.sportbooking.api.dto.request.areas.AreaCreateRequest;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE) // bo qua cac truong ko duoc map de ko
                                                                                  // bi loi
public interface AreaMapper {
    AreasResponse toAreaResponse(Area area); // map Area sang AreasResponse

    Area toArea(AreaCreateRequest request); // map AreaCreateRequest sang Area
}
