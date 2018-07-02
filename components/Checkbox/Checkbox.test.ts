import {mount} from '@vue/test-utils';
import Checkbox from './Checkbox.vue';

describe('Checkbox', () => {
  const wrapper = mount(Checkbox);

  it('unchecked by default', () => {
    expect(wrapper.vm.checked).toEqual(false);
  });

  it('change value on check', () => {
    wrapper.vm.toggleCheck();

    expect(wrapper.emitted()['update:checked']).toEqual([[true]]);
  });
});
