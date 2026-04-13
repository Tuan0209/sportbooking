package com.sportbooking.api.repository.fields;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.entity.fields.FieldType;

@Repository
public interface FieldTypeRepository extends JpaRepository<FieldType, String> {
}