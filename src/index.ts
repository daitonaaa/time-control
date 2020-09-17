#!/usr/bin/env node
import { TimeControl } from './time-control';
import { DataManager } from './data-manager';
import { Printer } from './printer';
import {argv} from 'yargs';

const printer = new Printer();
const dataManager = new DataManager();
const timeControl = new TimeControl(dataManager, printer);

timeControl.command(argv);


