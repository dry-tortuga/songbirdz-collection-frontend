import React from "react";

import { useFarcasterContext } from "../contexts/farcaster";

import openseaLogo from "../images/opensea-logomark-blue.svg";
import farcasterLogo from "../images/farcaster-logo-white.png";

import "./Footer.css";

const Footer = () => {

	const {
		fContext,
		fOpenExternalURL,
		fOpenLinkToChannel,
		fOpenLinkToOwner,
	} = useFarcasterContext();

	return (
		<footer className="footer py-2">
			<div className="container">
				<div className="row align-items-center">
					<div className="col-md-12 d-flex align-items-center flex-wrap">
						<div className="built-by-text text-center text-md-start me-md-auto">
							{"Built with "}
							&#9829;
							{" by "}
							{fContext &&
								<a
									href="https://farcaster.xyz/dry-tortuga"
									target="_blank"
									rel="noopener noreferrer nofollow"
									onClick={fOpenLinkToOwner}>
									<b>{"drytortuga"}</b>
								</a>
							}
							{!fContext &&
								<a
									href="https://twitter.com/dry_tortuga"
									target="_blank"
									rel="noopener noreferrer nofollow">
									{"drytortuga"}
								</a>
							}
						</div>
						<div className="icons-row d-flex align-items-center justify-content-center">
							<a
								className="btn btn-clear text-white me-md-2"
								href="https://twitter.com/songbirdz_cc"
								target="_blank"
								rel="noopener noreferrer nofollow"
								onClick={fOpenExternalURL}>
								<i className="fa fa-brands fa-twitter" />
							</a>
							<a
								className="btn btn-clear text-white me-md-2"
								href="https://t.me/songbirdz_cc"
								target="_blank"
								rel="noopener noreferrer nofollow"
								onClick={fOpenExternalURL}>
								<i className="fa fa-brands fa-telegram" />
							</a>
							<a
								className="btn btn-clear  me-md-2"
								href="https://farcaster.xyz/~/channel/songbirdz"
								rel="noopener noreferrer nofollow"
								target="_blank"
								onClick={fOpenLinkToChannel}>
								<img
									alt=""
									src={farcasterLogo}
									style={{
										width: "1.5rem",
										height: "auto",
									}} />
							</a>
							<a
								className="btn btn-clear me-md-2"
								href="https://opensea.io/collection/songbirdz"
								rel="noopener noreferrer nofollow"
								target="_blank"
								onClick={fOpenExternalURL}>
								<img
									alt=""
									src={openseaLogo}
									style={{
										width: "1.5rem",
										height: "auto",
									}} />
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);

};

export default Footer;
