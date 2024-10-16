import React from 'react';
import {
	BrowserRouter,
	Outlet,
	Routes,
	Route,
} from 'react-router-dom';

import { WalletProvider } from './contexts/wallet';

import Navbar from './components/Navbar';

import About from './containers/About';
import BirdListing from './containers/BirdListing';
import BirdDetails from './containers/BirdDetails';
import Home from './containers/Home';
import Leaderboard from './containers/Leaderboard';
import SoundsOfSummer from './containers/SoundsOfSummer';

const AppWrapper = (props) => {

	return (
		<WalletProvider>
			<Navbar />
			<Outlet />
		</WalletProvider>
	);

};

const App = () => {

	return (
		<div className="app">
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={<AppWrapper />}>
						<Route
							path="about"
							element={<About />} />
						<Route
							path="collection"
							element={<BirdListing />} />
						<Route
							path="collection/:id"
							element={<BirdDetails />} />
						<Route
							path="leaderboard"
							element={<Leaderboard />} />
						<Route
							path="sounds-of-summer-2024"
							element={<SoundsOfSummer />} />
						<Route
							path=""
							element={<Home />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);

};

export default App;
