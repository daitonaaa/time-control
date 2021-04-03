import { TimePeriod } from './time-period';

export enum CommandTypes {
  next = 'next',
  jump = 'jump',
  ps = 'day',
  list = 'list',
  pause = 'p',
  stats = 'st',
  delete = 'd',
  go = 'go'
}

export interface TimePeriodList {
  [day: string]: TimePeriod[];
}
