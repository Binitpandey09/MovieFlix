import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import './Header.css';

const Header = ({ city, setCity, allCities }) => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const [keyword, setKeyword] = React.useState('');

    const searchHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/movies?search=${keyword}`);
        } else {
            navigate('/movies');
        }
    };

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const queryCity = searchParams.get('city');
    const cityMatch = matchPath("/city/:cityName", location.pathname);

    // Order: 1. /city/:name, 2. ?city=Name, 3. Default
    const isHome = location.pathname === '/';
    const currentCity = isHome ? "Select City" : ((cityMatch ? cityMatch.params.cityName : null) || queryCity || "Select City");

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

                    <Form className="search-bar d-none d-lg-flex" onSubmit={searchHandler}>
                        <div className="search-wrapper">
                            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <Form.Control
                                type="search"
                                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                                className="search-field"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                    </Form>

                    <Navbar.Toggle aria-controls="navbar-content" />

                    <Navbar.Collapse id="navbar-content">
                        <Nav className="ms-auto nav-items">


                            {/* City Dropdown */}
                            <NavDropdown title={currentCity} id="city-dropdown" className="location-select me-3">
                                <LinkContainer to="/city/Mumbai"><NavDropdown.Item>Mumbai</NavDropdown.Item></LinkContainer>
                                <LinkContainer to="/city/Delhi-NCR"><NavDropdown.Item>Delhi-NCR</NavDropdown.Item></LinkContainer>
                                <LinkContainer to="/city/Bengaluru"><NavDropdown.Item>Bengaluru</NavDropdown.Item></LinkContainer>
                                <LinkContainer to="/city/Hyderabad"><NavDropdown.Item>Hyderabad</NavDropdown.Item></LinkContainer>
                                <LinkContainer to="/city/Chennai"><NavDropdown.Item>Chennai</NavDropdown.Item></LinkContainer>
                            </NavDropdown>

                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id="profile-dropdown" className="profile-menu">
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
                                    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
