import React from "react";
import PropTypes from "prop-types";
import { Pagination } from "react-bootstrap";

const PaginationControls = ({ page, totalPages, onChange }) => {

	if (totalPages <= 1) { return null; }

	return (
		<Pagination className="justify-content-center">
			<Pagination.First disabled={page === 1} onClick={() => onChange(1)} />
			{[...Array(totalPages)].map((_, index) => (
				<Pagination.Item
					key={index + 1}
					active={index + 1 === page}
					onClick={() => onChange(index + 1)}>
					{index + 1}
				</Pagination.Item>
			))}
			<Pagination.Last disabled={page === totalPages} onClick={() => onChange(totalPages)} />
		</Pagination>
	);

};

PaginationControls.propTypes = {
	page: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default PaginationControls;