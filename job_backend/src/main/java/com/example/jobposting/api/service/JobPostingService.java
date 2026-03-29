package com.example.jobposting.api.service;

import com.example.jobposting.api.dto.JobPostingRequest;
import com.example.jobposting.api.dto.JobPostingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobPostingService {
    JobPostingResponse createJobPosting(JobPostingRequest request);
    Page<JobPostingResponse> getAllJobPostings(Pageable pageable);
    JobPostingResponse getJobPostingById(Long id);
    JobPostingResponse updateJobPosting(Long id, JobPostingRequest request);
    void deleteJobPosting(Long id);
}
