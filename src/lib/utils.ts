import os from "node:os";
import ptn from "#configs/pattern.js";
import {Recode, recode} from "#configs/Recode";
import printf from "printf";

import {Option} from "#intefaces/index";

// hooking
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
})(ptn.TIME_PTN, ptn.LOGIN_PTN, ptn.CUSTOM_PTN);

function captureLog(_texts: string[], regx: RegExp[]) {
    // arg1: str[], arg2: regex[]
    const result = [];
    for (const text of _texts) {
        for (const re of regx) {
            for (const matchedObj of text.matchAll(re)) {
                if (matchedObj.groups) {
                    result.push(matchedObj.groups);
                    break;
                }
            }
        }
    }
    return result;
}
// object의 value값들을 특정 문자로 나뉘어진 문자열로 만듦.
function delimiterPrint(infoArr: Recode[], delimiter: string) {
    let text = "";
    for (const info of infoArr) {
        text += printf("%s%s%s\n", info.name, delimiter, info.timestamp);
    }
    console.log(text);
}
function OriginPrint(infoArr: Recode[]) {
    // Arr: [ {name,timestamp,...}, {} ]
    let text = "";
    for (const info of infoArr) {
        text += printf("%-25s%s\n", info.name, info.timestamp);
    }

    console.log(text);
}

function compareGenerator(key: string) {
    type objectType = Record<string, string>;
    return function (a: objectType, b: objectType) {
        if (a[key] == b[key]) return 0;
        else if (a[key] < b[key]) return -1;
        else return 1;
    };
}

function calculate(textArr: string[], _options: Option) {
    // selete sentence using hint option
    textArr = textArr.filter((str, idx) => {
        //here options.hint
        return str.includes(_options.hint);
    });

    //caputre
    const parsedArr = captureLog(textArr, combinedPatterns);
    // sort and then fillter among capturedNames
    const compareName = compareGenerator(recode.name);
    const compareTimeStamp = compareGenerator(recode.timestamp);
    const sortedArr = parsedArr
        .sort(compareTimeStamp)
        .sort(compareName)
        .map((obj, idx) => {
            const tmp: Recode = {
                name: obj.name,
                timestamp: obj.timestamp,
            };
            return tmp;
        })
        //only the latest date
        .reduceRight<Recode[]>((acc, cur) => {
            let haveName = false;
            for (const obj of acc) {
                if (obj.name == cur.name) {
                    haveName = true;
                }
            }
            if (!haveName) {
                acc.unshift(cur as Recode);
            }
            return acc;
        }, []);
    return sortedArr;
}

// const textArr = 'text\ntext2\n'.split(os.EOL);
// stamp, foramt
// for (const text of texts) {
// 	parseTimeStamp(text);
// }

// 내보내기
export {
    combinedPatterns,
    compareGenerator,
    captureLog,
    calculate,
    OriginPrint,
    delimiterPrint,
};
