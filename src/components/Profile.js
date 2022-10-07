import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase';
import Spinner from 'react-bootstrap/Spinner';
import NavigationBar from './Navbar';
import { AuthContext } from '../Context/AuthContext';
import Image from 'react-bootstrap/Image'
import { v4 as uuidv4 } from 'uuid';
import "./Profile.css";


function Profile() {
    const { user } = useContext(AuthContext)
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            const docRef2 = doc(db, "users", id);
            const docSnap = await getDoc(docRef2);
            let thisuser = docSnap.data();
            setUserData(thisuser)
        }
        fetchUser()
        
    }, [id])

    useEffect(() => {
        let thisuser;
        async function fetchPosts() {
            let list = [];
            const docRef2 = doc(db, "users", id);
            const docSnap = await getDoc(docRef2);
            thisuser = docSnap.data();
            thisuser.postIds.forEach(p => {
                onSnapshot(doc(db, "posts", p), (doc) => {
                    list.unshift({ ...doc.data(), pId: doc.id })
                    setPosts(list);
                });
            })
        }
        fetchPosts()

    }, [id])


    return (
        <div>
            {posts === null || userData === null ? <Spinner animation="border" /> : (
                <>
                    <NavigationBar user={user} />
                    <div className="spacer mb-2">
                    </div>
                    <div className="container">
                        <div className="upper-part">
                            <div className="profile-img">
                                <Image width="100" height="100" src={userData.profileUrl} style={{ objectFit: "contain" }} />
                            </div>
                            <div className="info">
                                <h5>Email: {userData.email}</h5>
                                <h5>total videos: {userData.postIds.length}</h5>
                            </div>
                        </div>
                        <h4 className="mt-4">My Videos</h4>
                        <hr />
                        <div className="profile-videos mt-2">
                            {
                                posts.map((post, index) => {

                                    return (
                                        <div key={uuidv4()}>
                                            <div className="videos">
                                                <video src={post.Purl} width="170" height="300" controls />
                                            </div>
                                        </div>
                                    )

                                })

                            }
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Profile