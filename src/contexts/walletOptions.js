import React, { useEffect, useState } from 'react';
import { Connector, useConnect } from 'wagmi';

const WalletOptions = () => {
 
	const { connectors, connect } = useConnect();

	return connectors.map((connector) => (
		<WalletOption
			key={connector.uid}
			connector={connector}
			onClick={() => connect({ connector })}
		/>
	));

}

const WalletOption = ({ connector, onClick }) => {

	const [ready, setReady] = React.useState(false)

	useEffect(() => {

		const isReady = async () => {

			const provider = await connector.getProvider();
			setReady(Boolean(provider));

		};

		isReady();

	}, [connector])

	return (
		<button
			disabled={!ready}
			onClick={onClick}>
			{connector.name}
		</button>
	);

};

export default WalletOptions;
