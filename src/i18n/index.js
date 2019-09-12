
import Vue from 'vue';
import vuexI18n from 'vuex-i18n';

import store from '../store';

const locales = {
    en: () => import('./en.json'),
};

const i18n = {
    init() {
        let userLang = window.localStorage.getItem('_locale');

        if (!userLang) {
            userLang = navigator.language || navigator.userLanguage;
        }

        return this.load(userLang);
    },

    async switch(locale) {
        window.localStorage.setItem('_locale', locale);

        this.load(locale);
    },

    async load(locale) {
        if (Vue.i18n.localeExists(locale)) {
            Vue.i18n.set(locale);
            return;
        }

        if (!locales[locale]) {
            if (locale.length === 5) {
                return this.load(locale.slice(0, 2));
            }

            throw `Locale ${locale} does not exist.`;
        }

        Vue.i18n.add(locale, Object.assign({}, await locales[locale]()));
        Vue.i18n.set(locale);
    },
};


Vue.use(vuexI18n.plugin, store);
Vue.i18n.fallback('en');
i18n.load('en');

export default i18n;
