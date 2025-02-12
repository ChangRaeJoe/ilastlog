const os = require("node:os");
const { DateTime } = require("luxon");
const readline = require("node:readline");
console.debug = (msg) => {
	if (process.env.NODE_ENV == "production") return;
	console.debug("debug:", msg);
};

const dummyTexts = [
	"Feb 10 15:02:37 joe-ka56k login[12345]: pam_unix(login:session) for uuu by uuu",
	"2025-02-10T15:02:37.027236+09:00 joe-15U480-KA56K login[24943]: pam_unix(login:session): session closed f",
	"Mon, 10 Feb 2025 15:02:37 +0900 joe-15U480-KA56K login[24943]: pam_unix(login:session): session closed f",
];
const formats = () => {
	return [
		"MMM dd HH:mm:ss", //syslog(default)
		"yyyy-MM-dd'T'HH:mm:ss.SSSZZ", //ISO 8601
		"EEE, dd MMM yyyy HH:mm:ss Z", // RFC 2822
	];
};

const combinedPatterns = (() => {
	const timePatterns = [
		"(?<timestamp>\\b\\w{3} \\d{1,2} \\d{2}:\\d{2}:\\d{2}\\b)",
		"(?<timestamp>\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{6}[+-]\\d{2}:\\d{2})",
		"(?<timestamp>\\w{3}, \\d{2} \\w{3} \\d{4} \\d{2}:\\d{2}:\\d{2} [+-]\\d{4})",
	];
	const logPattern =
		"(?<hostname>\\S+) (?<process>.+?(?=\\[)|.+?(?=))[^a-zA-Z0-9](?<pid>\\d{1,7}|)[^a-zA-Z0-9]{1,3}(?<info>.*)";

	return timePatterns.map((pattern, idx) => {
		return new RegExp([pattern, logPattern].join(" "), "gi");
	});
})();

function parseTimeStamp(log) {
	const str = log.split(" ").slice(0, 2).join(" ");
	for (const format of formats) {
		const parsedTime = DateTime.fromFormat(log, format, { zone: "local" });
		console.log(parsedTime);
	}
}

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

function printParsed(objArr, filterList) {
	let text = "";
	for (const obj of objArr) {
		for (const element of filterList) {
			text += `${obj[element]}\t`;
		}
		console.debug(obj);
		text += "\n";
	}
	console.log(text);
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
	printParsed(parsedArr, ["timestamp", "info"]);
});
