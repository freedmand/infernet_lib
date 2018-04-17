import {Time, TimeDuration} from './temporal.js';
import test from 'ava';

test('basic time', t => {
  const time = new Time(Date.UTC(2015, 2, 1), 'day');
  t.is(time.year(), 2015);
  t.is(time.month(), 2);
  t.is(time.dayOfMonth(), 1);
  t.is(time.dayOfYear(), 60);
  t.is(time.dayOfWeek(), 0);
  t.is(time.decade(), 2010);
  t.is(time.century(), 2000);
});

test('day of leap year', t => {
  const time = new Time(Date.UTC(2016, 2, 1), 'day');
  t.is(time.year(), 2016);
  t.is(time.month(), 2);
  t.is(time.dayOfMonth(), 1);
  t.is(time.dayOfYear(), 61);
  t.is(time.dayOfWeek(), 2);
});

test('basic resolution enforce', t => {
  const time = new Time(Date.UTC(2015, 0, 1), 'day');
  t.throws(() => time.hour());
});

test('basic time duration', t => {
  const duration = new TimeDuration(3, 'month');
  t.true(duration.eq(new TimeDuration(1 / 4, 'year')));
});

test('add time duration', t => {
  const startTime = new Time(Date.UTC(2015, 0, 1), 'day');
  const expectedEndTime = new Time(Date.UTC(2015, 0, 8), 'day');
  t.true(startTime.add(new TimeDuration(1, 'week')).eq(expectedEndTime));
});

test('add time duration resolution error', t => {
  const startTime = new Time(Date.UTC(2015, 0, 1), 'day');
  t.throws(() => startTime.add(new TimeDuration(1, 'hour')));
});

test('sub time duration', t => {
  const startTime = new Time(Date.UTC(2014, 11, 31, 16, 32, 18), 'second');
  const endTime = new Time(Date.UTC(2015, 0, 1, 1, 32, 19), 'second');
  const duration = endTime.sub(startTime);
  t.true(duration.eq(new TimeDuration(9, 'hour').add(new TimeDuration(1, 'second'))));
});

test('iso date format', t => {
  const date = new Time(Date.UTC(2009, 3, 9), 'day');
  t.is(date.isoDate(), '2009-04-09');
});

test('iso date and time format', t => {
  const date = new Time(Date.UTC(1993, 9, 2, 2, 15, 15), 'second');
  t.is(date.isoDateAndTime(), '1993-10-02 02:15:15');
});

test('medium date format', t => {
  const date = new Time(Date.UTC(1776, 6, 4), 'day');
  t.is(date.mediumDate(), 'July 4, 1776');
});

test('medium date and time format', t => {
  const date = new Time(Date.UTC(2015, 0, 1, 13, 1, 1), 'second');
  t.is(date.mediumDateAndTime(), 'January 1, 2015 1:01:01 p.m.');
});

test('long date format', t => {
  const date = new Time(Date.UTC(1999, 11, 31), 'day');
  t.is(date.longDate(), 'Friday, December 31, 1999');
});

test('long date and time format', t => {
  const date = new Time(Date.UTC(2011, 4, 4, 10, 59, 59), 'second');
  t.is(date.longDateAndTime(), 'Wednesday, May 4, 2011 10:59:59 a.m.');
});

test('date format not enough resolution', t => {
  const date = new Time(Date.UTC(2000, 0, 1), 'day');
  t.throws(() => date.isoDateAndTime());
});