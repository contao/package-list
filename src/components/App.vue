<template>
    <div id="app">
        <div v-if="initializing" class="view-init">
            <div class="view-init__cell animate-initializing">
                <img src="../assets/images/logo.svg" width="300" height="100" alt="Contao Logo">
                <p class="view-init__message">{{ $t('ui.app.loading') }}</p>
            </div>
        </div>
        <template v-else>
            <router-view :class="hasModal ? 'animate-blur-in' : 'animate-blur-out'"/>
            <component :is="currentModal" v-if="hasModal"/>
        </template>
    </div>
</template>

<script>
    import { defineAsyncComponent } from "vue";
    import { mapGetters } from 'vuex';

    export default {
        data: () => ({
            initializing: true,
        }),

        computed: {
            ...mapGetters('modals', ['hasModal', 'currentModal']),
        },

        methods: {
            initColorMode() {
                let prefersDark = localStorage.getItem('contao--prefers-dark');

                if (null === prefersDark) {
                    prefersDark = String(window.matchMedia('(prefers-color-scheme: dark)').matches);
                }

                document.documentElement.dataset.colorScheme = prefersDark === 'true' ? 'dark' : 'light';
            },
        },

        async created() {
            document.title = this.$t('ui.app.title');

            this.$watch(this.$i18n.locale, () => {
                document.title = this.$t('ui.app.title');
            });

            await this.$store.dispatch('algolia/discover');

            const network = document.createElement('script');
            network.src = 'https://contao.org/files/js/network.min.js';
            network.onload = () => {
                setTimeout(() => {
                    this.initializing = false;
                }, 300);
            };

            document.body.appendChild(network);
        },

        mounted() {
            this.initColorMode();

            this.$store.dispatch('packages/details/init', {
                vue: this,
                component: defineAsyncComponent(() => import('./fragments/PackageDetails'))
            });
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
@use "../assets/styles/layout";
@use "../assets/styles/forms";
@use "../assets/styles/animations";

.view-init {
    display: table;
    width: 100%;
    height: 100%;

    &__cell {
        display: table-cell;
        font-size: 1.5em;
        text-align: center;
        vertical-align: middle;

        p {
            margin-top: 2em;
        }
    }
}
</style>
