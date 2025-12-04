import React, { useState } from 'react'; // 1. Import useState
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ContactFormModal from './ContactFormModal'; // 2. Import the modal component
import './Footer.css';

const Footer = () => {
    // 3. Add state to manage the modal's visibility
    const [showContactModal, setShowContactModal] = useState(false);

    const handleShow = () => setShowContactModal(true);
    const handleClose = () => setShowContactModal(false);

    return (
        <>
            <footer className="footer-section">
                <Container>
                    <Row>
                        <Col lg={4} md={6} sm={12} className="footer-col">
                            <h4 className="footer-title">MovieFlix</h4>
                            <p>
                                Your one-stop destination for booking movie tickets. Find showtimes, watch trailers, and book your seats for the latest movies.
                            </p>
                        </Col>
                        <Col lg={2} md={6} sm={12} className="footer-col">
                            <h4 className="footer-title">Quick Links</h4>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/">Movies</Link></li>
                                {/* 4. Change this to a button-like link to open the modal */}
                                <li><a href="#!" onClick={handleShow} style={{cursor: 'pointer'}}>Contact Us</a></li>
                                <li><Link to="/my-bookings">My Bookings</Link></li>
                            </ul>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="footer-col">
                            <h4 className="footer-title">Contact Info</h4>
                            <p><i className="fas fa-map-marker-alt"></i> Phagwara, Punjab, India</p>
                            <p><i className="fas fa-envelope"></i> vinitpandey858@gmail.com</p>
                            <p><i className="fas fa-phone"></i> +91 950 744 2952</p>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="footer-col">
                            <h4 className="footer-title">Follow Us</h4>
                            <div className="social-links">
                                <a href="https://x.com/Binitkumarpan17" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                                <a href="https://www.instagram.com/binitpandey07/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                                <a href="https://www.linkedin.com/in/binit-pandey/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <div className="footer-bottom">
                    <Container>
                        <Row>
                            <Col><p className="text-center mb-0">&copy; {new Date().getFullYear()} MovieFlix. All Rights Reserved.</p></Col>
                        </Row>
                    </Container>
                </div>
            </footer>

            {/* 5. Render the modal component and pass props */}
            <ContactFormModal show={showContactModal} handleClose={handleClose} />
        </>
    );
};

export default Footer;