import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Sidebar from '../Components/Sidebar'

const ViewUsers = () => {

    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    async function fetchUsers() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:5000/api/v1/getUsers", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response) {
                setUsers(response.data.user)
            }
            else {
                console.log(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    async function deleteUser(id) {
        const alert = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        })
        if (alert.isConfirmed) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/v1/deleteUser/${id}`)
                if (response) {
                    Swal.fire({
                        title: "Cancelled!",
                        text: "User has been cancelled.",
                        icon: "success"
                    });
                    fetchUsers()
                }
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Failed to delete user. Please try again later.",
                    icon: "error"
                });
            }
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: '1' }}>
                <Container className='mt-3'>
                    <h2 style={{ display: "flex", justifyContent: "center" }}>Recruiter Details</h2>
                    <Row>
                        <Col>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>SNO</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Contact Number</th>
                                        <th style={{ display: "flex", justifyContent: "center" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user._id}>
                                            <td>{index + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phoneNo}</td>
                                            <td style={{ whiteSpace: 'nowrap', display: "flex", justifyContent: "center" }}>
                                                <Button onClick={() => { navigate(`/updateUser/${user._id}`) }} variant="success">Update</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div >
    )
}

export default ViewUsers
