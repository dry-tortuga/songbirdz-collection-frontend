import React from "react";

import { useFarcasterContext } from "../contexts/farcaster";

import openseaLogo from "../images/opensea-logomark-blue.svg";
import warpcastLogo from "../images/warpcast-logo.png";
import magicedenLogo from "../images/magiceden-logo.png";

import "./Footer.css";

const Footer = () => {

	const { fContext, fOpenLinkToChannel, fOpenLinkToOwner } = useFarcasterContext();

	return (
		<footer className="footer py-2">
			<div className="container">
				<div className="row align-items-center">
					<div className="col-md-12 flex align-items-center flex-wrap">
						<div className="built-by-text text-center text-md-start me-md-auto">
							{"Built with "}
							&#9829;
							{" by "}
							{fContext &&
								<a
									href="https://warpcast.com/dry-tortuga"
									target="_blank"
									rel="noopener noreferrer nofollow"
									onClick={fOpenLinkToOwner}>
									<b>{"drytortuga.base.eth"}</b>
								</a>
							}
							{!fContext &&
								<a
									href="https://twitter.com/dry_tortuga"
									target="_blank"
									rel="noopener noreferrer nofollow">
									{"drytortuga.base.eth"}
								</a>
							}
						</div>
						<div className="icons-row d-flex align-items-center justify-content-center">
							<a
								href="https://twitter.com/songbirdz_cc"
								target="_blank"
								rel="noopener noreferrer nofollow"
								className="btn btn-clear text-white me-md-2">
								<i className="fa fa-brands fa-twitter"></i>
							</a>
							<a
								href="https://t.me/songbirdz_cc"
								target="_blank"
								rel="noopener noreferrer nofollow"
								className="btn btn-clear text-white me-md-2">
								<i className="fa fa-brands fa-telegram"></i>
							</a>
							<a
								className="btn btn-clear  me-md-2"
								href="https://warpcast.com/~/channel/songbirdz"
								rel="noopener noreferrer nofollow"
								target="_blank"
								onClick={fOpenLinkToChannel}>
								<img
									alt=""
									src={warpcastLogo}
									style={{
										width: "1.5rem",
										height: "auto",
									}} />
							</a>
							<a
								className="btn btn-clear  me-md-2"
								href="https://opensea.io/collection/songbirdz"
								rel="noopener noreferrer nofollow"
								target="_blank">
								<img
									alt=""
									src={openseaLogo}
									style={{
										width: "1.5rem",
										height: "auto",
									}} />
							</a>
							<a
								className="btn btn-clear"
								href="https://magiceden.io/collections/base/0x7c3b795e2174c5e0c4f7d563a2fb34f024c8390b"
								rel="noopener noreferrer nofollow"
								target="_blank">
								<img
									alt=""
									src={magicedenLogo}
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
