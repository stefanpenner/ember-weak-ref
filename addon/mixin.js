import cellMap from './map';
import Cell from './cell';
import Mixin from 'ember-metal/mixin';
import Ember from 'ember';

const { Promise } = Ember.RSVP;

export default Mixin.create({
  weak(callback) {
    let ref = this.weakRef();
    return new Promise(resolve => resolve(callback(ref))).
               finally(() => ref.release());
  },

  weakRef() {
    let cell = new Cell(this);
    let cells = cellMap.get(this) || [];

    cellMap.set(this, cells);
    cells.push(cell);

    return cell;
  },

  destroy() {
    if (!cellMap.has(this)) { return; }

    cellMap.get(this).forEach(cell => cell.release());

    this._super(...arguments);
  },
});
