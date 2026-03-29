import { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import JobService from '../services/JobService';

const JobForm = () => {
    const [job, setJob] = useState({
        title: '',
        description: '',
        department: '',
        location: '',
        employmentType: 'FULL_TIME',
        active: true
    });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            JobService.getJobById(id).then((res) => {
                setJob({
                    title: res.data.title,
                    description: res.data.description,
                    department: res.data.department,
                    location: res.data.location,
                    employmentType: res.data.employmentType,
                    active: res.data.active
                });
            }).catch(err => {
                console.error(err);
                setGlobalError("Failed to fetch job details.");
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setJob({ ...job, [e.target.name]: value });
        // clear errors on type
        if(errors[e.target.name]) {
             setErrors({...errors, [e.target.name]: null});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setGlobalError('');
        
        const payload = { ...job };

        if (id) {
            JobService.updateJob(id, payload).then(() => {
                navigate('/jobs');
            }).catch(handleError);
        } else {
            JobService.createJob(payload).then(() => {
                navigate('/jobs');
            }).catch(handleError);
        }
    };

    const handleError = (err) => {
        if (err.response && err.response.data && err.response.data.errors) {
            setErrors(err.response.data.errors);
        } else {
            setGlobalError("Failed to save. Ensure backend is running.");
        }
    };

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg border-0 rounded-4">
                        <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 text-center">
                            <h3 className="fw-bold text-primary">
                                {id ? "Edit Job Posting" : "Post a New Job"}
                            </h3>
                            <p className="text-secondary small">Fill out the form below to list a new opening</p>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {globalError && <Alert variant="danger">{globalError}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Job Title</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="e.g. Senior Software Engineer"
                                        name="title" 
                                        value={job.title} 
                                        onChange={handleChange} 
                                        isInvalid={!!errors.title}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                                </Form.Group>

                                <Row>
                                    <Form.Group as={Col} sm={6} className="mb-3">
                                        <Form.Label className="fw-semibold">Department</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="e.g. Engineering"
                                            name="department" 
                                            value={job.department} 
                                            onChange={handleChange} 
                                            isInvalid={!!errors.department}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.department}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} sm={6} className="mb-3">
                                        <Form.Label className="fw-semibold">Location</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="e.g. Remote / New York"
                                            name="location" 
                                            value={job.location} 
                                            onChange={handleChange} 
                                            isInvalid={!!errors.location}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Employment Type</Form.Label>
                                    <Form.Select 
                                        name="employmentType" 
                                        value={job.employmentType} 
                                        onChange={handleChange}
                                        isInvalid={!!errors.employmentType}
                                    >
                                        <option value="FULL_TIME">Full Time</option>
                                        <option value="PART_TIME">Part Time</option>
                                        <option value="CONTRACT">Contract</option>
                                        <option value="INTERNSHIP">Internship</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{errors.employmentType}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Job Description</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={5} 
                                        placeholder="Describe the responsibilities and requirements..."
                                        name="description" 
                                        value={job.description} 
                                        onChange={handleChange} 
                                        isInvalid={!!errors.description}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Check 
                                        type="switch"
                                        id="active-switch"
                                        label="Listing is Active"
                                        name="active"
                                        checked={job.active}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button variant="primary" size="lg" type="submit" className="rounded-pill">
                                        {id ? "Update Job Posting" : "Publish Job Posting"}
                                    </Button>
                                    <Button variant="light" size="lg" className="rounded-pill text-muted" onClick={() => navigate('/jobs')}>
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default JobForm;
