import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import ShowAlert from '../Components/ShowAlert';
import Sidebar from '../Components/Sidebar';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const AddPositions = () => {

    const navigate = useNavigate()

    const [candidates, setCandidates] = useState([]);
    const [clients, setClients] = useState([]);
    const [recruiter, setRecruiter] = useState('');
    const [client, setClient] = useState('');
    const [positionName, setPositionName] = useState('');
    const [salary, setSalary] = useState('');
    const [location, setLocation] = useState('');
    const [keyCriteria, setKeyCriteria] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [candidatesProposed, setCandidatesProposed] = useState('');
    const [remarks, setRemarks] = useState('');
    const [newPositionId, setNewPositionId] = useState('');

    const [toggleAlert, setToggleAlert] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const data = {
        client: client,
        position: positionName,
        salary: salary,
        keyCriteria: keyCriteria,
        jobDescription: jobDescription,
        location: location
    };

    // Fetch candidates function
    async function getCandidates() {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/getCandidateNames');
            setCandidates(response.data.candidateNames);
        } catch (error) {
            console.error('Error fetching candidates:', error);
            setErrorMsg('Failed to fetch candidates. Please try again.');
        }
    }

    // Fetch clients function
    async function getClients() {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/getClientNames');
            setClients(response.data.clientNames.map(client => ({ value: client._id, label: client.company })));
        } catch (error) {
            console.error('Error fetching clients:', error);
            setErrorMsg('Failed to fetch clients. Please try again.');
        }
    }

    // Fetch data on component mount
    useEffect(() => {
        getCandidates();
        getClients();
    }, []);

    // Function to handle adding positions
    async function addPosition() {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post('http://localhost:5000/api/v1/addPosition', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setToggleAlert(true);
                setSuccessMsg('Position added successfully!');
                resetForm();
                setTimeout(() => {
                    navigate("/viewPositions")
                }, 1000);
            } else {
                setErrorMsg('Failed to add position. Please try again.');
            }
        } catch (error) {
            console.error('Error adding position:', error);
            setErrorMsg('Failed to add position. Please try again.');
        }
    }

    // Reset form fields
    function resetForm() {
        setRecruiter('');
        setClient('');
        setPositionName('');
        setSalary('');
        setKeyCriteria('');
        setJobDescription('');
    }

    return (
        <div>
            <Sidebar />
            <Container className='mt-3'>
                <Row>
                    <Col>
                        <Card className='p-4 mx-auto' style={{ width: '60%', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                            <h2 style={{ display: 'flex', justifyContent: 'center' }}>Add Position Details</h2>
                            {toggleAlert && <ShowAlert variant='success' message={successMsg} />}
                            {errorMsg && <ShowAlert variant='danger' message={errorMsg} />}

                            <Form.Group className='mb-3'>
                                <Select
                                    options={clients}
                                    onChange={(selectedOption) => setClient(selectedOption.value)}
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

                            <Form.Group className='mb-3'>
                                <FloatingLabel label='Position Name'>
                                    <Form.Control id='positionName' type='text' placeholder='Position Name' value={positionName} onChange={(e) => setPositionName(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className='mb-3'>
                                <FloatingLabel label='Salary'>
                                    <Form.Control id='salary' type='text' placeholder='Salary' value={salary} onChange={(e) => setSalary(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className='mb-3'>
                                <FloatingLabel label='Location'>
                                    <Form.Control id='location' type='text' placeholder='Location' value={location} onChange={(e) => setLocation(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className='mb-3'>
                                <FloatingLabel label='Key Criteria'>
                                    <Form.Control id='keyCriteria' type='text' placeholder='Key Criteria' value={keyCriteria} onChange={(e) => setKeyCriteria(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button id='btn' style={{ width: '25%', display: 'flex', justifyContent: 'center' }} onClick={addPosition} variant='primary' size='lg'>Add Position</Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AddPositions;
