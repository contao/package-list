
import Vue from 'vue';
import vuexI18n from 'vuex-i18n';

import store from '../store';

const locales = {
    en: () => import('./en.json'),
    de: () => import('./de.json'),
    br: () => import('./br.json'),
    cs: () => import('./cs.json'),
    es: () => import('./es.json'),
    fa: () => import('./fa.json'),
    fr: () => import('./fr.json'),
    it: () => import('./it.json'),
    ja: () => import('./ja.json'),
    lv: () => import('./lv.json'),
    nl: () => import('./nl.json'),
    pl: () => import('./pl.json'),
    pt: () => import('./pt.json'),
    ru: () => import('./ru.json'),
    sr: () => import('./sr.json'),
    zh: () => import('./zh.json'),
};

const i18n = {
    async init() {
        Vue.i18n.fallback('en');
        await this.load('en');

        const userLang = localStorage.getItem('contao_manager_locale');

        if (userLang && locales[userLang]) {
            return this.load(userLang);
        }

        const languages = Array.from(navigator.languages);

        for (let i = 0; i < languages.length; i += 1) {
            if (locales[languages[i]]) {
                return this.load(languages[i]);
            }
        }
    },

    async switch(locale) {
        window.localStorage.setItem('_locale', locale);

        this.load(locale);

        store.dispatch('algolia/discover');
    },

    async load(locale) {
        if (Vue.i18n.localeExists(locale)) {
            Vue.i18n.set(locale);
            store.commit('algolia/setLanguage', locale);
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
        store.commit('algolia/setLanguage', locale);
    },
};

Vue.use(vuexI18n.plugin, store);

export default i18n;
