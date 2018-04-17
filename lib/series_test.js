import test from 'ava';
import {Float, Int} from './quantitative.js';
import {Series} from './series.js';
import {UnitTable, makeUnitClass} from './unit.js';
import {Nominal} from './nominal.js';

test('series sum', t => {
  const floats = [
    new Float(2.0),
    new Float(3.0),
    new Float(4.0),
  ];

  const series = new Series(floats, Float);
  t.is(series.sum().data, 9.0);
});

test('series average', t => {
  const floats = [
    new Float(2.0),
    new Float(3.0),
    new Float(4.0),
  ];

  const series = new Series(floats, Float);
  t.is(series.average().data, 3.0);
});

test('series unit average', t => {
  const distanceTable = new UnitTable({
    'km': [1000, 'm'],
  });
  const Distance = makeUnitClass(distanceTable, 'm');

  const distances = [
    new Distance(100, 'm'),
    new Distance(2, 'km'),
    new Distance(3, 'm'),
  ];
  const series = new Series(distances, Distance);
  t.true(series.average().eq(new Distance(701, 'm')));
});

test('variance test', t => {
  const floats = [
    new Float(1.0),
    new Float(2.0),
    new Float(5.0),
    new Float(8.0),
  ];
  const series = new Series(floats, Float);
  t.is(series.variance().data, 7.5);
});

test('std dev test', t => {
  const floats = [
    new Float(2.0),
    new Float(11.0),
    new Float(15.0),
    new Float(16.0),
    new Float(67.0),
    new Float(77.0),
    new Float(84.0),
    new Float(96.0),
  ];
  const series = new Series(floats, Float);
  t.is(series.stddev().data, 36);
});

test('hist test', t => {
  const ints = [
    new Int(2),
    new Int(3),
    new Int(1),
    new Int(2),
    new Int(2),
    new Int(3),
    new Int(4),
    new Int(1),
    new Int(3),
    new Int(3),
  ];
  const series = new Series(ints, Int);
  const hist = series.hist();
  t.is(hist.length, 4);

  // four occurrences of 3
  t.is(hist[0][0].data, 3);
  t.is(hist[0][1], 4);
  
  // three occurrences of 2
  t.is(hist[1][0].data, 2);
  t.is(hist[1][1], 3);

  // two occurrences of 1
  t.is(hist[2][0].data, 1);
  t.is(hist[2][1], 2);

  // one occurrences of 4
  t.is(hist[3][0].data, 4);
  t.is(hist[3][1], 1);
});

test('mode test', t => {
  const labels = [
    new Nominal('a'),
    new Nominal('b'),
    new Nominal('b'),
    new Nominal('c'),
    new Nominal('a'),
    new Nominal('b'),
    new Nominal('c'),
    new Nominal('c'),
    new Nominal('d'),
    new Nominal('c'),
    new Nominal('e'),
    new Nominal('c'),
    new Nominal('c'),
    new Nominal('b'),
  ];
  const series = new Series(labels, Nominal);
  t.is(series.mode().data, 'c');
});