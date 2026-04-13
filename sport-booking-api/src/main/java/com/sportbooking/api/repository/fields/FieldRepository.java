package com.sportbooking.api.repository.fields;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.entity.fields.Field;

@Repository
public interface FieldRepository extends JpaRepository<Field, String> {

    List<Field> findByAreaId(String areaId); // lay tat ca fields theo areaId

    List<Field> findByFieldTypeId(String fieldTypeId);

    List<Field> findByAreaIdAndFieldTypeId(String areaId, String fieldTypeId);
}