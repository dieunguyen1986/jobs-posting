package com.example.jobposting.api.repository;

import com.example.jobposting.api.model.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.jobposting.api.dto.CategoryCountDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {

    @Query("SELECT new com.example.jobposting.api.dto.CategoryCountDTO(j.department, COUNT(j)) " +
           "FROM JobPosting j WHERE j.active = true " +
           "GROUP BY j.department ORDER BY COUNT(j) DESC")
    List<CategoryCountDTO> countActiveJobsByDepartment();

    @Query("SELECT j FROM JobPosting j WHERE " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:department IS NULL OR LOWER(j.department) = LOWER(:department)) " +
           "AND (:employmentType IS NULL OR j.employmentType = :employmentType) " +
           "AND j.active = true")
    Page<JobPosting> searchActiveJobs(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("department") String department,
            @Param("employmentType") String employmentType,
            Pageable pageable
    );
}
