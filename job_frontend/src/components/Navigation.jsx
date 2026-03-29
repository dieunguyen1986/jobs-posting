import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <Navbar expand="lg" className="py-3 sticky-top">
            <Container>
                <Navbar.Brand as={NavLink} to="/">
                    <i className="bi bi-briefcase-fill me-2"></i>
                    Job Board
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/jobs">Find a Job</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link as={NavLink} to="/add-job" className="btn btn-brand text-white px-4 py-2 rounded-pill ms-lg-3">
                            <i className="bi bi-plus-lg me-2"></i>Post a Job
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
