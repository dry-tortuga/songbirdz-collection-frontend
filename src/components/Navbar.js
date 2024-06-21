import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
	Button,
	Container,
	Nav,
	Navbar,
} from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import AccountOwner from "./AccountOwner";
import CreateWalletButton from "./CreateWalletButton";

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
							className="nav-item nav-link d-none"
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
						{account &&
							<>
								<AccountOwner
									className="ms-auto"
									account={account} />
								<Button
									className="ms-3"
									variant="primary"
									onClick={() => onDisconnectWallet()}>
									{"Disconnect"}
								</Button>
							</>
						}
						{!account &&
							<div className="d-flex align-items-center ms-md-auto">
								<CreateWalletButton />
								<Button
									className="ms-4"
									variant="primary"
									onClick={() => onConnectWallet()}>
									{"Connect"}
								</Button>
							</div>
						}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);

};

export default NavbarHeader;
