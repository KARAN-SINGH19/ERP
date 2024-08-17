import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const UpdateClient = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [date, setDate] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactName2, setContactName2] = useState('');
    const [contactEmail2, setContactEmail2] = useState('');
    const [contactPhone2, setContactPhone2] = useState('');

    const [existingClient, setExistingClient] = useState({
        date: '',
        company: '',
        location: '',
        address: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        contactName2: '',
        contactEmail2: '',
        contactPhone2: ''
    });

    async function fetchClient() {
        try {
            const response = await axios.get(`http://localhost:6000/api/v1/getClient/${id}`);
            if (response.data.success) {
                const { date, company, location, address, contactName, contactEmail, contactPhone, contactName2, contactEmail2, contactPhone2 } = response.data.client;
                console.log(response.data)
                setDate(date);
                setCompany(company);
                setLocation(location);
                setAddress(address);
                setContactName(contactName);
                setContactEmail(contactEmail);
                setContactPhone(contactPhone);
                setContactName2(contactName2);
                setContactEmail2(contactEmail2);
                setContactPhone2(contactPhone2);

                setExistingClient({
                    date,
                    company,
                    location,
                    address,
                    contactName,
                    contactEmail,
                    contactPhone,
                    contactName2,
                    contactEmail2,
                    contactPhone2
                });
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchClient();
    }, []);

    async function updateClient() {
        try {
            const response = await axios.put(`http://localhost:6000/api/v1/updateClient/${id}`, {
                date,
                company,
                location,
                address,
                contactName,
                contactEmail,
                contactPhone,
                contactName2,
                contactEmail2,
                contactPhone2
            });
            if (response.data.success) {
                navigate("/viewClients"); 
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Sidebar />
            <Container className='mt-3'>
                <Row>
                    <Col>
                        <Card className="p-4 mx-auto" style={{ width: "60%", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
                            <h2 style={{ display: "flex", justifyContent: "center" }}>Update Client Details</h2>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Date">
                                    <Form.Control id='date' type='date' placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Company">
                                    <Form.Control id='company' type='text' placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Location">
                                    <Form.Control id='location' type='text' placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Address">
                                    <Form.Control id='address' type='text' placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Contact Name">
                                    <Form.Control id='contactName' type='text' placeholder="Contact Name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Contact Email">
                                    <Form.Control id='contactEmail' type='text' placeholder="Contact Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Contact Phone">
                                    <Form.Control id='contactPhone' type='number' placeholder="Contact Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Contact Name 2">
                                    <Form.Control id='contactName2' type='text' placeholder="Contact Name 2" value={contactName2} onChange={(e) => setContactName2(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Contact Email 2">
                                    <Form.Control id='contactEmail2' type='text' placeholder="Contact Email 2" value={contactEmail2} onChange={(e) => setContactEmail2(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Contact Phone 2">
                                    <Form.Control id='contactPhone2' type='number' placeholder="Contact Phone 2" value={contactPhone2} onChange={(e) => setContactPhone2(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <div style={{ display: 'flex', justifyContent: "center" }}>
                                <Button id='btn' style={{ width: "25%", display: "flex", justifyContent: "center" }} onClick={updateClient} variant="primary" size="lg">Update Client</Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default UpdateClient;
