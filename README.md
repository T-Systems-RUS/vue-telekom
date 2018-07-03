# vue-telekom

This is a collection of Telekom styles and base Vue components.

## Prerequisites

This repository uses [bulma](https://bulma.io/) styles so you will have to make sure you installed *bulma* as a dependency to your project. If you are using [vue-seed](https://github.com/T-Systems-RUS/vue-seed) *bulma* is added as a dependency by default.

## Getting Started

To use *vue-telekom* in your project you will need to add *vue-telekom* repository as submodule to your project:
```bash
# navigate to the folder in your project
# where you would like the submodule to be located (e.g my-project/src/common) and run:
git submodule add https://github.com/T-Systems-RUS/vue-telekom.git
git submodule init
git submodule update
```

## Import Styles

- Import styles to your main *style.scss*: `@import 'vue-telekom/styles/styles';`
- Import *vue-telekom* mixins to your *mixins.scss* file: `@import 'vue-telekom/styles/utilities/mixins;`
and use this file when importing to components that need mixins. (*vue-telekom* mixins file already contains *bulma* mixins with overriden variables. So please  ***do not***  import bulma mixins directly to your components as it might lead to viewport breakpoint inconsistency, e.g when using *bulma* mixins like `mobile`, `tablet`, `deskop` etc.)

## Import Components

- Import the necessary *vue-telekom* components locally to the component that will be using them:

```
import CommonModal from './vue-telekom/components/CommonModal/CommonModal.vue';

export default Vue.extend({
	...,
	components: {CommonModal},
	...
});
```

- Import the necessary *vue-telekom* components globally:

```
import CommonModal from './vue-telekom/components/CommonModal/CommonModal.vue';

Vue.component('CommonModal , CommonModal);
```

- Import all components globally by importing `/vue-telekom/components/index.ts` to your *main.ts* file
