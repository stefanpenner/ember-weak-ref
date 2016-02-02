import { module, test } from 'qunit';

import Object from 'ember-object';

import Mixin from 'ember-weak-ref/mixin';

import run from 'ember-runloop';
import map from 'ember-weak/map';

module('WeakMixin');

test('basic scenario (get/set)', function(assert) {
  let obj = Object.extend(Mixin).create();

  let weak = obj.weak();

  assert.equal(obj.get('foo'), undefined);

  weak.set('foo', 1);

  assert.equal(obj.get('foo'), 1);
  assert.equal(weak.get('foo'), 1);

  run(obj, 'destroy');

  weak.set('foo', 2);
  assert.equal(weak.get('foo'), undefined);
});

test('basic scenario (invoke)', function(assert) {
  let obj = Object.extend(Mixin, {
    init() {
      this._super(...arguments);
      this.state = undefined;
    },

    updateState(state) {
      this.state = state;
    }
  }).create();

  let weak = obj.weak();

  assert.equal(obj.state, undefined);

  weak.invoke('updateState', 'hi');

  assert.equal(obj.get('state'), 'hi');
  assert.equal(weak.get('state'), 'hi');

  run(obj, 'destroy');

  weak.invoke('updateState', 'foo');
  assert.equal(weak.get('state'), undefined);
});

test('basic scenario (release)', function(assert) {
  let obj = Object.extend(Mixin).create();

  let weak = obj.weak();

  assert.equal(obj.get('foo'), undefined);

  weak.set('foo', 1);

  assert.equal(obj.get('foo'), 1);
  assert.equal(weak.get('foo'), 1);

  weak.release();
  assert.deepEqual(map.get(obj), []);


  weak.set('foo', 2);
  assert.equal(weak.get('foo'), undefined);
  assert.equal(obj.get('foo'), 1);
});
