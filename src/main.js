import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VSocket from 'vue-socket.io';
import { ValidationObserver, ValidationProvider, extend, localize } from 'vee-validate';
import fr from 'vee-validate/dist/locale/fr.json';
import * as rules from 'vee-validate/dist/rules';
import VueMonent  from 'vue-moment';

// install rules and localization
Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule]);
});

localize('fr', fr);

// Install components globally
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
Vue.use(VueMonent);
Vue.use(
    new VSocket({
        // for development
        debug: false,
        connection: 'http://localhost:4000',
    })
);

Vue.config.productionTip = false;

new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app');
