import { DataManager } from './data-manager';
import { Printer } from './printer';
import { newGuid } from './utils/guid';
import { TimePeriod } from './time-period';
import { CommandTypes } from './model';

export class TimeControl {
  constructor(
    private readonly dataManager: DataManager,
    private readonly printer: Printer,
  ) {}

  async command(cmd: {[x: string]: any}) {
    const cArr = cmd._;
    if (!Array.isArray(cArr) || cArr.length === 0) {
      throw new Error(`Invalid Arguments, ${JSON.stringify(cArr, null, 2)}`)
    }

    const [cName, ...extra] = cArr;
    switch (cName) {
      case CommandTypes.next: {
        await this.createPeriod(extra.join(' '));
        break;
      }
      default: {
        console.error(cName, 'Command not found');
      }
    }
  }

  async createPeriod(text: string): Promise<void> {
    const period = new TimePeriod();
    period.id = newGuid();
    period.text = text;
    period.timestamp = new Date();

    await this.dataManager.save(period);
    const list: TimePeriod[] = await this.dataManager.getList();
    this.printer.printList(list);
  }
}
