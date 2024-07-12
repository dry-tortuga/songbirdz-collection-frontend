import React from "react";
import { Link } from "react-router-dom";
import { Form, Pagination, Table } from "react-bootstrap";

import AccountOwner from "./AccountOwner";
import BirdAudioFile from "./BirdAudioFile";

import "./BirdsTable.css";

const BirdsTable = (props) => {

	const {
		birds,
		pagination,
		showOnlyUnidentifiedBirds,
		setShowOnlyUnidentifiedBirds,
		onChangePage,
	} = props;

	return (
		<>
			<Table
				className="birds-table fw-normal"
				hover
				responsive>
				<thead>
					<tr>
						<th scope="col">
							<div className="flex flex-col flex-lg-row">
								{"#"}
								{pagination.current_page === 0 &&
									<Form className="ms-lg-3">
										<Form.Check
											type="switch"
											id="show-only-unidentified-birds"
											label="Show Unidentified"
											checked={showOnlyUnidentifiedBirds}
											onChange={(event) => setShowOnlyUnidentifiedBirds(event.target.checked)} />
									</Form>
								}
							</div>
						</th>
						<th
							className="d-none d-md-table-cell text-center"
							scope="col">
							{"Song Audio"}
						</th>
						<th
							className="text-center"
							scope="col">
							{"Species"}
						</th>
					</tr>
				</thead>
				<tbody>
					{birds.length === 0 &&
						<span>
							{"Nothing to show here..."}
						</span>
					}
					{birds.map((bird, index) => (
						<tr key={index}>
							<td>
								<div>
									<img
										alt={bird.name}
										src={bird.image}
										style={{
											width: 50,
											height: 50,
											borderRadius: "15%"
										}} />
									<div className="d-flex flex-column flex-lg-row align-items-center ms-1 ms-lg-3">
										<Link
											className="text-info"
											to={`/collection/${bird.id}`}>
											{bird.name}
										</Link>
										{bird.owner &&
											<AccountOwner
												className="ms-lg-3"
												account={bird.owner} />
										}
									</div>
								</div>
							</td>
							<td className="d-none d-md-table-cell">
								<div className="justify-content-center">
									<BirdAudioFile birdId={bird.id} />
								</div>
							</td>
							<td>
								<div className="justify-content-end justify-content-sm-center">
									<span className="text-end">
										{bird.species || "ERROR"}
									</span>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
			<Pagination>
				<Pagination.First
					disabled={pagination.current_page <= 2}
					onClick={() => onChangePage(0)} />
				{Array.from({ length: pagination.num_pages }, (value, index) => index).map((number) => {

					let start = 0;
					if (pagination.current_page === 0) {
						start += 2;
					} else if (pagination.current_page === 1) {
						start += 1;
					}

					let end = 0;
					if (pagination.current_page === pagination.num_pages - 1) {
						end += 2;
					} else if (pagination.current_page === pagination.num_pages - 2) {
						end += 1;
					}

					if (pagination.num_pages <= 5 || (
						number >= (pagination.current_page - 2 - end) &&
						number <= (pagination.current_page + 2 + start)
					)) {

						return (
							<Pagination.Item
								key={number}
								active={number === pagination.current_page}
								onClick={() => onChangePage(number)}>
								{number + 1}
							</Pagination.Item>
						);

					}

					return null;

				})}
				<Pagination.Last
					disabled={pagination.current_page >= (pagination.num_pages - 3)}
					onClick={() => onChangePage(pagination.num_pages - 1)} />
			</Pagination>
		</>
	);

};

export default BirdsTable;
