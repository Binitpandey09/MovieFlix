import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Form, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ city, setCity, allCities }) => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <header>
            <Navbar bg="light" variant="light" expand="lg" collapseOnSelect className="custom-header">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>MovieFlix</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Form className="d-flex flex-grow-1 mx-lg-5 my-2 my-lg-0">
                            <Form.Control type="search" placeholder="Search for Movies..." className="me-2" aria-label="Search" />
                            <Button variant="outline-secondary">Search</Button>
                        </Form>
                        <Nav className="ms-auto align-items-center">
                            <NavDropdown title={`📍 ${city}`} id="city-select-dropdown" onSelect={(selectedCity) => setCity(selectedCity)} className="me-lg-3 city-dropdown">
                                {allCities && allCities.map(c => (
                                    <NavDropdown.Item key={c} eventKey={c}>{c}</NavDropdown.Item>
                                ))}
                            </NavDropdown>
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id="username-dropdown">
                                    <LinkContainer to="/my-bookings"><NavDropdown.Item>My Bookings</NavDropdown.Item></LinkContainer>
                                    {userInfo.isAdmin && (<LinkContainer to="/admin"><NavDropdown.Item>Admin Panel</NavDropdown.Item></LinkContainer>)}
                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login" className="signin-button"><Nav.Link><i className="fas fa-user"></i> Sign In</Nav.Link></LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;