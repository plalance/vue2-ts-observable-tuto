import 'es6-promise/auto';
import {Vue} from 'vue-property-decorator'
import Paginate from 'vuejs-paginate'
import M from './Libraries/materialize.js';
import vSelect from 'vue-select';

import * as $ from 'jquery';
import * as axios from "axios";
import * as VueAxios from 'vue-axios';
import * as VueLodash from 'vue-lodash';
import * as VueCookie from 'vue-cookie';
import * as moment from 'vue-moment';

import App from './App.vue'
import {store} from './Store'
import {router} from "./Router";
import {trads} from "./Traductions";
import {i18n} from './I18n'

import promiseFinally from 'promise.prototype.finally';
promiseFinally.shim();

Vue.config.devtools = true;

const options = {name: '_'};

Vue.use((<any>store));
Vue.use((<any>i18n));
Vue.use((<any>VueAxios), axios);
Vue.use(moment);
Vue.use(VueCookie);
Vue.use(VueLodash, options);
Vue.component('paginate', Paginate);
Vue.component('v-select', vSelect);

// Globals configuration
(<any>window).Vue = Vue;
(<any>window).$ = (<any>window).jQuery = $;
(<any>window).M = M;
(<any>window).axios = axios;

// Definition de la locale dans instance vue (pour changement à la volée)
Object.defineProperty(Vue.prototype, '$DEBUG', {
    get: function () {
        return (<any>window).configuration.DEBUG;
    }
});


// Traductions
Object.defineProperty(Vue.prototype, '$TRADS', {
    get: function () {
        return trads;
    }
});

// Definition de la locale dans instance vue (pour changement à la volée)
Object.defineProperty(Vue.prototype, '$locale', {
    get: function () {
        return i18n.locale
    },
    set: function (locale) {
        i18n.locale = locale
    }
});

// User NULL + Token présent = refresh de page ==> Il faut recharger les claims depuis l'API
if (store.getters.authenticatedUser === null && VueCookie.get('token')){

    // Si un token est présent dans le locastorage, c'est qu'il faut reconnecter le faux profil
    // Seul le faux profil met un jeton dans le localstorage, le vrai profil n'utilise que le cookie.
    // Il faut aussi que la configuration autorise le bypass du profil (ALLOW_FAKE_AUTH)
    if(localStorage.getItem('token') !== null && window.configuration.ALLOW_FAKE_AUTH){

        let fakeGroup = window.configuration.PROJECT_ADMIN_GROUP_ID;

        let fakeCompanyId = "00";

        if(localStorage.getItem("fake_group")){
            fakeGroup = localStorage.getItem("fake_group");
        }
        if(localStorage.getItem("fake_companyId")){
            fakeCompanyId = localStorage.getItem("fake_companyId");
        }

        store.dispatch("connectFakeUser", {group: fakeGroup, companyId: fakeCompanyId});
        loadApp();

        // Si pas de token en localstorage mais que  le cookie 'token' existe, c'est que l'utilsiateur connecté est un vrai user.
    }else{
        store.dispatch('getClaims', {token: VueCookie.get('token'), isLoginProcess: false}).then(
            () => {

                (<any>window).configuration.DEBUG ? console.log('Utilisateur chargé, APP loading', store.getters.authenticatedUser) : false;
                loadApp();
            }
        ).catch(() => {
            store.dispatch('authLogoutForce');
            loadApp();
        });
    }
}else {
    loadApp();
}

function loadApp(){
    new Vue({
        el: document.querySelector('#app') as Element,
        store,
        router: router,
        i18n: i18n,
        components: {App},
        render(h) {
            return h('App')
        }
    });
}