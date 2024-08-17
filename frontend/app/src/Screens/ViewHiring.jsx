import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sidebar from '../Components/Sidebar';
import Swal from 'sweetalert2';
import Pagination from 'react-bootstrap/Pagination';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { FaPlus } from 'react-icons/fa';

const ViewHiring = () => {
    const [role, setRole] = useState('')
    const [hirings, setHirings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [columnFilters, setColumnFilters] = useState({
        client: '',
        position: '',
        candidate: '',
        recruiter: '',
        remarks: '',
        comment: '',
        location: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [hiringsPerPage] = useState(50);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');
    const [editingLocationId, setEditingLocationId] = useState(null);
    const [editedLocation, setEditedLocation] = useState('');
    const navigate = useNavigate();

    const fetchHirings = async () => {
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                ...columnFilters,
                search: searchTerm.trim()
            });
            const response = await axios.get(`http://82.112.236.55:5000/api/v1/getHirings?${params}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setHirings(response.data.hirings);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    async function userRole() {
        try {
            const token = localStorage.getItem('token');
            const userRole = await axios.get('http://82.112.236.55:5000/api/v1/userRole', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (userRole) {
                setRole(userRole.data.role);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate("/");
            } else {
                console.error('Internal Server Error');
            }
        }
    }

    const saveLocation = async (id, locationValue) => {
        try {
            const response = await axios.put(`http://82.112.236.55:5000/api/v1/updateLocation/${id}`, { location: locationValue });
            if (response.data.success) {
                Swal.fire({
                    title: "Updated!",
                    text: "Location has been updated.",
                    icon: "success"
                });
                fetchHirings();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Failed to update location. Please try again later.",
                    icon: "error"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Failed to update location. Please try again later.",
                icon: "error"
            });
        }
    };

    const handleLocationSave = async (id) => {
        await saveLocation(id, editedLocation);
        setEditingLocationId(null);
        setEditedLocation('');
    };


    useEffect(() => {
        fetchHirings()
        userRole();
    }, [columnFilters, searchTerm]);

    const deleteHiring = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (confirmDelete.isConfirmed) {
            try {
                const response = await axios.delete(`http://82.112.236.55:5000/api/v1/deleteHiring/${id}`);
                if (response.data.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Hiring has been deleted.",
                        icon: "success"
                    });
                    fetchHirings();
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to delete hiring. Please try again later.",
                        icon: "error"
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Failed to delete hiring. Please try again later.",
                    icon: "error"
                });
            }
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleColumnFilterChange = (columnName, value) => {
        setColumnFilters(prevFilters => ({
            ...prevFilters,
            [columnName]: value
        }));
        setCurrentPage(1);
    };

    const saveRemark = async (id, remarkValue) => {
        try {
            const response = await axios.put(`http://82.112.236.55:5000/api/v1/updateRemark/${id}`, { remarks: remarkValue });
            if (response.data.success) {
                Swal.fire({
                    title: "Updated!",
                    text: "Remark has been updated.",
                    icon: "success"
                });
                fetchHirings();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Failed to update remark. Please try again later.",
                    icon: "error"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Failed to update remark. Please try again later.",
                icon: "error"
            });
        }
    };

    const handleRemarkChange = async (id, event) => {
        const remarkValue = event.target.value;
        await saveRemark(id, remarkValue);
    };

    const saveComment = async (id, commentValue) => {
        try {
            const response = await axios.put(`http://82.112.236.55:5000/api/v1/updateComment/${id}`, { comment: commentValue });
            if (response.data.success) {
                Swal.fire({
                    title: "Updated!",
                    text: "Comment has been updated.",
                    icon: "success"
                });
                fetchHirings();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Failed to update comment. Please try again later.",
                    icon: "error"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Failed to update comment. Please try again later.",
                icon: "error"
            });
        }
    };

    const handleCommentChange = (id, event) => {
        setEditingCommentId(id);
        setEditedComment(event.target.value);
    };

    const handleCommentSave = async (id) => {
        await saveComment(id, editedComment);
        setEditingCommentId(null);
        setEditedComment('');
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const filteredHirings = hirings.filter(hiring => {
        const matchesSearchTerm = Object.values(hiring).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesColumnFilters = Object.keys(columnFilters).every(column => {
            const filterValue = columnFilters[column];
            if (!filterValue) return true;

            const fieldValue = column === 'recruiter' ? hiring.recruiter.name :
                column === 'client' ? hiring.client.company :
                    column === 'position' ? hiring.position.position :
                        column === 'candidate' ? hiring.candidate.candidateName :
                            column === 'location' ? hiring.location : // Add this line
                                hiring[column];

            if (typeof fieldValue === 'string') {
                return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
            } else if (typeof fieldValue === 'number') {
                return fieldValue.toString().toLowerCase().includes(filterValue.toLowerCase());
            }
            return false;
        });

        return matchesSearchTerm && matchesColumnFilters;
    });


    const indexOfLastHiring = currentPage * hiringsPerPage;
    const indexOfFirstHiring = indexOfLastHiring - hiringsPerPage;
    const currentHirings = filteredHirings.slice(indexOfFirstHiring, indexOfLastHiring);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: '1' }}>
                <Container className='mt-3'>
                    <Row className="align-items-center justify-content-between">
                        <Col xs="auto">
                            <h2>
                                Hiring Details
                            </h2>
                        </Col>
                        <Col xs="auto">
                            <Button
                                variant="success"
                                onClick={() => navigate('/addHiring')}
                                style={{ display: 'flex', alignItems: 'center', whiteSpace: "nowrap" }}
                            >
                                <FaPlus />
                                Add Hiring
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div style={{ overflowX: 'auto' }}>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.client || ''}
                                                    onChange={(e) => handleColumnFilterChange('client', e.target.value)}
                                                />
                                                Client
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.position || ''}
                                                    onChange={(e) => handleColumnFilterChange('position', e.target.value)}
                                                />
                                                Position
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.candidate || ''}
                                                    onChange={(e) => handleColumnFilterChange('candidate', e.target.value)}
                                                />
                                                Candidate
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.location || ''}
                                                    onChange={(e) => handleColumnFilterChange('location', e.target.value)}
                                                />
                                                Location
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.recruiter || ''}
                                                    onChange={(e) => handleColumnFilterChange('recruiter', e.target.value)}
                                                />
                                                Recruiter
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.remarks || ''}
                                                    onChange={(e) => handleColumnFilterChange('remarks', e.target.value)}
                                                />
                                                Remarks
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.comment || ''}
                                                    onChange={(e) => handleColumnFilterChange('comment', e.target.value)}
                                                />
                                                Comment
                                            </th>
                                            {role === "admin" ? (<th>Actions</th>) : null}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentHirings.map((hiring, index) => (
                                            <tr key={hiring._id}>
                                                <td>{hiring.client ? hiring.client.company : 'N/A'}</td>
                                                <td>{hiring.position ? hiring.position.position : 'N/A'}</td>
                                                <td>{hiring.candidate ? hiring.candidate.candidateName : 'N/A'}</td>
                                                <td>
                                                    {editingLocationId === hiring._id ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={1}
                                                                value={editedLocation}
                                                                onChange={(e) => setEditedLocation(e.target.value)}
                                                            />
                                                            <div style={{ display: 'flex', marginTop: '5px' }}>
                                                                <Button onClick={() => handleLocationSave(hiring._id)} variant="success" style={{ marginRight: '5px' }}>Save</Button>
                                                                <Button onClick={() => setEditingLocationId(null)} variant="secondary">Cancel</Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <span style={{ flex: 2, color: 'black' }}>{hiring.location}</span>
                                                            <Button onClick={() => {
                                                                setEditingLocationId(hiring._id);
                                                                setEditedLocation(hiring.location);
                                                            }} variant="primary" style={{ marginLeft: '10px' }}>Edit</Button>
                                                        </div>
                                                    )}
                                                </td>

                                                <td>{hiring.recruiter ? hiring.recruiter.name : 'N/A'}</td>
                                                <td>
                                                    <select
                                                        value={hiring.remarks}
                                                        onChange={(e) => handleRemarkChange(hiring._id, e)}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Hired">Hired</option>
                                                        <option value="Rejected">Rejected</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    {editingCommentId === hiring._id ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={2}
                                                                value={editedComment}
                                                                onChange={(e) => handleCommentChange(hiring._id, e)}
                                                            />
                                                            <div style={{ display: 'flex', marginTop: '5px' }}>
                                                                <Button onClick={() => handleCommentSave(hiring._id)} variant="success" style={{ marginRight: '5px' }}>Save</Button>
                                                                <Button onClick={() => setEditingCommentId(null)} variant="secondary">Cancel</Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <span style={{ flex: 2, color: 'black' }}>{hiring.comment}</span>
                                                            <Button onClick={() => {
                                                                setEditingCommentId(hiring._id);
                                                                setEditedComment(hiring.comment);
                                                            }} variant="primary" style={{ marginLeft: '10px' }}>Edit</Button>
                                                        </div>
                                                    )}
                                                </td>
                                                {role === "admin" ? (
                                                    <td style={{ whiteSpace: 'nowrap' }}>
                                                        <Button onClick={() => deleteHiring(hiring._id)} variant="danger" style={{ marginRight: '10px' }}>Delete</Button>
                                                    </td>
                                                ) : null}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <Pagination className="justify-content-center">
                                {[...Array(Math.ceil(filteredHirings.length / hiringsPerPage)).keys()].map(number => (
                                    <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                                        {number + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default ViewHiring;
