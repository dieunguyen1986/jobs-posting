import { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert, Badge, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import JobService from '../services/JobService';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, [page]);

    const fetchJobs = () => {
        setLoading(true);
        JobService.getJobs(page, 10).then((res) => {
            setJobs(res.data.content);
            setTotalPages(res.data.totalPages);
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setError("Failed to fetch jobs. Please ensure backend is running.");
            setLoading(false);
        });
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

    if (loading && jobs.length === 0) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading Open Positions...</p>
            </Container>
        );
    }

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Current Openings</h2>
                <Button variant="primary" onClick={() => navigate('/add-job')}>
                    <i className="bi bi-plus-circle me-2"></i>Post New Job
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {jobs.length === 0 && !loading && !error && (
                <Alert variant="info" className="text-center py-5">
                    <i className="bi bi-briefcase display-1"></i>
                    <h4 className="mt-3">No jobs found!</h4>
                    <p>There are no active job postings available at the moment.</p>
                </Alert>
            )}

            <Row className="g-4">
                {jobs.map((job) => (
                    <Col md={6} lg={4} key={job.id}>
                        <Card className="h-100 shadow-sm border-0 job-card">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="fw-bold mb-3">{job.title}</Card.Title>
                                <Card.Subtitle className="mb-3 text-muted d-flex align-items-center">
                                    <i className="bi bi-building me-2"></i>{job.department}
                                </Card.Subtitle>
                                
                                <div className="mb-3">
                                    <Badge bg="info" className="me-2 rounded-pill px-3 py-2">
                                        <i className="bi bi-geo-alt-fill me-1"></i>{job.location}
                                    </Badge>
                                    <Badge bg={job.active ? "success" : "secondary"} className="rounded-pill px-3 py-2">
                                        {job.employmentType}
                                    </Badge>
                                </div>
                                
                                <Card.Text className="text-truncate-3 flex-grow-1 text-secondary">
                                    {job.description}
                                </Card.Text>
                                
                            </Card.Body>
                            <Card.Footer className="bg-white border-0 pb-3 pt-0">
                                <div className="d-flex gap-2 mt-auto">
                                    <Button variant="outline-primary" size="sm" className="w-50" onClick={() => navigate(`/edit-job/${job.id}`)}>
                                        <i className="bi bi-pencil me-1"></i>Edit
                                    </Button>
                                    <Button variant="outline-danger" size="sm" className="w-50" onClick={() => deleteJob(job.id)}>
                                        <i className="bi bi-trash me-1"></i>Delete
                                    </Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Simple Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Button variant="outline-secondary" disabled={page === 0} onClick={() => setPage(page - 1)} className="me-2">
                        Previous
                    </Button>
                    <span className="align-self-center">Page {page + 1} of {totalPages}</span>
                    <Button variant="outline-secondary" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="ms-2">
                        Next
                    </Button>
                </div>
            )}
        </Container>
    );
};

export default JobList;
