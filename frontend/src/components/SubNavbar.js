import React from 'react';
import { Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './SubNavbar.css';

// It now receives city and setCity as props
const SubNavbar = ({ city, setCity }) => {
    return (
        <nav className="sub-navbar">
            <Container className="d-flex justify-content-between align-items-center">
                <Nav>
                    <LinkContainer to="/"><Nav.Link>Home</Nav.Link></LinkContainer>
                    <LinkContainer to="/contact"><Nav.Link>Contact</Nav.Link></LinkContainer>
                </Nav>
                <Nav>
                    <NavDropdown title={`📍 ${city}`} id="city-select-dropdown" onSelect={(selectedCity) => setCity(selectedCity)}>
                        <NavDropdown.Item eventKey="Mumbai">Mumbai</NavDropdown.Item>
                        <NavDropdown.Item eventKey="Delhi">Delhi</NavDropdown.Item>
                        <NavDropdown.Item eventKey="Ludhiana">Ludhiana</NavDropdown.Item>
                        <NavDropdown.Item eventKey="Bengaluru">Bengaluru</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </nav>
    );
};

export default SubNavbar;