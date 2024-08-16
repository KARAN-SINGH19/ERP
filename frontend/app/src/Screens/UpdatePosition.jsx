import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import ShowAlert from '../Components/ShowAlert';

const UpdatePosition = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [client, setClient] = useState('');
    const [positionName, setPositionName] = useState('');
    const [salary, setSalary] = useState('');
    const [keyCriteria, setKeyCriteria] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [remarks, setRemarks] = useState('');
    const [toggleAlert, setToggleAlert] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchPosition();
        getClients();
    }, []);

    async function fetchPosition() {
        try {
            const response = await axios.get(`http://localhost:4000/api/v1/getPosition/${id}`);
            const position = response.data.position;
            setPositionName(position.positionName);
            setSalary(position.salary);
            setKeyCriteria(position.keyCriteria);
            setJobDescription(position.jobDescription);
            setRemarks(position.remarks);
            setClient(position.client); // Set client from fetched position data
        } catch (error) {
            console.error('Error fetching position:', error);
            setErrorMsg('Failed to fetch position details. Please try again.');
        }
    }

    async function getClients() {
        try {
            const response = await axios.get('http://localhost:4000/api/v1/getClientNames');
            setClients(response.data.clientNames);
        } catch (error) {
            console.error('Error fetching clients:', error);
            setErrorMsg('Failed to fetch clients. Please try again.');
        }
    }

    const updatePosition = async () => {
        const data = {
            positionName: positionName,
            salary: salary,
            keyCriteria: keyCriteria,
            jobDescription: jobDescription,
            remarks: remarks
        };

        // Add client to data if it's not an empty string (indicating it should be updated)
        if (client !== '') {
            data.client = client;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:4000/api/v1/updatePosition/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (response.data.success) {
                setToggleAlert(true);
                setSuccessMsg('Position updated successfully!');
                navigate('/viewPositions');
            } else {
                setErrorMsg('Failed to update position. Please try again.');
            }
        } catch (error) {
            console.error('Error updating position:', error);
            setErrorMsg('Failed to update position. Please try again.');
        }
    };

    return (
        <div>
            <Sidebar />
            <Container className='mt-3'>
                <Row>
                    <Col>
                        <Card className='p-4 mx-auto' style={{ width: '60%', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                            <h2 style={{ display: 'flex', justifyContent: 'center' }}>Update Position Details</h2>
                            {toggleAlert && <ShowAlert variant='success' message={successMsg} />}
                            {errorMsg && <ShowAlert variant='danger' message={errorMsg} />}
                            <Form>
                                <Form.Select className='mb-3' aria-label='Client' value={client} onChange={(e) => setClient(e.target.value)}>
                                    <option>Select Client</option>
                                    {clients.map(client => (
                                        <option key={client._id} value={client._id}>{client.company}</option>
                                    ))}
                                </Form.Select>

                                <Form.Group className='mb-3'>
                                    <FloatingLabel label='Position Name'>
                                        <Form.Control type='text' placeholder='Position Name' value={positionName} onChange={(e) => setPositionName(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className='mb-3'>
                                    <FloatingLabel label='Salary'>
                                        <Form.Control type='text' placeholder='Salary' value={salary} onChange={(e) => setSalary(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className='mb-3'>
                                    <FloatingLabel label='Key Criteria'>
                                        <Form.Control type='text' placeholder='Key Criteria' value={keyCriteria} onChange={(e) => setKeyCriteria(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>

                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button style={{ width: '25%' }} onClick={updatePosition} variant='primary' size='lg'>
                                        Update Position
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default UpdatePosition;
