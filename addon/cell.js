import Ember from 'ember';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

import map from './map';

const { setProperties, getProperties } = Ember;

export default class Cell {
  constructor(obj) {
    this._obj = obj;
  }

  release() {
    let obj = this._obj;
    if (!obj) { return; }

    this._obj = undefined;
    if (!map.has(obj)) { return; }

    let cells = map.get(obj);
    if (!cells) { return; }

    let index = cells.indexOf(this);
    cells.splice(index, 1);
  }

  get object() {
    return this._obj;
  }

  set(key, value) {
    return this._obj && set(this._obj, key, value);
  }

  setProperties(key, value) {
    return this._obj && setProperties(this._obj, key, value);
  }

  getProperties(key, value) {
    return this._obj && getProperties(this._obj, key, value);
  }

  get(key) {
    return this._obj && get(this._obj, key);
  }

  invoke(key, ...args) {
    return this._obj && this._obj[key](...args);
  }
}
