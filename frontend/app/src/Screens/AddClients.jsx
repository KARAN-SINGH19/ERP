import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import axios from 'axios'
import ShowAlert from '../Components/ShowAlert';
import Sidebar from '../Components/Sidebar';
import { useNavigate } from 'react-router-dom';

const AddClients = () => {
    const navigate = useNavigate()
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


    const [toggleAlert, setToggleAlert] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    const data = {
        date: date,
        company: company,
        location: location,
        address: address,
        contactName: contactName,
        contactEmail: contactEmail,
        contactPhone: contactPhone,
        contactName2: contactName2,
        contactEmail2: contactEmail2,
        contactPhone2: contactPhone2,
    }

    async function AddClients() {
        try {
            const token = localStorage.getItem('token');
            const request = await axios.post("http://82.112.236.55:5000/api/v1/addClient", data)
            if (request) {
                setDate('')
                setCompany('')
                setLocation('')
                setAddress('')
                setContactName('')
                setContactEmail('')
                setContactPhone('')
                setContactName2('')
                setContactEmail2('')
                setContactPhone2('')
                setToggleAlert(true)
                setSuccessMsg("Client added successfully!!")
                setTimeout(() => {
                    navigate("/viewClients")
                }, 1000);
            }
            else {
                setToggleAlert(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Sidebar />
            <Container className='mt-3'>
                <Row>
                    <Col>
                        <Card className="p-4 mx-auto" style={{ width: "60%", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
                            <h2 style={{ display: "flex", justifyContent: "center" }}>Add Client Details</h2>
                            {
                                toggleAlert === true ? (
                                    <ShowAlert variant='success' message={successMsg} />
                                ) : null
                            }

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
                                    <Form.Control id='contactEmail' type='email' placeholder="Contact Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Contact Phone">
                                    <Form.Control id='contactPhone' type='tel' placeholder="Contact Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Second Contact Name">
                                    <Form.Control id='contactName2' type='text' placeholder="Second Contact Name" value={contactName2} onChange={(e) => setContactName2(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Second Contact Email">
                                    <Form.Control id='contactEmail2' type='email' placeholder="Second Contact Email" value={contactEmail2} onChange={(e) => setContactEmail2(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Second Contact Phone">
                                    <Form.Control id='contactPhone2' type='tel' placeholder="Second Contact Phone" value={contactPhone2} onChange={(e) => setContactPhone2(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>

                            <div style={{ display: 'flex', justifyContent: "center" }}>
                                <Button id='btn' style={{ width: "25%", display: "flex", justifyContent: "center" }} onClick={AddClients} variant="primary" size="lg">Add Client</Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default AddClients
