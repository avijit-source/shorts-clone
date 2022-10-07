import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "./signup.css";
import reels from "../assets/reels.png"
import Alert from 'react-bootstrap/Alert';
import { CgDanger } from 'react-icons/cg'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import Form from 'react-bootstrap/Form';
import { Link,useHistory } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { doc, setDoc,serverTimestamp } from "firebase/firestore"; 

function SignUp() {
    const history = useHistory();
    const { signup } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");

    const handleClick = async (e) => {
        e.preventDefault();
        let timerId;
        if (file === null) {
            setError("please upload profile image first");
            timerId = setTimeout(() => {
                setError("");
                clearTimeout(timerId);
                return
            }, 2000)
        }

        try {
            setError("")
            setLoading(true);
            let userObj = await signup(email, password);
            let uid = userObj.user.uid;
            console.log(uid);
            const storageRef = ref(storage, `/users/${uid}/profileImage`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on("state_changed", fn1, fn2, fn3)
            function fn1(snapshot) {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }
            function fn2(error) {
                timerId = setTimeout(() => {
                    setError("");
                    clearTimeout(timerId);
                    return
                }, 2000)
                setLoading(false)
                console.log("error", error);
            }
            function fn3() {
                getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                    console.log('File available at', downloadURL);
                    await setDoc(doc(db, "users", uid), {
                        email,
                        userId: uid,
                        fullname: name,
                        profileUrl: downloadURL,
                        createdAt: serverTimestamp(),
                    });
                });
                setLoading(false);
                history.push("/")
            }
        } catch (err) {
            setError(err.message);
            timerId = setTimeout(() => {
                setError("");
                clearTimeout(timerId);
                setLoading(false);
                return
            }, 2000)
        }

    }
    return (
        <div className="signup-wrapper container-fluid">
            <div className="signupcard">
                <Card style={{ width: '22rem' }}>
                    <Card.Img src={reels} variant="top" alt="Card image" style={{ width: "50px" }} className="insta-logo" />
                    <Card.Body>
                        <Card.Title>Sign Up to see posts</Card.Title>
                        {error && <Alert variant="danger" className="alert-danger">
                            <CgDanger style={{ fontSize: "1.5rem" }} /> {error}
                        </Alert>}
                        <Form className="form-signup">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" size="sm" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" size="sm" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <Form.Label>Full name</Form.Label>
                                <Form.Control type="text" placeholder="Full name" size="sm" value={name} onChange={(e) => setName(e.target.value)} />
                            </Form.Group>
                            <div className="m-2">
                                <label htmlFor="upload"><AiOutlineCloudUpload /> Upload Profile Picture</label>
                                <input type="file" id="upload" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                            </div>
                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit" size="sm" disabled={loading} onClick={handleClick}>
                                    Submit
                                </Button>
                            </div>

                        </Form>
                    </Card.Body>
                </Card>
                <Card style={{ width: '21rem', fontSize: "0.8rem" }} className="m-2">

                    <Card.Title className="m-2" style={{ fontSize: "0.9rem" }}>
                        Already have an account ? <Link to="/login" style={{ textDecoration: "none" }}>login</Link>
                    </Card.Title>
                </Card>
            </div>
        </div>
    );
}

export default SignUp;