import Vue from 'vue'
import App from './App.vue'


import router from './router'
import './permission' // permission control
//訊息欄
import Toastr from "vue-toastr";
const toastrConfig = {
    defaultTimeout: 5000,
    defaultProgressBar: true,
    defaultProgressBarValue: 0,
    defaultType: "info",
    defaultPosition: "toast-top-right",
};

import 'bootstrap/dist/css/bootstrap.css'

Vue.use(Toastr, toastrConfig);
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
