package com.sportbooking.api.service.fields;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.TreeSet;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportbooking.api.dto.request.fields.FieldPriceSlotCreateRequest;
import com.sportbooking.api.dto.request.fields.FieldPriceSlotUpdateRequest;
import com.sportbooking.api.dto.response.fields.FieldPriceSlotResponse;
import com.sportbooking.api.dto.response.fields.PriceResponse;
import com.sportbooking.api.dto.response.fields.PriceResponse.PriceBreakdownItem;
import com.sportbooking.api.entity.fields.Field;
import com.sportbooking.api.entity.fields.FieldPriceSlot;
import com.sportbooking.api.mapper.FieldPriceSlotMapper;
import com.sportbooking.api.repository.fields.FieldPriceSlotRepository;
import com.sportbooking.api.repository.fields.FieldRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class FieldPriceSlotService {

    FieldPriceSlotRepository slotRepository;
    FieldRepository fieldRepository;
    FieldPriceSlotMapper slotMapper;

    // ─── CRUD ─────────────────────────────────────────────────────────────────

    @Transactional
    public FieldPriceSlotResponse createSlot(FieldPriceSlotCreateRequest request) {
        Field field = fieldRepository.findById(request.getFieldId())
                .orElseThrow(() -> new RuntimeException("Field not found with id: " + request.getFieldId()));

        validateTimeRange(request.getStartTime(), request.getEndTime());
        validateDateRange(request.getStartDate(), request.getEndDate());

        // kiem tra overlap
        List<FieldPriceSlot> conflicts = slotRepository.findOverlappingSlots(
                request.getFieldId(),
                request.getStartTime(), request.getEndTime(),
                request.getStartDate(), request.getEndDate(),
                request.getDayOfWeek(),
                request.getPriority());

        if (!conflicts.isEmpty()) {
            throw new RuntimeException(
                    "Slot bị trùng với slot đã tồn tại cùng priority: " + conflicts.get(0).getId());
        }

        FieldPriceSlot slot = slotMapper.toEntity(request);
        slot.setField(field);

        return slotMapper.toResponse(slotRepository.save(slot));
    }

    @Transactional
    public FieldPriceSlotResponse updateSlot(String id, FieldPriceSlotUpdateRequest request) {
        FieldPriceSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PriceSlot not found with id: " + id));

        // lay gia tri sau update de validate
        LocalTime newStartTime = request.getStartTime() != null ? request.getStartTime() : slot.getStartTime();
        LocalTime newEndTime = request.getEndTime() != null ? request.getEndTime() : slot.getEndTime();
        LocalDate newStartDate = request.getStartDate() != null ? request.getStartDate() : slot.getStartDate();
        LocalDate newEndDate = request.getEndDate() != null ? request.getEndDate() : slot.getEndDate();
        Integer newDayOfWeek = request.getDayOfWeek() != null ? request.getDayOfWeek() : slot.getDayOfWeek();
        Integer newPriority = request.getPriority() != null ? request.getPriority() : slot.getPriority();

        validateTimeRange(newStartTime, newEndTime);
        validateDateRange(newStartDate, newEndDate);

        // kiem tra overlap, exclude chinh no
        List<FieldPriceSlot> conflicts = slotRepository.findOverlappingSlotsExcluding(
                slot.getField().getId(), id,
                newStartTime, newEndTime,
                newStartDate, newEndDate,
                newDayOfWeek, newPriority);

        if (!conflicts.isEmpty()) {
            throw new RuntimeException(
                    "Slot bị trùng với slot đã tồn tại cùng priority: " + conflicts.get(0).getId());
        }

        slotMapper.updateFromRequest(request, slot);
        return slotMapper.toResponse(slotRepository.save(slot));
    }

    @Transactional
    public String deleteSlot(String id) {
        FieldPriceSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PriceSlot not found with id: " + id));
        slotRepository.delete(slot);
        return "PriceSlot deleted successfully";
    }

    @Transactional(readOnly = true)
    public List<FieldPriceSlotResponse> getSlotsByFieldId(String fieldId) {
        if (!fieldRepository.existsById(fieldId)) {
            throw new RuntimeException("Field not found with id: " + fieldId);
        }
        return slotRepository.findByFieldIdOrderByPriorityDesc(fieldId)
                .stream()
                .map(slotMapper::toResponse)
                .toList();
    }

    // ─── PRICING ENGINE ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public PriceResponse calculatePrice(String fieldId, LocalDateTime start, LocalDateTime end) {
        if (!start.isBefore(end)) {
            throw new RuntimeException("Thời gian bắt đầu phải trước thời gian kết thúc");
        }

        Field field = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new RuntimeException("Field not found with id: " + fieldId));

        // lay tat ca slots cua san, sap xep priority giam dan
        List<FieldPriceSlot> allSlots = slotRepository.findByFieldIdOrderByPriorityDesc(fieldId);

        // 1. Thu thap tat ca boundary points de chia segment
        TreeSet<LocalTime> boundaries = new TreeSet<>();
        LocalTime startTime = start.toLocalTime();
        LocalTime endTime = end.toLocalTime();

        boundaries.add(startTime);
        boundaries.add(endTime);

        // them cac boundary tu slots
        for (FieldPriceSlot slot : allSlots) {
            if (slot.getStartTime().isAfter(startTime) && slot.getStartTime().isBefore(endTime)) {
                boundaries.add(slot.getStartTime());
            }
            if (slot.getEndTime().isAfter(startTime) && slot.getEndTime().isBefore(endTime)) {
                boundaries.add(slot.getEndTime());
            }
        }

        // 2. Voi moi segment, tim slot phu hop nhat (priority cao nhat)
        List<LocalTime> boundaryList = new ArrayList<>(boundaries);
        List<PriceBreakdownItem> breakdown = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        LocalDate bookingDate = start.toLocalDate();
        int dayOfWeek = bookingDate.getDayOfWeek().getValue() % 7; // 0=CN, 1=T2..6=T7

        for (int i = 0; i < boundaryList.size() - 1; i++) {
            LocalTime segStart = boundaryList.get(i);
            LocalTime segEnd = boundaryList.get(i + 1);

            // tim slot phu hop cho segment nay (da sap xep priority desc → lay dau tien)
            FieldPriceSlot matchedSlot = findBestSlot(allSlots, segStart, segEnd, bookingDate, dayOfWeek);

            BigDecimal pricePerHour;
            String slotId;

            if (matchedSlot != null) {
                pricePerHour = matchedSlot.getPrice();
                slotId = matchedSlot.getId();
            } else {
                // fallback: dung price_per_hour cua san
                pricePerHour = field.getPricePerHour();
                slotId = null;
            }

            // tinh so phut cua segment
            long minutes = java.time.Duration.between(segStart, segEnd).toMinutes();
            BigDecimal hours = BigDecimal.valueOf(minutes).divide(BigDecimal.valueOf(60), 6, RoundingMode.HALF_UP);
            BigDecimal subtotal = pricePerHour.multiply(hours).setScale(0, RoundingMode.HALF_UP);

            totalPrice = totalPrice.add(subtotal);

            breakdown.add(PriceBreakdownItem.builder()
                    .from(segStart)
                    .to(segEnd)
                    .price(pricePerHour)
                    .subtotal(subtotal)
                    .slotId(slotId)
                    .build());
        }

        return PriceResponse.builder()
                .totalPrice(totalPrice)
                .breakdown(breakdown)
                .build();
    }

    // tim slot phu hop nhat cho 1 segment (priority cao nhat)
    private FieldPriceSlot findBestSlot(List<FieldPriceSlot> slots,
            LocalTime segStart, LocalTime segEnd,
            LocalDate date, int dayOfWeek) {

        return slots.stream()
                .filter(slot ->
                // time overlap: slot covers toan bo segment
                !slot.getStartTime().isAfter(segStart) && !slot.getEndTime().isBefore(segEnd)
                // date range
                        && (slot.getStartDate() == null || !slot.getStartDate().isAfter(date))
                        && (slot.getEndDate() == null || !slot.getEndDate().isBefore(date))
                        // day of week
                        && (slot.getDayOfWeek() == null || slot.getDayOfWeek() == dayOfWeek))
                .max(Comparator.comparingInt(FieldPriceSlot::getPriority))
                .orElse(null);
    }

    // ─── VALIDATION ───────────────────────────────────────────────────────────

    private void validateTimeRange(LocalTime start, LocalTime end) {
        if (!start.isBefore(end)) {
            throw new RuntimeException("start_time phải nhỏ hơn end_time");
        }
    }

    private void validateDateRange(LocalDate start, LocalDate end) {
        if (start != null && end != null && start.isAfter(end)) {
            throw new RuntimeException("start_date phải nhỏ hơn hoặc bằng end_date");
        }
    }
}