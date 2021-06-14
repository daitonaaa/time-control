import { TimePeriod } from './time-period';

export enum CommandTypes {
  next = 'next',
  jump = 'jump',
  ps = 'day',
  list = 'list',
  pause = 'p',
  stats = 'st',
  delete = 'd',
  resume = 'resume',
  raise = 'raise',
}

export interface TimePeriodList {
  [day: string]: TimePeriod[];
}
