import Vue from 'vue';

import datimFormat from './datimFormat';
import numberFormat from './numberFormat';

Vue.filter('datimFormat', datimFormat);
Vue.filter('numberFormat', numberFormat);
