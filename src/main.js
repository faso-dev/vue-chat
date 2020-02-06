import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VSocket from 'vue-socket.io';
import { ValidationObserver, ValidationProvider, extend, localize } from 'vee-validate';
import fr from 'vee-validate/dist/locale/fr.json';
import * as rules from 'vee-validate/dist/rules';

// install rules and localization
Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule]);
});

localize('fr', fr);

// Install components globally
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

Vue.use(
    new VSocket({
        // for development
        debug: false,
        // listen url 'https://faso-chat.herokuapp.com'
        //connection: 'http://localhost:4000',
        connection: 'https://faso-chat.herokuapp.com',
    })
);

Vue.config.productionTip = false;

new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app');
