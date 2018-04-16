import {Quantitative} from './quantitative.js';

export const RESOLUTIONS = {
  MILLISECOND: 0,
  SECOND: 1,
  MINUTE: 2,
  HOUR: 3,
  DAY: 4,
  WEEK: 5,
  MONTH: 6,
  QUARTER: 7,
  YEAR: 8,
  DECADE: 9,
  CENTURY: 10,
};

const RESOLUTION_ERROR = 'The time does not have enough resolution for this';

export class TimeDuration extends Quantiative {
  
}




/**
 * Temporal represents data aligned with a certain resolution, e.g. *day* or
 * *second*.
 */
export class Temporal extends Quantitative {
  constructor(millisSince1970, resolution) {
    super(millisSince1970);
    this.dateTime = new Date(millisSince1970);
    this.resolution = resolution;
  }

  valid() {
    return true;
  }

  enforceResolution(resolution) {
    if (this.resolution > resolution) throw new RESOLUTION_ERROR;
  }

  epoch() {
    this.enforceResolution(RESOLUTIONS.MILLISECOND);
    return this.dateTime.getTime();
  }

  millisecond() {
    this.enforceResolution(RESOLUTIONS.MILLISECOND);
    return this.dateTime.getUTCMilliseconds();
  }

  second() {
    this.enforceResolution(RESOLUTIONS.SECOND);
    return this.dateTime.getUTCSeconds();
  }

  minute() {
    this.enforceResolution(RESOLUTIONS.MINUTE);
    return this.dateTime.getUTCMinutes();
  }

  hour() {
    this.enforceResolution(RESOLUTIONS.HOUR);
    return this.dateTime.getUTCHours();
  }

  dayOfYear() {
    this.enforceResolution(RESOLUTIONS.DAY);
    return Math.floor((Date.UTC(this.year(), this.month(), this.dayOfMonth()) - Date.UTC(this.year(), 0, 0)) / 24 / 60 / 60 / 1000);
  }

  dayOfMonth() {
    this.enforceResolution(RESOLUTIONS.DAY);
    return this.dateTime.getUTCDate();
  }

  dayOfWeek() {
    this.enforceResolution(RESOLUTIONS.DAY);
    return this.dateTime.getUTCDay();
  }

  month() {
    this.enforceResolution(RESOLUTIONS.MONTH);
    return this.dateTime.getUTCMonth();
  }

  quarter() {
    this.enforceResolution(RESOLUTIONS.QUARTER);
    return Math.floor(this.month() / 3);
  }

  year() {
    this.enforceResolution(RESOLUTIONS.YEAR);
    return this.dateTime.getUTCFullYear();
  }

  decade() {
    this.enforceResolution(RESOLUTIONS.DECADE);
    return Math.floor(this.year() / 10) * 10;
  }

  century() {
    this.enforceResolution(RESOLUTIONS.CENTURY);
    return Math.floor(this.decade() / 100) * 100;
  }
}