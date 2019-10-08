<template>
    <component :is="wrapper">

        <template #subheader>
            <search-input/>
        </template>

        <loader v-if="searching && !results" class="package-search__status package-search__status--loader">
            <p class="package-search__title">{{ $t('ui.discover.loading') }}</p>
        </loader>

        <div v-else-if="offline || discover === null" class="package-search__status package-search__status--offline">
            <p class="package-search__title">{{ $t('ui.discover.offline') }}</p>
            <p class="package-search__explain">{{ $t('ui.discover.offlineExplain') }}</p>
            <button class="widget-button widget-button--inline widget-button--update" @click="getOnline">{{ $t('ui.discover.offlineButton') }}</button>
        </div>

        <template v-else-if="isSearching">
            <search-sorting v-if="!query"/>
            <div class="package-search__results">
                <discover-package class="package-search__item" v-for="item in results" :data="item" :key="item.name">
                    <slot name="package-actions" :data="item"/>
                </discover-package>
            </div>
            <div class="package-search__more">
                <loading-button inline icon="search" :loading="searching" v-if="hasMore" @click="loadMore">{{ $t('ui.discover.more') }}</loading-button>
            </div>
        </template>

        <div v-else>
            <ads v-if="discover.ads.length"/>

            <h2 class="package-search__headline">{{ $t('ui.discover.latestPackages') }}</h2>
            <div class="package-search__results">
                <discover-package class="package-search__item" v-for="item in discover.latest" :data="item" :key="item.name">
                    <slot name="package-actions" :data="item"/>
                </discover-package>
            </div>
            <div class="package-search__more">
                <button class="package-search__more-button" @click="openSearch('latest')">{{ $t('ui.discover.more') }}</button>
            </div>

            <h2 class="package-search__headline">{{ $t('ui.discover.faversPackages') }}</h2>
            <div class="package-search__results">
                <discover-package class="package-search__item" v-for="item in discover.favers" :data="item" :key="item.name">
                    <slot name="package-actions" :data="item"/>
                </discover-package>
            </div>
            <div class="package-search__more">
                <button class="package-search__more-button" @click="openSearch('favers')">{{ $t('ui.discover.more') }}</button>
            </div>

            <h2 class="package-search__headline">{{ $t('ui.discover.downloadsPackages') }}</h2>
            <div class="package-search__results">
                <discover-package class="package-search__item" v-for="item in discover.downloads" :data="item" :key="item.name">
                    <slot name="package-actions" :data="item"/>
                </discover-package>
            </div>
            <div class="package-search__more">
                <button class="package-search__more-button" @click="openSearch('downloads')">{{ $t('ui.discover.more') }}</button>
            </div>
        </div>

        <a href="https://www.algolia.com/" target="_blank" class="package-search__algolia"><img src="../../assets/images/search-by-algolia.svg" alt="Algolia | Fast, Reliable and Modern Search and Discovery" width="200"></a>

    </component>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import search from '../../mixins/search';

    import DiscoverPackage from './DiscoverPackage';
    import Loader from './Loader';
    import Ads from './Ads';
    import SearchSorting from './SearchSorting';
    import SearchInput from './SearchInput';
    import LoadingButton from './LoadingButton';

    export default {
        mixins: [search],
        components: { LoadingButton, SearchInput, SearchSorting, Ads, Loader, DiscoverPackage },

        props: {
            wrapper: {
                required: true,
            },
        },

        data: () => ({
            offline: false,
            searching: false,

            results: null,
            hasMore: false,
        }),

        computed: {
            ...mapState('algolia', ['discover']),
        },

        methods: {
            ...mapMutations('packages/details', ['setCurrent']),

            async searchPackages() {
                this.searching = true;
                this.offline = false;

                try {
                    const params = {
                        hitsPerPage: 10 * this.pages,
                    };

                    if (this.query) {
                        params.query = this.query;
                    } else if (this.sorting) {
                        params.sorting = this.sorting;
                    }

                    const response = await this.$store.dispatch('algolia/findPackages', params);

                    this.hasMore = response.nbPages > 1;

                    if (response.nbHits === 0) {
                        this.results = {};
                        return;
                    }

                    const packages = {};

                    response.hits.forEach((pkg) => {
                        packages[pkg.name] = pkg;
                    });

                    this.results = packages;

                } catch (err) {
                    this.offline = true;
                }

                this.searching = false;
            },

            async getOnline() {
                this.searching = true;
                this.offline = false;

                await this.$store.dispatch('algolia/discover');

                this.searching = false;
            },

            async openSearch(sort) {
                this.results = null;
                await this.sortBy(sort);
            }
        },

        watch: {
            sorting() {
                this.searchPackages();
            },

            query() {
                this.results = null;
                this.searchPackages();
            },

            pages() {
                this.searchPackages();
            },
        },

        created() {
            if (this.$route.query && !this.$route.query.q && !this.$route.query.p) {
                this.$router.replace({ query: {}, append: true });
            }

            this.$watch(this.$i18n.locale, () => {
                if (this.isSearching) {
                    this.searchPackages();
                }
            });
        },

        mounted() {
            if (this.isSearching) {
                this.searchPackages();
            }
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/styles/defaults";

    .package-search {
        position: relative;

        &__headline {
            font-size: 18px;
            font-weight: $font-weight-normal;
            margin: 30px 0 10px;
        }

        @include screen(1024) {
            &__results {
                display: flex;
                flex-wrap: wrap;
                margin: 0 -8px;
            }

            &__item {
                flex-basis: calc(50% - 16px);
                margin-left: 8px;
                margin-right: 8px;
            }
        }

        &__status {
            margin: 100px 0;
            text-align: center;
            font-size: 20px;
            line-height: 1.5em;

            &--empty {
                padding-top: 140px;
                background: url('../../assets/images/sad.svg') top center no-repeat;
                background-size: 100px 100px;
            }

            &--offline {
                padding-top: 140px;
                background: url('../../assets/images/offline.svg') top center no-repeat;
                background-size: 100px 100px;
            }

            &--loader {
                .sk-circle {
                    width: 100px;
                    height: 100px;
                    margin: 0 auto 40px;
                }
            }

            button {
                margin-top: 2em;
            }
        }

        &__explain {
            font-size: 16px;
        }

        &__more {
            margin: 10px 0 30px;
            text-align: center;

            &-button {
                display: inline-block;
                margin: 0 auto;
                padding: 0;
                text-transform: uppercase;
                background: none;
                border: none;
                cursor: pointer;

                &:hover {
                    text-decoration: underline;
                }
            }
        }

        &__algolia {
            display: block;
            width: 200px;
            margin: 50px auto 0;
        }
    }

</style>
