import { hasOwn } from './util.js';

export function isVNode(node) {
  return node !== null && typeof node === 'object' && hasOwn(node, 'componentOptions');
};

export function getFirstComponentChild(children) {
  return children && children.filter(c => c && c.tag)[0];
};
