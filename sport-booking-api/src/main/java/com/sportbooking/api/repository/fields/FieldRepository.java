package com.sportbooking.api.repository.fields;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.entity.fields.Field;

@Repository
public interface FieldRepository extends JpaRepository<Field, String> {

    List<Field> findByFieldTypeId(String fieldTypeId);

    List<Field> findByVenueId(String venueId);

    List<Field> findByVenueIdAndFieldTypeId(String venueId, String fieldTypeId);

    List<Field> findByVenueAreaId(String areaId);

    List<Field> findByVenueAreaIdAndFieldTypeId(String areaId, String fieldTypeId);

    @Query("""
                SELECT f FROM Field f
                JOIN FETCH f.venue v
                JOIN FETCH v.area
                JOIN FETCH f.fieldType ft
                JOIN FETCH ft.sportType
                WHERE v.id = :venueId
            """)
    List<Field> findFullByVenueId(@Param("venueId") String venueId);

    int countByVenueId(String venueId);
}
