import React, { useMemo } from "react";
import { Table } from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import AccountOwner from "./AccountOwner";

import "./LeaderboardTable.css";

const LeaderboardTable = (props) => {

    const { users, onUserClick } = props;

    const { account } = useWalletContext();

    const filteredUsers = useMemo(() => {

        let result = users
            .filter(
                (user) =>
                    user.address.toLowerCase() !==
                        "0x3fb4920e09493b2bc7e9b7e14ea7585ca8babf21" &&
                    user.address.toLowerCase() !==
                        "0x585d3ef48e12cb1be6837109b0853afe78b5ebe3" &&
                    user.address.toLowerCase() !==
                        "0x2d437771f6fbedf3d83633cbd3a31b6c6bdba2b1",
            )
            .slice(0, 51);

        result.sort((temp1, temp2) => {
            if (temp1.total > temp2.total) {
                return -1;
            }

            if (temp1.total < temp2.total) {
                return 1;
            }

            return 0;
        });

        return result;

    }, [users]);

    return (
        <Table className="leaderboard-table fw-normal" hover responsive>
            <thead>
                <tr>
                    <th scope="col">{"Rank"}</th>
                    <th className="ps-5" scope="col">
                        {"Account"}
                    </th>
                    <th scope="col">{"Birder Points"}</th>
                </tr>
            </thead>
            <tbody>
                {filteredUsers.length === 0 && <span>{"Nothing to show here..."}</span>}
                {filteredUsers.map((user, index) => (
                    <tr
                        key={index}
                        className={
                            account && user.address.toLowerCase() === account.toLowerCase()
                                ? "current-user"
                                : ""
                        }>
                        <td>
                            <span>{index + 1}</span>
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
    );
};

export default LeaderboardTable;
