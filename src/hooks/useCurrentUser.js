import { useEffect, useState } from "react";

const useCurrentUser = ({ context }) => {

	const [data, setData] = useState(null);

	// Fetch the list of birds owned by the current user
	useEffect(() => {

		if (context.account && !data) {
			setData({ account: context.account });
		}

	}, [context, data]);

	return [data, setData];

};

export default useCurrentUser;
