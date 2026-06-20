package com.sportbooking.api.entity.venues;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;
import jakarta.persistence.CascadeType;
import org.hibernate.annotations.UuidGenerator;
import com.sportbooking.api.entity.fields.Field;
import com.sportbooking.api.common.enums.VenueStatus;
import com.sportbooking.api.entity.areas.Area;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.Builder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "venues")
public class Venue {

    @Id
    @UuidGenerator
    @Column(length = 36, nullable = false, updatable = false)
    String id;

    @Column(nullable = false)
    String name;

    @Column(nullable = false)
    String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id", nullable = false)
    Area area;

    @Column(precision = 10, scale = 6)
    BigDecimal latitude;

    @Column(precision = 10, scale = 6)
    BigDecimal longitude;

    @Column(name = "open_time", nullable = false)
    LocalTime openTime;

    @Column(name = "close_time", nullable = false)
    LocalTime closeTime;

    @OneToMany(mappedBy = "venue", fetch = FetchType.LAZY)
    private List<VenueImage> images;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    VenueStatus status = VenueStatus.ACTIVE;

    @Column(precision = 2, scale = 1)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;
    // @Column(name = "is_favorite")
    // @Builder.Default
    // Boolean isFavorite;
    @Column(name = "total_reviews")
    @Builder.Default
    private Integer totalReviews = 0;

    @OneToMany(mappedBy = "venue", cascade = { CascadeType.ALL }, orphanRemoval = true) // xoa san khi xoa venue
    private List<Field> fields;
}
