import React from 'react';
import ReactDOM from 'react-dom';
import { Web3ReactProvider } from '@web3-react/core'
import { Buffer } from 'buffer';

import App from './App';
import { WALLET_CONNECTORS } from './contexts/wallet';

import 'bootswatch/dist/sketchy/bootstrap.min.css';
import './index.css';

// Polyfill window buffer object for wallet connection logic
window.Buffer = window.Buffer || Buffer;

ReactDOM.render(
	<React.StrictMode>
		<Web3ReactProvider connectors={WALLET_CONNECTORS}>
			<App />
		</Web3ReactProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
