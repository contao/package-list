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
                            <span class="package-popup__stats package-popup__stats--updated" v-if="metadata.updated">{{ metadata.updated | datimFormat }}</span>
                            <span class="package-popup__stats package-popup__stats--downloads" v-if="metadata.downloads > 0">{{ metadata.downloads | numberFormat }}</span>
                            <span class="package-popup__stats package-popup__stats--favers" v-if="metadata.favers > 0">{{ metadata.favers | numberFormat }}</span>
                        </p>
                    </div>
                    <div class="package-popup__actions">
                        <slot name="package-actions" :data="metadata"/>
                    </div>
                </div>

                <ul class="package-popup__tabs">
                    <details-tab :active="tab === ''" @click="tab = ''">Beschreibung</details-tab>
                    <details-tab :active="tab === 'require'" :disabled="!metadata.require" :count="requireCount" @click="tab = 'require'">Abhängigkeiten</details-tab>
                    <details-tab :active="tab === 'suggest'" highlight :disabled="!metadata.suggest" :count="suggestCount" @click="tab = 'suggest'">Empfehlungen</details-tab>
                    <details-tab :active="tab === 'conflict'" :disabled="!metadata.conflict" :count="conflictCount" @click="tab = 'conflict'">Konflikte</details-tab>
                </ul>
                <div class="package-popup__tabcontent" v-if="tab === ''">
                    <p>{{ metadata.description }}</p>
                    <p class="package-popup__separator">Latest Package Details</p>
                    <dl class="package-popup__info">
                        <dt class="package-popup__info-title">Version</dt>
                        <dd class="package-popup__info-text">{{ metadata.latest ? metadata.latest.version : '–' }}</dd>
                        <dt class="package-popup__info-title">Released</dt>
                        <dd class="package-popup__info-text">{{ metadata.latest ? new Date(metadata.latest.time).toLocaleString() : '–' }}</dd>
                        <dt class="package-popup__info-title">License</dt>
                        <dd class="package-popup__info-text">{{ license }}</dd>

                        <dt class="package-popup__info-title">Downloads</dt>
                        <dd class="package-popup__info-text">{{ (metadata.downloads || 0) | numberFormat }}</dd>
                        <dt class="package-popup__info-title">Favers</dt>
                        <dd class="package-popup__info-text">{{ metadata.favers || 0 | numberFormat }}</dd>
                        <dt class="package-popup__info-title">Type</dt>
                        <dd class="package-popup__info-text">{{ metadata.type || '–' }}</dd>
                    </dl>
                </div>
                <div class="package-popup__tabcontent" v-if="tab === 'require'">
                    <div class="package-popup__packagelist" v-if="metadata.require">
                        <template v-for="(constraint, name) in metadata.require">
                            <package-link :name="name" :key="name" :text="constraint"/>
                        </template>
                    </div>
                </div>
                <div class="package-popup__tabcontent" v-if="tab === 'suggest'">
                    <div class="package-popup__packagelist" v-if="metadata.suggest">
                        <template v-for="(reason, name) in metadata.suggest">
                            <package-link :name="name" :key="name" :text="reason" :installable="suggestInstallable && suggestInstallable(name)"/>
                        </template>
                    </div>
                </div>
                <div class="package-popup__tabcontent" v-if="tab === 'conflict'">
                    <div class="package-popup__packagelist" v-if="metadata.conflict">
                        <template v-for="(constraint, name) in metadata.conflict">
                            <package-link :name="name" :key="name" :text="constraint"/>
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

    export default {
        mixins: [metadata],

        components: { Loader, PackageLogo, DetailsTab, PackageLink },

        props: {
            suggestInstallable: Function,
        },

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
                    'package-popup--fixed': !this.$refs.popup || this.$refs.popup.clientHeight < window.innerHeight,
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
            overflow: hidden;
            flex-grow: 0;
            padding: 25px 35px;
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
                height: 90px;
                margin-left: 0;
                margin-right: 20px;
            }
        }

        &__text {
            flex-grow: 1;
        }

        &__title {
            margin: 0;
            line-height: 1.4;
        }

        &__authors {
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
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            margin-left: 25px;
            text-align: center;
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
            padding: 25px 35px;
            background: #f8f9fb;

            @include screen(960) {
                min-height: 450px;
            }
        }

        &__separator {
            margin: 2em -35px 1em;
            padding: 10px 35px;
            font-weight: $font-weight-bold;
            background: #fff;
            border-top: 2px solid #e9eef1;
            border-bottom: 1px solid #e9eef1;
        }

        &__info {
            display: flex;
            flex-wrap: wrap;
            margin: 0 0 1em;
            padding: 0;

            &-title {
                flex-grow: 1;
                width: 13.33333333%;
                margin: 0;
                padding: 0;
                font-weight: $font-weight-bold;

                &:after {
                    content: ":";
                }
            }

            &-text {
                flex-grow: 2;
                width: 20%;
                margin: 0;
                padding: 0;
            }
        }

        @include screen(960) {
            display: block;
            top: 50%;
            left: 50%;
            width: 750px;
            margin-left: -375px;
            height: auto;
            transform: translateY(-50%);
            border-bottom: 2px solid #ddd3bc;
            border-radius: 2px;
        }
    }
</style>
