package com.example.jobposting.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobPostingRequest {

    @NotBlank(message = "Title is mandatory")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @NotBlank(message = "Description is mandatory")
    private String description;

    @NotBlank(message = "Department is mandatory")
    @Size(max = 50, message = "Department must not exceed 50 characters")
    private String department;

    @NotBlank(message = "Location is mandatory")
    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @NotBlank(message = "Employment type is mandatory")
    @Size(max = 50, message = "Employment type must not exceed 50 characters")
    private String employmentType;

    @Builder.Default
    private boolean active = true;
}
