package com.sportbooking.api.entity.venues;

import java.time.LocalDateTime;
import java.util.List;
import com.sportbooking.api.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "favorite_venue", uniqueConstraints = {
        @UniqueConstraint(name = "unique_user_venue", columnNames = { "user_id", "venue_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteVenue {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}