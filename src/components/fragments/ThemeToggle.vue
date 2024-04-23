<template>
    <div class="theme-switch">
        <button @click="toggle" :title="$t('ui.app.colorLightTitle')" v-if="colorScheme === 'dark'">{{ $t('ui.app.colorLight') }}</button>
        <button @click="toggle" :title="$t('ui.app.colorDarkTitle')" v-else>{{ $t('ui.app.colorDark') }}</button>
    </div>
</template>

<script>
    export default {
        data: () => ({
            colorScheme: 'light',
        }),

        computed: {
            themeOptions() {
                return {
                    light: 'Dark Mode',
                    dark: 'Light Mode'
                }
            },
        },

        methods: {
            prefersDark () {
                const prefersDark = localStorage.getItem('contao--prefers-dark');

                if (null === prefersDark) {
                    return !!window.matchMedia('(prefers-color-scheme: dark)').matches;
                }

                return prefersDark === 'true';
            },

            setColorScheme () {
                document.documentElement.dataset.colorScheme = this.colorScheme = this.prefersDark() ? 'dark' : 'light';
            },

            toggle () {
                const isDark = !this.prefersDark();

                if (isDark === window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    localStorage.removeItem('contao--prefers-dark');
                } else {
                    localStorage.setItem('contao--prefers-dark', String(isDark));
                }

                this.setColorScheme();
            }
        },

        mounted () {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.setColorScheme);
            this.setColorScheme();
        },

        unmounted () {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.setColorScheme)
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/styles/defaults";

    .theme-switch {
        position: relative;
        display: inline-block;

        button {
            width: auto;
            height: auto;
            padding: 0 0 0 24px;
            background: transparent;
            color: var(--text);
            font-size: 12px;
            font-weight: $font-weight-normal;
            line-height: 20px;
            background: var(--svg--color-scheme) left center no-repeat;
            background-size: 20px 20px;
            border: none;
            cursor: pointer;

            &:hover {
                color: var(--black);
            }
        }
    }

</style>
