import Vue, {VNodeDirective} from 'vue';

interface IOuterClickHTMLElement extends HTMLElement {
  event?: EventListener;
}

Vue.directive('outer-click', {
  bind(el: IOuterClickHTMLElement, binding: VNodeDirective) {
    const onOuterClickFn = binding.value;
    if (onOuterClickFn instanceof Function) {
      const handler: EventListener = (event: Event) => {
        if (event.target instanceof Node && !el.contains(event.target)) {
          onOuterClickFn();
        }
      };
      el.event = handler;
      document.addEventListener('click', handler, true);
    }
  },
  unbind(el: IOuterClickHTMLElement) {
    if (el.event) {
      document.removeEventListener('click', el.event, true);
    }
  }
});
