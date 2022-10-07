import React, { useContext} from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useHistory } from "react-router-dom";
import { AuthContext } from '../Context/AuthContext';
import { CgProfile } from "react-icons/cg";
import { AiOutlineLogout } from "react-icons/ai";
import { AiOutlineBars } from "react-icons/ai"

function NavigationBar({ user }) {
    const { logout } = useContext(AuthContext)
    const history = useHistory()
    const handleProfile = () => {
        history.replace(`/profile/${user.uid}`)
    }
    const handleLogout = () => {
        logout();
        //   history.push("/login")
    }
    const handleBannerClick = () => {
        history.push("/")
    }
   
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
                <Container>
                    <Navbar.Brand onClick={handleBannerClick} className="mx-5 brand">Reels</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"><AiOutlineBars style={{ fontSize: "1.5rem" }} /></Navbar.Toggle>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <NavDropdown title="Account" id="collasible-nav-dropdown">
                                <NavDropdown.Item onClick={handleProfile}>
                                    <CgProfile style={{ fontSize: "1.5rem" }} /> Profile
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={handleLogout}><AiOutlineLogout style={{ fontSize: "1.5rem" }} /> Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default NavigationBar