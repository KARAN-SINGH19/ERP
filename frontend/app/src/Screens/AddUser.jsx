import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const [toggleAlert, setToggleAlert] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const data = {
        name: name,
        phoneNo: phoneNo,
        email: email,
        password: pass
    };

    async function addUser() {
        try {
            const token = localStorage.getItem('token');
            const request = await axios.post("http://localhost:6000/api/v1/addUser", data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (request.data.success) {
                setName('');
                setPhoneNo('');
                setEmail('');
                setPass('');
                setToggleAlert(true);
                setSuccessMsg("User added successfully!!");
                setTimeout(() => {
                    navigate("/viewUsers")
                }, 1000);
            } else {
                setToggleAlert(false);
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                navigate("/"); // Redirect to login page on unauthorized access
            } else {
                console.error('Internal Server Error');
            }
        }
    }

    return (
        <div>
            <Sidebar />
            <Container className='mt-3'>
                <Row>
                    <Col>
                        <Card className="p-4 mx-auto" style={{ width: "60%", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
                            <h2 style={{ display: "flex", justifyContent: "center" }}>Add User Details</h2>
                            {toggleAlert && (
                                <ShowAlert variant='success' message={successMsg} />
                            )}
                            <Form.Group className="mb-3">
                                <FloatingLabel label="Name">
                                    <Form.Control id='name' type='text' placeholder="Name" value={name} onChange={(e) => { setName(e.target.value) }} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Contact Number">
                                    <Form.Control id='phoneNo' type='number' placeholder="Contact Number" value={phoneNo} onChange={(e) => { setPhoneNo(e.target.value) }} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Email">
                                    <Form.Control id='Email' type='text' placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Password">
                                    <Form.Control id='Password' type="password" placeholder="Password" value={pass} onChange={(e) => setPass((e.target.value))} />
                                </FloatingLabel>
                            </Form.Group>

                            <div style={{ display: 'flex', justifyContent: "center" }}>
                                <Button id='btn' style={{ width: "25%", display: "flex", justifyContent: "center" }} onClick={addUser} variant="primary" size="lg">Add User</Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AddUser;
