import React, { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext'
import UploadFile from './UploadFile';
import Posts from './Posts';
import NavigationBar from './Navbar';
function Feed() {
  const { user } = useContext(AuthContext)
  return (
    <>
    <NavigationBar user={user} />
    <div className="feed">
      <div className="comp" style={{width:"50%"}}>
        {/* <h2>welocme to feed</h2>
        <Button variant="danger" onClick={logout}>Logout</Button> */}
        <UploadFile user={user} />
        <Posts user={user} />
      </div>
    </div>
    </>
  )
}

export default Feed