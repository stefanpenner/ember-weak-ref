export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');
}
import Object from 'ember-object';
import Mixin from '../mixin';

Object.reopen(Mixin); // TODO: maybe not all objects want this.

export default {
  name: 'ember-weak',
  initialize
};
