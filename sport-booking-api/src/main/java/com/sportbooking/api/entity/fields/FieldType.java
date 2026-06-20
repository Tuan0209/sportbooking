package com.sportbooking.api.entity.fields;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import com.sportbooking.api.entity.sport.SportType;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "field_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FieldType {

    @Id
    @UuidGenerator
    @Column(length = 36, nullable = false, updatable = false)
    String id;

    @Column(length = 50, nullable = false)
    String name;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "sport_type_id")
    SportType sportType;
}