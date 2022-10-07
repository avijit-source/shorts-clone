import React, { useEffect, useState } from 'react';
import {auth} from '../firebase';
import {createUserWithEmailAndPassword,onAuthStateChanged,signInWithEmailAndPassword, signOut } from "firebase/auth";


export const AuthContext = React.createContext()

export function AuthProvider({children}){
     const [user,setUser] = useState();
     const [loading,setLoading] = useState(true);

     function signup(email,password) {
          return createUserWithEmailAndPassword(auth,email,password);
     }

     function login(email,password) {
        return signInWithEmailAndPassword(auth, email, password);

     }

     function logout(){
        return signOut(auth)
     }
     useEffect(() =>{
       const unsub = onAuthStateChanged(auth,(user)=>{
         setUser(user);
         setLoading(false);
       })
       return () =>{
          unsub()
       }
     },[])
    const store = {
        user,
        signup,
        login,
        logout,
    }

    return <AuthContext.Provider value={store}>
          {!loading && children}
    </AuthContext.Provider>
}

