import season1 from "./points/season-1-top-50.json";
import season2 from "./points/season-2-top-50.json";
import season3 from "./points/season-3-top-50.json";
import season4 from "./points/season-4-top-50.json";
import season5 from "./points/season-5-top-50.json";
import season6 from "./points/season-6-top-50.json";
import season7 from "./points/season-7-top-50.json";
import season8 from "./points/season-8-top-50.json";

// Read-only archive of every Birder Points season.
export const ARCHIVE_SEASONS = [{
	id: 1,
	title: "Big Onchain Summer",
	dates: "April 4th, 2024 (Songbirdz genesis) to August 31st, 2024",
	data: season1,
	prizes: [
		"Top 10: 1 airdrop from each of the remaining 9 flocks, i.e. 9 birds each",
		"Top 10: 0.339975 ETH split amongst the top 10",
		"Top 10: 1325 TOAST",
		"Top 10: 5 pack of Paint Cartridges from dot.fan",
		"Top 10: 1000 KIBBLE from cat.town",
	],
}, {
	id: 2,
	title: "Big Onchain Fall",
	dates: "September 1st, 2024 to November 30th, 2024",
	data: season2,
	prizes: [
		"Top 10: 1 airdrop from each of the remaining 7 flocks, i.e. 7 birds each",
		"Top 10: 0.25 ETH split amongst the top 10",
		"Top 5: $10 worth of PEPLO",
		"1st place: 1 plot on the Million Bit Homepage",
	],
}, {
	id: 3,
	title: "Big Onchain Winter",
	dates: "December 1st, 2024 to February 28th, 2025",
	data: season3,
	prizes: [
		"Top 10: 0.25 ETH split amongst the top 10",
		"Top 10: 1 Based ShibaPunkz NFT each",
		"Top 10: 1 BaseBulls NFT each",
		"Top 10: $3.50 worth of TOAST each",
	],
}, {
	id: 4,
	title: "Big Onchain Spring",
	dates: "March 1st, 2025 to May 31st, 2025",
	data: season4,
	prizes: [
		"Top 10: 0.25 ETH split amongst the top 10 (% based on Birder Points)",
		"Top 10: 1 Base Colors NFT each",
		"Top 3: 1 custom Pixel Art NFT each from xPoli",
		"1st place: 4 BMX",
		"1st place: 100,000 QR",
	],
}, {
	id: 5,
	title: "Big Onchain Summer 2.0",
	dates: "June 1st, 2025 to August 31st, 2025",
	data: season5,
	prizes: [
		"Top 10: 0.25 ETH split amongst the top 10 (% based on Birder Points)",
		"Top 5: 1986.5 KIBBLE (~$10 each) from Cat Town",
		"Top 3: 1 trophy each in the Songbirdz Hall of Fame",
	],
}, {
	id: 6,
	title: "Big Onchain Fall 2.0",
	dates: "September 1st, 2025 to November 30th, 2025",
	data: season6,
	prizes: [
		"Top 10: 0.25 ETH split amongst the top 10 (% based on Birder Points)",
		"Top 10: 1 Blueprint Pack from Vibe Market",
		"Top 3: 1 trophy each in the Songbirdz Hall of Fame",
	],
}, {
	id: 7,
	title: "Big Onchain Winter 2.0",
	dates: "December 1st, 2025 to February 28th, 2026",
	data: season7,
	prizes: [
		"Top 10: 0.15 ETH split amongst the top 10 (% based on Birder Points)",
		"Top 3: 1 trophy each in the Songbirdz Hall of Fame",
	],
}, {
	id: 8,
	title: "Big Onchain Spring 2.0",
	dates: "March 1st, 2026 to May 31st, 2026 (11 PM UTC)",
	data: season8,
	prizes: [
		"Top 10: 0.15 ETH split amongst the top 10 (% based on Birder Points)",
		"Top 3: 1 trophy each in the Songbirdz Hall of Fame",
	],
}];

export const LATEST_ARCHIVE_SEASON = ARCHIVE_SEASONS[ARCHIVE_SEASONS.length - 1].id;
