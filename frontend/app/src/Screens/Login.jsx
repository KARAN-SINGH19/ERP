import React from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ShowAlert from '../Components/ShowAlert';

const Login = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [errAlert, setErrAlert] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate()

    const data = {
        email: email,
        password: pass
    }

    async function validateUser() {
        try {
            const response = await axios.post("http://localhost:6000/api/v1/loginUser", data)
            if (response.status === 200) {
                const token = response.data.token
                localStorage.setItem("token", token)
                navigate("/dashboard")
            }
        } catch (error) {
            console.log(error)
            setErrAlert(true)
            setErrMsg(error.response.data.message)
        }
    }


    return (
        <div>
            <Container fluid style={{ paddingLeft: 0 }}>
                <Row>

                    <Col md={8} className="pr-md-5">
                        <div className="background-image"></div>
                    </Col>

                    <Col md={4} className="login-form d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                        <Card className="p-4 mx-auto" style={{ background: 'transparent', width: "100%", border: 'none' }}>
                            <img src='/images/mcaLogo.png' alt="Logo" style={{ margin: 'auto', marginBottom: '20px', width: '130px', height: '115px', borderRadius: '10px', border: '0px solid #555', }} />
                            <h1 className="mb-4" style={{ textAlign: "center" }}>Talent Vault</h1>
                            {
                                errAlert === true ? (
                                    <ShowAlert variant='danger' message={errMsg} />
                                ) : null
                            }
                            <Form.Group className="mb-3 input-1">
                                <FloatingLabel controlId="floatingEmail" label="Email">
                                    <Form.Control placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3 input-2">
                                <FloatingLabel controlId="floatingPassword" label="Password">
                                    <Form.Control type='password' placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} />
                                </FloatingLabel>
                            </Form.Group>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Button style={{ width: "25%", display: "flex", justifyContent: "center" }} onClick={() => { validateUser() }} variant="primary" size='lg'>
                                    Login
                                </Button>
                            </div>
                            {/* <div className="d-flex flex-column align-items-center">
                                <Link to='/Regsiteration' style={{ textDecoration: "none", color: '#555' }}>
                                    <p className="mt-3">Forgot Password? Support</p>
                                </Link>
                            </div> */}
                        </Card>
                    </Col>

                </Row>
            </Container>
        </div>
    );
}

export default Login;
