import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import JobService from '../services/JobService';

const Home = () => {
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch only first page to show recent jobs
        JobService.getJobs(0, 5).then((res) => {
             setRecentJobs(res.data.content);
             setLoading(false);
        }).catch(err => {
             console.error("Home: Error loading recent jobs", err);
             setLoading(false);
        });
    }, []);

    const categories = [
        { name: "Design & Creative", count: 50, icon: "bi-palette" },
        { name: "Marketing", count: 86, icon: "bi-megaphone" },
        { name: "Telemarketing", count: 42, icon: "bi-telephone-forward" },
        { name: "Software & Web", count: 120, icon: "bi-laptop" },
        { name: "Administration", count: 35, icon: "bi-building" },
        { name: "Teaching & Education", count: 65, icon: "bi-book" },
        { name: "Engineering", count: 90, icon: "bi-tools" },
        { name: "Garments / Textile", count: 20, icon: "bi-scissors" },
    ];

    return (
        <>
            {/* HERO SECTION */}
            <section className="hero-section text-center position-relative">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={10} xl={8}>
                            <h1 className="hero-title">Find the most exciting startup jobs</h1>
                            <p className="hero-subtitle">Search between more than 50,000 open jobs</p>
                            
                            <div className="hero-search-card text-start">
                                <Form className="d-flex flex-column flex-md-row gap-3">
                                    <div className="flex-grow-1">
                                        <Form.Control type="text" placeholder="Job Title or Keyword" className="hero-search-input" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <Form.Select className="hero-search-input">
                                            <option>All Locations</option>
                                            <option>New York</option>
                                            <option>California</option>
                                            <option>Remote</option>
                                        </Form.Select>
                                    </div>
                                    <div className="flex-grow-1">
                                        <Form.Select className="hero-search-input">
                                            <option>All Categories</option>
                                            {categories.map((c, i) => <option key={i}>{c.name}</option>)}
                                        </Form.Select>
                                    </div>
                                    <div>
                                        <Button className="btn-brand w-100 h-100 px-4" onClick={(e) => { e.preventDefault(); navigate('/jobs'); }}>
                                            Find Job
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* POPULAR CATEGORIES */}
            <section className="section-padding bg-light">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="section-title">Popular Categories</h2>
                        <p className="text-muted mt-3">Browse exciting positions by category</p>
                    </div>
                    
                    <Row className="g-4">
                        {categories.map((cat, index) => (
                            <Col md={6} lg={3} key={index}>
                                <div className="category-card" onClick={() => navigate('/jobs')}>
                                    <i className={`bi ${cat.icon} category-icon`}></i>
                                    <h4 className="category-title">{cat.name}</h4>
                                    <span className="category-count">{cat.count} Available position</span>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* RECENT JOBS */}
            <section className="section-padding">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="section-title">Job Listing</h2>
                        <p className="text-muted mt-3">Discover the latest opportunities</p>
                    </div>

                    <Row className="justify-content-center">
                        <Col lg={10}>
                            {loading ? (
                                <div className="text-center"><div className="spinner-border text-success" role="status"></div></div>
                            ) : recentJobs.length === 0 ? (
                                <div className="text-center text-muted py-5">No recent jobs available at the moment.</div>
                            ) : (
                                recentJobs.map((job) => (
                                    <div className="job-row" key={job.id}>
                                        <div className="job-logo-box">
                                            <i className="bi bi-briefcase-fill job-logo-icon"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <Link to={`/edit-job/${job.id}`} className="job-title-link">{job.title}</Link>
                                            <div className="job-meta-list">
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
                                        </div>
                                        <div className="text-end">
                                            <Button variant="outline-success" className="btn-outline-brand rounded-pill px-4" onClick={() => navigate(`/edit-job/${job.id}`)}>
                                                Apply Now
                                            </Button>
                                            <div className="text-muted mt-2 small">
                                                Date line: 1 Week
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            
                            <div className="text-center mt-5">
                                <Button className="btn-brand" onClick={() => navigate('/jobs')}>Load More Jobs</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CALL TO ACTION */}
            <section className="section-padding pt-0">
                <Container>
                    <Row className="g-4">
                        <Col lg={6}>
                            <div className="cta-card">
                                <h3>Looking for a job?</h3>
                                <p className="text-muted mb-4 mt-3 col-10">We have thousands of opportunities available. Browse job listings to find your ideal career fit today.</p>
                                <Button className="btn-brand" onClick={() => navigate('/jobs')}>Browser Job</Button>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="cta-card">
                                <h3>Are you recruiting?</h3>
                                <p className="text-muted mb-4 mt-3 col-10">Post your job opportunity and gain access to thousands of qualified candidates looking for their next role.</p>
                                <Button className="btn-outline-brand" onClick={() => navigate('/add-job')}>Post a Job</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default Home;
