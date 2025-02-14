const os = require("node:os");
const readline = require("node:readline");
const {
	authStringify,
	captureLog,
	combinedPatterns,
	compareGenerator,
} = require("./ilastlog");
const { captureName } = require("./pattern.json");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false,
});
const inputTexts = [];

rl.on("line", (line) => {
	inputTexts.push(line);
}).on("close", () => {
	//caputre
	const parsedArr = captureLog(inputTexts, combinedPatterns);
	// sort and then fillter among capturedNames
	const compareName = compareGenerator(captureName.info);
	const compareTimeStamp = compareGenerator(captureName.timestamp);
	const sortedArr = parsedArr
		.sort(compareTimeStamp)
		.sort(compareName)
		.map((obj, idx) => {
			return {
				[captureName.info]: obj.info,
				[captureName.timestamp]: obj.timestamp,
			};
		});
	console.log(authStringify(sortedArr, "~"));
});
