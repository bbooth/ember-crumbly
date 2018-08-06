import Route from '@ember/router/route';

export default Route.extend({
  init() {
    this._super(arguments);
    this.breadCrumb = {
      name: 'Animals at the Zoo',
      description: 'Animals are multicellular, eukaryotic organisms of the kingdom Animalia (also called Metazoa).',
      linkable: false
    }
  }
});
