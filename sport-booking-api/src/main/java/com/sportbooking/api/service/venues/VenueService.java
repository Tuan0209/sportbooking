package com.sportbooking.api.service.venues;

import java.util.List;
import com.sportbooking.api.dto.request.venues.VenueCreateRequest;
import com.sportbooking.api.dto.request.venues.VenueUpdateRequest;
import com.sportbooking.api.dto.response.fields.FieldResponse;
import com.sportbooking.api.dto.response.venues.VenueResponse;
import com.sportbooking.api.entity.areas.Area;
import com.sportbooking.api.entity.venues.Venue;
import com.sportbooking.api.mapper.VenueMapper;
import com.sportbooking.api.repository.areas.AreaRepository;
import com.sportbooking.api.repository.fields.FieldRepository;
import com.sportbooking.api.repository.venues.VenueRepository;
import com.sportbooking.api.mapper.FieldMapper;
import org.springframework.transaction.annotation.Transactional;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class VenueService {

    private final VenueRepository venueRepository;
    private final AreaRepository areaRepository;
    private final VenueMapper venueMapper;
    private final FieldRepository fieldRepository;
    private final FieldMapper fieldMapper;

    public VenueResponse create(VenueCreateRequest request) {

        Area area = areaRepository.findById(request.getAreaId())
                .orElseThrow(() -> new RuntimeException("Area not found"));

        Venue venue = venueMapper.toEntity(request);
        venue.setArea(area);

        return venueMapper.toResponse(venueRepository.save(venue));
    }

    @Transactional(readOnly = true)
    public VenueResponse getById(String id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));
        VenueResponse res = venueMapper.toResponse(venue);

        List<FieldResponse> fields = fieldRepository.findFullByVenueId(id)
                .stream()
                .map(fieldMapper::toFieldResponse)
                .toList();

        res.setFields(fields);
        res.setTotalFields(fields.size());

        return res;
    }

    public List<VenueResponse> getAll() {
        return venueRepository.findAll()
                .stream()
                .map(venue -> {
                    VenueResponse res = venueMapper.toResponse(venue);

                    List<FieldResponse> fields = fieldRepository
                            .findFullByVenueId(venue.getId())
                            .stream()
                            .map(fieldMapper::toFieldResponse)
                            .toList();

                    res.setFields(fields);
                    res.setTotalFields(fields.size());

                    return res;
                })
                .toList();
    }

    public List<VenueResponse> getByArea(String areaId) {
        return venueRepository.findByAreaId(areaId)
                .stream()
                .map(venueMapper::toResponse)
                .toList();
    }

    public VenueResponse update(String id, VenueUpdateRequest request) {

        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        if (request.getAreaId() != null) {
            Area area = areaRepository.findById(request.getAreaId())
                    .orElseThrow(() -> new RuntimeException("Area not found"));
            venue.setArea(area);
        }

        venueMapper.update(request, venue);

        return venueMapper.toResponse(venueRepository.save(venue));
    }

    public String delete(String id) {
        venueRepository.deleteById(id);
        return "Deleted";
    }
}
