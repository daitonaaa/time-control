import { TimePeriod } from '../time-period';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { TimePeriodList } from '../model';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readDir = promisify(fs.readdir);

const rootFolder = '/Users/main/';
const jsonDataFolder = 'json-data';
const jsonDataFolderPath = path.join(rootFolder, jsonDataFolder);

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
  } catch {
    return [];
  }
};

export const saveJSONDayFile = (date: Date, data: any) =>
  saveJSONFile(data, getJsonPathByName(generateJSONFilename(date)));

export const saveJSONFile = async (data: any, targetDir: string): Promise<void> => {
  const stringify = JSON.stringify(data, null, 2);
  await writeFile(targetDir, stringify);
};

(() => {
  if (!fs.existsSync(jsonDataFolderPath)) {
    fs.mkdirSync(jsonDataFolderPath);
  }
})();

export const getJSONAllDays = async (): Promise<TimePeriodList> => {
  const results = {};
  const jsons = await readDir(jsonDataFolderPath);

  for (let json of jsons) {
    let match;
    if (match = json.match(/^(.+).json$/g)) {
      const day = await readFile(path.join(jsonDataFolderPath, match[0]), { encoding: 'utf-8' });
      results[match[0].replace(/.json/g, '')] = JSON.parse(day);
    }
  }

  await saveJSONFile(results, path.join(rootFolder, 'Documents/tm-monitor/src', 'data.json'));
  return results;
};
