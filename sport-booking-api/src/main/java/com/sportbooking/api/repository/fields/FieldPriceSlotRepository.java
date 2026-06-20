package com.sportbooking.api.repository.fields;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.entity.fields.FieldPriceSlot;

@Repository
public interface FieldPriceSlotRepository extends JpaRepository<FieldPriceSlot, String> {

    // lay tat ca slot cua 1 san, sap xep priority giam dan
    List<FieldPriceSlot> findByFieldIdOrderByPriorityDesc(String fieldId);

    // lay cac slot hop le cho 1 khung gio va ngay cu the
    // dung cho pricing engine
    @Query("""
            SELECT s FROM FieldPriceSlot s
            WHERE s.field.id = :fieldId
              AND s.startTime < :endTime
              AND s.endTime > :startTime
              AND (:date IS NULL
                   OR (s.startDate IS NULL OR s.startDate <= :date)
                   AND (s.endDate IS NULL OR s.endDate >= :date))
              AND (:dayOfWeek IS NULL
                   OR s.dayOfWeek IS NULL
                   OR s.dayOfWeek = :dayOfWeek)
            ORDER BY s.priority DESC
            """)
    List<FieldPriceSlot> findApplicableSlots(
            @Param("fieldId") String fieldId,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("date") LocalDate date,
            @Param("dayOfWeek") Integer dayOfWeek);

    // kiem tra overlap voi cung priority (dung khi create)
    @Query("""
            SELECT s FROM FieldPriceSlot s
            WHERE s.field.id = :fieldId
              AND s.priority = :priority
              AND s.startTime < :endTime
              AND s.endTime > :startTime
              AND (s.startDate IS NULL OR :endDate IS NULL OR s.startDate <= :endDate)
              AND (s.endDate IS NULL OR :startDate IS NULL OR s.endDate >= :startDate)
              AND (s.dayOfWeek IS NULL OR :dayOfWeek IS NULL OR s.dayOfWeek = :dayOfWeek)
            """)
    List<FieldPriceSlot> findOverlappingSlots(
            @Param("fieldId") String fieldId,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("dayOfWeek") Integer dayOfWeek,
            @Param("priority") Integer priority);

    // kiem tra overlap khi update (exclude slot hien tai)
    @Query("""
            SELECT s FROM FieldPriceSlot s
            WHERE s.field.id = :fieldId
              AND s.id <> :excludeId
              AND s.priority = :priority
              AND s.startTime < :endTime
              AND s.endTime > :startTime
              AND (s.startDate IS NULL OR :endDate IS NULL OR s.startDate <= :endDate)
              AND (s.endDate IS NULL OR :startDate IS NULL OR s.endDate >= :startDate)
              AND (s.dayOfWeek IS NULL OR :dayOfWeek IS NULL OR s.dayOfWeek = :dayOfWeek)
            """)
    List<FieldPriceSlot> findOverlappingSlotsExcluding(
            @Param("fieldId") String fieldId,
            @Param("excludeId") String excludeId,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("dayOfWeek") Integer dayOfWeek,
            @Param("priority") Integer priority);
}