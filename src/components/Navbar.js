import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";

import ConnectWalletButton from "./ConnectWalletButton";

import "./Navbar.css";

const NavbarHeader = () => {

	const [expanded, setExpanded] = useState(false);

	return (
		<Navbar
			bg="light"
			expand="md"
			expanded={expanded}>
			<Container>
				<Navbar.Brand href="/">
					{"Songbirdz"}
				</Navbar.Brand>
				<Navbar.Toggle
					aria-controls="basic-navbar-nav"
					onClick={() => setExpanded(!expanded)} />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="w-100 align-items-center">
						<Link
							className="nav-item nav-link"
							to="/collection"
							onClick={() => setExpanded(false)}>
							{"Collection"}
						</Link>
						<Link
							className="nav-item nav-link"
							to="/leaderboard"
							onClick={() => setExpanded(false)}>
							{"Leaderboard"}
						</Link>
						<Link
							className="nav-item nav-link"
							to="/about"
							onClick={() => setExpanded(false)}>
							{"About"}
						</Link>
						<Link
							className="nav-item nav-link"
							to="/sounds-of-summer-2024"
							onClick={() => setExpanded(false)}>
							{"Sounds of Summer"}
						</Link>
						<ConnectWalletButton className="mt-3 mt-md-0 ms-md-auto" />
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);

};

export default NavbarHeader;
