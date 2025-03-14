#! /usr/bin/env node

import os from "node:os";
import readline from "readline";

import {Option} from "#intefaces/index";

import {Util} from "#lib/index";
import constant from "#configs/constant.js";
import {
    name as pkgName,
    version as pkgVersion,
    description as pkgDesc,
} from "#root/package.json";
import {program} from "commander";

// option's constant
const DEFAULT_DEL = constant.DEFAULT_DEL;
const DEFAULT_HINT = constant.DEFAULT_HINT;

// load version into package.json

// command
program
    .name(pkgName)
    .description(pkgDesc)
    .version(pkgVersion, "-v, --version", "Current version")
    // .option("--no-all", "Displays only the users who have recently accessed")
    .option("--hint <hint>", "To find out per line", DEFAULT_HINT)
    .option(
        "-d, --delimiter <delimiter>",
        "Sentences added delimiter before stdout",
        DEFAULT_DEL,
    )
    .argument("[argText]", "Input data", "")
    .action(function (argText, options: Option, command) {
        if (argText.length == 0) {
            startUsingStdin(options);
        } else {
            startUsingArg(argText, options);
        }
    });

program.parse();

//stdin, stdout, stderr
function startUsingStdin(options: Option) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });
    const inputTexts: string[] = [];

    rl.on("line", (line) => {
        inputTexts.push(line);
    }).on("close", () => {
        const resultArr = Util.calculate(inputTexts, options);
        console.log("result:", resultArr);
        if (options.delimiter.length < 1) {
            Util.OriginPrint(resultArr);
        } else {
            Util.delimiterPrint(resultArr, options.delimiter);
        }
    });
}

function startUsingArg(argText: string, options: Option) {
    const inputTexts = [];
    for (const text of argText.split(os.EOL)) {
        inputTexts.push(text);
    }
    const resultArr = Util.calculate(inputTexts, options);
    if (options.delimiter.length < 1) {
        Util.OriginPrint(resultArr);
    } else {
        Util.delimiterPrint(resultArr, options.delimiter);
    }
}
