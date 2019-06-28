import Vue from 'vue';
// I18n traductions
import VueI18n from 'vue-i18n'
import {trads} from "../Traductions";

Vue.use(VueI18n);

// browser locale identification, default : fr
let locale = 'fr';
if(navigator.language){
    // navigator.language : fr-FR , we have to split it to get "fr"
    locale = navigator.language.split('-')[0];
}

// Create VueI18n instance with options
export let i18n = new VueI18n({
    locale: locale, // set locale
    fallbackLocale: 'fr', // locale if default not found
    messages: trads, // set locale messages
});