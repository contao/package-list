
import Vue from 'vue';
import VueI18n from 'vue-i18n';

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

Vue.use(VueI18n);

const i18n = new VueI18n();

const setLocale = (locale) => {
    i18n.locale = locale;
    store.commit('algolia/setLanguage', locale);
    document.querySelector('html').setAttribute('lang', locale);
};

export default {
    plugin: i18n,

    async init() {
        i18n.fallbackLocale = 'en';
        await this.load('en');

        const userLang = localStorage.getItem('_locale');

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
        if (i18n.availableLocales.includes(locale)) {
            setLocale(locale);
            return;
        }

        if (!locales[locale]) {
            if (locale.length === 5) {
                return this.load(locale.slice(0, 2));
            }

            throw `Locale ${locale} does not exist.`;
        }

        i18n.setLocaleMessage(locale, Object.assign({}, await locales[locale]()));
        setLocale(locale);
    },
};
