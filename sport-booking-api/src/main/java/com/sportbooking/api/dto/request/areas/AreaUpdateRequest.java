package com.sportbooking.api.dto.request.areas;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AreaUpdateRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be at most 100 characters")
    private String name;
    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must be at most 100 characters")
    private String city;

}
