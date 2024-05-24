import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import LoginOut from "../../customs/login-out/LoginOut";
import styles from "./NavBarGen.module.css"; // Import the custom CSS module

function NavBarGen() {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const expireDate = localStorage.getItem("expireDate");

    if (!token || !userId || !expireDate) {
      return false;
    }

    const expiration = new Date(expireDate);
    const now = new Date();

    if (now > expiration) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("expireDate");
      return false;
    }

    return true;
  };

  const handleMembersOnlyClick = (e) => {
    if (!isLoggedIn()) {
      e.preventDefault();
      alert("You must be logged in to access this page.");
    }
  };

  return (
    <>
      <Navbar expand="lg" className={styles.customNavbar}>
        <Container fluid>
          <Navbar.Brand as={NavLink} to="/" className={styles.brand}>
            <Image
              alt="WMC Logo"
              src="/WMC_logo.png"
              width="50"
              height="50"
              className="d-inline-block align-top"
              roundedCircle
            />{" "}
            <span className={styles.brandText}>WMC</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
            className={styles.customOffcanvas}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link as={NavLink} to="/about" className={styles.navLink}>
                  About
                </Nav.Link>
                <Nav.Link as={NavLink} to="/worship-songs" className={styles.navLink}>
                  Worship Songs
                </Nav.Link>
                <NavDropdown
                  title={
                    <span className={styles.navDropdownToggle}>Services</span>
                  }
                  id="services-dropdown"
                  className={styles.navDropdown}
                >
                  <NavDropdown.Item
                    as={NavLink}
                    to="/prayers"
                    className={styles.dropdownItem}
                  >
                    Prayers
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    to="/"
                    className={styles.dropdownItem}
                  >
                    Transportation
                  </NavDropdown.Item>
                  <NavDropdown.Divider className={styles.dropdownDivider} />
                  <NavDropdown.Item
                    as={NavLink}
                    to="/manage-members"
                    className={styles.dropdownItem}
                    onClick={handleMembersOnlyClick}
                  >
                    Members Only
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <LoginOut />
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBarGen;
