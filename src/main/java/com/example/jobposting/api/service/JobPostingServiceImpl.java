package com.example.jobposting.api.service;

import com.example.jobposting.api.dto.JobPostingRequest;
import com.example.jobposting.api.dto.JobPostingResponse;
import com.example.jobposting.api.exception.ResourceNotFoundException;
import com.example.jobposting.api.model.JobPosting;
import com.example.jobposting.api.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobPostingServiceImpl implements JobPostingService {

    private final JobPostingRepository jobPostingRepository;

    @Override
    @Transactional
    public JobPostingResponse createJobPosting(JobPostingRequest request) {
        JobPosting jobPosting = mapToEntity(request);
        JobPosting saved = jobPostingRepository.save(jobPosting);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobPostingResponse> getAllJobPostings(Pageable pageable) {
        return jobPostingRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public JobPostingResponse getJobPostingById(Long id) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPosting", "id", id));
        return mapToResponse(jobPosting);
    }

    @Override
    @Transactional
    public JobPostingResponse updateJobPosting(Long id, JobPostingRequest request) {
        JobPosting existingJobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPosting", "id", id));
        
        existingJobPosting.setTitle(request.getTitle());
        existingJobPosting.setDescription(request.getDescription());
        existingJobPosting.setDepartment(request.getDepartment());
        existingJobPosting.setLocation(request.getLocation());
        existingJobPosting.setEmploymentType(request.getEmploymentType());
        existingJobPosting.setActive(request.isActive());

        JobPosting updated = jobPostingRepository.save(existingJobPosting);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteJobPosting(Long id) {
        JobPosting existingJobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobPosting", "id", id));
        jobPostingRepository.delete(existingJobPosting);
    }

    // Mapper methods
    private JobPosting mapToEntity(JobPostingRequest request) {
        return JobPosting.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .department(request.getDepartment())
                .location(request.getLocation())
                .employmentType(request.getEmploymentType())
                .active(request.isActive())
                .build();
    }

    private JobPostingResponse mapToResponse(JobPosting entity) {
        return JobPostingResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .department(entity.getDepartment())
                .location(entity.getLocation())
                .employmentType(entity.getEmploymentType())
                .active(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
