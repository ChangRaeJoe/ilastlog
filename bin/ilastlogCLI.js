#! /usr/bin/env node

const os = require("node:os");
const readline = require("readline");

const { calculate } = require("../utils");
const constant = require("../constant.js");
const {
	name: pkgName,
	version: pkgVersion,
	description: pkgDesc,
} = require("../package.json");

const { program } = require("commander");

// option's constant
const DEFAULT_DEL = constant.DEFAULT_DEL;
const DEFAULT_HINT = constant.DEFAULT_HINT;

// load version into package.json

// command
program
	.name(pkgName)
	.description(pkgDesc)
	.version(pkgVersion, "-v, --version", "current version")
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
