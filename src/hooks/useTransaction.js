import { useCallback, useState } from "react";

const useTransaction = () => {

	const [data, setData] = useState({
		timestamp: null,
		transaction: null,
		pending: false,
		success: false,
		error: false,
		errorMsg: null,
	});

	const resetData = useCallback(() => setData({
		timestamp: null,
		transaction: null,
		pending: false,
		success: false,
		error: false,
		errorMsg: null,
	}), []);

	return [data, setData, resetData];

};

export default useTransaction;
