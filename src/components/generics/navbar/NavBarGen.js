import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import LoginOut from '../../customs/login-out/LoginOut';
import styles from './NavBarGen.module.css'; // Import the custom CSS module

function NavBarGen() {
  return (
    <>
      <Navbar expand="lg" className={styles.customNavbar}>
        <Container fluid>
          <Navbar.Brand href="/" className={styles.brand}>
            <Image
              alt="WMC Logo"
              src="/WMC_logo.png"
              width="50"
              height="50"
              className="d-inline-block align-top"
              roundedCircle
            />{' '}
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
              <Offcanvas.Title id="offcanvasNavbarLabel">
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="/about" className={styles.navLink}>About</Nav.Link>
                <Nav.Link href="/worship-songs" className={styles.navLink}>Worship Songs</Nav.Link>
                <NavDropdown
                  title={<span className={styles.navDropdownToggle}>Services</span>}
                  id="services-dropdown"
                  className={styles.navDropdown}
                >
                  <NavDropdown.Item href="/service1" className={styles.dropdownItem}>Service 1</NavDropdown.Item>
                  <NavDropdown.Item href="/service2" className={styles.dropdownItem}>Service 2</NavDropdown.Item>
                  <NavDropdown.Divider className={styles.dropdownDivider} />
                  <NavDropdown.Item href="/service3" className={styles.dropdownItem}>Service 3</NavDropdown.Item>
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
