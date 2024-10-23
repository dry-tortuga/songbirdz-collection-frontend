import React from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Outlet,
	Route,
	RouterProvider,
} from "react-router-dom";

import { WalletProvider } from "./contexts/wallet";

import Navbar from "./components/Navbar";

const AppWrapper = (props) => {

	return (
		<WalletProvider>
			<Navbar />
			<Outlet />
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
				lazy={() => import("./routes/listing")} />
			<Route
				path="collection/:id"
				lazy={() => import("./routes/details")} />
			<Route
				path="leaderboard"
				lazy={() => import("./routes/leaderboard")} />
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
		</div>
	);

};

export default App;
