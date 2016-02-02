# Ember-weak

WeakRef implementation for ember objects. Allowing a mixture of long-running
and short running tasks to exist, without strongly retaining all parties.

```js
export default Component.extend({
  actions: {
    async save() {
      this.set('saving', true);

      const component = this.weak('save');

      try {
        let model = await this.model.save();
      } finally {
        // ignore these operations, if
        // * the this.weak('save') is invoked again, resulting in a new operation id
        // * the component is destroyed
        // * if the compnoent has been released
        component.set('saving',  false);

        component.release(); // platform provided versions, could do this automatically.
      }
    }
  }
})

```

## Installation

* `ember install ember-weak`

