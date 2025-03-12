//import os from "node:os";
import {calculate, OriginPrint, delimiterPrint} from "#lib/utils";
import constant from "#configs/constant";
import ptns from "#configs/pattern";
import _ from "lodash";

// type def
import {Option} from "#intefaces/option.js";

const options: Option = {} as Option;
const defaults: Option = {
    delimiter: constant.DEFAULT_DEL,
    hint: constant.DEFAULT_HINT,
};
_.defaults(options, defaults);

const calculateWrapper = (textArr: string[], opt?: Option): void => {
    // set opt
    const _options = setOptions(opt);

    const result = calculate(textArr, _options);

    if (_options.delimiter.length < 1) {
        return OriginPrint(result);
    } else {
        return delimiterPrint(result, _options.delimiter);
    }
};

function setGetnerator(toSetKey: keyof Option) {
    return (opts: Option) => {
        if (!_.isString(opts[toSetKey])) {
            return 1;
        } else {
            options[toSetKey] = opts[toSetKey];
            return 0;
        }
    };
}

function setOptions(opts: Option) {
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
function setConfigs(confs: unknown) {
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

export {
    calculateWrapper as ilastlog,
    getDelimiter,
    getHint,
    setOptions,
    getOptions,
};
