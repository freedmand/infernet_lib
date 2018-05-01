import {Vega, isSubset, merge, Visual, VEGA_SCHEMA, BarChartSpec} from './vega.js';
import {Dataset, Column} from './dataset.js';
import {Series} from './series.js';
import {Nominal} from './nominal.js';
import {Int} from './quantitative.js';
import test from 'ava';

test('subset test equality', t => {
  t.true(isSubset({
    a: 1,
    b: 2,
    c: 3,
  }, {
    a: 1,
    b: 2,
    c: 3,
  }));
});

test('subset test actual subset', t => {
  t.true(isSubset({
    a: 1,
    b: 2,
    c: 3,
  }, {
    a: 1,
    b: 2,
  }));
});

test('subset test wrong subset', t => {
  t.false(isSubset({
    a: 1,
    b: 2,
    c: 3,
  }, {
    a: 1,
    b: 3,
  }));
});

test('subset complex 1', t => {
  t.true(isSubset({
    a: [
      1,
      2,
      3,
      {
        4: 'dog',
      },
    ],
    b: 2,
    c: 3,
  }, {
    b: 2,
    c: 3,
  }));
});

test('subset complex 2', t => {
  t.true(isSubset({
    a: [
      1,
      2,
      3,
      {
        4: 'dog',
      },
    ],
    b: 2,
    c: 3,
  }, {
    a: [
      1,
      2,
      3,
      {}
    ],
  }));
});

test('merge simple', t => {
  t.deepEqual(
    merge({
      a: 1,
    }, {
      a: 2,
    }),
    {
      a: 1,
    },
  );
});

test('merge layered', t => {
  t.deepEqual(
    merge({
      width: 500,
    }, {
      spec: 'vega',
    }, {
      style: {
        color: 'blue',
      },
    }),
    {
      width: 500,
      spec: 'vega',
      style: {
        color: 'blue',
      },
    },
  );
});

test('merge complex', t => {
  t.deepEqual(
    merge({
      width: 500,
      style: {
        stroke: 2,
      },
    }, {
      spec: 'vega',
    }, {
      style: {
        color: 'blue',
      },
    }),
    {
      width: 500,
      spec: 'vega',
      style: {
        color: 'blue',
        stroke: 2,
      },
    },
  );
});

test('vega basic bar chart', t => {
  const viz = new Visual(new Dataset([
    new Column('name', new Series([
      new Nominal('Alfred'),
      new Nominal('Bob'),
      new Nominal('Carol'),
      new Nominal('Doug'),
    ], Nominal)),
    new Column('age', new Series([
      new Int(22),
      new Int(12),
      new Int(34),
      new Int(50),
    ], Int)),
  ]), ['name', 'age'], new BarChartSpec());
  t.true(isSubset(viz.toVegaSpec(), {
    $schema: VEGA_SCHEMA,
    data: {
      values: [
        {
          name: 'Alfred',
          age: 22,
        },
        {
          name: 'Bob',
          age: 12,
        },
        {
          name: 'Carol',
          age: 34,
        },
        {
          name: 'Doug',
          age: 50,
        },
      ],
    },
    mark: 'bar',
    encoding: {
      x: {
        field: 'name',
        type: 'nominal',
      },
      y: {
        field: 'age',
        type: 'quantitative',
      },
    },
  }));
});