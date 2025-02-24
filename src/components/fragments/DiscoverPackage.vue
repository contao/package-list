<template>
    <article class="discover-package" :class="(hint || !slotEmpty($slots.hint)) ? 'is--hint' : ''">

        <div class="discover-package__hint" v-if="hint || !slotEmpty($slots.hint)"><slot name="hint">{{ hint }}</slot></div>
        <div class="discover-package__inside">
            <div class="discover-package__abandoned" :title="abandonedText" v-if="data.abandoned">{{ $t('ui.package.abandoned') }}</div>
            <package-logo class="discover-package__icon" :class="{ 'discover-package__icon--fallback': !data.logo }" :src="data.logo"/>
            <div class="discover-package__details">
                <div class="discover-package__headline-container">
                    <ul class="discover-package__versions" :title="`${$t('ui.package.contaoVersion')} ${data.contaoVersions.join(', ')}`" :class="{ 'discover-package__versions--fallback': !data.logo }" v-if="data.contaoVersions">
                        <li class="discover-package__version" v-for="(version, i) in data.contaoVersions" :key="i">{{ version }}</li>
                    </ul>
                    <h1 class="discover-package__headline" :class="{ 'discover-package__headline--fallback': !data.logo }" :title="data.name !== data.title ? data.name : ''">
                        <template v-for="(fragment, i) in title.split('%%')">
                            <em :key="i" v-if="i % 2">{{ fragment }}</em>
                            <template v-else>{{ fragment }}</template>
                        </template>
                    </h1>
                </div>
                <p class="discover-package__description" :class="{ 'discover-package__description--fallback': !data.logo }">
                    <template v-for="(fragment, i) in description.split('%%')">
                        <em :key="i" v-if="i % 2">{{ fragment }}</em>
                        <template v-else>{{ fragment }}</template>
                    </template>
                </p>

                <div class="discover-package__more">
                    <p class="discover-package__counts">
                        <span class="discover-package__count discover-package__count--private" :title="$t('ui.package.privateTitle')" v-if="data.private">{{ $t('ui.package.private') }}</span>
                        <span class="discover-package__count discover-package__count--updated" v-if="data.updated">{{ datimFormat(data.updated, false, 'short') }}</span>
                        <span class="discover-package__count discover-package__count--downloads" v-if="data.downloads">{{ numberFormat(data.downloads) }}</span>
                        <span class="discover-package__count discover-package__count--favers" v-if="data.favers">{{ numberFormat(data.favers) }}</span>
                    </p>
                    <div class="discover-package__actions">
                        <details-button small :name="data.name"/>
                        <slot name="actions"/>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>

<script>
import datimFormat from '../../filters/datimFormat'
import numberFormat from '../../filters/numberFormat'
import slotEmpty from '../../filters/slotEmpty'
import PackageLogo from './PackageLogo';
import DetailsButton from './DetailsButton';

export default {
    components: { PackageLogo, DetailsButton },

    props: {
        data: Object,
        hint: String,
    },

    computed: {
        title: vm => vm.data._highlightResult?.title?.value || vm.data.title || vm.data.name,
        description: vm => vm.data._highlightResult?.description?.value || vm.data.description || '',
        abandonedText: vm => vm.data.abandoned === true ? vm.$t('ui.package.abandonedText') : vm.$t('ui.package.abandonedReplace', { replacement: vm.data.abandoned }),
    },

    methods: {
        datimFormat,
        numberFormat,
        slotEmpty,
    }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@use "../../assets/styles/defaults";

$discover-package-padding: 16px;

.discover-package {
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    background: var(--tiles-bg);
    border: 1px solid var(--tiles-bdr);
    border-radius: 14px;

    &.is--hint {
        border-color: var(--border--light);

        .discover-package__inside > * {
            opacity: 0.65;
        }
    }

    &__hint {
        position: relative;
        background: var(--border--light);
        padding: 8px $discover-package-padding;
        font-weight: defaults.$font-weight-medium;
        font-size: 12px;
        line-height: 1.2;
        //border-radius: 14px 14px 0 0;
        z-index: 1;

        p a {
            display: inline-block;
            padding-right: 10px;

            &:first-child {
                margin-left: 10px;
            }

            &:not(:first-child):before {
                padding-right: 10px;
                content: "|";
            }
        }
    }

    &__inside {
        flex-grow: 1;
        padding: $discover-package-padding;
    }

    &__abandoned {
        display: inline-block;
        margin-bottom: 1em;
        padding: 2px 5px;
        color: #fff;
        font-size: 12px;
        font-weight: defaults.$font-weight-bold;
        background: var(--btn-alert);
        cursor: help;
        z-index: 10;

        @include defaults.screen(600) {
            position: absolute;
            top: 20px;
            left: -25px;
            padding: 2px 30px;
            border-top: 1px solid var(--btn-alert-active);
            transform: rotateZ(-45deg);
        }
    }

    &__icon {
        border-radius: 6px;
        height: 60px;
        width: 60px;
        background: #f7f7f7;
        margin: 0 auto 10px;
        position: absolute;
        right: $discover-package-padding;

        > figure {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            max-height: 140px;
        }

        img,
        svg {
            border-radius: 4px;
            width: 50px;
            height: 50px;
            max-height: 100%;
            object-fit: contain;
        }
    }

    &__details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        min-height: 96px;
    }

    &__headline {
        margin-bottom: .2em;
        line-height: 1;
        overflow-wrap: break-word;
        margin-right: 70px;

        em {
            background-color: var(--highlight-bg);
            color: var(--highlight-color);
            font-style: normal;
        }
    }

    &__versions {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        list-style: none;
        margin: 5px 0;
        padding: 0;
    }

    &__version {
        display: inline-flex;
        justify-content: center;
        padding: 3px 5px;
        border-radius: 4px;
        line-height: 1;
        min-width: 40px;
        font-size: 13px;
        color: #fff;
        background: var(--badge-bg);
        pointer-events: none;
    }

    &__description {
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-bottom: 1em;
        margin-right: 70px;

        em {
            background-color: var(--highlight-bg);
            color: var(--highlight-color);
            font-style: normal;
        }
    }

    &__more {
        display: flex;
        flex-flow: row wrap;
        align-items: flex-end;
        flex-grow: 1;
        gap: 4px;

        line-height: 28px;
    }

    &__counts {
        flex-grow: 1;
        justify-content: flex-start;
    }

    &__count {
        display: inline-block;
        margin-right: 15px;
        padding-left: 18px;
        font-size: 13px;
        background-position: 0 50%;
        background-repeat: no-repeat;
        background-size: 13px 13px;

        &--private {
            background-image: var(--svg--private);
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
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
    }

    @media (max-width: 599.98px) {
        &__headline-container {
            display: flex;
            flex-direction: column-reverse;
        }
    }

    @include defaults.screen(600) {
        &__inside {
            text-align: initial;
            display: flex;
            padding: 0;
        }

        &__icon {
            width: 130px;
            height: 100%;
            min-height: 130px;
            margin: 0;
            border-radius: 0;

            position: revert;
            right: revert;

            img {
                width: 100px;
                height: 100px;
            }

            svg {
                width: 90px;
                height: 90px;
            }
        }

        &__details {
            padding: $discover-package-padding;
            height: 100%;
            min-height: 90px;
            max-width: calc(100% - 130px);
            flex: 1;
        }

        &__versions {
            float: right;
            margin: -3px 0 0 16px;
        }

        &__headline,
        &__description {
            margin-right: 0;
        }

        &__more {
            flex-direction: row;
        }

        &__actions {
            justify-content: end;
        }
    }
}
</style>
