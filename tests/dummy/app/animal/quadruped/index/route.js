import Route from '@ember/router/route';

export default Route.extend({
  init() {
    this._super(arguments);
    this.breadCrumb = {
      name: 'I am Quadrupeds Index'
    }
  }
});
