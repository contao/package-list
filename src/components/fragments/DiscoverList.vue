<template>
    <component :is="wrapper">

        <template #search>
            <search-input :placeholder="$tc('ui.discover.searchPlaceholder', extensionCount)" class="package-search__input"/>
        </template>

        <loading-spinner v-if="searching && !results" class="package-search__status package-search__status--loader">
            <p class="package-search__title">{{ $t('ui.discover.loading') }}</p>
        </loading-spinner>

        <div v-else-if="offline || discover === null" class="package-search__status package-search__status--offline">
            <p class="package-search__title">{{ $t('ui.discover.offline') }}</p>
            <p class="package-search__explain">{{ $t('ui.discover.offlineExplain') }}</p>
            <button class="widget-button widget-button--inline widget-button--update" @click="getOnline">{{ $t('ui.discover.offlineButton') }}</button>
        </div>

        <div v-else-if="isSearching && results && !Object.keys(results).length" class="package-search__status package-search__status--empty">
            <i18n tag="p" path="ui.discover.empty" class="package-search__title">
                <template #query><i>{{ query }}</i></template>
            </i18n>
        </div>

        <template v-else-if="isSearching">
            <search-sorting v-if="!query"/>
            <div class="package-search__results">
                <discover-package class="package-search__item" v-for="item in results" :data="item" :key="item.name">
                    <template #hint><slot name="package-hint" :data="item"/></template>
                    <template #actions><slot name="package-actions" :data="item"/></template>
                </discover-package>
            </div>
            <div class="package-search__more">
                <loading-button inline icon="search" :loading="searching" v-if="hasMore" @click="loadMore">{{ $t('ui.discover.more') }}</loading-button>
            </div>
        </template>

        <div v-else>
            <ad-banner v-if="discover.ads.length"/>

            <h2 class="package-search__headline">{{ $t('ui.discover.latestPackages') }}</h2>
            <div class="package-search__results">
                <discover-package class="package-search__item" v-for="item in discover.latest" :data="item" :key="item.name">
                    <template #hint><slot name="package-hint" :data="item"/></template>
                    <template #actions><slot name="package-actions" :data="item"/></template>
                </discover-package>
            </div>
            <div class="package-search__more">
                <button class="package-search__more-button" @click="openSearch('latest')">{{ $t('ui.discover.more') }}</button>
            </div>

            <h2 class="package-search__headline">{{ $t('ui.discover.faversPackages') }}</h2>
            <div class="package-search__results">
                <discover-package class="package-search__item" v-for="item in discover.favers" :data="item" :key="item.name">
                    <template #hint><slot name="package-hint" :data="item"/></template>
                    <template #actions><slot name="package-actions" :data="item"/></template>
                </discover-package>
            </div>
            <div class="package-search__more">
                <button class="package-search__more-button" @click="openSearch('favers')">{{ $t('ui.discover.more') }}</button>
            </div>

            <h2 class="package-search__headline">{{ $t('ui.discover.downloadsPackages') }}</h2>
            <div class="package-search__results">
                <discover-package class="package-search__item" v-for="item in discover.downloads" :data="item" :key="item.name">
                    <template #hint><slot name="package-hint" :data="item"/></template>
                    <template #actions><slot name="package-actions" :data="item"/></template>
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
    import LoadingSpinner from './LoadingSpinner';
    import AdBanner from './AdBanner';
    import SearchSorting from './SearchSorting';
    import SearchInput from './SearchInput';
    import LoadingButton from './LoadingButton';

    export default {
        mixins: [search],
        components: { LoadingButton, SearchInput, SearchSorting, AdBanner, LoadingSpinner, DiscoverPackage },

        props: {
            wrapper: {
                required: true,
            },
            hideThemes: {
                type: Boolean,
                default: false,
            }
        },

        data: () => ({
            offline: false,
            searching: false,
            extensionCount: 0,

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

                    if (this.hideThemes) {
                        params.facetFilters = ['type:-contao-theme'];
                    }

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
            this.$watch(this.$i18n.locale, () => {
                if (this.isSearching) {
                    this.searchPackages();
                }
            });
        },

        async mounted() {
            const params = {
                hitsPerPage: 0,
                attributesToRetrieve: null,
                attributesToHighlight: null,
                analytics: false
            };

            if (this.hideThemes) {
                params.facetFilters = ['type:-contao-theme'];
            }

            this.$store.dispatch('algolia/findPackages', params).then((result) => {
                this.extensionCount = result.nbHits;
            }, () => {});

            if (this.isSearching) {
                this.searchPackages();
            }
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
@use "../../assets/styles/defaults";

.package-search {
    position: relative;

    &__input {
        max-width: 400px;
        margin: 0 20px;

        @include defaults.screen(1024) {
            margin-right: 0;
        }
    }

    &__headline {
        font-size: 18px;
        font-weight: defaults.$font-weight-normal;
        margin: 30px 0 10px;
    }

    &__results {
        display: grid;
        gap: 20px;
        margin-bottom: 20px;

        @include defaults.screen(1024) {
            grid-template-columns: repeat(2, 1fr);
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
