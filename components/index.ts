import Vue from 'vue';
import ActionsPane from './ActionsPane/ActionsPane.vue';
import BackToTop from './BackToTop/BackToTop.vue';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs.vue';
import Checkbox from './Checkbox/Checkbox.vue';
import Collapse from './Collapse/Collapse.vue';
import CommonModal from './CommonModal/CommonModal.vue';
import ConfirmModal from './ConfirmModal/ConfirmModal.vue';
import ErrorMessage from './ErrorMessage/ErrorMessage.vue';
import FileUploader from './FileUploader/FileUploader.vue';
import InfoField from './InfoField/InfoField.vue';
import PageTemplate from './PageTemplate/PageTemplate.vue';
import RadioButton from './RadioButton/RadioButton.vue';
import ScrolledIntoView from './ScrolledIntoView/ScrolledIntoView.vue';
import SharePane from './SharePane/SharePane.vue';
import Tab from './Tabs/Tab/Tab.vue';
import Tabs from './Tabs/Tabs.vue';
import ToggleVisibleField from './ToggleVisibleField/ToggleVisibleField.vue';
import SortingHeaderCell from './SortingHeaderCell/SortingHeaderCell.vue';
import Dropdown from './Dropdown/Dropdown.vue';
import Alert from './Alert/Alert.vue';
import Pagination from './Pagination/Pagination.vue';
import Selectbox from './Selectbox/Selectbox.vue';
import SelectboxItem from './Selectbox/SelectboxItem/SelectboxItem.vue';
import Datepicker from './Datepicker/Datepicker.vue';

const components: { [key: string]: {} } = {
  ActionsPane,
  Checkbox,
  Collapse,
  ToggleVisibleField,
  InfoField,
  Tabs,
  Tab,
  Breadcrumbs,
  PageTemplate,
  BackToTop,
  ConfirmModal,
  CommonModal,
  ErrorMessage,
  FileUploader,
  RadioButton,
  ScrolledIntoView,
  SharePane,
  SortingHeaderCell,
  Dropdown,
  Alert,
  Pagination,
  Selectbox,
  SelectboxItem,
  Datepicker
};

Object.keys(components)
  .forEach(componentName => Vue.component(componentName, components[componentName]));
