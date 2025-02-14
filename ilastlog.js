const os = require("node:os");
const {
	time: timePatterns,
	login: logPattern,
	custom: customPattern,
} = require("./pattern.json");
const pre_debug = console.debug;
console.debug = (msg) => {
	if (process.env.NODE_ENV == "production") return;
	pre_debug("debug:", msg);
};

const combinedPatterns = ((_timePatterns, _logPattern, _customPattern) => {
	// timePatterns: regex[], logPatterns: string
	// priority: customPattern(high), logPattern(low)
	if (_customPattern.length !== 0) {
		_logPattern = _customPattern;
	}
	return _timePatterns.map((pattern, idx) => {
		return new RegExp([pattern, _logPattern].join(" "), "gi");
	});
})(timePatterns, logPattern, customPattern);

function captureLog(_texts, regx) {
	// arg1: str[], arg2: regex[]
	const result = [];
	for (const text of _texts) {
		for (const re of regx) {
			for (const matchedObj of text.matchAll(re)) {
				if (!!matchedObj.groups) {
					result.push(matchedObj.groups);
					break;
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
		// console.debug(obj);
		text += "\n";
	}
	return text;
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

// 내보내기
module.exports = {
	combinedPatterns,
	compareGenerator,
	captureLog,
	authStringify,
};
