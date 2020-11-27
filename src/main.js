import Vue from 'vue'
import App from './App.vue'
//訊息欄
import Toastr from "vue-toastr";
const toastrConfig = {
    defaultTimeout: 5000,
    defaultProgressBar: true,
    defaultProgressBarValue: 0,
    defaultType: "info",
    defaultPosition: "toast-top-right",
};

Vue.use(Toastr, toastrConfig);
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')
