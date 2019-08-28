import Vue from 'vue';
import popup from './popup.vue';
import { isVNode } from '../../utils/vdom';
let PopupConstructor = Vue.extend(popup);

let instance;
let instances = [];
let seed = 1;

const Popup = function(message,duration,userOnClose){
	if (Vue.prototype.$isServer) return;
	userOnClose = typeof userOnClose === "function" ? userOnClose : new Function();
	let id = 'message_' + seed++;
	let options = {
		message : message,
		duration : Number(duration) || 2000
	}
	options.onClose = function() {
		Popup.close(id, userOnClose);
	};
	instance = new PopupConstructor({
		data: options
	});
	instance.id = id;
	if (isVNode(instance.message)) {
		instance.$slots.default = [instance.message];
		instance.message = null;
	}
	instance.vm = instance.$mount();
	document.body.appendChild(instance.vm.$el);
	instance.vm.visible = true;
	instance.dom = instance.vm.$el;
	instances.push(instance);
	return instance.vm;
}

Popup.close = function(id, userOnClose) {
  for (let i = 0, len = instances.length; i < len; i++) {
    if (id === instances[i].id) {
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i]);
      }
      instances.splice(i, 1);
      break;
    }
  }
};


export default Popup;
