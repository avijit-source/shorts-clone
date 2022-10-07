import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import {FcLike,FcDislike} from "react-icons/fc";
import { db } from '../firebase';


function Like({userData,post}) {
    const [like,setLike] = useState(null)
  
    useEffect(() => {
      let checkLike = post.likes.includes(userData.userId)?true:false;
      setLike(checkLike)
    },[post.likes,userData.userId])

    const handleLike = async() => {
        if(like===true){
            let narr = post.likes.filter(el=>el!==userData.userId)
            const postRef = doc(db, "posts",post.pId);
            await updateDoc(postRef, {
                likes:narr
            });
        }else{
            let narr= [...post.likes,userData.userId];
            const postRef = doc(db, "posts",post.pId);
            await updateDoc(postRef, {
                likes:narr
            });
        }
    }
  return (
    <span className="like mx-2">
        {
           like!==null ? <span>
             {
                like===false?
                 <FcLike onClick={handleLike} />
                 :<FcDislike onClick={handleLike} />
             }
           </span>:""
        }
        
    </span>
  )
}

export default Like