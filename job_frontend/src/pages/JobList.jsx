import { useState, useEffect } from 'react';
import { Container, Button, Alert, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import JobService from '../services/JobService';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Filter states initialized from URL params
    const [filterKeyword, setFilterKeyword] = useState(searchParams.get('keyword') || '');
    const [filterLocation, setFilterLocation] = useState(searchParams.get('location') || '');
    const [filterDepartment, setFilterDepartment] = useState(searchParams.get('department') || '');
    const [filterType, setFilterType] = useState(searchParams.get('employmentType') || '');

    useEffect(() => {
        // Fetch categories for the sidebar
        JobService.getDepartmentCounts().then(res => setCategories(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        // Whenever searchParams or page changes, execute search API
        fetchJobs();
        // Sync local states to URL in case URL was changed externally (e.g. Back button)
        setFilterKeyword(searchParams.get('keyword') || '');
        setFilterLocation(searchParams.get('location') || '');
        setFilterDepartment(searchParams.get('department') || '');
        setFilterType(searchParams.get('employmentType') || '');
    }, [page, searchParams]);

    const fetchJobs = () => {
        setLoading(true);
        const kw = searchParams.get('keyword') || '';
        const loc = searchParams.get('location') || '';
        const dept = searchParams.get('department') || '';
        const type = searchParams.get('employmentType') || '';

        JobService.searchJobs(kw, loc, dept, type, page, 10).then((res) => {
            setJobs(res.data.content);
            setTotalPages(res.data.totalPages);
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }).catch((err) => {
            console.error(err);
            setError("Failed to fetch jobs. Please ensure backend is running.");
            setLoading(false);
        });
    };

    const applyFilters = (e) => {
        if(e) e.preventDefault();
        const params = {};
        if (filterKeyword) params.keyword = filterKeyword;
        if (filterLocation) params.location = filterLocation;
        if (filterDepartment) params.department = filterDepartment;
        if (filterType) params.employmentType = filterType;
        
        setPage(0); // Reset to page 0 on new search
        setSearchParams(params);
    };

    const deleteJob = (id) => {
        if (window.confirm("Are you sure you want to delete this job posting?")) {
            JobService.deleteJob(id).then(() => {
                fetchJobs(); // refresh list
            }).catch((err) => {
                console.error("Error deleting job", err);
                alert("Failed to delete the job posting");
            });
        }
    };

    return (
        <>
            {/* Breadcrumb Header */}
            <div className="job-header-banner">
                <Container>
                    <h1 className="fw-bold display-4">Get your Dream Job</h1>
                    <p className="lead">Over 50,000 opportunities waiting for you</p>
                </Container>
            </div>

            <Container className="mb-5 pb-5">
                <Row className="g-4">
                    {/* LEFT SIDEBAR FILTERS */}
                    <Col lg={4}>
                        <div className="job-filter-sidebar">
                            <Form onSubmit={applyFilters}>
                                {/* Quick Search */}
                                <div className="filter-group">
                                    <h4>Search Keyword</h4>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Job Title / Keyword" 
                                        className="py-2 mb-3"
                                        value={filterKeyword}
                                        onChange={(e) => setFilterKeyword(e.target.value)}
                                    />
                                </div>

                                {/* Filter Category */}
                                <div className="filter-group">
                                    <h4>Job Category</h4>
                                    <Form.Select 
                                        className="py-2 text-muted"
                                        value={filterDepartment}
                                        onChange={(e) => setFilterDepartment(e.target.value)}
                                    >
                                        <option value="">Any Category</option>
                                        {categories.map((c, i) => (
                                            <option key={i} value={c.name}>{c.name} ({c.count})</option>
                                        ))}
                                    </Form.Select>
                                </div>

                                {/* Job Type Checkboxes (Converted to radios for 1-active selection) */}
                                <div className="filter-group">
                                    <h4>Job Type</h4>
                                    <Form.Check 
                                        type="radio" name="jobtype" id="type-all" label="All Types" className="custom-checkbox mb-2" 
                                        checked={filterType === ''} onChange={() => setFilterType('')}
                                    />
                                    <Form.Check 
                                        type="radio" name="jobtype" id="type-ft" label="Full Time" className="custom-checkbox mb-2" 
                                        checked={filterType === 'FULL_TIME'} onChange={() => setFilterType('FULL_TIME')}
                                    />
                                    <Form.Check 
                                        type="radio" name="jobtype" id="type-pt" label="Part Time" className="custom-checkbox mb-2" 
                                        checked={filterType === 'PART_TIME'} onChange={() => setFilterType('PART_TIME')}
                                    />
                                    <Form.Check 
                                        type="radio" name="jobtype" id="type-ct" label="Contract" className="custom-checkbox mb-2" 
                                        checked={filterType === 'CONTRACT'} onChange={() => setFilterType('CONTRACT')}
                                    />
                                    <Form.Check 
                                        type="radio" name="jobtype" id="type-in" label="Internship" className="custom-checkbox mb-2" 
                                        checked={filterType === 'INTERNSHIP'} onChange={() => setFilterType('INTERNSHIP')}
                                    />
                                </div>

                                {/* Location Filter */}
                                <div className="filter-group">
                                    <h4>Location</h4>
                                    <Form.Select 
                                        className="py-2 text-muted"
                                        value={filterLocation}
                                        onChange={(e) => setFilterLocation(e.target.value)}
                                    >
                                        <option value="">Anywhere</option>
                                        <option value="New York">New York</option>
                                        <option value="California">California</option>
                                        <option value="Remote">Remote</option>
                                        <option value="London">London</option>
                                    </Form.Select>
                                </div>

                                <Button type="submit" className="btn-brand w-100 mt-2">Filter Jobs</Button>
                                {(searchParams.toString().length > 0) && (
                                    <Button variant="link" className="w-100 mt-2 text-muted text-decoration-none" onClick={() => {
                                        setFilterKeyword(''); setFilterLocation(''); setFilterDepartment(''); setFilterType('');
                                        setSearchParams({});
                                    }}>Clear Filters</Button>
                                )}
                            </Form>
                        </div>
                    </Col>

                    {/* RIGHT MAIN CONTENT (Job Feed) */}
                    <Col lg={8}>
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                            <h3 className="mb-0 fw-bold">{loading ? "..." : jobs.length} Jobs found</h3>
                            <Button variant="primary" className="btn-brand" onClick={() => navigate('/add-job')}>
                                <i className="bi bi-plus-circle me-2"></i>Post Job
                            </Button>
                        </div>

                        {error && <Alert variant="danger">{error}</Alert>}

                        {loading ? (
                             <div className="text-center py-5">
                                 <div className="spinner-border text-success" role="status"></div>
                                 <p className="mt-2 text-muted">Searching Positions...</p>
                             </div>
                        ) : jobs.length === 0 ? (
                            <Alert variant="info" className="text-center py-5">
                                <i className="bi bi-briefcase display-1"></i>
                                <h4 className="mt-3">No jobs found!</h4>
                                <p>Try adjusting your filters or search keywords.</p>
                            </Alert>
                        ) : (
                            <div className="job-list-wrapper">
                                {jobs.map((job) => (
                                    <div className="job-row align-items-start" key={job.id}>
                                        <div className="job-logo-box">
                                            <i className="bi bi-briefcase-fill job-logo-icon"></i>
                                        </div>
                                        <div className="flex-grow-1 pe-3">
                                            <Link to={`/edit-job/${job.id}`} className="job-title-link d-block">{job.title}</Link>
                                            
                                            {/* Meta Tags */}
                                            <div className="job-meta-list mb-2">
                                                <div className="job-meta-item">
                                                    <i className="bi bi-building"></i>{job.department}
                                                </div>
                                                <div className="job-meta-item">
                                                    <i className="bi bi-geo-alt-fill"></i>{job.location}
                                                </div>
                                                <div className="job-meta-item">
                                                    <span className={`pill-badge pill-success`}>{job.employmentType}</span>
                                                </div>
                                            </div>

                                            {/* Advanced Job Description Preview */}
                                            <p className="job-desc-preview text-truncate-3">
                                                {job.description || "No description provided for this job opening."}
                                            </p>
                                        </div>
                                        <div className="text-end d-flex flex-column justify-content-between h-100 ms-2" style={{minWidth: '130px'}}>
                                            <Button variant="outline-success" className="btn-outline-brand rounded-pill px-4 mb-3" onClick={() => navigate(`/edit-job/${job.id}`)}>
                                                Apply Now
                                            </Button>
                                            <Button variant="link" className="text-danger p-0 mt-2 text-end text-decoration-none small" onClick={() => deleteJob(job.id)}>
                                                <i className="bi bi-trash"></i> Delete
                                            </Button>
                                            <div className="text-muted mt-auto small">
                                                Active Listing
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Theme Customized Pagination */}
                        {!loading && totalPages > 1 && (
                            <ul className="pagination theme-pagination">
                                <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(page - 1)}>&laquo;</button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(i)}>{(i + 1).toString().padStart(2, '0')}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(page + 1)}>&raquo;</button>
                                </li>
                            </ul>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default JobList;
