import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Sidebar from '../Components/Sidebar';
import Container from 'react-bootstrap/Container';
import ShowAlert from '../Components/ShowAlert';
import Select from 'react-select';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useNavigate } from 'react-router-dom';

const AddHiring = () => {
    const navigate = useNavigate()
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [comment, setComment] = useState('');
    const [location, setLocation] = useState('')

    const [toggleAlert, setToggleAlert] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    // Fetch clients from backend
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('https://erp-backend-ten.vercel.app/getClientNames');
                if (response.data.success) {
                    setClients(response.data.clientNames.map(client => ({ value: client._id, label: client.company })));
                } else {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
    }, []);

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                if (selectedClient) {
                    const response = await axios.get(`https://erp-backend-ten.vercel.app/fetchPositions/${selectedClient}`);
                    if (response.data.success) {
                        setPositions(response.data.positions.map(position => ({ value: position._id, label: position.position })));
                    } else {
                        console.log(response.data.message);
                    }
                } else {
                    setPositions([]);
                }
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };

        fetchPositions();
    }, [selectedClient]);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axios.get('https://erp-backend-ten.vercel.app/getCandidateNameOrg');
                if (response.data.success) {
                    setCandidates(response.data.candidate.map(candidate => ({ value: candidate._id, label: `${candidate.candidateName} || ${candidate.company}` })));
                } else {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching candidates:', error);
            }
        };

        fetchCandidates();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const data = {
                client: selectedClient,
                position: selectedPosition,
                candidate: selectedCandidate,
                location: location,
                remarks: remarks,
                comment: comment
            };

            console.log('Submitting Data:', data);

            const response = await axios.post('https://erp-backend-ten.vercel.app/addHiring', data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                console.log('Hiring record added successfully');
                setSelectedClient('');
                setSelectedPosition('');
                setSelectedCandidate('');
                setRemarks('');
                setLocation('');
                setToggleAlert(true);
                setSuccessMsg("Hiring details added successfully!!");
                setTimeout(() => {
                    navigate("/viewHiring")
                }, 1000);
            } else {
                console.error('Error adding hiring record:', response.data.message);
                setToggleAlert(false);
            }
        } catch (error) {
            console.error('Error adding hiring record:', error);
        }
    };

    return (
        <div>
            <Sidebar />
            <Container className='mt-3'>
                <Row>
                    <Col>
                        <Card className="p-4 mx-auto" style={{ width: "60%", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
                            <h2 style={{ display: "flex", justifyContent: "center" }}>Add Hiring Details</h2>
                            {
                                toggleAlert && (
                                    <ShowAlert variant='success' message={successMsg} />
                                )
                            }
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="clientSelect" className='mb-3'>
                                    <Form.Label>Select Client</Form.Label>
                                    <Select
                                        options={clients}
                                        onChange={(selectedOption) => setSelectedClient(selectedOption.value)}
                                        placeholder="Select Client"
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '58px',
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 9999,
                                            }),
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group controlId="positionSelect" className='mb-3'>
                                    <Form.Label>Select Position</Form.Label>
                                    <Select
                                        options={positions}
                                        onChange={(selectedOption) => setSelectedPosition(selectedOption.value)}
                                        placeholder="Select Position"
                                        isDisabled={!selectedClient}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '58px',
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 9999,
                                            }),
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group controlId="candidateSelect" className='mb-3'>
                                    <Form.Label>Select Candidate</Form.Label>
                                    <Select
                                        options={candidates}
                                        onChange={(selectedOption) => setSelectedCandidate(selectedOption.value)}
                                        placeholder="Select Candidate"
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '58px',
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 9999,
                                            }),
                                        }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Location">
                                        <Form.Control id='location' type='text' placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                                    </FloatingLabel>
                                </Form.Group>
                                <div style={{ display: 'flex', justifyContent: "center" }}>
                                    <Button variant="primary" type="submit">
                                        Add Hiring
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

export default AddHiring;
