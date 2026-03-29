package com.example.jobposting.api.controller;

import com.example.jobposting.api.dto.JobPostingRequest;
import com.example.jobposting.api.dto.JobPostingResponse;
import com.example.jobposting.api.exception.GlobalExceptionHandler;
import com.example.jobposting.api.service.JobPostingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class JobPostingControllerTest {

    private MockMvc mockMvc;

    @Mock
    private JobPostingService jobPostingService;

    @InjectMocks
    private JobPostingController jobPostingController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private JobPostingRequest request;
    private JobPostingResponse response;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(jobPostingController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        request = JobPostingRequest.builder()
                .title("Software Engineer")
                .description("Great job")
                .department("IT")
                .location("Remote")
                .employmentType("FULL_TIME")
                .active(true)
                .build();

        response = JobPostingResponse.builder()
                .id(1L)
                .title("Software Engineer")
                .description("Great job")
                .department("IT")
                .location("Remote")
                .employmentType("FULL_TIME")
                .active(true)
                .build();
    }

    @Test
    void createJobPosting_ShouldReturnCreatedResponse() throws Exception {
        Mockito.when(jobPostingService.createJobPosting(any(JobPostingRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/v1/jobs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Software Engineer"));
    }

    @Test
    void createJobPosting_ShouldReturnBadRequest_WhenInvalid() throws Exception {
        request.setTitle(""); // Invalid

        mockMvc.perform(post("/api/v1/jobs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").exists());
    }

    @Test
    void getJobPostingById_ShouldReturnResponse() throws Exception {
        Mockito.when(jobPostingService.getJobPostingById(1L))
                .thenReturn(response);

        mockMvc.perform(get("/api/v1/jobs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void updateJobPosting_ShouldReturnOk() throws Exception {
        Mockito.when(jobPostingService.updateJobPosting(eq(1L), any(JobPostingRequest.class)))
                .thenReturn(response);

        mockMvc.perform(put("/api/v1/jobs/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void deleteJobPosting_ShouldReturnNoContent() throws Exception {
        Mockito.doNothing().when(jobPostingService).deleteJobPosting(1L);

        mockMvc.perform(delete("/api/v1/jobs/1"))
                .andExpect(status().isNoContent());
    }
}
