const readline = require("node:readline");
const {
	authStringify,
	captureLog,
	combinedPatterns,
	compareGenerator,
} = require("./ilastlog");
const { captureName } = require("./pattern.json");

const sampleTexts = [
	"Mon, 10 Feb 2025 15:02:37 +0900 joe-1hostname CRON[17340]: pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)",
	"Feb 10 15:02:37 joe-1hostname CRON[17340]: pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)",
	"2025-02-01T22:45:32.861235+09:00 joe-1hostname CRON[17340]: pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)",
	"2025-02-25T12:55:01.861235+09:00 joe-1hostname CRON[17340]: pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)",
];

function sample(inputTexts) {
	const parsedArr = captureLog(inputTexts, combinedPatterns);
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
}

sample(sampleTexts);
