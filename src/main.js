// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './icon/fontAlign/iconfont.css'
// import 'at.alicdn.com/t/font_3144555_83ml6pqqjfp.css'
Vue.use(ElementUI);

import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)

// import {fabric} from "../static/js/fabric.js";

Vue.config.productionTip = false

// console.log = function (){}


// the below css files overrides the default style of element-UI
// including el-tabs, el-dialog, el-radio, el-select, el-tag
import "./assets/css/base.css";
import "./assets/css/tabs-override.css";
import "./assets/css/dialog-override.css";
import "./assets/css/radio-override.css";
import "./assets/css/input-override.css";
import "./assets/css/slider-override.css";

/* tag必须在dialog之前引入，否则会有覆写问题 */
import "./assets/css/tag-override.css";
import "./assets/css/select-override.css";
import "./assets/css/input-number-override.css";
import "./assets/css/step-override.css";
import "./assets/css/dropdown-override.css";


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
