import ANSWER_CHOICES_FLOCK_2 from './answer-choices/small-and-mighty-2-options';
import ANSWER_CHOICES_FLOCK_3 from './answer-choices/night-and-day-3-options';
import ANSWER_CHOICES_FLOCK_4 from './answer-choices/fire-and-ice-4-options';
import ANSWER_CHOICES_FLOCK_5 from './answer-choices/predator-and-prey-5-options.json';
import ANSWER_CHOICES_FLOCK_6 from './answer-choices/love-birds-6-options.json';
import ANSWER_CHOICES_FLOCK_7 from './answer-choices/eggstravaganza-7-options.json';

import FAMILIES from './families';

const NUM_BIRDS_TOTAL = 8000;

const COLLECTION_BIRD_SIZE = 1000;

const FIRST_ID_TO_IDENTIFY = 2402;

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
}, {
	name: "Lovebirds",
	count: 1000,
	min_id: 6000,
	max_id: 6999
}, {
	name: "Eggstravaganza",
	count: 1000,
	min_id: 7000,
	max_id: 7999
}];

const EVENTS = {
	BIRD_ID: "BirdIdentification",
	TRANSFER: "Transfer",
};

const ALREADY_IDENTIFIED_BIRDS = {};

const ADRESSES_TO_IGNORE = [
	"0x3fb4920e09493b2bc7e9b7e14ea7585ca8babf21",
	"0x585d3ef48e12cb1be6837109b0853afe78b5ebe3",
	"0x2d437771f6fbedf3d83633cbd3a31b6c6bdba2b1",
	"0x30f0aef010e5f3e33bdd2eb555d4e02377b9cad5",
	"0x13918a541e129a7ef210183e5e9c54486da3fb04", // Based Media X contract
];

export {
	ANSWER_CHOICES_FLOCK_2,
	ANSWER_CHOICES_FLOCK_3,
	ANSWER_CHOICES_FLOCK_4,
	ANSWER_CHOICES_FLOCK_5,
	ANSWER_CHOICES_FLOCK_6,
	ANSWER_CHOICES_FLOCK_7,
	FAMILIES,
	NUM_BIRDS_TOTAL,
	COLLECTION_BIRD_SIZE,
	FIRST_ID_TO_IDENTIFY,
	COLLECTIONS,
	EVENTS,
	ALREADY_IDENTIFIED_BIRDS,
	ADRESSES_TO_IGNORE,
};
