import React from 'react';
import { Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './FilterBar.css';

// It now receives 'categories' as a prop
const FilterBar = ({ setCategory, categories }) => {
    return (
        <div className="filter-bar">
            <Container className="d-flex justify-content-between">
                <Nav>
                    <LinkContainer to="/">
                        <Nav.Link>Home</Nav.Link>
                    </LinkContainer>
                </Nav>
                <Nav>
                    <NavDropdown title="Category" id="category-filter-dropdown" onSelect={(category) => setCategory(category)}>
                        <NavDropdown.Item eventKey="All">All Categories</NavDropdown.Item>
                        {/* The dropdown is now built dynamically */}
                        {categories && categories.map(cat => (
                            <NavDropdown.Item key={cat} eventKey={cat}>{cat}</NavDropdown.Item>
                        ))}
                    </NavDropdown>
                </Nav>
            </Container>
        </div>
    );
};

export default FilterBar;