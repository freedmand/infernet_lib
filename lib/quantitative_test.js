import test from 'ava';

import {Float, Int} from './quantitative.js';

test('float add', t => {
  const float1 = new Float(1);
  const float2 = new Float(2);

  t.is(float1.add(float2).data, 3);
});

test('float sub', t => {
  const float1 = new Float(1);
  const float2 = new Float(2);

  t.is(float1.sub(float2).data, -1);
});

test('float mul', t => {
  const float1 = new Float(1);
  const float2 = new Float(2);

  t.is(float1.mul(float2).data, 2);
});

test('float div', t => {
  const float1 = new Float(1);
  const float2 = new Float(2);

  t.is(float1.div(float2).data, 0.5);
});

test('float pow', t => {
  const float1 = new Float(2);
  const float2 = new Float(3);

  t.is(float1.pow(float2).data, 8);
});

test('float [n]eq', t => {
  const float1 = new Float(2);
  const float2 = new Float(2);
  const float3 = new Float(3);

  t.true(float1.eq(float2));
  t.false(float1.eq(float3));

  t.false(float1.neq(float2));
  t.true(float1.neq(float3));
});

test('float lt[e]', t => {
  const float1 = new Float(2);
  const float2 = new Float(2);
  const float3 = new Float(3);

  t.false(float1.lt(float2));
  t.true(float1.lt(float3));

  t.true(float1.lte(float2));
  t.true(float1.lte(float3));
});

test('float gt[e]', t => {
  const float1 = new Float(3);
  const float2 = new Float(3);
  const float3 = new Float(2);

  t.false(float1.gt(float2));
  t.true(float1.gt(float3));

  t.true(float1.gte(float2));
  t.true(float1.gte(float3));
});

test('int add', t => {
  const int1 = new Int(1);
  const int2 = new Int(2);

  t.is(int1.add(int2).data, 3);
});

test('int sub', t => {
  const int1 = new Int(1);
  const int2 = new Int(2);

  t.is(int1.sub(int2).data, -1);
});

test('int mul', t => {
  const int1 = new Int(1);
  const int2 = new Int(2);

  t.is(int1.mul(int2).data, 2);
});

test('int div', t => {
  const int1 = new Int(1);
  const int2 = new Int(2);

  t.is(int1.div(int2).data, 0);
});

test('int pow', t => {
  const int1 = new Int(2);
  const int2 = new Int(3);

  t.is(int1.pow(int2).data, 8);
});

test('int [n]eq', t => {
  const int1 = new Int(2);
  const int2 = new Int(2);
  const int3 = new Int(3);

  t.true(int1.eq(int2));
  t.false(int1.eq(int3));

  t.false(int1.neq(int2));
  t.true(int1.neq(int3));
});

test('int lt[e]', t => {
  const int1 = new Int(2);
  const int2 = new Int(2);
  const int3 = new Int(3);

  t.false(int1.lt(int2));
  t.true(int1.lt(int3));

  t.true(int1.lte(int2));
  t.true(int1.lte(int3));
});

test('int gt[e]', t => {
  const int1 = new Int(3);
  const int2 = new Int(3);
  const int3 = new Int(2);

  t.false(int1.gt(int2));
  t.true(int1.gt(int3));

  t.true(int1.gte(int2));
  t.true(int1.gte(int3));
});

test('int type mismatch', t => {
  const int1 = new Int(2);
  const float2 = new Float(3);

  t.throws(() => int1.add(float2));
});

test('cast to float', t => {
  const int = new Int(2);
  const float = int.toFloat();
  t.true(float instanceof Float);
});

test('cast to int', t => {
  const float = new Float(2.5);
  const int = float.toInt();
  t.true(int instanceof Int);
  t.is(int.data, 2);
});