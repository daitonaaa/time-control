import { TimePeriod } from '../time-period';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { TimePeriodList } from '../model';
import {Config} from "../config/config";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readDir = promisify(fs.readdir);

export const jsonDataFolderPath = path.join(Config.rootFolder, 'json-data');

if (!fs.existsSync(jsonDataFolderPath)) {
  fs.mkdirSync(jsonDataFolderPath);
}

const getJsonPathByName = (name: string): string => path.join(jsonDataFolderPath, `${name}.json`);
const generateJSONFilename = (date: Date): string => `${date.getDate()}_${date.getMonth()}_${date.getFullYear()}`;

export const getJSONFile = async (date: Date): Promise<TimePeriod[]> => {
  let result;
  try {
    result = await readFile(getJsonPathByName(generateJSONFilename(date)), {encoding: 'utf-8'});
    return JSON.parse(result, (key, value) => {
      if (key === 'timestamp') {
        return new Date(value);
      }

      return value;
    });
  } catch(err) {
    console.error(err);
    return [];
  }
};

export const saveJSONDayFile = (date: Date, data: any) => {
  const path = getJsonPathByName(generateJSONFilename(date));
  return saveJSONFile(data, path);
}

export const saveJSONFile = async (data: any, targetDir: string): Promise<void> => {
  const stringify = JSON.stringify(data, null, 2);
  await writeFile(targetDir, stringify);
};

export const generateAllDaysJSON = async (): Promise<TimePeriodList> => {
  const results = {};
  const jsons = await readDir(jsonDataFolderPath);

  for (let json of jsons) {
    let match;
    if (match = json.match(/^(.+).json$/g)) {
      const day = await readFile(path.join(jsonDataFolderPath, match[0]), { encoding: 'utf-8' });
      results[match[0].replace(/.json/g, '')] = JSON.parse(day);
    }
  }

  return results;
};

export const clearJsonFiles = async (): Promise<void> => {
  fs.readdirSync(jsonDataFolderPath).forEach(function (file) {
    const curPath = jsonDataFolderPath + "/" + file;
    if (!fs.lstatSync(curPath).isDirectory()) {
      // delete file
      fs.unlinkSync(curPath);
    }
  });
}
