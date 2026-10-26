import { useMemo, useState } from "react";

const usePagination = (items, pageSize = 10) => {

	const [requestedPage, setPage] = useState(1);

	return useMemo(() => {

		const list = items || [];
		const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
		const page = Math.min(requestedPage, totalPages);
		const start = (page - 1) * pageSize;

		return {
			page,
			totalPages,
			start,
			pageItems: list.slice(start, start + pageSize),
			setPage,
		};

	}, [items, pageSize, requestedPage]);

};

export default usePagination;
