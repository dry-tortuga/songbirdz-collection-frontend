import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
	Button,
	Container,
	Nav,
	Navbar,
} from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import "./Navbar.css";

const NavbarHeader = () => {

	const {
		account,
		onConnectWallet,
		onDisconnectWallet,
	} = useWalletContext();

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
							to="/about"
							onClick={() => setExpanded(false)}>
							{"About"}
						</Link>
						{account &&
							<>
								<span className="ms-md-auto me-md-3 text-break">
									{account}
								</span>
								<Button
									variant="primary"
									onClick={() => onDisconnectWallet()}>
									{"Disconnect Wallet"}
								</Button>
							</>
						}
						{!account &&
							<Button
								className="ms-md-auto"
								variant="primary"
								onClick={() => onConnectWallet()}>
								{"Connect Wallet"}
							</Button>
						}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);

};

export default NavbarHeader;
