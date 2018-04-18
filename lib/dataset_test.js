import {Column, Dataset, VEGA_SCHEMA, VEGA_DESCRIPTION} from './dataset.js';
import test from 'ava';
import {Series} from './series.js';
import {Nominal} from './nominal.js';
import {Int} from './quantitative.js';

test('basic table to vega', t => {
  const xColumn = new Column('name', new Series([
    new Nominal('Bob'),
    new Nominal('Carl'),
    new Nominal('Dave'),
    new Nominal('Evan'),
    new Nominal('Felix'),
    new Nominal('Giovanni'),
    new Nominal('Hubert'),
  ], Nominal));
  const yColumn = new Column('age', new Series([
    new Int(22),
    new Int(35),
    new Int(34),
    new Int(17),
    new Int(93),
    new Int(64),
    new Int(22),
  ], Int));
  const dataset = new Dataset([xColumn, yColumn]);
  t.deepEqual(dataset.toVega('age', 'name'), {
    $schema: VEGA_SCHEMA,
    description: VEGA_DESCRIPTION,
    data: {
      values: [
        {
          age: 22,
          name: 'Bob'
        },
        {
          age: 35,
          name: 'Carl'
        },
        {
          age: 34,
          name: 'Dave'
        },
        {
          age: 17,
          name: 'Evan'
        },
        {
          age: 93,
          name: 'Felix'
        },
        {
          age: 64,
          name: 'Giovanni'
        },
        {
          age: 22,
          name: 'Hubert'
        }
      ]
    },
    mark: 'bar',
    encoding: {
      x: {
        field: 'age',
        type: 'quantitative'
      },
      y: {
        field: 'name',
        type: 'nominal'
      }
    }
  });
});