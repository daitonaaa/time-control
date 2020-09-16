import { TimePeriod } from '../time-period';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const jsonDataFolder = 'json-data';
const jsonDataFolderPath = path.join(process.cwd(), jsonDataFolder);

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

export const saveJSONFile = async (date: Date, list: TimePeriod[]): Promise<void> => {
  const data = JSON.stringify(list, null, 2);
  await writeFile(getJsonPathByName(generateJSONFilename(date)), data);
};

(() => {
  if (!fs.existsSync(jsonDataFolderPath)) {
    fs.mkdirSync(jsonDataFolderPath);
  }
})();
