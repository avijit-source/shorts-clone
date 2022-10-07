import React, { useState } from 'react'
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function AddComment({post,userData}) {
    const [text,setText]= useState("")
    const handleComment =async()=>{
        if(text!==""){
            try{
                let obj = {
                    text,
                    uProfileImage:userData.profileUrl,
                    uName:userData.fullname,
                    createdAt: serverTimestamp()
                }
                const docRef = await addDoc(collection(db, "comments"), obj);
                const postsRef = doc(db, "posts", post.pId);
                await updateDoc(postsRef, {
                    comments: [...post.comments, docRef.id]
                });
                setText("");
            }catch (err) {
                alert(err.message)
            }
        }else{
            alert("can not submit empty values")
        }
    }
  return (
    <div>
        <InputGroup size="md" className="mb-3">
        <Form.Control
          aria-label="Small"
          value={text}
          placeholder="write a comment"
          onChange={(e)=>setText(e.target.value)}
          aria-describedby="inputGroup-sizing-sm"
        />
      </InputGroup>
      <Button variant="primary" size="sm" onClick={handleComment}>
          Submit
        </Button>
    </div>
  )
}

export default AddComment