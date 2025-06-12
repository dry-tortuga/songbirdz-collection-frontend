import React, { useMemo, useState } from "react";
import { Table, Pagination } from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import AccountOwner from "./AccountOwner";

import "./LeaderboardTable.css";

const PAGE_SIZE = 10;

const LeaderboardTable = (props) => {

    const { users, onUserClick } = props;

    const { account } = useWalletContext();

    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
	const paginationState = useMemo(() => {

		const totalPages = Math.ceil(users.length / PAGE_SIZE);

		const startIndex = (currentPage - 1) * PAGE_SIZE;
		const endIndex = startIndex + PAGE_SIZE;

		const currentUsers = users.slice(startIndex, endIndex);

		return {
			currentUsers,
			totalPages,
			startIndex,
			endIndex,
		};

	}, [users, currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Table className="leaderboard-table fw-normal" hover responsive>
                <thead>
                    <tr>
                        <th scope="col">{"#"}</th>
                        <th className="ps-5" scope="col">
                            {"Account"}
                        </th>
                        <th scope="col">{"Birder Points"}</th>
                    </tr>
                </thead>
                <tbody>
                    {paginationState.currentUsers.length === 0 &&
                    	<span>{"Nothing to show here..."}
                     </span>}
                    {paginationState.currentUsers.map((user, index) => (
                        <tr
                            key={paginationState.startIndex + index}
                            className={
                                account && user.address.toLowerCase() === account.toLowerCase()
                                    ? "current-user"
                                    : ""
                            }>
                            <td>
                                <span>
                                	{paginationState.startIndex + index + 1}
                                </span>
                                {account &&
                                    user.address.toLowerCase() === account.toLowerCase() && (
                                        <span className="ms-3">{"(You)"}</span>
                                    )}
                            </td>
                            <td>
                                <a
                                    href="#"
                                    title="View Life List"
                                    onClick={() =>
                                        onUserClick({
                                            account: user.address,
                                            total: user.total,
                                        })
                                    }>
                                    <AccountOwner account={user.address} />
                                </a>
                            </td>
                            <td>{user.total}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {paginationState.totalPages > 1 && (
                <Pagination className="justify-content-center">
                    <Pagination.First
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1} />
                    {[...Array(paginationState.totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={(index + 1) === currentPage}
                            onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Last
                        onClick={() => handlePageChange(paginationState.totalPages)}
                        disabled={currentPage === paginationState.totalPages} />
                </Pagination>
            )}
        </>
    );
};

export default LeaderboardTable;
