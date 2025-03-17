import React from "react";
import { Table } from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import AccountOwner from "./AccountOwner";

import "./LeaderboardTable.css";

const LeaderboardTable = (props) => {

    const { users, onUserClick } = props;

    const { account } = useWalletContext();

    return (
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
                {users.length === 0 && <span>{"Nothing to show here..."}</span>}
                {users.map((user, index) => (
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
