import { TimePeriod } from './time-period';

export enum CommandTypes {
  next = 'next',
  jump = 'jump',
  ps = 'day',
  list = 'list',
  pause = 'p',
}

export interface TimePeriodList {
  [day: string]: TimePeriod[];
}
