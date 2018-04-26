import {Ordinal} from './ordinal.js';
import test from 'ava';

test('ordinal [n]eq', t => {
  const rankings = ['good', 'better', 'best'];
  const n1 = new Ordinal('good', rankings);
  const n2 = new Ordinal('good', rankings);
  const n3 = new Ordinal('best', rankings);

  t.true(n1.eq(n2));
  t.false(n1.eq(n3));

  t.false(n1.neq(n2));
  t.true(n1.neq(n3));
});

test('ordinal lt[e]', t => {
  const rankings = ['S', 'M', 'L', 'XL'];
  const n1 = new Ordinal('M', rankings);
  const n2 = new Ordinal('M', rankings);
  const n3 = new Ordinal('XL', rankings);

  t.false(n1.lt(n2));
  t.true(n1.lt(n3));

  t.true(n1.lte(n2));
  t.true(n1.lte(n3));
});

test('ordinal gt[e]', t => {
  const rankings = ['very bad', 'bad', 'neutral', 'good', 'very good'];
  const n1 = new Ordinal('very good', rankings);
  const n2 = new Ordinal('very good', rankings);
  const n3 = new Ordinal('very bad', rankings);

  t.false(n1.gt(n2));
  t.true(n1.gt(n3));

  t.true(n1.gte(n2));
  t.true(n1.gte(n3));
});