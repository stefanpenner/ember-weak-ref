# Ember-weak-ref

WeakRef implementation for ember objects. Allowing a mixture of long-running
and short running tasks to exist, without strongly retaining all parties.

## Installation

* `ember install ember-weak-ref`

## Examples

*note: wil real ES6 proxies, the api becomes nicer*

### basic example

```js
import WeakMixin from 'ember-weak-ref/mixin';

const Foo = Ember.Object.extend(WeakMixin);

let foo = Foo.create();

const weak = foo.weakRef();

someAsync(function() {
  weak.invoke('toString')
  // => undefined, or the value of foo.toString(), depending on if foo is gone
  or not.
});
```

### more advanced example

It is common, to want to create a weak reference to `this`, unfortunately this
requires a second scope. To make this ease, `obj.weak(fn)` is provided, which
yields the WeakReference as its argument.

*note: be sure not to close over anything you don't want to retain (other weak refs are ok)*

```js
export default Component.extend({
  actions: {
    async save() {
      this.set('saving', true);

      this.weak(async (component) => {
        try {
          let model = await component.invoke('saveModel');
        } finally {
          // ignore these operations, if
          // * the this.weak('save') is invoked again, resulting in a new operation id
          // * the component is destroyed
          // * if the compnoent has been released
          component.set('saving',  false);

          component.release(); // platform provided versions, could do this automatically.
        }
      });
    }
  }
})

```
