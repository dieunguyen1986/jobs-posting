import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
            <Container>
                <Navbar.Brand as={NavLink} to="/">
                    <i className="bi bi-briefcase-fill me-2"></i>
                    RecruitEase
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/jobs">Job Listings</Nav.Link>
                        <Nav.Link as={NavLink} to="/add-job">Post a Job</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
