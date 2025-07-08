import React, { useEffect, useMemo, useState } from "react";
import { Table, Pagination } from "react-bootstrap";

import { useFarcasterContext } from "../contexts/farcaster";
import { useWalletContext } from "../contexts/wallet";

import AccountOwner from "./AccountOwner";

import "./LeaderboardTable.css";

const PAGE_SIZE = 10;

const LeaderboardTable = (props) => {

    const { users, onUserClick } = props;

   	const { fPopulateUsers } = useFarcasterContext();
    const { account } = useWalletContext();

    const [currentPage, setCurrentPage] = useState(1);

    const [farcasterUsers, setFarcasterUsers] = useState(null);

    // Add farcaster user data
	useEffect(() => {

		const populate = async () => {

			const result = await fPopulateUsers(users);

			setFarcasterUsers(result);

		}

		populate();

	}, [users, fPopulateUsers]);

    // Calculate pagination
	const paginationState = useMemo(() => {

		if (!farcasterUsers) { return null; }

		const totalPages = Math.ceil(farcasterUsers.length / PAGE_SIZE);

		const startIndex = (currentPage - 1) * PAGE_SIZE;
		const endIndex = startIndex + PAGE_SIZE;

		const currentUsers = farcasterUsers.slice(startIndex, endIndex);

		return {
			currentUsers,
			totalPages,
			startIndex,
			endIndex,
		};

	}, [farcasterUsers, currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

	console.log(farcasterUsers);

	if (!paginationState || !paginationState.currentUsers) {
		return <i className="fa-solid fa-spinner fa-spin fa-xl me-2" />;
	}

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
                                style={{ textDecoration: 'none' }}
                                onClick={() =>
                                    onUserClick({
                                        account: user.address,
                                        total: user.total,
                                    })
                                }>
                                <AccountOwner
	                                user={{ address: user.address, farcaster: user.farcaster }}
	                                showLinkToProfile={false} />
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
