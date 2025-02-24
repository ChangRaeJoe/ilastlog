require("module-alias/register");

const os = require("node:os");
let { calculate, OriginPrint, delimiterPrint } = require("@lib/utils");
const constant = require("@configs/constant");
const _ = require("lodash");

const options = {};
const defaults = {
	delimiter: constant.DEFAULT_DEL,
	hint: constant.DEFAULT_HINT,
};
_.defaults(options, defaults);

const pre_calculate = calculate;
calculate = (textArr, _options) => {
	// set opt
	setOptions(_options);

	const result = pre_calculate(textArr, options);

	if (options.delimiter.length < 1) {
		return OriginPrint(result);
	} else {
		return delimiterPrint(result, options.delimiter);
	}
};
function setGetnerator(toSetKey) {
	return (opts) => {
		if (!_.isString(opts[toSetKey])) {
			return 1;
		} else {
			options[toSetKey] = opts[toSetKey];
			return 0;
		}
	};
}

function setOptions(opts) {
	opts = _.defaults(opts, options);
	const setFuncs = [setDelimiter, setHint];

	for (const func of setFuncs) {
		// if error, return not 1;
		if (func(opts)) {
			console.error(`Not String: value in options.key ${JSON.stringify(opts)}`);
		}
	}
}
function setConfigs(confs) {
	//timeStamp pattern, log pattern, capture name
	console.warn("not supported yet");
	return;
}
function getConfigs() {
	const ptns = require("@configs/pattern");
	console.warn("not supported yet");

	return ptns;
}

const getOptions = () => options;
const setDelimiter = setGetnerator("delimiter");
const setHint = setGetnerator("hint");
const getDelimiter = () => options.delimiter;
const getHint = () => options.hint;

module.exports = {
	ilastlog: calculate,
	getDelimiter,
	getHint,
	setOptions,
	getOptions,
};
