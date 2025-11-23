import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Form } from 'react-bootstrap';
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
        <header className="bms-header">
            {/* Main Navigation Bar */}
            <Navbar expand="lg" className="top-navbar">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand className="logo-brand">
                            <span className="logo-movie">Movie</span>
                            <span className="logo-flix">Flix</span>
                        </Navbar.Brand>
                    </LinkContainer>
                    
                    <Form className="search-bar d-none d-lg-flex">
                        <div className="search-wrapper">
                            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <Form.Control 
                                type="search" 
                                placeholder="Search for Movies, Events, Plays, Sports and Activities" 
                                className="search-field"
                            />
                        </div>
                    </Form>

                    <Navbar.Toggle aria-controls="navbar-content" />
                    
                    <Navbar.Collapse id="navbar-content">
                        <Nav className="ms-auto nav-items">
                            <NavDropdown 
                                title={city} 
                                id="location-dropdown" 
                                className="location-select"
                                onSelect={(selectedCity) => setCity(selectedCity)}
                            >
                                {allCities && allCities.map(c => (
                                    <NavDropdown.Item key={c} eventKey={c}>{c}</NavDropdown.Item>
                                ))}
                            </NavDropdown>
                            
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id="profile-dropdown" className="profile-menu">
                                    <LinkContainer to="/my-bookings">
                                        <NavDropdown.Item>My Bookings</NavDropdown.Item>
                                    </LinkContainer>
                                    {userInfo.isAdmin && (
                                        <LinkContainer to="/admin">
                                            <NavDropdown.Item>Admin Panel</NavDropdown.Item>
                                        </LinkContainer>
                                    )}
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link className="signin-button">Sign In</Nav.Link>
                                </LinkContainer>
                            )}
                            
                            <Nav.Link className="hamburger-menu d-none d-lg-block">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            
            {/* Secondary Navigation Bar */}
            <div className="bottom-navbar">
                <Container>
                    <div className="nav-sections">
                        <Nav className="left-nav">
                            <LinkContainer to="/">
                                <Nav.Link className="nav-item">Movies</Nav.Link>
                            </LinkContainer>
                            <Nav.Link className="nav-item">Stream</Nav.Link>
                            <Nav.Link className="nav-item">Events</Nav.Link>
                            <Nav.Link className="nav-item">Plays</Nav.Link>
                            <Nav.Link className="nav-item">Sports</Nav.Link>
                            <Nav.Link className="nav-item">Activities</Nav.Link>
                        </Nav>
                        <Nav className="right-nav">
                            <Nav.Link className="nav-item">ListYourShow</Nav.Link>
                            <Nav.Link className="nav-item">Corporates</Nav.Link>
                            <Nav.Link className="nav-item">Offers</Nav.Link>
                            <Nav.Link className="nav-item">Gift Cards</Nav.Link>
                        </Nav>
                    </div>
                </Container>
            </div>
        </header>
    );
};

export default Header;
