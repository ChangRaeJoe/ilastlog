const os = require("node:os");
const { captureName } = require("./pattern.json");
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

function calculate(textArr, _options) {
	// selete sentence using hint option
	textArr = textArr.filter((str, idx) => {
		//here options.hint
		return str.includes(_options.hint);
	});

	//caputre
	const parsedArr = captureLog(textArr, combinedPatterns);
	// sort and then fillter among capturedNames
	const compareName = compareGenerator(captureName.name);
	const compareTimeStamp = compareGenerator(captureName.timestamp);
	const sortedArr = parsedArr
		.sort(compareTimeStamp)
		.sort(compareName)
		.map((obj, idx) => {
			return {
				[captureName.name]: obj.name,
				[captureName.timestamp]: obj.timestamp,
			};
		})
		// only the latest date
		.reduceRight((acc, cur) => {
			let haveName = false;
			for (const obj of acc) {
				if (obj.name == cur.name) {
					haveName = true;
				}
			}
			if (!haveName) {
				acc.unshift(cur);
			}
			return acc;
		}, []);
	//here options.delimiter
	console.log(authStringify(sortedArr, _options.delimiter));
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
	calculate,
};
