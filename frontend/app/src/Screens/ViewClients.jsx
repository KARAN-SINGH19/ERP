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

const ViewClients = () => {
    const [role, setRole] = useState('')
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [columnFilters, setColumnFilters] = useState({
        serialNo: '',
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
    const [currentPage, setCurrentPage] = useState(1);
    const [clientsPerPage] = useState(50);
    const navigate = useNavigate();

    async function fetchClients() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://82.112.236.55:5000/api/v1/getClients", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setClients(response.data.clients);
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
        fetchClients()
        userRole();
    }, []);

    const deleteClient = async (id) => {
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
                const response = await axios.delete(`http://82.112.236.55:5000/api/v1/deleteClient/${id}`);
                if (response.data.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Client has been deleted.",
                        icon: "success"
                    });
                    fetchClients();
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to delete client. Please try again later.",
                        icon: "error"
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Failed to delete client. Please try again later.",
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
            const response = await axios.get('http://82.112.236.55:5000/api/v1/searchClients', {
                params: {
                    searchTerm: searchTerm,
                }
            });
            if (response.data.success) {
                setClients(response.data.clients);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log('Error searching clients:', error);
        }
    };

    const handleColumnFilterChange = (columnName, value) => {
        setColumnFilters({ ...columnFilters, [columnName]: value });
        setCurrentPage(1);
    };

    const filteredClients = clients.filter(client => {
        const matchesSearchTerm = Object.values(client).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesColumnFilters = Object.keys(columnFilters).every(column => {
            const filterValue = columnFilters[column];
            if (!filterValue) return true;

            const fieldValue = client[column];
            if (typeof fieldValue === 'string') {
                return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
            } else if (typeof fieldValue === 'number') {
                return fieldValue.toString().toLowerCase().includes(filterValue.toLowerCase());
            }
            return false;
        });

        return matchesSearchTerm && matchesColumnFilters;
    });

    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: '1' }}>
                <Container className='mt-3'>
                    <Row>
                        <Col>
                            <h2 style={{ display: "flex", justifyContent: "center", gap: 460 }}>
                                Client Details
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
                                        onClick={() => navigate('/addClient')}
                                        className="mx-3"
                                        style={{ display: 'flex', alignItems: 'center', whiteSpace: "nowrap" }}
                                    >
                                        <FaPlus />
                                        Add Client
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
                                                    value={columnFilters.date || ''}
                                                    onChange={(e) => handleColumnFilterChange('date', e.target.value)}
                                                />
                                                Date
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.company || ''}
                                                    onChange={(e) => handleColumnFilterChange('company', e.target.value)}
                                                />
                                                Company
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
                                                    value={columnFilters.address || ''}
                                                    onChange={(e) => handleColumnFilterChange('address', e.target.value)}
                                                />
                                                Address
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.contactName || ''}
                                                    onChange={(e) => handleColumnFilterChange('contactName', e.target.value)}
                                                />
                                                Contact Name
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    style={{ width: "100%" }}
                                                    value={columnFilters.contactEmail || ''}
                                                    onChange={(e) => handleColumnFilterChange('contactEmail', e.target.value)}
                                                />
                                                Contact Email
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.contactPhone || ''}
                                                    onChange={(e) => handleColumnFilterChange('contactPhone', e.target.value)}
                                                />
                                                Contact Phone
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.contactName2 || ''}
                                                    onChange={(e) => handleColumnFilterChange('contactName2', e.target.value)}
                                                />
                                                Contact Name2
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.contactEmail2 || ''}
                                                    onChange={(e) => handleColumnFilterChange('contactEmail2', e.target.value)}
                                                />
                                                Contact Email2
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.contactPhone2 || ''}
                                                    onChange={(e) => handleColumnFilterChange('contactPhone2', e.target.value)}
                                                />
                                                Contact Phone2
                                            </th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentClients.map((client, index) => (
                                            <tr key={client._id}>
                                                <td>{indexOfFirstClient + index + 1}</td>
                                                <td>{client.date}</td>
                                                <td>{client.company}</td>
                                                <td>{client.location}</td>
                                                <td>{client.address}</td>
                                                <td>{client.contactName}</td>
                                                <td>{client.contactEmail}</td>
                                                <td>{client.contactPhone}</td>
                                                <td>{client.contactName2}</td>
                                                <td>{client.contactEmail2}</td>
                                                <td>{client.contactPhone2}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                    {role === 'admin' ? (<Button onClick={() => deleteClient(client._id)} variant="danger" style={{ marginRight: '10px' }}>Delete</Button>) : null}
                                                    <Button onClick={() => navigate(`/updateClient/${client._id}`)} variant="success">Update</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Pagination className="mt-3">
                                {Array.from({ length: Math.ceil(filteredClients.length / clientsPerPage) }, (_, index) => (
                                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                                        {index + 1}
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

export default ViewClients;
