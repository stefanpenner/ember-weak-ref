import cellMap from './map';
import Cell from './cell';
import Mixin from 'ember-metal/mixin';

export default Mixin.create({
  weak() {
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
