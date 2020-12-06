import { TimePeriod } from './time-period';
import { generateAllDaysJSON, getJSONFile, saveJSONDayFile } from './utils/json';
import { TimePeriodList } from './model';

export class DataManager {
  async save(period: TimePeriod): Promise<void> {
    const curPeriods = await getJSONFile(new Date());
    curPeriods.push(period);
    await saveJSONDayFile(new Date(), curPeriods);
  }

  getDayData(): Promise<TimePeriod[]> {
    return getJSONFile(new Date());
  }

  generateList(): Promise<TimePeriodList> {
    return generateAllDaysJSON();
  }
}
