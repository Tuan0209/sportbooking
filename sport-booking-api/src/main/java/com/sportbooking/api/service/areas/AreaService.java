package com.sportbooking.api.service.areas;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sportbooking.api.dto.request.areas.AreaCreateRequest;
import com.sportbooking.api.dto.response.areas.AreasResponse;
import com.sportbooking.api.entity.areas.Area;
import com.sportbooking.api.mapper.AreaMapper;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import com.sportbooking.api.repository.areas.AreaRepository;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class AreaService {
    AreaRepository areaRepository;
    AreaMapper areaMapper;

    public AreasResponse createArea(AreaCreateRequest request) {
        Area area = areaMapper.toArea(request); // map AreaCreateRequest sang Area
        Area savedArea = areaRepository.save(area); // luu Area vao database
        return areaMapper.toAreaResponse(savedArea);
    }

    public AreasResponse getAreaById(String id) {
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Area not found with id: " + id)); // tim Area theo id, neu
                                                                                           // khong tim thay thi throw
                                                                                           // exception
        return areaMapper.toAreaResponse(area); // map Area sang AreasResponse
    }

    public List<AreasResponse> getAllAreas() {
        List<Area> areas = areaRepository.findAll(); // lay tat ca Area tu database
        return areas.stream() // chuyen List<Area> sang Stream<Area>
                .map(areaMapper::toAreaResponse) // map tung Area sang AreasResponse
                .toList(); // chuyen stream sang List<AreasResponse>

    }

    public String deleteArea(String id) {
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Area not found with id: " + id)); // tim Area theo id, neu
                                                                                           // khong tim thay thi throw
                                                                                           // exception
        areaRepository.delete(area); // xoa Area khoi database
        return "Area deleted successfully";
    }

    public AreasResponse updateArea(String id, AreaCreateRequest request) {
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Area not found with id: " + id)); // tim Area theo id, neu
                                                                                           // khong tim thay thi throw
                                                                                           // exception
        area.setName(request.getName()); // cap nhat ten Area
        Area updatedArea = areaRepository.save(area); // luu Area da cap nhat vao database
        return areaMapper.toAreaResponse(updatedArea); // map Area sang AreasResponse
    }
}
