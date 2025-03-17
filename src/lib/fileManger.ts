import {loadJsonFile, loadJsonFileSync} from "load-json-file";
import {writeJsonFile, writeJsonFileSync} from "write-json-file";
import {access, copyFile, constants} from "node:fs/promises";
import {accessSync, copyFileSync} from "node:fs";
import {rootPath} from "get-root-path";
import path from "node:path";
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface Data {
    [idx: string]: string;
}

const filePath = path.join(rootPath, "data", "lastlog.json");
const baseFilePath = path.join(rootPath, "data", "emptyLastlog.json");
const mode = 0o666;

export function appendFile(newData: Data): void {
    let data: Data = {};
    try {
        accessSync(filePath, constants.F_OK);
    } catch (err) {
        copyFileSync(baseFilePath, filePath, constants.COPYFILE_EXCL);
    }

    data = loadJsonFileSync(filePath, {}) as Data;

    data = Object.assign(data, newData);

    try {
        writeJsonFileSync(filePath, data);
    } catch (err) {
        throw new Error("Failed to Write:" + err);
    }
}

export async function appendFileAsync(newData: Data) {
    let data: Data = {};

    try {
        await access(filePath, constants.F_OK);
    } catch (error) {
        return copyFile(baseFilePath, filePath, constants.COPYFILE_EXCL);
    }

    data = (await loadJsonFile(filePath, {})) as Data;

    data = Object.assign(data, newData);

    try {
        await writeJsonFile(filePath, data);
    } catch (error) {
        throw new Error("Failed to Write:" + error);
    }
}
