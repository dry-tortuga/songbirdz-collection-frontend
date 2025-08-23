import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";

import ConnectWalletButton from "./ConnectWalletButton";

import "./Navbar.css";

const NavbarHeader = () => {

	const [expanded, setExpanded] = useState(false);

	const { pathname } = useLocation();

<<<<<<< HEAD
    return (
        <Navbar bg="light" expand="md" expanded={expanded}>
            <Container>
                <Navbar.Brand href="/">{"Songbirdz"}</Navbar.Brand>
                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    onClick={() => setExpanded(!expanded)} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="w-100 align-items-center">
                        <Link
                            className={`nav-item nav-link ${pathname === "/collection" ? "active" : ""} `}
                            to="/collection?number=9&hide_already_identified=true"
                            onClick={() => setExpanded(false)}>
                            {"Collection"}
                        </Link>
                        <Link
                            className={`nav-item nav-link ${pathname === "/leaderboard" ? "active" : ""} `}
                            to="/leaderboard"
                            onClick={() => setExpanded(false)}>
                            {"Leaderboard"}
                        </Link>
                        <Link
                            className={`nav-item nav-link ${pathname === "/memory-match" ? "active" : ""} `}
                            to="/memory-match"
                            onClick={() => setExpanded(false)}>
                            {"Memory Match Game"}
                        </Link>
                        <Link
                            className={`nav-item nav-link ${pathname === "/about" ? "active" : ""} `}
                            to="/about"
                            onClick={() => setExpanded(false)}>
                            {"About"}
                        </Link>
                        <ConnectWalletButton className="mt-3 mt-md-0 ms-md-auto" />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
=======
	return (
		<Navbar
			bg="light"
			expand="md"
			expanded={expanded}>
			<Container>
				<Navbar.Brand href="/">
					<img src="/logo.png" alt="Songbirdz Logo" className="logo" />
					{"Songbirdz"}
				</Navbar.Brand>
				<Navbar.Toggle
					aria-controls="basic-navbar-nav"
					onClick={() => setExpanded(!expanded)} />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="w-100 align-items-center">
						<Link
							className={`nav-item nav-link ${pathname === "/collection" ? "active" : ""} `}
							to="/collection?number=8&hide_already_identified=true"
							onClick={() => setExpanded(false)}>
							{"Collection"}
						</Link>
						<Link
							className={`nav-item nav-link ${pathname === "/leaderboard" ? "active" : ""} `}
							to="/leaderboard"
							onClick={() => setExpanded(false)}>
							{"Leaderboard"}
						</Link>
						<Link
							className={`nav-item nav-link ${pathname === "/memory-match" ? "active" : ""} `}
							to="/memory-match"
							onClick={() => setExpanded(false)}>
							{"Memory Match Game"}
						</Link>
						<Link
							className={`nav-item nav-link ${pathname === "/about" ? "active" : ""} `}
							to="/about"
							onClick={() => setExpanded(false)}>
							{"About"}
						</Link>
						<ConnectWalletButton
							className="mt-3 mt-md-0 ms-md-auto"
							showDailyStreak />
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
>>>>>>> main

};

export default NavbarHeader;
