import { TimePeriod } from './time-period';

export enum CommandTypes {
  next = 'next',
  jump = 'jump',
  ps = 'day',
  list = 'list'
}

export interface TimePeriodList {
  [day: string]: TimePeriod[];
}
