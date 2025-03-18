import {loadJsonFile, loadJsonFileSync} from "load-json-file";
import {writeJsonFile, writeJsonFileSync} from "write-json-file";
import {access, constants} from "node:fs/promises";
import {accessSync} from "node:fs";
import path from "node:path";
import envPaths from "env-paths";
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface Data {
    [idx: string]: string;
}

const fileName = "lastlog.json";
const paths = envPaths("ilastlog");
const basePath = path.join(paths.data, fileName);
const mode = 0o666;

export function appendFile(newData: Data): void {
    let data: Data = {};
    try {
        accessSync(basePath, constants.F_OK);
        data = loadJsonFileSync(basePath, {}) as Data;
    } catch (err) {
        data = {};
    }
    data = Object.assign(data, newData);

    try {
        writeJsonFileSync(basePath, data);
    } catch (err) {
        throw new Error("Failed to Write:" + err);
    }
}

export async function appendFileAsync(newData: Data) {
    let data: Data = {};

    try {
        await access(basePath, constants.F_OK);
        data = (await loadJsonFile(basePath, {})) as Data;
    } catch (error) {
        data = {};
    }
    data = Object.assign(data, newData);

    try {
        await writeJsonFile(basePath, data);
    } catch (error) {
        throw new Error("Failed to Write:" + error);
    }
}
