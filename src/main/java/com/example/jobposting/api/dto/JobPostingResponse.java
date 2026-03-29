package com.example.jobposting.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobPostingResponse {
    private Long id;
    private String title;
    private String description;
    private String department;
    private String location;
    private String employmentType;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
