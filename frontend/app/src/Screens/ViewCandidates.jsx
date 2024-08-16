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


const ViewCandidates = () => {
    const [role, setRole] = useState('')
    const [candidates, setCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [columnFilters, setColumnFilters] = useState({
        mainFunction: '',
        subFunction: '',
        position: '',
        candidateName: '',
        dob: '',
        nationality: '',
        company: '',
        location: '',
        currentDesignation: '',
        yearsOfExperience: '',
        currentSalary: '',
        noticePeriod: '',
        reportingTo: '',
        comments: '',
        positionStatus: '',
        recruiter: '',
        statusFilter: '',
        education: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [candidatesPerPage] = useState(50);
    const navigate = useNavigate();

    async function fetchCandidates() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("https://erp-backend-gules.vercel.app/getCandidates", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setCandidates(response.data.candidates);
                console.log(response.data.candidates)
            } else {
                console.log(response.data.error);
            }
        } catch (error) {
            console.log('Error fetching candidates:', error);
        }
    }

    async function userRole() {
        try {
            const token = localStorage.getItem('token');
            const userRole = await axios.get('https://erp-backend-gules.vercel.app/userRole', {
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
        fetchCandidates()
        userRole();
    }, []);

    const handleResumeDownload = (resumeUrl, filename) => {
        const link = document.createElement('a');
        link.href = resumeUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const deleteUser = async (id) => {
        const alert = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (alert.isConfirmed) {
            try {
                const response = await axios.delete(`https://erp-backend-gules.vercel.app/deleteCandidate/${id}`);
                if (response.data.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Candidate has been deleted.",
                        icon: "success"
                    });
                    fetchCandidates();
                }
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Failed to delete candidate. Please try again later.",
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
            const response = await axios.get('https://erp-backend-gules.vercel.app/searchCandidates', {
                params: {
                    searchTerm: searchTerm,
                    positionStatus: columnFilters.positionStatus
                }
            });
            if (response.data.success) {
                setCandidates(response.data.candidates);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log('Error searching candidates:', error);
        }
    };

    const handleColumnFilterChange = (columnName, value) => {
        setColumnFilters({ ...columnFilters, [columnName]: value });
        setCurrentPage(1);
    };

    const filteredCandidates = candidates.filter(candidate => {
        const matchesSearchTerm = Object.values(candidate).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesColumnFilters = Object.keys(columnFilters).every(column => {
            const filterValue = columnFilters[column];
            if (!filterValue) return true;

            const fieldValue = candidate[column];

            if (column === 'statusFilter') {
                return candidate.status && candidate.status.some(status =>
                    (status.hiring?.client?.company && status.hiring.client.company.toLowerCase().includes(filterValue.toLowerCase())) ||
                    (status.hiring?.position?.position && status.hiring.position.position.toLowerCase().includes(filterValue.toLowerCase())) ||
                    (status.hiring?.remarks && status.hiring.remarks.toLowerCase().includes(filterValue.toLowerCase())) ||
                    (status.hiring?.comment && status.hiring.comment.toLowerCase().includes(filterValue.toLowerCase())) ||
                    (status.hiring?.location && status.hiring.location.toLowerCase().includes(filterValue.toLowerCase()))
                );
            } else if (column === 'positionStatus') {
                return candidate.positionStatus && candidate.positionStatus.some(position =>
                    position.status && position.status.some(status =>
                        (status.client?.company && status.client.company.toLowerCase().includes(filterValue.toLowerCase())) ||
                        (status.position && status.position.toLowerCase().includes(filterValue.toLowerCase())) ||
                        (status.remarks && status.remarks.toLowerCase().includes(filterValue.toLowerCase()))
                    )
                );
            } else if (typeof fieldValue === 'string') {
                return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
            } else if (typeof fieldValue === 'number') {
                return fieldValue.toString().toLowerCase().includes(filterValue.toLowerCase());
            }
            return false;
        });

        return matchesSearchTerm && matchesColumnFilters;
    });

    const indexOfLastCandidate = currentPage * candidatesPerPage;
    const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
    const currentCandidates = filteredCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: '1' }}>
                <Container className='mt-3'>
                    <Row>
                        <Col>
                            <h2 style={{ display: "flex", justifyContent: "center", gap: 360 }}>
                                Candidate Details
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
                                        onClick={() => navigate('/addCandidates')}
                                        className="mx-3"
                                        style={{ display: 'flex', alignItems: 'center', whiteSpace: "nowrap" }}
                                    >
                                        <FaPlus />
                                        Add Candidate
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
                                                    value={columnFilters.mainFunction || ''}
                                                    onChange={(e) => handleColumnFilterChange('mainFunction', e.target.value)}
                                                />
                                                Main Function
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.subFunction || ''}
                                                    onChange={(e) => handleColumnFilterChange('subFunction', e.target.value)}
                                                />
                                                Sub Function
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.candidateName || ''}
                                                    onChange={(e) => handleColumnFilterChange('candidateName', e.target.value)}
                                                />
                                                Candidate Name
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.nationality || ''}
                                                    onChange={(e) => handleColumnFilterChange('nationality', e.target.value)}
                                                />
                                                Nationality
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.company || ''}
                                                    onChange={(e) => handleColumnFilterChange('company', e.target.value)}
                                                />
                                                Current Organization
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.location || ''}
                                                    onChange={(e) => handleColumnFilterChange('location', e.target.value)}
                                                />
                                                Current Location
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.currentDesignation || ''}
                                                    onChange={(e) => handleColumnFilterChange('currentDesignation', e.target.value)}
                                                />
                                                Current Designation
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.yearsOfExperience || ''}
                                                    onChange={(e) => handleColumnFilterChange('yearsOfExperience', e.target.value)}
                                                />
                                                Years of Experience
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.dob || ''}
                                                    onChange={(e) => handleColumnFilterChange('dob', e.target.value)}
                                                />
                                                DOB
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.currentSalary || ''}
                                                    onChange={(e) => handleColumnFilterChange('currentSalary', e.target.value)}
                                                />
                                                Current Salary
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.noticePeriod || ''}
                                                    onChange={(e) => handleColumnFilterChange('noticePeriod', e.target.value)}
                                                />
                                                Notice Period
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.education || ''}
                                                    onChange={(e) => handleColumnFilterChange('education', e.target.value)}
                                                />
                                                Education
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.comments || ''}
                                                    onChange={(e) => handleColumnFilterChange('comments', e.target.value)}
                                                />
                                                Comments
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    placeholder="Filter"
                                                    value={columnFilters.statusFilter || ''}
                                                    onChange={(e) => handleColumnFilterChange('statusFilter', e.target.value)}
                                                />
                                                Status
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
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentCandidates.map((candidate, index) => (
                                            <tr key={candidate._id}>
                                                <td>{indexOfFirstCandidate + index + 1}</td>
                                                <td>{candidate.mainFunction}</td>
                                                <td>{candidate.subFunction}</td>
                                                <td>{candidate.candidateName}</td>
                                                <td>{candidate.nationality}</td>
                                                <td>{candidate.company}</td>
                                                <td>{candidate.location}</td>
                                                <td>{candidate.currentDesignation}</td>
                                                <td>{candidate.yearsOfExperience}</td>
                                                <td>{candidate.dob}</td>
                                                <td>{candidate.currentSalary}</td>
                                                <td>{candidate.noticePeriod}</td>
                                                <td>{candidate.education}</td>
                                                <td>{candidate.comments}</td>
                                                <td>
                                                    {candidate.status.map(status => (
                                                        <div key={status.hiring?._id || Math.random()}>
                                                            Client: {status.hiring?.client?.company || 'N/A'}, <br />
                                                            Position: {status.hiring?.position?.position || 'N/A'}, <br />
                                                            Location: {status.hiring?.location || 'N/A'}, <br />
                                                            Remark: {status.hiring?.remarks || 'N/A'} <br />
                                                            Comment: {status.hiring?.comment || 'N/A'}  <br />  <br />
                                                        </div>
                                                    ))}
                                                </td>

                                                <td>
                                                    {candidate.recruiter}
                                                </td>

                                                <td className="actions">
                                                    {candidate.resume && candidate.resume.fileId ? (
                                                        <Button
                                                            onClick={() => handleResumeDownload(`https://erp-backend-gules.vercel.app/downloadResume/${candidate.resume.fileId}`, candidate.resume.filename)}
                                                            variant="primary"
                                                            style={{ whiteSpace: "nowrap", textAlign: "center" }}
                                                        >
                                                            View Resume
                                                        </Button>
                                                    ) : (
                                                        "No Resume"
                                                    )}
                                                    {
                                                        role === 'admin' ? (<Button onClick={() => deleteUser(candidate._id)} variant="danger">Delete</Button>) : null
                                                    }
                                                    <Button onClick={() => { navigate(`/updateCandidates/${candidate._id}`) }} variant="success">Update</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            <Pagination className="mt-3">
                                {Array.from({ length: Math.ceil(filteredCandidates.length / candidatesPerPage) }, (_, index) => (
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

export default ViewCandidates;
