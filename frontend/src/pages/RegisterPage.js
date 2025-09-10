import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import api from '../api';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const userInfo = localStorage.getItem('userInfo');

    useEffect(() => {
        if (userInfo) navigate('/');
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            setMessage(null);
            try {
                const { data } = await api.post('/api/auth/register', { name, email, password });
                localStorage.setItem('userInfo', JSON.stringify(data));
                navigate('/');
            } catch (error) {
                setMessage(error.response?.data?.message || 'An error occurred');
            }
        }
    };

    return (
        <Row className="justify-content-md-center">
            <Col xs={12} md={6}>
                <h1>Sign Up</h1>
                {message && <div className="alert alert-danger">{message}</div>}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className="my-2"><Form.Label>Name</Form.Label><Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}></Form.Control></Form.Group>
                    <Form.Group controlId="email" className="my-2"><Form.Label>Email Address</Form.Label><Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control></Form.Group>
                    <Form.Group controlId="password" className="my-2"><Form.Label>Password</Form.Label><Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control></Form.Group>
                    <Form.Group controlId="confirmPassword" className="my-2"><Form.Label>Confirm Password</Form.Label><Form.Control type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control></Form.Group>
                    <Button type="submit" variant="primary" className="mt-3">Register</Button>
                </Form>
                <Row className="py-3">
                    <Col>Have an Account? <Link to="/login">Login</Link></Col>
                </Row>
            </Col>
        </Row>
    );
};

export default RegisterPage;