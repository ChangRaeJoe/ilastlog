#! /usr/bin/env node

const { program } = require("commander");
const readline = require("readline");
const os = require("node:os");
const { calculate } = require("../utils");
const constant = require("../constant.js");

// command
const DEFAULT_DEL = constant.DEFAULT_DEL;
const DEFAULT_HINT = constant.DEFAULT_HINT;

program
	.name("ilastlog")
	.description("desc")
	.version("1.0.0", "-v, --version", "current version")
	.option("--hint <hint>", "To find out per line", DEFAULT_HINT)
	.option(
		"-d, --delimiter <delimiter>",
		"sentences added delimiter before stdout",
		DEFAULT_DEL
	)
	.argument("[argText]", "input data", "")
	.action(function (argText, options, command) {
		if (argText.length == 0) {
			startUsingStdin(options);
		} else {
			startUsingArg(argText, options);
		}
	});

program.parse();

//stdin, stdout, stderr
function startUsingStdin(options) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: false,
	});
	const inputTexts = [];

	rl.on("line", (line) => {
		inputTexts.push(line);
	}).on("close", () => {
		calculate(inputTexts, options);
	});
}

function startUsingArg(argText, options) {
	const inputTexts = [];
	for (const text of argText.split(os.EOL)) {
		inputTexts.push(text);
	}
	calculate(inputTexts, options);
}
