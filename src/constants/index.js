import ANSWER_CHOICES_FLOCK_2 from './answer-choices/small-and-mighty-2-options';
import ANSWER_CHOICES_FLOCK_3 from './answer-choices/night-and-day-3-options';
import ANSWER_CHOICES_FLOCK_4 from './answer-choices/fire-and-ice-4-options';
import ANSWER_CHOICES_FLOCK_5 from './answer-choices/predator-and-prey-5-options.json';

import FAMILIES from './families';

const NUM_BIRDS_TOTAL = 6000;

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
}, {
	name: "Small & Mighty",
	count: 1000,
	min_id: 2000,
	max_id: 2999
}, {
	name: "Night & Day",
	count: 1000,
	min_id: 3000,
	max_id: 3999,
}, {
	name: "Fire & Ice",
	count: 1000,
	min_id: 4000,
	max_id: 4999,
}, {
    name: "Predator & Prey",
    count: 1000,
    min_id: 5000,
    max_id: 5999,
}];

const CURRENT_COLLECTION_MIN_ID = process.env.REACT_APP_NODE_ENV === "production" ? 2000 : 0;
const CURRENT_COLLECTION_MAX_ID = 5999;

const EVENTS = {
	BIRD_ID: "BirdIdentification",
	TRANSFER: "Transfer",
};

const ALREADY_IDENTIFIED_BIRDS = {};

export {
	ANSWER_CHOICES_FLOCK_2,
	ANSWER_CHOICES_FLOCK_3,
	ANSWER_CHOICES_FLOCK_4,
	ANSWER_CHOICES_FLOCK_5,
	FAMILIES,
	NUM_BIRDS_TOTAL,
	COLLECTION_BIRD_SIZE,
	COLLECTIONS,
	CURRENT_COLLECTION_MIN_ID,
	CURRENT_COLLECTION_MAX_ID,
	EVENTS,
	ALREADY_IDENTIFIED_BIRDS,
};
