import {UnitTable} from './unit.js';
import test from 'ava';

const distanceTable = new UnitTable({
  'cm': [100, 'mm'],
  'in': [2.54, 'cm'],
  'm': [100, 'cm'],
  'ft': [12, 'in'],
  'yd': [3, 'ft'],
  'mi': [5280, 'ft'],
  'km': [1000, 'm'],
});

test('unit conversion', t => {
  const conversionTable = new UnitTable({
    'b': [2, 'a'],
    'c': [5, 'a'],
    'd': [10, 'b'],
    'e': [50, 'c'],
  });

  t.is(conversionTable.matrix.get('a').get('a'), 1);
  t.is(conversionTable.matrix.get('a').get('b'), 1 / 2);
  t.is(conversionTable.matrix.get('a').get('c'), 1 / 5);
  t.is(conversionTable.matrix.get('a').get('d'), 1 / 20);
  t.is(conversionTable.matrix.get('a').get('e'), 1 / 250);
  t.is(conversionTable.matrix.get('b').get('a'), 2);
  t.is(conversionTable.matrix.get('b').get('b'), 1);
  t.is(conversionTable.matrix.get('b').get('c'), 2 / 5);
  t.is(conversionTable.matrix.get('b').get('d'), 1 / 10);
  t.is(conversionTable.matrix.get('b').get('e'), 2 / 250);
  t.is(conversionTable.matrix.get('c').get('a'), 5);
  t.is(conversionTable.matrix.get('c').get('b'), 5 / 2);
  t.is(conversionTable.matrix.get('c').get('c'), 1);
  t.is(conversionTable.matrix.get('c').get('d'), 5 / 20);
  t.is(conversionTable.matrix.get('c').get('e'), 1 / 50);
  t.is(conversionTable.matrix.get('d').get('a'), 20);
  t.is(conversionTable.matrix.get('d').get('b'), 10);
  t.is(conversionTable.matrix.get('d').get('c'), 20 / 5);
  t.is(conversionTable.matrix.get('d').get('d'), 1);
  t.is(conversionTable.matrix.get('d').get('e'), 20 / 250);
  t.is(conversionTable.matrix.get('e').get('a'), 250);
  t.is(conversionTable.matrix.get('e').get('b'), 250 / 2);
  t.is(conversionTable.matrix.get('e').get('c'), 50);
  t.is(conversionTable.matrix.get('e').get('d'), 250 / 20);
  t.is(conversionTable.matrix.get('e').get('e'), 1);
});

test('unit eq', t => {
  t.true(distanceTable.value(6, 'ft').eq(distanceTable.value(2, 'yd')));
  t.true(distanceTable.value(2640, 'ft').eq(distanceTable.value(0.5, 'mi')));
  t.true(distanceTable.value(1000, 'in').eq(distanceTable.value(254000, 'mm')));
});

test('unit add', t => {
  t.true(distanceTable.value(6, 'ft').add(distanceTable.value(1, 'mi')).eq(distanceTable.value(1762, 'yd')));
});