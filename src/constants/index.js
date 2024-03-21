import ANSWER_CHOICES from './options';

const NUM_BIRDS_TOTAL = 1000;

const COLLECTION_BIRD_SIZE = 1000;

const COLLECTIONS = [{
	name: "Picasso",
	count: 1000,
	min_id: 0,
	max_id: 999,
}];

const EVENTS = {
	BIRD_ID: "BirdIdentification",
	TRANSFER: "Transfer",
};

export {
	ANSWER_CHOICES,
	NUM_BIRDS_TOTAL,
	COLLECTION_BIRD_SIZE,
	COLLECTIONS,
	EVENTS,
};
