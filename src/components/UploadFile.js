import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert';
import { GrAlert } from "react-icons/gr";
import { AiOutlineCloudUpload } from "react-icons/ai";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { doc, getDoc, serverTimestamp, addDoc, collection, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import ProgressBar from 'react-bootstrap/ProgressBar';


function UploadFile({ user }) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState("");
    const id = uuidv4();
    const handleClick = async () => {
        if (file === null) {
            setError("please select a file")
            let timerId = setTimeout(() => {
                setError("");
                clearTimeout(timerId);
            }, 2000)
        }
        if (file.size / (1024 * 1024) > 100) {
            setError("please select a smaller file ")
            let timerId = setTimeout(() => {
                setError("");
                clearTimeout(timerId);
            }, 2000)
        }
        try {
            setError("")
            setLoading(true);
            const storageRef = ref(storage, `/posts/${id}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on("state_changed", fn1, fn2, fn3)
            function fn1(snapshot) {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(Math.floor(progress))
                console.log('Upload is ' + progress + '% done');
            }
            function fn2(error) {
                let timerId = setTimeout(() => {
                    setError("");
                    clearTimeout(timerId);
                    return
                }, 2000)
                setLoading(false)
                console.log("error", error);
            }
            function fn3() {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    const docRef2 = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef2);
                    let thisuser = docSnap.data();

                    let obj = {
                        likes: [],
                        comments: [],
                        pId: id,
                        Purl: downloadURL,
                        uName: thisuser.fullname,
                        uDp: thisuser.profileUrl,
                        userId: thisuser.userId,
                        createdAt: serverTimestamp()
                    }
                    const docRef = await addDoc(collection(db, "posts"), obj);
                    const userRef = doc(db, "users", user.uid);
                    await updateDoc(userRef, {
                        postIds: thisuser.postIds ? [...thisuser.postIds, docRef.id] : [docRef.id]
                    });
                });
                setLoading(false);
                setFile(null)
            }
        } catch (err) {
            setError(err.message);
            let timerId = setTimeout(() => {
                setError("");
                clearTimeout(timerId);
                setLoading(false);
                return
            }, 2000)
        }


    }
    return (
        <div>
            {
                error && <Alert variant='danger' style={{ margin: "10px" }}>
                    <GrAlert />
                    {error}
                </Alert>
            }
            <Form.Group className="m-2">
                {/* <Form.Label>Default file input example</Form.Label> */}
                <Form.Control type="file" size="sm" accept='video/*' id="upload-input" onChange={(e) => setFile(e.target.files[0])} />
                <Button variant="primary"
                    className="mt-2"
                    disabled={loading}
                    onClick={handleClick}
                >
                    {!loading && (<AiOutlineCloudUpload className="mx-1" />)}
                    {!loading ? "Upload video" : (<Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true" />)}
                </Button>
            </Form.Group>

            {
                loading && <ProgressBar now={progress} label={`${progress}%`} />
            }
        </div>
    )
}

export default UploadFile