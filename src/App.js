import React from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Outlet,
	Route,
	RouterProvider,
} from "react-router-dom";

import { GiftProvider } from "./contexts/gift";
import { IdentificationProvider } from "./contextxs/identification";
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
				path="sounds-of-summer-2024"
				lazy={() => import("./routes/soundsOfSummer")} />
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
			<Footer />
		</div>
	);

};

export default App;
