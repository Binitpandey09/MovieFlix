import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import api from '../api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const userInfo = localStorage.getItem('userInfo');

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (error) {
            alert('Invalid email or password');
        }
    };

    return (
        <Row className="justify-content-md-center">
            <Col xs={12} md={6}>
                <h1>Sign In</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="email" className="my-2">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="password" className="my-2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="primary" className="mt-3">Sign In</Button>
                </Form>
                <Row className="py-3">
                    <Col>New Customer? <Link to="/register">Register</Link></Col>
                </Row>
            </Col>
        </Row>
    );
};

export default LoginPage;