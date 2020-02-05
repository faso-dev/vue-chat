import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VSocket from 'vue-socket.io';
Vue.use(
    new VSocket({
        // for development
        debug: false,
        // listen url
        connection: 'https://faso-chat.herokuapp.com',
    })
);

Vue.config.productionTip = false;

new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app');
