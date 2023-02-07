<template>
    <article class="discover-package">
        <div class="discover-package__abandoned" :title="abandonedText" v-if="data.abandoned">{{ $t('ui.package.abandoned') }}</div>
        <package-logo class="discover-package__icon" :class="{ 'discover-package__icon--fallback': !data.logo }" :src="data.logo"/>
        <div class="discover-package__details">
            <h1 class="discover-package__headline" :class="{ 'discover-package__headline--fallback': !data.logo }" :title="data.name !== data.title ? data.name : ''">
                <template v-for="(fragment, i) in title.split('%%')">
                    <em :key="i" v-if="i % 2">{{ fragment }}</em>
                    <template v-else>{{ fragment }}</template>
                </template>
            </h1>
            <p class="discover-package__description" :class="{ 'discover-package__description--fallback': !data.logo }">
                <template v-for="(fragment, i) in description.split('%%')">
                    <em :key="i" v-if="i % 2">{{ fragment }}</em>
                    <template v-else>{{ fragment }}</template>
                </template>
            </p>

            <div class="discover-package__more">
                <p class="discover-package__counts">
                    <span class="discover-package__count discover-package__count--private" :title="$t('ui.package.privateTitle')" v-if="data.private">{{ $t('ui.package.private') }}</span>
                    <span class="discover-package__count discover-package__count--updated" v-if="data.updated">{{ data.updated | datimFormat(false, 'short') }}</span>
                    <span class="discover-package__count discover-package__count--downloads" v-if="data.downloads">{{ data.downloads | numberFormat }}</span>
                    <span class="discover-package__count discover-package__count--favers" v-if="data.favers">{{ data.favers | numberFormat }}</span>
                </p>
                <div class="discover-package__actions">
                     <details-button small :name="data.name"/>
                    <slot/>
                </div>
            </div>
        </div>
    </article>
</template>

<script>
import PackageLogo from './Logo';
import DetailsButton from './DetailsButton';

export default {
        components: { PackageLogo, DetailsButton },

        props: {
            data: Object,
        },

        computed: {
            title: vm => vm.data._highlightResult ? vm.data._highlightResult.title.value : vm.data.title,
            description: vm => vm.data._highlightResult ? vm.data._highlightResult.description.value : vm.data.description,
            abandonedText: vm => vm.data.abandoned === true ? vm.$t('ui.package.abandonedText') : vm.$t('ui.package.abandonedReplace', { replacement: vm.data.abandoned }),
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/styles/defaults";

    .discover-package {
        position: relative;
        overflow: hidden;
        margin-bottom: 14px;
        padding: 20px;
        background: #fff;
        border-bottom: 3px solid #ddd3bc;
        border-radius: 2px;

        &__abandoned {
            display: inline-block;
            margin-bottom: 1em;
            padding: 2px 5px;
            color: #fff;
            font-size: 12px;
            font-weight: $font-weight-bold;
            background: $red-button;
            cursor: help;

            @include screen(600) {
                position: absolute;
                top: 20px;
                left: -25px;
                padding: 2px 30px;
                border-top: 1px solid darken($red-button, 10);
                border-bottom: 1px solid darken($red-button, 20);
                transform: rotateZ(-45deg);
            }
        }

        &__icon {
            position: absolute;
            right: 20px;
            height: 42px;
            width: 42px;
            margin-left: 1em;

            &--fallback {
                display: none;
            }

            img {
                position: absolute;
                width: 100%;
                height: auto;
                max-height: 100%;
            }

            @include screen(600) {
                position: relative;
                right: auto;
                display: block;
                float: left;
                width: 90px;
                height: 90px;
                margin-left: 0;
                margin-right: 20px;
            }

            @include screen(1024) {
                position: absolute;
                right: 20px;
                height: 50px;
                width: 50px;
                margin-left: 1em;
                margin-right: 0;

                &--fallback {
                    display: none;
                }
            }

            @include screen(1200) {
                position: relative;
                right: auto;
                display: block;
                float: left;
                width: 90px;
                height: 90px;
                margin-left: 0;
                margin-right: 20px;
            }
        }

        &__details {
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            @include screen(600) {
                height: 100%;
                min-height: 90px;
            }
        }

        &__headline {
            margin-bottom: .2em;
            line-height: 1;
            margin-right: 50px;
            overflow-wrap: break-word;

            &--fallback {
                margin-right: 0;
            }

            @include screen(600) {
                margin-right: 0;
            }

            @include screen(1024) {
                margin-right: 60px;

                &--fallback {
                    margin-right: 0;
                }
            }

            @include screen(1200) {
                margin-right: 0;
            }

            em {
                background-color: $highlight-color;
                font-style: normal;
            }
        }

        &__description {
            display: -webkit-box;
            overflow: hidden;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: .5em;
            margin-right: 50px;

            &--fallback {
                margin-right: 0;
            }

            @include screen(600) {
                margin-right: 0;
            }

            @include screen(1024) {
                margin-right: 60px;

                &--fallback {
                    margin-right: 0;
                }
            }

            @include screen(1200) {
                margin-right: 0;
            }

            em {
                background-color: $highlight-color;
                font-style: normal;
            }
        }

        &__more {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: flex-end;
            flex-grow: 1;
            margin-bottom: -.5em;
            line-height: 28px;
        }

        &__counts {
            flex-grow: 1;
            margin-bottom: .5em;

            @include screen(600) {
                margin-bottom: 0;
            }
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
                background-image: url("../../assets/images/private.svg");
            }

            &--updated {
                background-image: url("../../assets/images/updated.svg");
            }

            &--downloads {
                background-image: url("../../assets/images/downloads.svg");
            }

            &--favers {
                background-image: url("../../assets/images/favers.svg");
            }
        }

        &__actions {
            flex-grow: 1;
            display: flex;
            justify-content: flex-end;
            margin: 0 -4px .5em;

            > * {
                margin: 0 4px;
            }

            @include screen(600) {
                margin-bottom: 0;
            }
        }
    }
</style>
