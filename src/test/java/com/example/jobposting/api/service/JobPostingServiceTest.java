package com.example.jobposting.api.service;

import com.example.jobposting.api.dto.JobPostingRequest;
import com.example.jobposting.api.dto.JobPostingResponse;
import com.example.jobposting.api.exception.ResourceNotFoundException;
import com.example.jobposting.api.model.JobPosting;
import com.example.jobposting.api.repository.JobPostingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobPostingServiceTest {

    @Mock
    private JobPostingRepository jobPostingRepository;

    @InjectMocks
    private JobPostingServiceImpl jobPostingService;

    private JobPosting jobPosting;
    private JobPostingRequest jobPostingRequest;

    @BeforeEach
    void setUp() {
        jobPosting = JobPosting.builder()
                .id(1L)
                .title("Software Engineer")
                .description("Java Developer")
                .department("Engineering")
                .location("New York")
                .employmentType("FULL_TIME")
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        jobPostingRequest = JobPostingRequest.builder()
                .title("Software Engineer")
                .description("Java Developer")
                .department("Engineering")
                .location("New York")
                .employmentType("FULL_TIME")
                .active(true)
                .build();
    }

    @Test
    void createJobPosting_ShouldReturnResponse() {
        when(jobPostingRepository.save(any(JobPosting.class))).thenReturn(jobPosting);

        JobPostingResponse response = jobPostingService.createJobPosting(jobPostingRequest);

        assertNotNull(response);
        assertEquals(response.getTitle(), jobPosting.getTitle());
        verify(jobPostingRepository, times(1)).save(any(JobPosting.class));
    }

    @Test
    void getJobPostingById_ShouldReturnResponse_WhenFound() {
        when(jobPostingRepository.findById(1L)).thenReturn(Optional.of(jobPosting));

        JobPostingResponse response = jobPostingService.getJobPostingById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Software Engineer", response.getTitle());
    }

    @Test
    void getJobPostingById_ShouldThrowException_WhenNotFound() {
        when(jobPostingRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> jobPostingService.getJobPostingById(1L));
    }

    @Test
    void getAllJobPostings_ShouldReturnPageOfResponses() {
        Page<JobPosting> page = new PageImpl<>(List.of(jobPosting));
        when(jobPostingRepository.findAll(any(PageRequest.class))).thenReturn(page);

        Page<JobPostingResponse> responsePage = jobPostingService.getAllJobPostings(PageRequest.of(0, 10));

        assertNotNull(responsePage);
        assertEquals(1, responsePage.getTotalElements());
    }

    @Test
    void updateJobPosting_ShouldReturnUpdatedResponse() {
        when(jobPostingRepository.findById(1L)).thenReturn(Optional.of(jobPosting));
        when(jobPostingRepository.save(any(JobPosting.class))).thenReturn(jobPosting);

        JobPostingRequest updateRequest = JobPostingRequest.builder()
                .title("Senior Software Engineer")
                .description("Updated Desc")
                .build();

        JobPostingResponse response = jobPostingService.updateJobPosting(1L, updateRequest);

        assertNotNull(response);
        verify(jobPostingRepository, times(1)).save(any(JobPosting.class));
    }

    @Test
    void deleteJobPosting_ShouldDelete() {
        when(jobPostingRepository.findById(1L)).thenReturn(Optional.of(jobPosting));
        doNothing().when(jobPostingRepository).delete(any(JobPosting.class));

        jobPostingService.deleteJobPosting(1L);

        verify(jobPostingRepository, times(1)).delete(any(JobPosting.class));
    }
}
