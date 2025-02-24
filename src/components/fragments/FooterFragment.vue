<template>
    <footer :class="'fragment-footer' + (display ? (' fragment-footer--'+display) : '')">
        <div class="fragment-footer__settings">
            <footer-languages :locales="languageOptions" :current="currentLanguage" @change="updateLanguage"/>
            <theme-toggle/>
        </div>
    </footer>
</template>

<script>
    import i18n from '../../i18n';
    import locales from '../../i18n/locales';
    import FooterLanguages from './FooterLanguages.vue';
    import ThemeToggle from './ThemeToggle.vue';

    export default {
        components: { FooterLanguages, ThemeToggle },

        props: {
            display: String,
        },

        data: () => ({
            visible: false,
        }),

        computed: {
            currentLanguage() {
                return this.$i18n.locale;
            },

            languageOptions() {
                return locales;
            },
        },

        methods: {
            updateLanguage(value) {
                i18n.switch(value);
            },
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
@use "../../assets/styles/defaults";

.fragment-footer {
    clear: both;
    width: 250px;
    margin: 10px auto 0;
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    border-top: 1px solid var(--footer-bdr);

    &--main {
        width: auto;
        margin-top: 52px !important;
        padding: 20px 0;
    }

    &:before {
        content: "";
        display: table;
        clear: both
    }

    &__settings {
        margin-top: 10px;
        display: flex;
        flex-flow: column;
        justify-content: center;
        gap: 10px;
    }

    @include defaults.screen(960) {
        &--boxed,
        &--main {
            .fragment-footer {
                &__settings {
                    flex-flow: row;
                    margin-top: 0;
                }
            }
        }

        &--boxed {
            width: 840px;
        }
    }
}
</style>
