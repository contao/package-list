<template>
    <div class="popup-overlay" @click="clearCurrent()">
        <div ref="popup" :class="popupClass" @click.stop v-if="current">
            <div class="package-popup__headline">
                <button class="package-popup__button package-popup__button--previous" :title="$t('ui.package-details.previous')" @click="popCurrent()" v-if="hasPrevious">
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

            <div class="package-popup__loader" v-if="!metadata.hasOwnProperty('name')">
                <loader horizontal/>
                <p>{{ $t('ui.package-details.loading') }}</p>
            </div>
            <template v-else>
                <div class="package-popup__summary">
                    <package-logo component-class="package-popup__icon" :src="metadata.logo"/>
                    <div class="package-popup__text">
                        <h1 class="package-popup__title">{{ metadata.title || data.name }}</h1>
                        <p class="package-popup__authors" v-if="authors">
                            von
                            <template v-for="(author, key) in authors">
                                <a class="package-popup__author" :key="key" :href="author.homepage" target="_blank" rel="noreferrer noopener" v-if="author.homepage">{{ author.name }}</a>
                                <span class="package-popup__author" :key="key" v-else>{{ author.name }}</span>
                            </template>
                        </p>
                        <p class="package-popup__statistics">
                            <span class="package-popup__stats package-popup__stats--abandoned" :title="abandonedText" v-if="metadata.abandoned">{{ $t('ui.package.abandoned') }}</span>
                            <span class="package-popup__stats package-popup__stats--updated" v-if="metadata.updated">{{ metadata.updated | datimFormat(false) }}</span>
                            <span class="package-popup__stats package-popup__stats--downloads" v-if="metadata.downloads > 0">{{ metadata.downloads | numberFormat }}</span>
                            <span class="package-popup__stats package-popup__stats--favers" v-if="metadata.favers > 0">{{ metadata.favers | numberFormat }}</span>
                            <more :name="metadata.name" :homepage="metadata.homepage" :support="Object.assign({}, metadata.support)" :metadata="metadata.metadata" :hide-packagist="metadata.private"/>
                        </p>
                    </div>
                    <div class="package-popup__actions">
                        <slot name="package-actions" v-bind="{ data: metadata }">
                            <a class="widget-button widget-button--primary widget-button--link" target="_blank" :href="metadata.homepage" v-if="metadata && metadata.homepage">{{ $t('ui.package-details.homepage') }}</a>
                        </slot>
                    </div>
                </div>

                <ul class="package-popup__tabs">
                    <details-tab :active="tab === ''" @click="tab = ''">{{ $t('ui.package-details.tabDescription') }}</details-tab>
                    <details-tab :active="tab === 'require'" :disabled="!metadata.require" :count="requireCount" @click="tab = 'require'">{{ $t('ui.package-details.tabRequire') }}</details-tab>
                    <details-tab :active="tab === 'suggest'" highlight :disabled="!metadata.suggest" :count="suggestCount" @click="tab = 'suggest'">{{ $t('ui.package-details.tabSuggest') }}</details-tab>
                    <details-tab :active="tab === 'conflict'" :disabled="!metadata.conflict" :count="conflictCount" @click="tab = 'conflict'">{{ $t('ui.package-details.tabConflict') }}</details-tab>
                </ul>
                <div class="package-popup__tabcontent" v-if="tab === ''">
                    <p v-if="metadata.latest"><strong>{{ $t('ui.package-details.latest') }}:</strong> {{ metadata.latest.version}} ({{ $t('ui.package-details.released') }} {{ metadata.latest.time | datimFormat('short', 'long') }})</p>
                    <p><strong>{{ $t('ui.package-details.license') }}:</strong> {{ license }}</p>
                    <p class="package-popup__description">{{ metadata.description }}</p>
                </div>
                <div class="package-popup__tabcontent" v-if="tab === 'require'">
                    <div class="package-popup__packagelist" v-if="metadata.require">
                        <template v-for="(constraint, name) in metadata.require">
                            <package-link :name="name" :key="name" :text="constraint">
                                <slot name="require-actions" v-bind="{ name }"/>
                            </package-link>
                        </template>
                    </div>
                </div>
                <div class="package-popup__tabcontent" v-if="tab === 'suggest'">
                    <div class="package-popup__packagelist" v-if="metadata.suggest">
                        <template v-for="(reason, name) in metadata.suggest">
                            <package-link :name="name" :key="name" :text="reason">
                                <slot name="suggest-actions" v-bind="{ name }"/>
                            </package-link>
                        </template>
                    </div>
                </div>
                <div class="package-popup__tabcontent" v-if="tab === 'conflict'">
                    <div class="package-popup__packagelist" v-if="metadata.conflict">
                        <template v-for="(constraint, name) in metadata.conflict">
                            <package-link :name="name" :key="name" :text="constraint">
                                <slot name="conflict-actions" v-bind="{ name }"/>
                            </package-link>
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import metadata from '../../mixins/metadata';

    import PackageLogo from './Logo';
    import PackageLink from './Link';
    import DetailsTab from './Tab';
    import Loader from './Loader';
    import More from './More';

    export default {
        mixins: [metadata],

        components: { More, Loader, PackageLogo, DetailsTab, PackageLink },

        data: () => ({
            tab: '',
        }),

        computed: {
            ...mapGetters('packages/details', ['hasPrevious']),

            current: vm => vm.$route.query.p,
            abandonedText: vm => vm.metadata.replacement ? vm.$t('ui.package.abandonedReplace', { replacement: vm.metadata.replacement }) : vm.$t('ui.package.abandonedText'),

            popupClass() {
                return {
                    'package-popup': true,
                };
            },

            requireCount: vm => vm.metadata.require ? Object.values(vm.metadata.require).length : 0,
            suggestCount: vm => vm.metadata.suggest ? Object.values(vm.metadata.suggest).length : 0,
            conflictCount: vm => vm.metadata.conflict ? Object.values(vm.metadata.conflict).length : 0,

            exists: vm => /*vm.installed[vm.current] || */vm.metadata,

            data() {
                return { name: this.current };
            },

            authors: vm => (vm.metadata.authors && vm.metadata.authors.length) ? vm.metadata.authors.filter(a => !!a.name) : null,
            license: vm => vm.metadata.license ? (vm.metadata.license instanceof Array ? vm.metadata.license.join(', ') : vm.metadata.license) : '–',
        },

        methods: {
            ...mapMutations('packages/details', ['clearCurrent', 'popCurrent']),
        },

        watch: {
            current() {
                this.tab = '';
            },

            exists(exists) {
                if (!exists) {
                    this.clearCurrent();
                }
            },
        },

        activated() {
            this.tab = '';
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/styles/defaults";

    .package-popup {
        position: fixed;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
        background: #ffffff;
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
            background: $contao-color;
            color: #fff;
            font-size: 18px;
            font-weight: $font-weight-normal;
            line-height: 1.5;
            text-align: center;
            border-radius: 2px 2px 0 0;

            &--complete {
                background-color: $green-button;
            }

            &--error {
                background-color: $red-button;
            }
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
            border-radius: 1px;
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
                background-color: darken($contao-color, 5);
                border-color: darken($contao-color, 10);

                .package-popup__headline--complete & {
                    background-color: darken($green-button, 5);
                    border-color: darken($green-button, 10);
                }

                .package-popup__headline--error & {
                    background-color: $red-button;
                    border-color: darken($red-button, 10);
                }
            }
        }

        &__summary {
            flex-grow: 0;
            padding: 25px 35px;

            @include screen(600) {
                display: flex;
            }
        }

        &__icon {
            float: right;
            height: 42px;
            width: 42px;
            margin-left: 1em;

            &--fallback {
                display: none;
            }

            img {
                width: 100%;
                height: auto;
            }

            @include screen(600) {
                display: block;
                float: left;
                width: 90px;
                height: auto;
                margin-left: 0;
                margin-right: 20px;
                margin-bottom: -4px;
            }
        }

        &__text {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }

        &__title {
            margin: 0;
            line-height: 1.4;
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
            font-size: 13px;
            background-position: 0 50%;
            background-repeat: no-repeat;
            background-size: 15px 15px;

            &--abandoned {
                padding: 2px 5px;
                color: #fff;
                font-weight: $font-weight-bold;
                background: $red-button;
            }

            &--updated {
                padding-left: 18px;
                background-image: url("../../assets/images/updated.svg");
            }

            &--downloads {
                padding-left: 20px;
                background-image: url("../../assets/images/downloads.svg");
            }

            &--favers {
                padding-left: 18px;
                background-image: url("../../assets/images/favers.svg");
            }
        }

        &__actions {
            margin-top: 1em;

            @include screen(600) {
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                margin: 0 0 0 25px;
                min-width: 200px;
            }
        }

        &__tabs {
            flex-grow: 0;
            clear: both;
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            margin: 0;
            padding: 0;
            list-style-type: none;
        }

        &__tab {
            flex-grow: 1;
            margin: 0;
            padding: 0;
            height: 39px;
            line-height: 39px;
            text-align: center;
            border-top: 1px solid #e9eef1;
            border-right: 1px solid #e9eef1;
            border-bottom: 1px solid #e9eef1;

            &:last-child {
                border-right: none;
            }

            &--active {
                font-weight: $font-weight-bold;
                background: #f8f9fb;
                border-bottom-color: transparent;
            }

            button {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0 10px;
                border: none;
                background: transparent;
                cursor: pointer;
                outline: none;

                &:disabled {
                    color: $border-color !important;
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
            font-weight: $font-weight-medium;
            background: #e9eef1;
            border-radius: 40%;

            &--highlight {
                color: #fff;
                background: $green-button;
            }
        }

        &__tabcontent {
            position: relative;
            padding: 25px 35px;
            overflow-y: auto;
            background: #f8f9fb;

            @media (min-width: 960px) and (min-height: 700px) {
                height: 450px;
            }
        }

        &__description {
            margin: 1em 0;
            white-space: pre-wrap;
        }

        @include screen(960) {
            position: relative;
            display: block;
            top: 0;
            left: 50%;
            width: 750px;
            margin-left: -375px;
            height: auto;
            border-bottom: 2px solid #ddd3bc;
            border-radius: 2px;
        }

        @media (min-width: 960px) and (min-height: 700px) {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
    }
</style>
