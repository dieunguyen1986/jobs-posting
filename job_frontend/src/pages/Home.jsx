import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, Link, createSearchParams } from 'react-router-dom';
import JobService from '../services/JobService';

const Home = () => {
    const [recentJobs, setRecentJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Search states
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [department, setDepartment] = useState('');

    const navigate = useNavigate();

    // Map departments to Bootstrap icons visually
    const getIconForCategory = (name) => {
        const iconMap = {
            'design': 'bi-palette',
            'creative': 'bi-palette',
            'marketing': 'bi-megaphone',
            'telemarketing': 'bi-telephone-forward',
            'software': 'bi-laptop',
            'web': 'bi-laptop',
            'engineering': 'bi-tools',
            'administration': 'bi-building',
            'teaching': 'bi-book',
            'garments': 'bi-scissors'
        };
        const key = Object.keys(iconMap).find(k => name.toLowerCase().includes(k));
        return key ? iconMap[key] : 'bi-briefcase';
    };

    useEffect(() => {
        // Fetch recent jobs
        JobService.searchJobs('', '', '', '', 0, 5).then((res) => {
             setRecentJobs(res.data.content);
             setLoading(false);
        }).catch(err => {
             console.error("Home: Error loading recent jobs", err);
             setLoading(false);
        });

        // Fetch department counts
        JobService.getDepartmentCounts().then((res) => {
             setCategories(res.data);
        }).catch(console.error);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (keyword) params.keyword = keyword;
        if (location) params.location = location;
        if (department) params.department = department;
        
        navigate({
            pathname: '/jobs',
            search: `?${createSearchParams(params)}`
        });
    };

    return (
        <>
            {/* 1. SLIDER AREA (Hero) */}
            <div className="slider_area">
                <div className="single_slider d-flex align-items-center slider_bg_1">
                    <Container>
                        <Row className="align-items-center">
                            <Col lg={7} md={6}>
                                <div className="slider_text">
                                    <h5>50,000+ Jobs listed</h5>
                                    <h3>Find your Dream Job</h3>
                                    <p>We provide opportunities for dedicated candidates seeking the best positions to suit their career paths.</p>
                                    <div className="sldier_btn mt-4">
                                        <button className="boxed-btn3" onClick={() => navigate('/jobs')}>Upload your Resume</button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                {/* Fixed illustration placeholder replacing the local image */}
                <div className="ilstration_img d-none d-lg-block">
                    <img src="https://raw.githubusercontent.com/themewagon/job-board-2/master/img/banner/illustration.png" alt="Hero Illustration" />
                </div>
            </div>

            {/* 2. CATAGORY AREA (Search Bar Strip) */}
            <div className="catagory_area">
                <Container>
                    <Form className="row cat_search align-items-center" onSubmit={handleSearch}>
                        <Col lg={3} md={4}>
                            <div className="single_input">
                                <input 
                                    type="text" 
                                    placeholder="Search keyword" 
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col lg={3} md={4}>
                            <div className="single_input">
                                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                                    <option value="">Location</option>
                                    <option value="New York">New York</option>
                                    <option value="California">California</option>
                                    <option value="London">London</option>
                                    <option value="Remote">Remote</option>
                                </select>
                            </div>
                        </Col>
                        <Col lg={3} md={4}>
                            <div className="single_input">
                                <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                                    <option value="">Category</option>
                                    {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                        </Col>
                        <Col lg={3} md={12}>
                            <div className="job_btn">
                                <button type="submit" className="boxed-btn3 w-100 fs-5">Find Job</button>
                            </div>
                        </Col>
                    </Form>
                    <Row>
                        <Col lg={12}>
                            <div className="popular_search d-flex align-items-center flex-wrap pt-3">
                                <span>Popular Search:</span>
                                <ul>
                                    <li><Link to="/jobs?department=Design+%26+Creative">Design & Creative</Link></li>
                                    <li><Link to="/jobs?department=Marketing">Marketing</Link></li>
                                    <li><Link to="/jobs?department=Administration">Administration</Link></li>
                                    <li><Link to="/jobs?department=Teaching">Teaching & Education</Link></li>
                                    <li><Link to="/jobs?department=Engineering">Engineering</Link></li>
                                    <li><Link to="/jobs?department=Software">Software & Web</Link></li>
                                    <li><Link to="/jobs?keyword=Remote">Remote</Link></li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* 3. POPULAR CATEGORIES */}
            <div className="popular_catagory_area">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="section_title mb-5">
                                <h3 className="section-title">Popular Categories</h3>
                            </div>
                        </Col>
                    </Row>
                    <Row className="g-4">
                        {categories.slice(0, 8).map((cat, index) => (
                            <Col md={6} lg={4} xl={3} key={index}>
                                <div 
                                    className="single_catagory text-center cursor-pointer" 
                                    onClick={() => navigate(`/jobs?department=${encodeURIComponent(cat.name)}`)}
                                    style={{cursor: 'pointer'}}
                                >
                                    <i className={`bi ${getIconForCategory(cat.name)} category-icon d-block mb-3`}></i>
                                    <h4>{cat.name}</h4>
                                    <p><span>{cat.count}</span> Available position{cat.count !== 1 && 's'}</p>
                                </div>
                            </Col>
                        ))}
                        {categories.length === 0 && !loading && (
                            <div className="text-center text-muted">No categories populated yet. Start posting jobs!</div>
                        )}
                    </Row>
                </Container>
            </div>

            {/* 4. JOB LISTING */}
            <div className="job_listing_area py-5">
                <Container>
                    <div className="row align-items-center mb-5">
                        <div className="col-lg-6">
                            <div className="section_title">
                                <h3 className="section-title">Job Listing</h3>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="text-lg-end mt-3 mt-lg-0">
                                <Button variant="outline-success" className="btn-outline-brand" onClick={() => navigate('/jobs')}>Browse More Job</Button>
                            </div>
                        </div>
                    </div>

                    <div className="job_lists">
                        <Row>
                            <Col lg={12}>
                                {loading ? (
                                    <div className="text-center"><div className="spinner-border text-success" role="status"></div></div>
                                ) : recentJobs.length === 0 ? (
                                    <div className="text-center text-muted py-5">No recent jobs available at the moment.</div>
                                ) : (
                                    recentJobs.map((job) => (
                                        <div className="job-row align-items-center" key={job.id}>
                                            <div className="job-logo-box">
                                                <i className="bi bi-briefcase-fill job-logo-icon"></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <Link to={`/edit-job/${job.id}`} className="job-title-link">{job.title}</Link>
                                                <div className="job-meta-list">
                                                    <div className="job-meta-item">
                                                        <i className="bi bi-geo-alt-fill"></i>{job.location}
                                                    </div>
                                                    <div className="job-meta-item">
                                                        <i className="bi bi-clock"></i>{job.employmentType}
                                                    </div>
                                                    <div className="job-meta-item">
                                                        <span className={`pill-badge pill-success`}>{job.department}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-end d-flex flex-column justify-content-between ms-2">
                                                <Button variant="outline-success" className="btn-outline-brand rounded-pill px-4 mb-2" onClick={() => navigate(`/edit-job/${job.id}`)}>
                                                    Apply Now
                                                </Button>
                                                <div className="text-muted small">
                                                    Active Listing
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>

            {/* 5. FEATURED CANDIDATES (Hardcoded UI Clone) */}
            <div className="featured_candidates_area">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="section_title text-center mb-5">
                                <h3 className="section-title">Featured Candidates</h3>
                            </div>
                        </Col>
                    </Row>
                    <Row className="g-4">
                        {[1, 2, 3, 4].map((item) => (
                            <Col md={6} lg={3} key={item}>
                                <div className="single_candidates text-center">
                                    <div className="thumb">
                                        <img src={`https://raw.githubusercontent.com/themewagon/job-board-2/master/img/candiateds/${item}.png`} alt={`Candidate ${item}`} />
                                    </div>
                                    <Link to="#" className="text-decoration-none"><h4>Markary Jondon</h4></Link>
                                    <p>Software Engineer</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            {/* 6. TOP COMPANIES (Hardcoded UI Clone) */}
            <div className="top_companies_area">
                <Container>
                    <div className="row align-items-center mb-5">
                        <div className="col-lg-6 col-md-6">
                            <div className="section_title">
                                <h3 className="section-title">Top Companies</h3>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="text-lg-end mt-3 mt-lg-0">
                                <Button variant="outline-success" className="btn-outline-brand" onClick={() => navigate('/jobs')}>Browse More Job</Button>
                            </div>
                        </div>
                    </div>
                    <Row className="g-4">
                        {[1, 2, 3, 4].map((item) => (
                            <Col md={6} lg={4} xl={3} key={item}>
                                <div className="single_company">
                                    <div className="thumb">
                                        <i className={`bi bi-${['apple', 'google', 'microsoft', 'meta'][item-1]} text-success fs-1`}></i>
                                    </div>
                                    <Link to="/jobs" className="text-decoration-none"><h3>Snack Studio</h3></Link>
                                    <p><span>50</span> Available position</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            {/* 7. JOB SEARCHING WRAP (Dark Overlay) */}
            <div className="job_searcing_wrap">
                <Container>
                    <Row>
                        <Col lg={{span: 5, offset: 1}} md={6}>
                            <div className="searching_text">
                                <h3>Looking for a Job?</h3>
                                <p>We provide online instant cash loans with quick approval</p>
                                <Button className="btn-brand px-4 py-2 mt-2" onClick={() => navigate('/jobs')}>Browse Job</Button>
                            </div>
                        </Col>
                        <Col lg={{span: 5, offset: 1}} md={6} className="mt-5 mt-md-0">
                            <div className="searching_text">
                                <h3>Looking for a Expert?</h3>
                                <p>We provide online instant cash loans with quick approval</p>
                                <Button className="btn-brand px-4 py-2 mt-2" style={{background: 'transparent', border: '2px solid white'}} onClick={() => navigate('/add-job')}>Post a Job</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Home;
