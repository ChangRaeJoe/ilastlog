// eslint-disable-next-line @typescript-eslint/no-require-imports
require("module-alias/register");

//import os from "node:os";
import {calculate, OriginPrint, delimiterPrint} from "@lib/utils";
import constant from "@configs/constant";
import ptns from "@configs/pattern";
import _ from "lodash";

// type def
interface Option {
    delimiter: string;
    hint: string;
}

const options: Option = {} as Option;
const defaults: Option = {
    delimiter: constant.DEFAULT_DEL,
    hint: constant.DEFAULT_HINT,
};
_.defaults(options, defaults);

const calculateWrapper = (textArr, _options: Option): void => {
    // set opt
    _options = setOptions(_options);

    const result = calculate(textArr, _options);

    if (_options.delimiter.length < 1) {
        return OriginPrint(result);
    } else {
        return delimiterPrint(result, _options.delimiter);
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

    // setting using setxxx function
    for (const func of setFuncs) {
        // if error, return not 1;
        if (func(opts)) {
            console.error(
                `Not String: value in options.key ${JSON.stringify(opts)}`,
            );
        }
    }
    return opts;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setConfigs(confs) {
    //timeStamp pattern, log pattern, capture name
    console.warn("not supported yet");
    return;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getConfigs() {
    console.warn("not supported yet");

    return ptns;
}

const getOptions = () => options;
const setDelimiter = setGetnerator("delimiter");
const setHint = setGetnerator("hint");
const getDelimiter = () => options.delimiter;
const getHint = () => options.hint;

module.exports = {
    ilastlog: calculateWrapper,
    getDelimiter,
    getHint,
    setOptions,
    getOptions,
};
