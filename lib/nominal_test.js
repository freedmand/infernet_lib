import {Nominal} from './nominal.js';
import test from 'ava';

test('nominal [not]equals', t => {
  const rankings = ['good', 'better', 'best'];
  const n1 = new Nominal(rankings, 'good');
  const n2 = new Nominal(rankings, 'good');
  const n3 = new Nominal(rankings, 'best');

  t.true(n1.equals(n2));
  t.false(n1.equals(n3));

  t.false(n1.notEquals(n2));
  t.true(n1.notEquals(n3));
});

test('nominal lt[e]', t => {
  const rankings = ['S', 'M', 'L', 'XL'];
  const n1 = new Nominal(rankings, 'M');
  const n2 = new Nominal(rankings, 'M');
  const n3 = new Nominal(rankings, 'XL');

  t.false(n1.lt(n2));
  t.true(n1.lt(n3));

  t.true(n1.lte(n2));
  t.true(n1.lte(n3));
});

test('nominal gt[e]', t => {
  const rankings = ['very bad', 'bad', 'neutral', 'good', 'very good'];
  const n1 = new Nominal(rankings, 'very good');
  const n2 = new Nominal(rankings, 'very good');
  const n3 = new Nominal(rankings, 'very bad');

  t.false(n1.gt(n2));
  t.true(n1.gt(n3));

  t.true(n1.gte(n2));
  t.true(n1.gte(n3));
});