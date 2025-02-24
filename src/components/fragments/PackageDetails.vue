<template>
    <popup-overlay :fixed="true" popup-class="package-popup" tabindex="-1" @clear="clearCurrent()">
        <template #content>
            <div class="package-popup__headline">
                <button class="package-popup__button package-popup__button--previous" :title="$t('ui.package-details.previous')" @click="$router.go(-1)" v-if="hasPrevious">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none"/><path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z"/>
                    </svg>
                </button>
                {{ data.name }}
                <button class="package-popup__button package-popup__button--close" :title="$t('ui.package-details.close')" @click="clearCurrent()">
                    <svg height="24" viewBox="0 0 24 24" width="24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                    </svg>
                </button>
            </div>

            <div class="package-popup__loader" v-if="!metadata || !metadata.hasOwnProperty('name')">
                <loading-spinner horizontal/>
                <p>{{ $t('ui.package-details.loading') }}</p>
            </div>
            <template v-else>

                <div class="package-popup__summary">
                    <package-logo class="package-popup__logo" component-class="package-popup__icon" :src="metadata.logo"/>
                    <div class="package-popup__text">
                        <h1 class="package-popup__title">{{ metadata.title || data.name }}</h1>
                        <p class="package-popup__authors" v-if="authors">
                            {{ $t('ui.package-details.authors' )}}
                            <template v-for="(author, key) in authors">
                                <template v-if="author.homepage"><a class="package-popup__author" :key="key" :href="author.homepage" target="_blank" rel="noreferrer noopener">{{ author.name }}</a></template>
                                <span class="package-popup__author" :key="key" v-else>{{ author.name }}</span>
                            </template>
                        </p>
                        <p class="package-popup__statistics">
                            <span class="package-popup__stats package-popup__stats--private" :title="$t('ui.package.privateTitle')" v-if="metadata.private">{{ $t('ui.package.private') }}</span>
                            <span class="package-popup__stats package-popup__stats--updated" v-if="metadata.updated">{{ datimFormat(metadata.updated, false) }}</span>
                            <span class="package-popup__stats package-popup__stats--downloads" v-if="metadata.downloads > 0">{{ numberFormat(metadata.downloads) }}</span>
                            <span class="package-popup__stats package-popup__stats--favers" v-if="metadata.favers > 0">{{ numberFormat(metadata.favers) }}</span>
                            <more-links :name="metadata.name" :homepage="metadata.homepage" :support="Object.assign({}, metadata.support)" :metadata="metadata.metadata" :hide-packagist="metadata.private"/>
                        </p>
                    </div>
                    <div class="package-popup__actions">
                        <slot v-bind="{ data: metadata }" name="package-actions">
                            <a class="widget-button widget-button--primary widget-button--link" target="_blank" :href="metadata.homepage" v-if="metadata && metadata.homepage">{{ $t('ui.package.homepage') }}</a>
                            <a class="widget-button widget-button--primary widget-button--link" target="_blank" :href="`https://packagist.org/packages/${data.name}`" v-else-if="!metadata.private">{{ $t('ui.package-details.packagist') }}</a>
                        </slot>
                    </div>
                </div>
                <div class="package-popup__tabs">
                    <ul class="package-popup__tabs-list">
                        <details-tab
                            show-empty
                            :links="false"
                            :active="tab === ''"
                            @click="setTab('')"
                        >{{ $t('ui.package-details.tabDescription') }}</details-tab>
                        <details-tab
                            highlight
                            :links="metadata.features"
                            :active="tab === 'features'"
                            @click="setTab('features')"
                            v-if="metadata.features"
                        >{{ $t('ui.package-details.tabFeatures') }}</details-tab>
                        <details-tab
                            highlight
                            :active="tab === 'suggest'"
                            :links="metadata.suggest"
                            @click="setTab('suggest')"
                        >{{ $t('ui.package-details.tabSuggest') }}</details-tab>
                        <details-tab
                            show-empty
                            :active="tab === 'require'"
                            :links="metadata.require"
                            @click="setTab('require')"
                        >{{ $t('ui.package-details.tabRequire') }}</details-tab>
                        <details-tab
                            show-empty
                            :active="tab === 'conflict'"
                            :links="metadata.conflict"
                            @click="setTab('conflict')"
                        >{{ $t('ui.package-details.tabConflict') }}</details-tab>
                        <details-tab
                            :active="tab === 'dependents'"
                            :links="dependents"
                            @click="setTab('dependents')"
                            v-if="dependents"
                        >{{ $t('ui.package-details.tabDependents') }}</details-tab>
                    </ul>
                </div>
                <details-content :active="tab === ''">
                    <div class="package-popup__abandoned" v-if="metadata.abandoned">
                        <template v-if="metadata.abandoned === true">{{ $t('ui.package.abandonedText') }}</template>
                        <i18n-t keypath="ui.package.abandonedReplace" v-else>
                            <template #replacement><router-link :to="{ query: { p: metadata.abandoned } }">{{ metadata.abandoned }}</router-link></template>
                        </i18n-t>
                    </div>
                    <package-funding class="package-popup__funding" :items="metadata.funding" v-if="metadata.funding"/>
                    <slot name="package-update"/>
                    <p v-if="metadata.contaoVersions"><strong>{{ $t('ui.package-details.contaoVersions') }}:</strong> {{ metadata.contaoVersions.join(', ') }}</p>
                    <p v-if="metadata.latest"><strong>{{ $t('ui.package-details.latest') }}:</strong> {{ metadata.latest.version}} ({{ $t('ui.package-details.released') }} {{ datimFormat(metadata.latest.time, 'short', 'long') }})</p>
                    <p v-if="metadata.license"><strong>{{ $t('ui.package-details.license') }}:</strong> {{ license }}</p>
                    <p class="package-popup__description">{{ metadata.description }}</p>
                </details-content>
                <details-content :active="tab === 'features'" :links="metadata.features" v-if="metadata.features">
                    <template #actions="{ name }"><slot v-bind="{ name }" name="features-actions"/></template>
                </details-content>
                <details-content :active="tab === 'suggest'" :links="metadata.suggest">
                    <template #actions="{ name }"><slot v-bind="{ name }" name="suggest-actions"/></template>
                </details-content>
                <details-content :active="tab === 'require'" :links="metadata.require">
                    <template #actions="{ name }"><slot v-bind="{ name }" name="require-actions"/></template>
                </details-content>
                <details-content :active="tab === 'conflict'" :links="metadata.conflict">
                    <template #actions="{ name }"><slot v-bind="{ name }" name="conflict-actions"/></template>
                </details-content>
                <details-content :active="tab === 'dependents'" :links="dependents" v-if="dependents">
                    <template #actions="{ name }"><slot v-bind="{ name }" name="dependents-actions"/></template>
                </details-content>
            </template>
        </template>
    </popup-overlay>
</template>

<script>
    import { mapMutations } from 'vuex';
    import locales from '../../i18n/locales';
    import metadata from '../../mixins/metadata';
    import datimFormat from '../../filters/datimFormat'
    import numberFormat from '../../filters/numberFormat'

    import PackageLogo from './PackageLogo';
    import LoadingSpinner from './LoadingSpinner';
    import MoreLinks from './MoreLinks';
    import DetailsTab from './DetailsTab';
    import DetailsContent from './DetailsContent';
    import PopupOverlay from "./PopupOverlay";
    import PackageFunding from './PackageFunding';

    export default {
        mixins: [metadata],

        components: { PopupOverlay, MoreLinks, LoadingSpinner, PackageLogo, PackageFunding, DetailsTab, DetailsContent },

        props: {
            local: {
                type: Object,
            },
            dependents: {
                type: Object,
            },
        },

        data: () => ({
            appTitle: '',
            links: [],
            hasPrevious: false,
        }),

        computed: {
            current: vm => vm.$route.query.p,
            tab: vm => String(vm.$route.hash).substring(1),

            exists: vm => vm.metadata,

            data: vm => vm.local || { name: vm.current },

            authors: vm => (vm.metadata.authors && vm.metadata.authors.length) ? vm.metadata.authors.filter(a => !!a.name) : null,
            license: vm => vm.metadata.license ? (vm.metadata.license instanceof Array ? vm.metadata.license.join(', ') : vm.metadata.license) : '–',
            contaoVersions: vm => vm.metadata.contaoVersions || null,
        },

        methods: {
            datimFormat,
            numberFormat,
            ...mapMutations('packages/details', ['clearCurrent']),

            setTab(name) {
                this.$router.replace({ query: this.$route.query, hash: `#${name}`, append: true });
            },

            updatePage() {
                let title = `${this.current} - ${this.appTitle}`;
                let description = '';

                if (this.metadata) {
                    if (this.metadata.title) {
                        title = `${this.metadata.title} (${this.current}) - ${this.appTitle}`;
                    }

                    description = this.metadata.description || '';
                }

                document.title = title;
                document.head.querySelector('meta[name="description"]').setAttribute('content', description);
            },

            addLink(query, rel, hrefLang = null) {
                const href = new URL(location.pathname, location);
                href.search = query;

                const link = document.createElement('link');
                link.setAttribute('rel', rel);
                link.setAttribute('href', href.toString());

                if (hrefLang) {
                    link.setAttribute('hrefLang', hrefLang);
                }

                document.head.appendChild(link);
                this.links.push(link);
            },
        },

        watch: {
            current() {
                this.updatePage();
                this.hasPrevious = /[?&]p=/.test(window.history.state?.back);
            },

            exists(exists) {
                if (!exists) {
                    this.clearCurrent();
                }
            },

            metadata() {
                this.updatePage();
            },
        },

        created() {
            this.appTitle = document.title;
        },

        mounted() {
            document.head.querySelector('meta[name="robots"]').setAttribute('content', 'index,follow');

            this.updatePage();
            this.addLink(`?p=${this.current}&_locale=${this.$i18n.locale}`, 'canonical');

            Object.keys(locales).forEach((locale) => {
                this.addLink(`?p=${this.current}&_locale=${locale}`, 'alternate', locale);
            });
        },

        beforeUnmount() {
            document.title = this.appTitle;

            document.head.querySelector('meta[name="description"]').setAttribute('content', '');
            // document.head.querySelector('meta[name="robots"]').setAttribute('content', 'noindex,follow');

            this.links.forEach((link) => {
                document.head.removeChild(link);
            });
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
@use "sass:color";
@use "../../assets/styles/defaults";

.package-popup {
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    max-width: none;
    height: 100%;
    background: var(--popup-bg);
    z-index: 10;
    opacity: 1;

    > * {
        flex-basis: auto;
        flex-grow: 1;
    }

    &__loader {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 50px 0;

        p {
            margin: 1em;
        }
    }

    &__headline {
        position: relative;
        flex-grow: 0;
        flex-shrink: 1;
        padding: 7px 30px 6px;
        background: var(--popup-hl-bg);
        color: #fff;
        font-size: 18px;
        font-weight: defaults.$font-weight-normal;
        line-height: 1.5;
        text-align: center;
    }

    &__button {
        display: block;
        float: right;
        position: absolute;
        top: 0;
        margin: 4px 0;
        padding: 4px;
        background: none;
        border: 1px solid transparent;
        border-radius: 5px;
        cursor: pointer;

        &--previous {
            left: 4px;
        }

        &--close {
            right: 4px;
        }

        svg {
            display: block;
            width: 22px;
            height: 22px;
        }

        &:hover {
            background-color: color.adjust(#f47c00, $lightness: -5%);
        }
    }

    &__summary {
        flex-grow: 0;
        padding: 25px 35px;

        @include defaults.screen(600) {
            display: flex;
        }
    }

    &__logo {
        border-radius: 6px;
        float: right;
        height: 60px;
        width: 60px;
        margin-left: 1em;
        background: #f7f7f7;

        @include defaults.screen(600) {
            display: block;
            float: left;
            width: 110px;
            height: 110px;
            margin: -10px 16px 0 -10px;
        }
    }

    &__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;

        &--fallback {
            display: none;
        }

        img {
            width: 50px;
            height: 50px;
            max-height: 100%;
            object-fit: contain;

            @include defaults.screen(600) {
                width: 90px;
                height: 90px;
            }
        }
    }

    &__text {
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        @include defaults.screen(600) {
            width: 200px;
        }
    }

    &__title {
        margin: 0;
        line-height: 1.4;
        overflow-wrap: break-word;
    }

    &__authors {
        flex-grow: 1;
        font-size: 13px;
        margin-bottom: .5em;
    }

    &__author {
        display: inline-block;
        margin-right: 2px;

        &:after {
            color: var(--text);
            content: ", ";
        }

        &:last-child:after {
            content: none;
        }
    }

    &__stats {
        display: inline-block;
        margin-right: 15px;
        margin-top: .5em;
        padding-left: 18px;
        font-size: 13px;
        background-position: 0 50%;
        background-repeat: no-repeat;
        background-size: 13px 13px;

        &--private {
            padding-left: 20px;
            background-image: var(--svg--private);
            background-size: 15px 15px;
        }

        &--updated {
            background-image: var(--svg--updated);
        }

        &--downloads {
            background-image: var(--svg--downloads);
        }

        &--favers {
            background-image: var(--svg--favers);
        }
    }

    &__actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 1em;

        @include defaults.screen(600) {
            justify-content: space-between;
            margin: 0 0 0 25px;
            width: 200px;
        }
    }

    &__installed {
        margin-top: 1em;
    }

    &__abandoned {
        margin: 0 0 20px;
        padding: 10px 20px 10px 50px;
        font-weight: defaults.$font-weight-medium;
        font-size: 12px;
        line-height: 1.8;
        background: rgba(var(--hint-rgb), .3) url('../../assets/images/hint.svg') 15px 50% no-repeat;
        background-size: 23px 23px;
        border: 1px solid var(--hint-link);
        border-radius: 6px;
    }

    &__funding {
        margin: 0 0 20px;
    }

    &__tabs {
        position: relative;
        flex-grow: revert;

        &::before,
        &::after {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            bottom: 1px;
            width: 7px;
            background: linear-gradient(-90deg, transparent 0, var(--popup-bg) 50%);
            z-index: 1;
            pointer-events: none;
        }

        &::after {
            background: linear-gradient(90deg, transparent 0, var(--popup-bg) 50%);
            right: 0;
        }
    }

    &__tabs-list {
        flex-shrink: 0;
        flex-grow: 0;
        display: flex;
        column-gap: 4px;
        height: 40px;
        min-width: 100%;
        overflow-x: auto;
        scrollbar-width: none;
        overflow-y: hidden;
        margin: 0;
        padding: 0 7px;
        list-style-type: none;

        &::after {
            content: "";
            position: absolute;
            inset: auto 0 0;
            height: 1px;
            background: var(--border--light);
            z-index: -1;
        }
    }

    &__tab {
        position: relative;
        top: 1px;
        flex-grow: 1;
        padding: 0;
        height: 39px;
        line-height: 39px;
        text-align: center;
        border: 1px solid var(--border--light);
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;

        &--active {
            background: var(--tab-content);
            border-bottom: 1px solid var(--tab-content);
        }

        button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0 10px;
            border: none;
            background: transparent;
            cursor: pointer;

            &:disabled {
                color: var(--border) !important;
                cursor: not-allowed;
            }
        }
    }

    &__pill {
        position: relative;
        top: -2px;
        display: inline-block;
        margin-left: 5px;
        padding: 2px 5px;
        font-size: 10px;
        font-weight: defaults.$font-weight-medium;
        background: var(--border--light);
        border-radius: 40%;

        &--highlight {
            color: var(--clr-btn);
            background: var(--btn-primary);
        }
    }

    &__tabcontent {
        position: relative;
        padding: 25px 35px;
        overflow-y: auto;
        background: var(--tab-content);
        outline: 0;

        @media (min-width: 960px) and (min-height: 700px) {
            height: 450px;
        }
    }

    &__description {
        margin: 1em 0;
        white-space: pre-wrap;
    }

    @include defaults.screen(960) {
        position: relative;
        display: block;
        top: 0;
        left: 50%;
        width: 750px;
        margin-left: -375px;
        height: auto;
        border-radius: 8px;
        transform: none;

        &__headline {
            border-radius: 8px 8px 0 0;
        }

        &__tabcontent {
            border-radius: 0 0 8px 8px;
        }
    }

    @media (min-width: 960px) and (min-height: 700px) {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>
