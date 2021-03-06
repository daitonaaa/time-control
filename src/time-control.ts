import { DataManager } from './data-manager';
import { Printer } from './printer';
import { newGuid } from './utils/guid';
import { GetData } from './utils/SplitTimes';
import { TimePeriod } from './time-period';
import { CommandTypes, TimePeriodList } from './model';

export class TimeControl {
    constructor(
        private readonly dataManager: DataManager,
        private readonly printer: Printer,
    ) { }

    async command(cmd: { [x: string]: any }) {
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
            case CommandTypes.jump: {
                await this.jump(extra[0]);
                break;
            }
            case CommandTypes.ps: {
                await this.day();
                break;
            }
            case CommandTypes.list: {
                await this.list();
                break;
            }
            case CommandTypes.stats: {
                await this.stats();
                break;
            }
            case CommandTypes.delete: {
                await this.delete();
                break;
            }
            case CommandTypes.pause: {
                await this.pause();
                break;
            }
            case CommandTypes.resume: {
                await this.resume();
                break;
            }
            case CommandTypes.raise: {
                await this.raise(extra[0], extra[1]);
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
        const list: TimePeriod[] = await this.dataManager.getDayData();
        this.printer.printList(list);
    }

    async jump(i: string): Promise<void> {
        const list = await this.dataManager.getDayData();
        const cur: TimePeriod | undefined = list[+i];

        if (!cur) {
            throw new Error(`Element not found by index ${i}`);
        }

        cur.timestamp = new Date();
        await this.dataManager.save(cur);
        const newList: TimePeriod[] = await this.dataManager.getDayData();
        this.printer.printList(newList);
    }
    async resume(): Promise<void> {
        const list = await this.dataManager.getDayData();
        await this.jump((list.length - 2).toString());
    }

    async day(): Promise<void> {
        const list = await this.dataManager.getDayData();
        this.printer.printList(list);
    }

    async pause(): Promise<void> {
        const list = await this.dataManager.getDayData();
        const existPause = list.findIndex(i => i.text === 'pause');
        if (~existPause) {
            return this.jump(existPause.toString());
        }

        return this.createPeriod('pause');
    }

    async list(): Promise<TimePeriodList> {
        return this.dataManager.generateList();
    }

    async stats(): Promise<TimePeriodList> {
        var a: any = GetData(await this.dataManager.generateList());

        a.forEach((day: any) => {
            console.table(day.tasks);
            console.log('total estimated: ', day.totalEstimated);
            console.log('total estimated without pause: ', day.totalEstimatedWithoutPause);
        })

        return a;
    }

    async delete() {
        await this.dataManager.clearAll();
    }

    async raise(tid: number, unparsedTime: number) {
        const list = await this.dataManager.getDayData();
        const period = list[tid];
        const [h, m] = unparsedTime.toString().split('.');
        period.timestamp.setHours(period.timestamp.getHours() - Number(h));
        if (m) period.timestamp.setMinutes(period.timestamp.getMinutes() - Number(m));

        await this.dataManager.updatePeriod(tid, period);
        return this.day();
    }
}
