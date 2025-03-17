//import os from "node:os";
import {Util} from "#lib/index";
import constant from "#configs/constant";
import ptns from "#configs/pattern";
import _ from "lodash";

// type def
import {Option} from "#intefaces/index";

const options: Option = {} as Option;
const defaults: Option = {
    delimiter: constant.DEFAULT_DEL,
    hint: constant.DEFAULT_HINT,
    save: constant.DEFAULT_SAVE,
};
_.defaults(options, defaults);

const calculateWrapper = (textArr: string[], opt?: Option) => {
    // set opt
    const _options = setOptions(opt);

    const result = Util.calculate(textArr, _options);

    Util.Print(result, _options);

    Util.WriteToFile(result, _options.save);
};
const calculateWrapperAsync = (textArr: string[], opt?: Option) => {
    // set opt
    const _options = setOptions(opt);

    const result = Util.calculate(textArr, _options);

    Util.Print(result, _options);

    return Util.WriteToFileAsync(result, _options.save);
};

function setGetnerator<T extends keyof Option>(toSetKey: T) {
    return (opts: Option) => {
        options[toSetKey] = opts[toSetKey];
        return 0;
    };
}

function setOptions(opts: Option) {
    opts = _.defaults(opts, options);
    const setFuncs = [setDelimiter, setHint, setSave];

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
const setSave = setGetnerator("save");
const getDelimiter = () => options.delimiter;
const getHint = () => options.hint;
const getSave = () => options.save;

export {
    calculateWrapper as ilastlog,
    calculateWrapperAsync as ilastlogAsync,
    setOptions,
    getOptions,
};
