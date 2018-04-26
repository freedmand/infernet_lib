import test from 'ava';
import {UntypedSeries, matchWhole, INT_REGEX, FLOAT_REGEX, ZERO_LEADING_REGEX, NA_REGEX, ISO_DAY_REGEX} from './untyped_series.js';
import {Float, Int} from './quantitative.js';
import {Nominal} from './nominal.js';

test('regexp match whole', t => {
  t.true(matchWhole('dog', /dog/));
  t.true(matchWhole('1234', /[0-9]+/));
  t.false(matchWhole('doggo', /dog/));
  t.false(matchWhole('1234a', /[0-9]+/));  
});

test('int regexp', t => {
  t.true(matchWhole('1', INT_REGEX));
  t.true(matchWhole('12', INT_REGEX));
  t.true(matchWhole('-34', INT_REGEX));
  t.true(matchWhole('0', INT_REGEX));
  t.false(matchWhole('01', INT_REGEX));
  t.false(matchWhole('00', INT_REGEX));
  t.false(matchWhole('-1.2', INT_REGEX));
  t.false(matchWhole('a', INT_REGEX));
  t.false(matchWhole('', INT_REGEX));
});

test('float regexp', t => {
  t.true(matchWhole('1.', FLOAT_REGEX));
  t.true(matchWhole('1.2', FLOAT_REGEX));
  t.true(matchWhole('-34.2', FLOAT_REGEX));
  t.true(matchWhole('0.', FLOAT_REGEX));
  t.false(matchWhole('01.', FLOAT_REGEX));
  t.false(matchWhole('00.', FLOAT_REGEX));
  t.false(matchWhole('1', FLOAT_REGEX));
  t.false(matchWhole('a', FLOAT_REGEX));
  t.false(matchWhole('', FLOAT_REGEX));
});

test('zero-leading regexp', t => {
  t.true(matchWhole('00', ZERO_LEADING_REGEX));
  t.true(matchWhole('01', ZERO_LEADING_REGEX));
  t.true(matchWhole('00001', ZERO_LEADING_REGEX));
  t.true(matchWhole('012345', ZERO_LEADING_REGEX));
  t.true(matchWhole('01.4', ZERO_LEADING_REGEX));
  t.true(matchWhole('035', ZERO_LEADING_REGEX));
  t.false(matchWhole('0.1', ZERO_LEADING_REGEX));
  t.false(matchWhole('-0.1', ZERO_LEADING_REGEX));
  t.false(matchWhole('-00001', ZERO_LEADING_REGEX));
  t.false(matchWhole('12', ZERO_LEADING_REGEX));
  t.false(matchWhole('-23.4', ZERO_LEADING_REGEX));
});

test('n/a regexp', t => {
  t.true(matchWhole('null', NA_REGEX));
  t.true(matchWhole('NULL', NA_REGEX));
  t.true(matchWhole('.nil', NA_REGEX));
  t.true(matchWhole('  NoNe  ', NA_REGEX));
  t.true(matchWhole('N/A', NA_REGEX));
  t.true(matchWhole('n.a.', NA_REGEX));
  t.true(matchWhole('na', NA_REGEX));
  t.true(matchWhole('', NA_REGEX));
  t.true(matchWhole(' ', NA_REGEX));
  t.true(matchWhole('  ', NA_REGEX));
  t.true(matchWhole('_', NA_REGEX));
  t.true(matchWhole(' - ', NA_REGEX));
  t.true(matchWhole('---', NA_REGEX));
  t.true(matchWhole(' __ ', NA_REGEX));
  t.false(matchWhole(' -_ ', NA_REGEX));
  t.false(matchWhole('0.1', NA_REGEX));
  t.false(matchWhole('-0.1', NA_REGEX));
  t.false(matchWhole('-00001', NA_REGEX));
  t.false(matchWhole('12', NA_REGEX));
  t.false(matchWhole('-23.4', NA_REGEX));
  t.false(matchWhole('a', NA_REGEX));
  t.false(matchWhole('none at all', NA_REGEX));
  t.false(matchWhole('nonexistent', NA_REGEX));
  t.false(matchWhole('/', NA_REGEX));
});

test('iso day regexp', t => {
  t.true(matchWhole('2015-10-21', ISO_DAY_REGEX));
  t.true(matchWhole('1999-01-11', ISO_DAY_REGEX));
  t.true(matchWhole('2010-12-31', ISO_DAY_REGEX));
  t.true(matchWhole('1000-02-01', ISO_DAY_REGEX));
  t.true(matchWhole(' 2222-01-01 ', ISO_DAY_REGEX));
  t.true(matchWhole('  2010-12-31', ISO_DAY_REGEX));

  t.false(matchWhole('', ISO_DAY_REGEX));
  t.false(matchWhole('asdf', ISO_DAY_REGEX));
  t.false(matchWhole('2010', ISO_DAY_REGEX));
  t.false(matchWhole('Jan 1 2005', ISO_DAY_REGEX));
  t.false(matchWhole('2010-22-01', ISO_DAY_REGEX));
  t.false(matchWhole('2001-01-42', ISO_DAY_REGEX));
});

test('infer float easy', t => {
  t.is(new UntypedSeries([
    '2.0',
    '3.5',
    '4.7',
  ]).inferType(), Float);
});

test('infer int easy', t => {
  t.is(new UntypedSeries([
    '2',
    '3',
    '4',
  ]).inferType(), Int);
});

test('infer nominal easy', t => {
  t.is(new UntypedSeries([
    'dog',
    'cat',
    'babboon',
  ]).inferType(), Nominal);
});

test('infer nominal zip codes', t => {
  t.is(new UntypedSeries([
    '93924',
    '93940',
    '02138',
  ]).inferType(), Nominal);
});

test('infer float tricky', t => {
  t.is(new UntypedSeries([
    '1',
    '',
    '2',
    '2.3',
  ]).inferType(), Float);
});

test('infer int mixed with strings', t => {
  t.is(new UntypedSeries([
    '1',
    '',
    '2',
    'dog',
  ]).inferType(), Nominal);
});

test('infer day', t => {
  t.is(new UntypedSeries([
    '2010-01-21',
    '1999-12-01',
    '1500-05-09',
  ]).inferType().name, 'Day');
});