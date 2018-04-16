import {Temporal, RESOLUTIONS} from './temporal.js';
import test from 'ava';

test('basic time', t => {
  const time = new Temporal(Date.UTC(2015, 0, 1), RESOLUTIONS.DAY);
  t.is(time.year(), 2015);
  t.is(time.month(), 0);
  t.is(time.dayOfMonth(), 1);
  t.is(time.decade(), 2010);
  t.is(time.century(), 2000);
});

test('basic resolution enforce', t => {
  const time = new Temporal(Date.UTC(2015, 0, 1), RESOLUTIONS.DAY);
  t.throws(() => time.hour());
});