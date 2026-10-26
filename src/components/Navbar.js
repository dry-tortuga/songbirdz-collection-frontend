import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

import ConnectWalletButton from "./ConnectWalletButton";

import homeImage1 from "../images/home1.png";

import "./Navbar.css";

const NavbarSB = () => {

	const [expanded, setExpanded] = useState(false);

	const { key, pathname } = useLocation();
	const navigate = useNavigate();

	// Check if there's a previous entry in the history stack
	const hasPreviousHistory = key !== "default";

	const links = [
		{ to: "/collection?number=9&hide_already_identified=true", path: "/collection", label: "Collection" },
		{ to: "/leaderboard", path: "/leaderboard", label: "Leaderboard" },
		{ to: "/profile", path: "/profile", label: "My Profile" },
		{ to: "/bird-of-the-week", path: "/bird-of-the-week", label: "Bird of the Week" },
		{ to: "/about", path: "/about", label: "About" },
	];

	return (
		<Navbar
			bg="light"
			expand="md"
			expanded={expanded}>
			<Container>
				{hasPreviousHistory &&
					<Nav className="d-flex d-sm-none">
						<Button
							className="me-2"
							variant="outline"
							aria-label="Go back"
							onClick={() => navigate(-1)}>
							<i
								aria-hidden="true"
								className="fa-solid fa-arrow-left me-2" />
						</Button>
					</Nav>
				}
				<Navbar.Brand
					className="d-flex align-items-center"
					href="/">
					<img
						className="logo me-1"
						alt=""
						src={homeImage1}
						style={{ width: 30, height: 30 }} />
					<span>
						{"Songbirdz"}
					</span>
				</Navbar.Brand>
				<Navbar.Toggle
					aria-controls="basic-navbar-nav"
					onClick={() => setExpanded(!expanded)} />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="w-100 align-items-center">
						{links.map((link) => (
							<Link
								key={link.path}
								className={`nav-item nav-link ${pathname.startsWith(link.path) ? "active" : ""} `}
								to={link.to}
								onClick={() => setExpanded(false)}>
								{link.label}
							</Link>
						))}
						<ConnectWalletButton
							className="mt-3 mt-md-0 ms-md-auto"
							showDailyStreak />
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);

};

export default NavbarSB;
