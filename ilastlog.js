const os = require("node:os");
const readline = require("node:readline");
console.debug = (msg) => {
	if (process.env.NODE_ENV == "production") return;
	console.debug("debug:", msg);
};

const combinedPatterns = (() => {
	const timePatterns = [
		"(?<timestamp>\\b\\w{3} \\d{1,2} \\d{2}:\\d{2}:\\d{2}\\b)",
		"(?<timestamp>\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{6}[+-]\\d{2}:\\d{2})",
		"(?<timestamp>\\w{3}, \\d{2} \\w{3} \\d{4} \\d{2}:\\d{2}:\\d{2} [+-]\\d{4})",
	];
	const logPattern =
		// "(?<hostname>\\S+) (?<process>.+?(?=\\[)|.+?(?=))[^a-zA-Z0-9](?<pid>\\d{1,7}|)[^a-zA-Z0-9]{1,3}(?<info>.*)";
		"(?<hostname>\\S+) (?<process>.+?(?=\\[)|.+?(?=))[^a-zA-Z0-9](?<pid>\\d{1,7}|)[^a-zA-Z0-9]{1,3}.*for user (?<info>.*)\\(.*\\) by.*";

	return timePatterns.map((pattern, idx) => {
		return new RegExp([pattern, logPattern].join(" "), "gi");
	});
})();

function captureLog(_texts, regx) {
	// arg1: str[], arg2: regex[]
	const result = [];
	for (const text of _texts) {
		for (const re of regx) {
			for (const matchedObj of text.matchAll(re)) {
				if (!!matchedObj.groups) {
					result.push(matchedObj.groups);
				}
			}
		}
	}
	return result;
}

// object의 value값들을 특정 문자로 나뉘어진 문자열로 만듦.
function authStringify(objArr, delimiter) {
	let text = "";
	for (const obj of objArr) {
		text += Object.values(obj).join(delimiter);
		console.debug(obj);
		text += "\n";
	}
	console.log(text);
}

function compareGenerator(key) {
	return function (a, b) {
		if (a[key] == b[key]) return 0;
		else if (a[key] < b[key]) return -1;
		else return 1;
	};
}

// const textArr = 'text\ntext2\n'.split(os.EOL);
// stamp, foramt
// for (const text of texts) {
// 	parseTimeStamp(text);
// }
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false,
});
const inputTexts = [];

rl.on("line", (line) => {
	inputTexts.push(line);
}).on("close", () => {
	const parsedArr = captureLog(inputTexts, combinedPatterns);
	const compareName = compareGenerator("info");
	const compareTimeStamp = compareGenerator("timestamp");
	const sortedArr = parsedArr
		.sort(compareTimeStamp)
		.sort(compareName)
		.map((obj, idx) => {
			return {
				info: obj.info,
				timestamp: obj.timestamp,
			};
		});
	authStringify(sortedArr, ",");
});
