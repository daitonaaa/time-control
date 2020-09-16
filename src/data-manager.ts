import { TimePeriod } from './time-period';
import { getJSONFile, saveJSONFile } from './utils/json';

export class DataManager {
  async save(period: TimePeriod): Promise<void> {
    const curPeriods = await getJSONFile(new Date());
    curPeriods.push(period);
    await saveJSONFile(new Date(), curPeriods);
  }

  getList(): Promise<TimePeriod[]> {
    return getJSONFile(new Date());
  }
}
