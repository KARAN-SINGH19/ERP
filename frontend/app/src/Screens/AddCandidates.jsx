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
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddCandidates = () => {
    const navigate = useNavigate();
    const [mainFunction, setMainFunction] = useState("");
    const [subFunction, setSubFunction] = useState("");
    const [candidateName, setCandidateName] = useState("");
    const [dob, setDob] = useState(null); 
    const [nationality, setNationality] = useState("");
    const [company, setCompany] = useState("");
    const [location, setLocation] = useState("");
    const [currentDesignation, setCurrentDesignation] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState("");
    const [currentSalary, setCurrentSalary] = useState("");
    const [noticePeriod, setNoticePeriod] = useState("");
    const [education, setEducation] = useState(""); 
    const [comments, setComments] = useState("");
    const [client, setClient] = useState("");
    const [positionName, setPositionName] = useState("");
    const [remarks, setRemarks] = useState("");
    const [resume, setResume] = useState(null);

    const [toggleAlert, setToggleAlert] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const [users, setUsers] = useState([]); 
    const [selectedUser, setSelectedUser] = useState(""); 

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://82.112.236.55:5000/api/v1/getUserNames");
            if (response.data.success) {
                setUsers(response.data.user);
            } else {
                console.error("Failed to fetch users");
            }
        } catch (error) {
            console.error("Server error:", error);
        }
    };

    async function addCandidate() {
        const data = new FormData();
        data.append('mainFunction', mainFunction);
        data.append('subFunction', subFunction);
        data.append('candidateName', candidateName);
        data.append('dob', formatDate(dob)); 
        data.append('nationality', nationality);
        data.append('company', company);
        data.append('location', location);
        data.append('currentDesignation', currentDesignation);
        data.append('yearsOfExperience', yearsOfExperience);
        data.append('currentSalary', currentSalary);
        data.append('noticePeriod', noticePeriod);
        data.append('education', education);
        data.append('comments', comments);
        data.append('client', client);
        data.append('positionName', positionName);
        data.append('remarks', remarks);
        data.append('selectedUser', selectedUser);
        if (resume) {
            data.append('resume', resume);
        }

        try {
            const token = localStorage.getItem('token');
            const request = await axios.post("http://82.112.236.55:5000/api/v1/addCandidate", data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            if (request) {
                resetFormFields();
                setToggleAlert(true);
                setSuccessMsg("Candidate added successfully!!");
                setTimeout(() => {
                    navigate("/viewCandidates")
                }, 1000);
            } else {
                setToggleAlert(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const formatDate = (date) => {
        if (!date) return "";
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const resetFormFields = () => {
        setMainFunction("");
        setSubFunction("");
        setCandidateName("");
        setDob(null);
        setNationality("");
        setCompany("");
        setLocation("");
        setCurrentDesignation("");
        setYearsOfExperience("");
        setCurrentSalary("");
        setNoticePeriod("");
        setEducation("");
        setComments("");
        setClient("");
        setPositionName("");
        setRemarks("");
        setResume(null);
    };

    return (
        <div>
            <Sidebar />
            <Container className='mt-3'>
                <Row>
                    <Col>
                        <Card className="p-4 mx-auto" style={{ width: "60%", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
                            <h2 style={{ display: "flex", justifyContent: "center" }}>Add Candidate Details</h2>
                            {
                                toggleAlert && (
                                    <ShowAlert variant='success' message={successMsg} />
                                )
                            }
                            <Form>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Main Function">
                                        <Form.Control
                                            type='text'
                                            placeholder="Main Function"
                                            value={mainFunction}
                                            onChange={(e) => setMainFunction(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Sub Function">
                                        <Form.Control
                                            type='text'
                                            placeholder="Sub Function"
                                            value={subFunction}
                                            onChange={(e) => setSubFunction(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Candidate Name">
                                        <Form.Control
                                            type='text'
                                            placeholder="Candidate Name"
                                            value={candidateName}
                                            onChange={(e) => setCandidateName(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Nationality">
                                        <Form.Control
                                            type='text'
                                            placeholder="Nationality"
                                            value={nationality}
                                            onChange={(e) => setNationality(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Current Organization">
                                        <Form.Control
                                            type='text'
                                            placeholder="Company"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Current Location">
                                        <Form.Control
                                            type='text'
                                            placeholder="Location"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Current Designation">
                                        <Form.Control
                                            type='text'
                                            placeholder="Current Designation"
                                            value={currentDesignation}
                                            onChange={(e) => setCurrentDesignation(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Years of Experience">
                                        <Form.Control
                                            type='text'
                                            placeholder="Years of Experience"
                                            value={yearsOfExperience}
                                            onChange={(e) => setYearsOfExperience(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3 position-relative">
                                    <DatePicker
                                        selected={dob}
                                        onChange={date => setDob(date)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="DD/MM/YYYY"
                                        className="form-control"
                                        wrapperClassName="w-100"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Current Salary">
                                        <Form.Control
                                            type='text'
                                            placeholder="Current Salary"
                                            value={currentSalary}
                                            onChange={(e) => setCurrentSalary(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Notice Period">
                                        <Form.Control
                                            type='text'
                                            placeholder="Notice Period"
                                            value={noticePeriod}
                                            onChange={(e) => setNoticePeriod(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Education">
                                        <Form.Control
                                            type='text'
                                            placeholder="Education"
                                            value={education}
                                            onChange={(e) => setEducation(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Comments">
                                        <Form.Control
                                            type='text'
                                            placeholder="Comments"
                                            value={comments}
                                            onChange={(e) => setComments(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Select User</Form.Label>
                                    <Form.Select
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a user</option>
                                        {users.map(user => (
                                            <option key={user._id} value={user.name}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Select File</Form.Label>
                                    <Form.Control type="file" onChange={(e) => { setResume(e.target.files[0]) }} />
                                </Form.Group>

                                <div style={{ display: 'flex', justifyContent: "center" }}>
                                    <Button
                                        style={{ width: "25%" }}
                                        onClick={addCandidate}
                                        variant="primary"
                                        size="lg"
                                    >
                                        Add Candidate
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AddCandidates;
