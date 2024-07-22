import ANSWER_CHOICES from './waterfowl-1-options';
import FAMILIES from './families';

const NUM_BIRDS_TOTAL = 2000;

const COLLECTION_BIRD_SIZE = 1000;

const COLLECTIONS = [{
	name: "Picasso Genesis",
	count: 1000,
	min_id: 0,
	max_id: 999,
}, {
	name: "Deep Blue",
	count: 1000,
	min_id: 1000,
	max_id: 1999,
}];

const EVENTS = {
	BIRD_ID: "BirdIdentification",
	TRANSFER: "Transfer",
};

const ALREADY_IDENTIFIED_BIRDS = {};

export {
	ANSWER_CHOICES,
	FAMILIES,
	NUM_BIRDS_TOTAL,
	COLLECTION_BIRD_SIZE,
	COLLECTIONS,
	EVENTS,
	ALREADY_IDENTIFIED_BIRDS,
};
