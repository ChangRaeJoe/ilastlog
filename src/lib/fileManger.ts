import {loadJsonFile} from "load-json-file";
import {writeJsonFile} from "write-json-file";
import {access, copyFile, constants} from "node:fs/promises";

type Data = Record<string, string>;

const filePath = "data/lastlog.json";
const baseFilePath = "data/emptyLastlog.json";
const mode = 0o666;

export function appendFile(newData: Data) {
    let data: Data = {};

    return access(filePath, constants.F_OK)
        .catch((reason) => {
            return copyFile(baseFilePath, filePath, constants.COPYFILE_EXCL);
        })
        .then(() => {
            return loadJsonFile(filePath, {});
        })
        .then((receivedData) => {
            data = receivedData as Data;
            console.log("44");
            //추가할 데이터
            data = Object.assign(data, newData);

            return writeJsonFile(filePath, data);
        })
        .catch((reason) => {
            console.error("reason4:", reason);
        })
        .finally(() => {
            //console.log("fin");
        });
}
