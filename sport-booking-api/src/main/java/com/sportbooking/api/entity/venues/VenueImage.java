package com.sportbooking.api.entity.venues;

import com.sportbooking.api.common.enums.VenueImageType;
import com.sportbooking.api.entity.fields.Field;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "venue_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VenueImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "venue_id")
    private Venue venue;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private VenueImageType type;

    private Boolean isPrimary;
    private Integer sortOrder;
}
