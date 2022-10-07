import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "./login.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase"
import reels from "../assets/reels.png"
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal'
import { Link, useHistory } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import Alert from 'react-bootstrap/Alert';
import { CgDanger } from 'react-icons/cg'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function Login() {
    const { login } = useContext(AuthContext)
    const [email, setEmail] = useState("");
    const [emailReset, setEmailReset] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory()
    const [show, setShow] = useState(false);
    const [showToast, setShowToast] = useState(false);


    const handleClose = () => {
        setShow(false);
        setEmailReset("");
    };
    const handleShow = () => {
        setShow(true)
    };
    const handleEmailSubmit = () => {
        sendPasswordResetEmail(auth, emailReset)
            .then(() => {
                console.log("email verification successful! please check email");
            })
            .catch((err) => {
                console.log(err);
            })
        setShowToast(true)
        setShow(false);
        setEmailReset("");
    }
    const handleClick = async () => {
        try {
            setError("")
            setLoading(true)
            let res = await login(email, password);
            setLoading(false)
            history.push("/")
        } catch (err) {
            setError(err.message);
            setTimeout(() => {
                setError("")
            }, 2000)
            setLoading(false)
        }
    }
    return (
        <>
            <div className="login-wrapper container-fluid">
                <div className="logincard">
                    <Card style={{ width: '22rem' }}>
                        <Card.Img src={reels} variant="top" alt="Card image" style={{ width: "50px" }} className="insta-logo" />
                        <Card.Title style={{ marginTop: "10px" }}>Sign in</Card.Title>
                        {error && <Alert variant="danger" className="alert-danger">
                            <CgDanger style={{ fontSize: "1.5rem" }} /> {error}
                        </Alert>}
                        <Card.Body>
                            <Form className="form-login">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" size="sm" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" size="sm" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>
                                <Form.Text className="text-primary modal-class" onClick={handleShow}>
                                    Forgot password?
                                </Form.Text>
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Reset Password</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    value={emailReset}
                                                    onChange={(e) => setEmailReset(e.target.value)}
                                                    placeholder="enter your email"
                                                    autoFocus
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button variant="primary" onClick={handleEmailSubmit}>
                                            Send email
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                <div className="d-grid gap-2 mt-2">
                                    <Button variant="primary" type="submit" size="sm" onClick={handleClick} disabled={loading}>
                                        Login
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '21rem', fontSize: "0.8rem" }} className="m-2">
                        <Card.Title className="m-2" style={{ fontSize: "0.9rem" }}>
                            Dont have an account ? <Link to="/signup" style={{ textDecoration: "none" }}>Sign up</Link>
                        </Card.Title>
                    </Card>
                </div>
            </div>
            <Row>
                <Col xs={6}>
                    <ToastContainer className="p-3" position="bottom-end">
                        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="dark">
                            <Toast.Body className="text-white">email verification sent</Toast.Body>
                        </Toast>
                    </ToastContainer>
                </Col>
            </Row>
        </>
    );
}

export default Login;