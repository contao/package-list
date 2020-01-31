<template>
    <div id="app">
        <div v-if="initializing" class="view-init">
            <div class="view-init__cell">
                <img src="../assets/images/logo.svg" width="300" height="100" alt="Contao Logo">
                <p class="view-init__message">{{ $t('ui.app.loading') }}</p>
            </div>
        </div>
        <template v-else>
            <router-view :class="!!currentPackage ? 'blur-in' : 'blur-out'"/>
            <package-details v-if="!!currentPackage"/>
        </template>
    </div>
</template>

<script>
    import PackageDetails from './fragments/PackageDetails';

    export default {
        components: { PackageDetails },

        data: () => ({
            initializing: true,
        }),

        computed: {
            currentPackage: vm => vm.$route.query.p,
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
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../assets/styles/defaults";
    @import "../assets/styles/layout";

    .view-init {
        display: table;
        width: 100%;
        height: 100%;

        &__cell {
            display: table-cell;
            font-size: 1.5em;
            text-align: center;
            vertical-align: middle;
            animation: initializing 1s linear infinite;

            p {
                margin-top: 2em;
            }
        }
    }

    .blur-in {
        z-index: -1;
        opacity: 0.5;
        filter: blur(4px);
        transition: opacity .5s, filter .5s;
    }

    .blur-out {
        opacity: 1;
        transition: opacity .5s;
    }

    @keyframes initializing {
        0% {
            opacity: 0.5;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.5;
        }
    }
</style>
