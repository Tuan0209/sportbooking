package com.sportbooking.api.service.fields;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import com.sportbooking.api.dto.request.fields.FieldPriceSlotCreateRequest;
import com.sportbooking.api.dto.response.fields.TimeSlotResponse;
import com.sportbooking.api.entity.fields.Field;

@Service
public class FieldTimeSlotService {

    public List<TimeSlotResponse> generateSlots(Field field) {

        int interval = field.getSlotInterval() != null ? field.getSlotInterval() : 30;

        LocalTime start = field.getOpenTime();
        LocalTime end = field.getCloseTime();

        List<TimeSlotResponse> result = new ArrayList<>();

        while (start.isBefore(end)) {

            LocalTime next = start.plusMinutes(interval);

            result.add(TimeSlotResponse.builder()
                    .start(start)
                    .end(next)
                    .label(start + " - " + next)
                    .build());

            start = next;
        }

        return result;
    }
}