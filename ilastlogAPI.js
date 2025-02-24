require("module-alias/register");

const os = require("node:os");
const { calculate, OriginPrint, delimiterPrint } = require("@lib/utils");
const constant = require("@configs/constant");
const _ = require("lodash");
const { config } = require("node:process");

const wrap_calculate = (textArr, _options) => {
	// default option init
	const defaults = {
		delimiter: constant.DEFAULT_DEL,
		hint: constant.DEFAULT_HINT,
	};
	_options = _.defaults(_options, defaults);
	// isString
	if (!_.isString(_options.delimiter) || !_.isString(_options.hint)) {
		console.error(
			`Not String: value in _options.key ${JSON.stringify(_options)}`
		);
	}

	const result = calculate(textArr, _options);

	if (_options.delimiter.length < 1) {
		return OriginPrint(result);
	} else {
		return delimiterPrint(result, _options.delimiter);
	}
};

module.exports = {
	ilastlog: wrap_calculate,
};
