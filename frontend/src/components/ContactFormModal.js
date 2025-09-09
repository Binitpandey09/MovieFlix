import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../api';

const ContactFormModal = ({ show, handleClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [issue, setIssue] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/api/contact', { name, email, issue });
            setMessage(data.message);
            setName('');
            setEmail('');
            setIssue('');
            // Optional: close modal after a delay
            setTimeout(() => {
                handleClose();
                setMessage('');
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Contact Us</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="contactFormName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="contactFormEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="contactFormIssue">
                        <Form.Label>Issue / Message</Form.Label>
                        <Form.Control as="textarea" rows={3} value={issue} onChange={(e) => setIssue(e.target.value)} required />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ContactFormModal;