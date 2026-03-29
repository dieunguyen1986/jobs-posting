import axios from 'axios';

const JOB_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1/jobs";

class JobService {
    getJobs(page = 0, size = 10) {
        return axios.get(`${JOB_API_BASE_URL}?page=${page}&size=${size}`);
    }

    getJobById(jobId) {
        return axios.get(`${JOB_API_BASE_URL}/${jobId}`);
    }

    searchJobs(keyword, location, department, employmentType, page = 0, size = 10) {
        let url = `${JOB_API_BASE_URL}/search?page=${page}&size=${size}`;
        if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
        if (location) url += `&location=${encodeURIComponent(location)}`;
        if (department) url += `&department=${encodeURIComponent(department)}`;
        if (employmentType) url += `&employmentType=${encodeURIComponent(employmentType)}`;
        return axios.get(url);
    }

    getDepartmentCounts() {
        return axios.get(`${JOB_API_BASE_URL}/departments/counts`);
    }

    createJob(job) {
        return axios.post(JOB_API_BASE_URL, job);
    }

    updateJob(jobId, job) {
        return axios.put(`${JOB_API_BASE_URL}/${jobId}`, job);
    }

    deleteJob(jobId) {
        return axios.delete(`${JOB_API_BASE_URL}/${jobId}`);
    }
}

export default new JobService();
