package com.example.jobposting.api.controller;

import com.example.jobposting.api.dto.JobPostingRequest;
import com.example.jobposting.api.dto.JobPostingResponse;
import com.example.jobposting.api.service.JobPostingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
@Tag(name = "Job Posting API", description = "Endpoints for managing job postings")
public class JobPostingController {

    private final JobPostingService jobPostingService;

    @Operation(summary = "Create a new job posting", responses = {
            @ApiResponse(responseCode = "201", description = "Job posting created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping
    public ResponseEntity<JobPostingResponse> createJobPosting(@Valid @RequestBody JobPostingRequest request) {
        JobPostingResponse response = jobPostingService.createJobPosting(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all job postings with pagination")
    @GetMapping
    public ResponseEntity<Page<JobPostingResponse>> getAllJobPostings(Pageable pageable) {
        Page<JobPostingResponse> response = jobPostingService.getAllJobPostings(pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get a job posting by ID")
    @GetMapping("/{id}")
    public ResponseEntity<JobPostingResponse> getJobPostingById(@PathVariable Long id) {
        JobPostingResponse response = jobPostingService.getJobPostingById(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update an existing job posting")
    @PutMapping("/{id}")
    public ResponseEntity<JobPostingResponse> updateJobPosting(
            @PathVariable Long id, @Valid @RequestBody JobPostingRequest request) {
        JobPostingResponse response = jobPostingService.updateJobPosting(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete a job posting")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobPosting(@PathVariable Long id) {
        jobPostingService.deleteJobPosting(id);
        return ResponseEntity.noContent().build();
    }
}
