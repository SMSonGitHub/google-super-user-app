import {PolymerElement, html} from '@polymer/polymer/polymer-element';

import view from './sabien-view.template.html';
import style from './sabien-view.style.scss';
import '../shared-styles';

export class SabienView extends PolymerElement {
  $: any;

  static get is() {
    return 'sabien-view';
  }

  static get template() {
    return html([`<style include="shared-styles">${style}</style>${view}`]);
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged',
      },
      route: Object,
      routeData: Object,
      dynamicPath: String,
      googleRoot: String
    };
  }

  static get observers() {
    return [
      '_routeChanged(route.path)',
    ];
  }

  _routeChanged(path: string) {
    // For some reason, the route change is not detected when we go back to the main page2 view.
    // This little workaround will fix this problem
    this.googleRoot = "https://www.google.com/search?q="
    const [route, subroute] = path.replace(this.rootPath, '').split('/');
    if (route !== 'view3') {
      return;
    }
   
    this.dynamicPath = '';
  }

  _pageChanged(page: string) {
    // Load page import on demand. Show 404 page if fails
    import(
      /* webpackMode: "lazy" */
      `./${page}/${page}.component`
      ).catch(this._showPage404.bind(this));
  }

  _showPage404() {
    this.page = 'index';
  }

  _insertSiteOperator() {
    if (!this.dynamicPath.includes('site:')) {
      this.dynamicPath = 'site:www.stackoverflow.com ' + this.dynamicPath;
    }
  }
}
window.customElements.define(SabienView.is, SabienView);
