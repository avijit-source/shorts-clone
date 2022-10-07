import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import Image from 'react-bootstrap/Image'

function Comments({ post }) {
    const [comments, setComments] = useState([]);
    useEffect(() => {
        let arr = [];
        async function getcomments(cId) {
            const docRef = doc(db, "comments", cId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                arr.push(docSnap.data());
                setComments(arr)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        for (let i = 0; i < post.comments.length; i++) {
            getcomments(post.comments[i])
        }

    }, [post])
    
    return (
        <div className="commentsDiv">
            {
               comments.length>0 && comments.map(c => (
                <div key={uuidv4()} style={{display:"flex",padding:"5px",border: "1px solid black",fontSize:"0.8rem"}}>
                    <Image width="50"
                     height="50" src={c.uProfileImage}
                     style={{ objectFit: "contain" }} roundedCircle />
                     <div style={{margin:"4px"}}>
                     <span style={{fontWeight:"bold"}}>{c.uName}</span>
                     <br />
                     <span>{c.text}</span>
                     <br />
                     <span>{new Date(c.createdAt.seconds*1000).toLocaleString()}</span>
                     </div>
                     
                </div>
            ))
            }
        </div>
    )
}

export default Comments