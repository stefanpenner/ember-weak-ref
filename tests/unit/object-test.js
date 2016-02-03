import { module, test } from 'qunit';

import Object from 'ember-object';

import Mixin from 'ember-weak-ref/mixin';
import map from 'ember-weak-ref/map';

import run from 'ember-runloop';

module('WeakMixin#weakRef');

test('basic scenario (get/set)', function(assert) {
  let obj = Object.extend(Mixin).create();

  let weak = obj.weakRef();

  assert.equal(obj.get('foo'), undefined);
  assert.equal(weak.object, obj);

  weak.set('foo', 1);

  assert.equal(obj.get('foo'), 1);
  assert.equal(weak.get('foo'), 1);

  run(obj, 'destroy');

  assert.equal(weak.object, undefined);

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

  let weak = obj.weakRef();

  assert.equal(weak.object, obj);

  assert.equal(obj.state, undefined);

  weak.invoke('updateState', 'hi');

  assert.equal(obj.get('state'), 'hi');
  assert.equal(weak.get('state'), 'hi');

  run(obj, 'destroy');

  assert.equal(weak.object, undefined);

  weak.invoke('updateState', 'foo');
  assert.equal(weak.get('state'), undefined);
});

test('basic scenario (release)', function(assert) {
  let obj = Object.extend(Mixin).create();

  let weak = obj.weakRef();

  assert.equal(weak.object, obj);

  assert.equal(obj.get('foo'), undefined);

  weak.set('foo', 1);

  assert.equal(obj.get('foo'), 1);
  assert.equal(weak.get('foo'), 1);

  weak.release();
  assert.equal(weak.object, undefined);

  assert.deepEqual(map.get(obj), []);

  weak.set('foo', 2);
  assert.equal(weak.get('foo'), undefined);
  assert.equal(obj.get('foo'), 1);
});

module('WeakMixin#weak');


test('basic scenario (get/set)', function(assert) {
  let obj = Object.extend(Mixin).create();

  let result = obj.weak(weak => {
    assert.equal(weak.object, obj);

    assert.equal(obj.get('foo'), undefined);

    weak.set('foo', 1);

    assert.equal(obj.get('foo'), 1);
    assert.equal(weak.get('foo'), 1);

    run(obj, 'destroy');

    assert.equal(weak.object, undefined);

    weak.set('foo', 2);
    assert.equal(weak.get('foo'), undefined);

    return 1;
  });

  assert.equal(result, 1);
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

  let result = obj.weak(weak => {
    assert.equal(weak.object, obj);

    assert.equal(obj.state, undefined);

    weak.invoke('updateState', 'hi');

    assert.equal(obj.get('state'), 'hi');
    assert.equal(weak.get('state'), 'hi');

    run(obj, 'destroy');

    assert.equal(weak.object, undefined);

    weak.invoke('updateState', 'foo');
    assert.equal(weak.get('state'), undefined);

    return 2;
  });

  assert.equal(result, 2);
});

test('basic scenario (release)', function(assert) {
  let obj = Object.extend(Mixin).create();

  let result = obj.weak(weak => {
    assert.equal(weak.object, obj);

    assert.equal(obj.get('foo'), undefined);

    weak.set('foo', 1);

    assert.equal(obj.get('foo'), 1);
    assert.equal(weak.get('foo'), 1);

    weak.release();

    assert.equal(weak.object, undefined);
    assert.deepEqual(map.get(obj), []);

    weak.set('foo', 2);
    assert.equal(weak.get('foo'), undefined);
    assert.equal(obj.get('foo'), 1);
    return 3;
  });

  assert.equal(result, 3);
});

