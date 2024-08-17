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
import { FaPlus } from 'react-icons/fa';

const ViewPositions = () => {
    const [role, setRole] = useState('')
    const [positions, setPositions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [columnFilters, setColumnFilters] = useState({
        serialNo: '',
        recruiter: '',
        position: '',
        location: '',
        salary: '',
        keyCriteria: '',
        jobDescription: '',
        candidatesProposed: '',
        status: ''
    });
    const [positionFilter, setPositionFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [positionsPerPage] = useState(50);
    const navigate = useNavigate();

    async function fetchPositions() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://82.112.236.55:5000/api/v1/getPositions", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setPositions(response.data.positions);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

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

    useEffect(() => {
        fetchPositions()
        userRole();
    }, []);

    const deletePosition = async (id) => {
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
                const response = await axios.delete(`http://82.112.236.55:5000/api/v1/deletePosition/${id}`);
                if (response.data.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Position has been deleted.",
                        icon: "success"
                    });
                    fetchPositions();
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to delete position. Please try again later.",
                        icon: "error"
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Failed to delete position. Please try again later.",
                    icon: "error"
                });
            }
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleSearchClick = async () => {
        try {
            const response = await axios.get('http://82.112.236.55:5000/api/v1/searchPositions', {
                params: {
                    searchTerm: searchTerm,
                    "recruiter.name": columnFilters.recruiter,
                    "candidatesProposed.candidateName": columnFilters.candidatesProposed,
                    serialNo: columnFilters.serialNo,
                    position: positionFilter,
                    location: columnFilters.location
                }
            });

            if (response.data.success) {
                setPositions(response.data.positions);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log('Error searching positions:', error);
        }
    };

    const handleColumnFilterChange = (columnName, value) => {
        setColumnFilters(prevFilters => ({
            ...prevFilters,
            [columnName]: value
        }));
        setCurrentPage(1); // Reset to the first page when a filter changes
    };

    const handleStatusChange = async (id, e) => {
        const newStatus = e.target.value;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://82.112.236.55:5000/api/v1/updateStatus/${id}`, { status: newStatus }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                Swal.fire({
                    title: "Updated!",
                    text: "Status has been updated.",
                    icon: "success"
                });
                fetchPositions();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Failed to update status. Please try again later.",
                    icon: "error"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Failed to update status. Please try again later.",
                icon: "error"
            });
        }
    };

    const filteredPositions = positions.filter(position => {
        const matchesSearchTerm = Object.values(position).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesColumnFilters = Object.keys(columnFilters).every(column => {
            const filterValue = columnFilters[column];
            if (!filterValue) return true;

            if (column === 'candidatesProposed') {
                return position.candidatesProposed && position.candidatesProposed.some(candidate =>
                    candidate.candidateName.toLowerCase().includes(filterValue.toLowerCase())
                );
            }

            if (column === 'recruiter') {
                return position.recruiter && position.recruiter.name &&
                    position.recruiter.name.toLowerCase().includes(filterValue.toLowerCase());
            }

            if (column === 'position') {
                return position.position && position.position.toLowerCase().includes(filterValue.toLowerCase());
            }

            if (column === 'client') {
                return position.client && position.client.company &&
                    position.client.company.toLowerCase().includes(filterValue.toLowerCase());
            }

            if (column === 'remarks') {
                return position.status && position.status.some(status =>
                    status.remarks && status.remarks.toLowerCase().includes(filterValue.toLowerCase())
                );
            }

            if (column === 'location') {
                return position.location && position.location.toLowerCase().includes(filterValue.toLowerCase());
            }

            const fieldValue = position[column];
            if (typeof fieldValue === 'string') {
                return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
            } else if (typeof fieldValue === 'number') {
                return fieldValue.toString().toLowerCase().includes(filterValue.toLowerCase());
            }

            return false;
        });

        return matchesSearchTerm && matchesColumnFilters;
    });

    const indexOfLastPosition = currentPage * positionsPerPage;
    const indexOfFirstPosition = indexOfLastPosition - positionsPerPage;
    const currentPositions = filteredPositions.slice(indexOfFirstPosition, indexOfLastPosition);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: '1' }}>
                <Container className='mt-3'>
                    <Row>
                        <Col>
                            <h2 style={{ display: "flex", justifyContent: "center", gap: 410 }}>
                                Position Details
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="form-control ml-3"
                                        style={{ maxWidth: '900px' }}
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={handleSearchClick}
                                        className="mx-3"
                                    >
                                        Search
                                    </Button>
                                    <Button
                                        variant="success"
                                        onClick={() => navigate('/addPosition')}
                                        className="mx-3"
                                        style={{ display: 'flex', alignItems: 'center', whiteSpace: "nowrap" }}
                                    >
                                        <FaPlus />
                                        Add Position
                                    </Button>
                                </div>
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div style={{ overflowX: 'auto' }}>
                                <Table striped bordered hover className="table-fixed">
                                    <thead>
                                        <tr>
                                            <th>SNO</th>
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
                                                    value={columnFilters.location || ''}
                                                    onChange={(e) => handleColumnFilterChange('location', e.target.value)}
                                                />
                                                Location
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.salary || ''}
                                                    onChange={(e) => handleColumnFilterChange('salary', e.target.value)}
                                                />
                                                Salary
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.keyCriteria || ''}
                                                    onChange={(e) => handleColumnFilterChange('keyCriteria', e.target.value)}
                                                />
                                                Key Criteria
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
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentPositions.map((position, index) => (
                                            <tr key={position._id}>
                                                <td>{index + 1 + (currentPage - 1) * positionsPerPage}</td>
                                                <td>{position.client ? position.client.company : 'N/A'}</td>
                                                <td>{position.position ? position.position : 'N/A'}</td>
                                                <td>{position.location}</td>
                                                <td>{position.salary}</td>
                                                <td>{position.keyCriteria}</td>
                                                <td>{position.recruiter.name}</td>
                                                <td>
                                                    <select value={position.status} onChange={(e) => handleStatusChange(position._id, e)}>
                                                        <option value="Open">Open</option>
                                                        <option value="Onhold">Onhold</option>
                                                        <option value="Close">Close</option>
                                                    </select>
                                                </td>
                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                    {role === "admin" ? (<Button onClick={() => deletePosition(position._id)} variant="danger" style={{ marginRight: '10px' }}>Delete</Button>) : null}
                                                    <Button onClick={() => navigate(`/updatePosition/${position._id}`)} variant="success">Update</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <Pagination className="justify-content-center">
                                {[...Array(Math.ceil(filteredPositions.length / positionsPerPage)).keys()].map(number => (
                                    <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
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

export default ViewPositions;
