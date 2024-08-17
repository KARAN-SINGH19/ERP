import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import axios from 'axios'
import Sidebar from '../Components/Sidebar';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const UpdateUser = () => {

    const { id } = useParams()

    const [name, setName] = useState('')
    const [phoneNo, setPhoneNo] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    const [existingName, setExistingName] = useState('')
    const [existingPhoneNo, setExistingPhoneNo] = useState('')
    const [existingEmail, setExistingEmail] = useState('')
    const [existingPass, setExistingPass] = useState('')

    const navigate = useNavigate()

    async function fetchUser() {
        try {
            const response = await axios.get(`http://82.112.236.55:5000/api/v1/getUser/${id}`)
            if (response) {
                console.log(response.data.user)
                setName(response.data.user.name)
                setPhoneNo(response.data.user.phoneNo)
                setEmail(response.data.user.email)

                setExistingName(response.data.user.name)
                setExistingPhoneNo(response.data.user.phoneNo)
                setExistingEmail(response.data.user.email)
                setExistingPass(response.data.user.email)
            }
            else {
                console.log(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])


    const data = {
        name: name !== existingName ? name : existingName,
        phoneNo: phoneNo !== existingPhoneNo ? phoneNo : existingPhoneNo,
        email: email !== existingEmail ? email : existingEmail,
    };

    if (pass) {
        data.password = pass;
    }

    async function updateUser(id) {
        try {
            const request = await axios.put(`http://82.112.236.55:5000/api/v1/updateUser/${id}`, data)
            if (request) {
                navigate("/viewUsers")
            }
            else {
                console.log(request.data.message)
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
                            <h2 style={{ display: "flex", justifyContent: "center" }}>Update User Details</h2>

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
                                    <Form.Control id='password' type='password' placeholder="Password" value={pass} onChange={(e) => { setPass(e.target.value) }} />
                                </FloatingLabel>
                            </Form.Group>

                            <div style={{ display: 'flex', justifyContent: "center" }}>
                                <Button id='btn' style={{ width: "25%", display: "flex", justifyContent: "center" }} onClick={() => { updateUser(id) }} variant="primary" size="lg">Update User</Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default UpdateUser
