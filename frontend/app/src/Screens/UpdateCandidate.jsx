import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateCandidate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [mainFunction, setMainFunction] = useState("");
    const [subFunction, setSubFunction] = useState("");
    const [candidateName, setCandidateName] = useState("");
    const [dob, setDob] = useState("");
    const [nationality, setNationality] = useState("");
    const [company, setCompany] = useState("");
    const [location, setLocation] = useState("");
    const [currentDesignation, setCurrentDesignation] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState("");
    const [currentSalary, setCurrentSalary] = useState("");
    const [noticePeriod, setNoticePeriod] = useState("");
    const [education, setEducation] = useState("");
    const [reportingTo, setReportingTo] = useState("");
    const [comments, setComments] = useState("");
    const [positionStatus, setPositionStatus] = useState([]);
    const [recruiter, setRecruiter] = useState("");
    const [file, setFile] = useState(null);
    const [users, setUsers] = useState([]);
    const [existingData, setExistingData] = useState({});
    const [selectedUser, setSelectedUser] = useState("");


    async function fetchCandidate() {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/getCandidate/${id}`);
            console.log(response)
            if (response) {
                setMainFunction(response.data.candidate.mainFunction);
                setSubFunction(response.data.candidate.subFunction);
                setCandidateName(response.data.candidate.candidateName);
                setDob(response.data.candidate.dob);
                setNationality(response.data.candidate.nationality);
                setCompany(response.data.candidate.company);
                setLocation(response.data.candidate.location);
                setCurrentDesignation(response.data.candidate.currentDesignation);
                setYearsOfExperience(response.data.candidate.yearsOfExperience);
                setCurrentSalary(response.data.candidate.currentSalary);
                setNoticePeriod(response.data.candidate.noticePeriod);
                setEducation(response.data.candidate.education)
                setReportingTo(response.data.candidate.reportingTo);
                setComments(response.data.candidate.comments);
                setPositionStatus(response.data.candidate.positionStatus);
                setRecruiter(response.data.candidate.recruiter);
                setFile(response.data.candidate.resume);

                setExistingData(response.data.candidate);
            } else {
                console.log(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCandidate()
        fetchUsers();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/v1/getUserNames");
            if (response.data.success) {
                setUsers(response.data.user);
            } else {
                console.error("Failed to fetch users");
            }
        } catch (error) {
            console.error("Server error:", error);
        }
    };

    const updateCandidate = async (id) => {
        console.log("Selected User:", selectedUser);
        const data = {
            mainFunction: mainFunction !== existingData.mainFunction ? mainFunction : existingData.mainFunction,
            subFunction: subFunction !== existingData.subFunction ? subFunction : existingData.subFunction,
            candidateName: candidateName !== existingData.candidateName ? candidateName : existingData.candidateName,
            dob: dob !== existingData.dob ? dob : existingData.dob,
            nationality: nationality !== existingData.nationality ? nationality : existingData.nationality,
            company: company !== existingData.company ? company : existingData.company,
            location: location !== existingData.location ? location : existingData.location,
            currentDesignation: currentDesignation !== existingData.currentDesignation ? currentDesignation : existingData.currentDesignation,
            yearsOfExperience: yearsOfExperience !== existingData.yearsOfExperience ? yearsOfExperience : existingData.yearsOfExperience,
            currentSalary: currentSalary !== existingData.currentSalary ? currentSalary : existingData.currentSalary,
            noticePeriod: noticePeriod !== existingData.noticePeriod ? noticePeriod : existingData.noticePeriod,
            education: education !== existingData.education ? education : existingData.education,
            reportingTo: reportingTo !== existingData.reportingTo ? reportingTo : existingData.reportingTo,
            comments: comments !== existingData.comments ? comments : existingData.comments,
            positionStatus: positionStatus !== existingData.positionStatus ? positionStatus : existingData.positionStatus,
            recruiter: selectedUser && selectedUser !== existingData.recruiter ? selectedUser : existingData.recruiter,
        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (file) {
            formData.append('resume', file);
        }

        try {
            const request = await axios.put(`http://localhost:5000/api/v1/updateCandidate/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (request.data.success) {
                navigate("/viewCandidates");
            } else {
                console.log(request.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Sidebar />
            <Container className='mt-3'>
                <Row>
                    <Col>
                        <Card className="p-4 mx-auto" style={{ width: "60%", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
                            <h2 style={{ display: "flex", justifyContent: "center" }}>Update Candidate Details</h2>
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
                                            placeholder="Current Organization"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Current Location">
                                        <Form.Control
                                            type='text'
                                            placeholder="Current Location"
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
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Date of Birth">
                                        <Form.Control
                                            type='text'
                                            placeholder="Date of Birth"
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Current Salary">
                                        <Form.Control
                                            type='text'
                                            placeholder="Current Salary"
                                            value={currentSalary}
                                            onChange={(e) => setCurrentSalary(e.target.value)}
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
                                        <option value="">Current Recruiter is {recruiter}</option>
                                        {users.map(user => (
                                            <option key={user._id} value={user.name}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Upload File</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                </Form.Group>

                                <div style={{ display: 'flex', justifyContent: "center" }}>
                                    <Button
                                        style={{ width: "25%" }}
                                        onClick={() => { updateCandidate(id) }}
                                        variant="primary"
                                        size="lg"
                                    >
                                        Update Candidate
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default UpdateCandidate;
