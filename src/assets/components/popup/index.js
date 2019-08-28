import Popup from './popup.js';
const install = function(Vue, opts = {}) {
  /* istanbul ignore if */
  if (install.installed) return;
  Vue.component(Popup.name, Popup);
	Vue.prototype.$popup = Popup;
};
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue);
};
export default {
	install,
	Popup
}