import React from "react";
import { Link } from "react-router-dom";

import homeImage1 from "../images/home1.png";
import homeImage2 from "../images/home2.jpg";
import homeImage3 from "../images/home3.jpg";
import homeImage4 from "../images/home4.jpg";
import homeImage5 from "../images/home5.jpg";

import "./Home.css";

const HomeContainer = () => {

	return (
		<div className="home-page">
			<header className="masthead">
				<div className="container px-md-5">
					<div className="row gx-5 align-items-center">
						<div className="col-lg-6">
							<div className="mb-5 mb-lg-0 text-center">
								<h1 className="display-1 lh-1 mb-3">
									{"Songbirdz"}
								</h1>
								<p className="lead fw-normal mb-md-5">
									{"An onchain bird watching game"}
								</p>
								<div className="d-flex flex-column flex-lg-row gap-3 align-items-center justify-content-center">
									<a
										className="btn btn-secondary"
										href="/collection?number=7&hide_already_identified=true">
										{"Explore Collection"}
									</a>
									<a
										className="btn btn-secondary"
										href="/memory-match">
										{"Play Memory Match Game"}
									</a>
								</div>
							</div>
						</div>
						<div className="col-lg-6">
							<div className="masthead-main-image">
								<div className="image-wrapper">
									<img
										alt=""
										src={homeImage1} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>
			<aside className="text-center bg-secondary">
				<div className="container px-5">
					<div className="row gx-5 justify-content-center">
						<div className="col-xs-12">
							<div className="h2 fs-3 text-white mb-4">
								{"The Songbirdz collection on Base consists of 10,000 birds who love nothing more than to sing a sweet tune. Each bird starts as an unidentified species with its name hidden. Listen to the bird's song, identify it as the correct species, and add it to your birding life list!"}
							</div>
						</div>
					</div>
					<div className="d-flex flex-column flex-lg-row align-items-center justify-content-center">
						<Link
							className="btn btn-outline-light me-lg-3 mb-4 mb-lg-0 py-3 px-4 rounded-pill"
							to="/collection?number=7&hide_already_identified=true">
							{"Get Started"}
						</Link>
					</div>
				</div>
			</aside>
			<section className="images-banner m-0 p-0">
				<div className="row g-0">
					<div className="col-6 col-md">
						<img
							alt=""
							src={homeImage2} />
					</div>
					<div className="col-6 col-md">
						<img
							alt=""
							src={homeImage3} />
					</div>
					<div className="col-6 col-md">
						<img
							alt=""
							src={homeImage4} />
					</div>
					<div className="col-6 col-md">
						<img
							alt=""
							src={homeImage5} />
					</div>
				</div>
			</section>
		</div>
	);

};

export default HomeContainer;
