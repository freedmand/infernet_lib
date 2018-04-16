import {Ordinal} from './ordinal.js';
import test from 'ava';

test('ordinal [n]eq', t => {
  const rankings = ['good', 'better', 'best'];
  const n1 = new Ordinal(rankings, 'good');
  const n2 = new Ordinal(rankings, 'good');
  const n3 = new Ordinal(rankings, 'best');

  t.true(n1.eq(n2));
  t.false(n1.eq(n3));

  t.false(n1.neq(n2));
  t.true(n1.neq(n3));
});

test('ordinal lt[e]', t => {
  const rankings = ['S', 'M', 'L', 'XL'];
  const n1 = new Ordinal(rankings, 'M');
  const n2 = new Ordinal(rankings, 'M');
  const n3 = new Ordinal(rankings, 'XL');

  t.false(n1.lt(n2));
  t.true(n1.lt(n3));

  t.true(n1.lte(n2));
  t.true(n1.lte(n3));
});

test('ordinal gt[e]', t => {
  const rankings = ['very bad', 'bad', 'neutral', 'good', 'very good'];
  const n1 = new Ordinal(rankings, 'very good');
  const n2 = new Ordinal(rankings, 'very good');
  const n3 = new Ordinal(rankings, 'very bad');

  t.false(n1.gt(n2));
  t.true(n1.gt(n3));

  t.true(n1.gte(n2));
  t.true(n1.gte(n3));
});