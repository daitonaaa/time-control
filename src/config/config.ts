import fs from 'fs';
import path from 'path';
import os from 'os';

import * as defaultConfig from './config.default.json';
import { ConfigType } from "./type";

const rootFolder = path.join(os.homedir(), '/tm');

if (!fs.existsSync(rootFolder)) {
    fs.mkdirSync(rootFolder);
}

// TODO add migrations
try {
    fs.readFileSync(path.join(rootFolder, '/config.json'));
} catch {
    fs.writeFileSync(path.join(rootFolder, '/config.json'), JSON.stringify(defaultConfig, null, 2));
}

const configUnparsed = fs.readFileSync(path.join(rootFolder, '/config.json'), { encoding: 'utf-8'});
export const Config = JSON.parse(configUnparsed) as ConfigType;
Config.rootFolder = rootFolder;
