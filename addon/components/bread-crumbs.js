import {get, computed, getWithDefault, setProperties} from '@ember/object';
import {A} from '@ember/array';
import {assert} from '@ember/debug';
import {deprecate} from '@ember/application/deprecations';
import {isPresent, typeOf} from '@ember/utils';
import layout from '../templates/components/bread-crumbs';
import {inject as service} from '@ember/service';
import titleize from 'ember-cli-string-helpers/utils/titleize';
import Component from '@ember/component';
import {bool, readOnly} from '@ember/object/computed';
import { getOwner } from '@ember/application';

export default Component.extend({
  layout,
  tagName: 'ol',
  linkable: true,
  reverse: false,
  classNameBindings: ['breadCrumbClass'],
  router: service('router'),
  hasBlock: bool('template').readOnly(),
  currentUrl: readOnly('router.currentURL'),
  currentRouteName: readOnly('router.currentRouteName'),

  routeHierarchy: computed('currentUrl', 'currentRouteName', 'reverse', {
    get() {
      // console.log('routeHierarchy', this.router, get(this, 'currentUrl'), get(this, 'currentRouteName'), get(this, 'reverse'));
      const currentRouteName = getWithDefault(this, 'currentRouteName', false);

      assert('[ember-crumbly] Could not find a current route', currentRouteName);

      const routeNames = currentRouteName.split('.');
      const filteredRouteNames = this._filterIndexAndLoadingRoutes(routeNames);
      const crumbs = this._lookupBreadCrumb(routeNames, filteredRouteNames);

      return get(this, 'reverse') ? crumbs.reverse() : crumbs;
    }
  }).readOnly(),

  breadCrumbClass: computed('outputStyle', {
    get() {
      let className = 'breadcrumb';
      const outputStyle = getWithDefault(this, 'outputStyle', '');
      if (isPresent(outputStyle)) {
        deprecate('outputStyle option will be deprecated in the next major release', false, {id: 'ember-crumbly.outputStyle', until: '2.0.0'});
      }
      const lowerCaseOutputStyle = outputStyle.toLowerCase();

      if (lowerCaseOutputStyle === 'foundation') {
        className = 'breadcrumbs';
      }

      return className;
    }
  }).readOnly(),

  _guessRoutePath(routeNames, name, index) {
    // console.log('_guessRoutePath', routeNames, name, index);
    const routes = routeNames.slice(0, index + 1);

    if (routes.length === 1) {
      let path = `${name}`;

      return (this._lookupRoute(path)) ? path : name;
    }

    return routes.join('.');
  },

  _filterIndexAndLoadingRoutes(routeNames) {
    return routeNames.filter((name) => !(name === 'index' || name === 'loading'));
  },

  _lookupRoute(routeName) {
    return getOwner(this).lookup(`route:${routeName}`);
  },

  _lookupBreadCrumb(routeNames, filteredRouteNames) {
    const defaultLinkable = get(this, 'linkable');
    const pathLength = filteredRouteNames.length;
    const breadCrumbs = A();

    filteredRouteNames.map((name, index) => {
      let path = this._guessRoutePath(routeNames, name, index);
      const route = this._lookupRoute(path);
      const isHead = index === 0;
      const isTail = index === pathLength - 1;

      const crumbLinkable = (index === pathLength - 1) ? false : defaultLinkable;

      assert(`[ember-crumbly] \`route:${path}\` was not found`, route);

      const multipleBreadCrumbs = route.get('breadCrumbs');

      if (multipleBreadCrumbs) {
        multipleBreadCrumbs.forEach((breadCrumb) => {
          breadCrumbs.pushObject(breadCrumb);
        });
      } else {

        let breadCrumb = Object.assign(getWithDefault(route, 'breadCrumb', {
          title: titleize(name).replace('-', ' ')
        }));

        if (typeOf(breadCrumb) === 'null') {
          return;
        } else {
          if (isPresent(breadCrumb.path)) {
            path = breadCrumb.path;
          }

          setProperties(breadCrumb, {
            path,
            isHead,
            isTail,
            linkable: breadCrumb.hasOwnProperty('linkable') ? breadCrumb.linkable : crumbLinkable
          });
        }

        breadCrumbs.pushObject(breadCrumb);
      }
    });

    return A(breadCrumbs.filter((breadCrumb) => typeOf(breadCrumb) !== 'undefined'));
  }
});
