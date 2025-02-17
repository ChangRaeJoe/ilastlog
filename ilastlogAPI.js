const os = require("node:os");
const { calculate } = require("./utils");
const { default_opts } = require("./constant.json");
const _ = require("lodash");

const wrap_calculate = (textArr, _options) => {
	// default option init
	const defaults = {
		delimiter: default_opts.DEFAULT_DEL,
		hint: default_opts.DEFAULT_HINT,
	};
	_options = _.defaults(_options, defaults);
	// isString
	if (!_.isString(_options.delimiter) || !_.isString(_options.hint)) {
		console.error(
			`Not String: value in _options.key ${JSON.stringify(_options)}`
		);
	}

	return calculate(textArr, _options);
};

module.exports = {
	ilastlog: wrap_calculate,
};
