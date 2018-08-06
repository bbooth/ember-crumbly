import {get, set} from '@ember/object';
import Route from '@ember/routing/route';

export default Route.extend({
  init() {
    this._super(arguments);
    this.breadCrumb = {}
  },

  model() {
    return {
      name: 'Derek Zoolander',
      age: 21,
      look: 'Blue Steel'
    };
  },

  afterModel(model) {
    const name = get(model, 'name');
    const age = get(model, 'age');
    const look = get(model, 'look');

    const fashionModel = {
      title: name,
      age,
      look
    };

    set(this, 'breadCrumb', fashionModel);
  }
});
