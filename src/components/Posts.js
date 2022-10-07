import React, { useEffect, useMemo, useState } from 'react'
import {
    collection,
    doc,
    onSnapshot,
    query,
    orderBy,
    getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Spinner from 'react-bootstrap/Spinner';
import { v4 as uuidv4 } from 'uuid';
import Video from './Video';
import "./posts.css"
import Image from 'react-bootstrap/Image'
import Like from './Like';
import { BsFillChatFill } from "react-icons/bs"
import MyModal from './Modal';



function Posts({ user }) {
    const [posts, setPosts] = useState(null);
    const [userData, setUserData] = useState(null);
    const [modalShow, setModalShow] = useState(false);


    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"))
        const unsub = onSnapshot(q, (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
                list.push({ ...doc.data(), pId: doc.id });
            });
            setPosts(list);
        }, (error) => {
            console.log(error);
        });

        async function fetchUser() {
            const docRef2 = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef2);
            let thisuser = docSnap.data();
            setUserData(thisuser)
        }
        fetchUser()
        return () => {
            unsub();
        };
    }, [user])

    const cb = (entries) => {
        entries.forEach((entry) => {
            let ele = entry.target.childNodes[0];
            ele.play().then(() => {
                if (!ele.paused && !entry.isIntersecting) {
                    ele.pause()
                }
            })
        })
    }
    let observer = useMemo(()=>new IntersectionObserver(cb, { threshold: 0.6 }),[])

    useEffect(() => {
        const elements = Array.from(document.getElementsByClassName("videos"))
        if (elements !== null) {
            elements.forEach(elem => {
                observer.observe(elem)
            })
        }
        return () => {
            observer.disconnect();
        }
    }, [posts, observer])


    return (
        <div>
            {!posts || !user || !userData ? <Spinner animation="border" variant="primary" /> :
                <div className="video-container">
                    {
                        posts.map((post, index) => {

                            return (
                                <div className="videos" key={uuidv4()}>
                                    <Video src={post.Purl} />
                                    <div className="fa" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <div className="video-icons">
                                            <Like userData={userData} post={post} />
                                            <BsFillChatFill style={{ color: "red", marginTop: "3px", fontSize: "1.2rem" }} onClick={
                                                function () {
                                                    setModalShow(post.pId)
                                                }
                                            } />
                                        </div>
                                        <Image width="50" height="50" src={post.uDp} style={{ objectFit: "contain" }} roundedCircle />
                                        <p className="m-2">{post.uName}</p>
                                    </div>
                                    <MyModal
                                        key={uuidv4()}
                                        show={modalShow === post.pId}
                                        post={post}
                                        userData={userData}
                                        onHide={() => setModalShow(null)}
                                    />

                                </div>

                            )

                        })

                    }
                </div>
            }

        </div>

    )
}

export default Posts