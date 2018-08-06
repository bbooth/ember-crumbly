import Component from '@ember/component';
import {oneWay, bool} from '@ember/object/computed';
import layout from '../templates/components/bread-crumb';

export default Component.extend({
  layout,
  tagName: 'li',
  classNameBindings: ['crumbClass'],

  crumbClass: oneWay('breadCrumbs.crumbClass'),
  linkClass: oneWay('breadCrumbs.linkClass'),
  hasBlock: bool('template').readOnly()
});
