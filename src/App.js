import React from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Outlet,
	Route,
	RouterProvider,
} from "react-router-dom";

import { GiftProvider } from "./contexts/gift";
import { IdentificationProvider } from "./contexts/identification";
import { WalletProvider } from "./contexts/wallet";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const AppWrapper = () => {

	return (
		<WalletProvider>
			<GiftProvider>
				<IdentificationProvider>
					<Navbar />
					<Outlet />
					<Footer />
				</IdentificationProvider>
			</GiftProvider>
		</WalletProvider>
	);

};

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path="/"
			element={<AppWrapper />}>
			<Route
				path="about"
				lazy={() => import("./routes/about")} />
			<Route
				path="bird-of-the-week"
				lazy={() => import("./routes/birdOfTheWeek")} />
			<Route
				path="collection"
				lazy={() => import("./routes/gallery")} />
			<Route
				path="collection/:id"
				lazy={() => import("./routes/details")} />
			<Route
				path="leaderboard"
				lazy={() => import("./routes/leaderboard")} />
			<Route
				path="memory-match"
				lazy={() => import("./routes/memoryMatchGame")} />
			<Route
				path=""
				lazy={() => import("./routes/home")} />
		</Route>
	)
);

const App = () => {

	return (
		<div className="app">
			<RouterProvider router={router} />
		</div>
	);

};

export default App;
