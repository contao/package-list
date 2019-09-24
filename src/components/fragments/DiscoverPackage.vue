<template>
    <article class="discover-package">
        <package-logo :class="{ 'discover-package__icon': true, 'discover-package__icon--fallback': !data.logo }" :src="data.logo"/>
        <div class="discover-package__details">
            <h1 class="discover-package__headline">
                <span class="discover-package__title" v-html="title">{{ data.title }}</span>
                <span class="discover-package__name" v-if="data.name !== data.title" style="display: none">{{ data.name }}</span>
            </h1>

            <p class="discover-package__description" v-html="description">{{ data.description }}</p>

            <div class="discover-package__more">
                <p class="discover-package__counts">
                    <span class="discover-package__count discover-package__count--updated" v-if="data.updated">{{ data.updated | datimFormat }}</span>
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
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/styles/defaults";

    .discover-package {
        overflow: hidden;
        margin-bottom: 14px;
        padding: 20px;
        background: #fff;
        border-bottom: 3px solid #ddd3bc;
        border-radius: 2px;

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

            @include screen(1024) {
                float: right;
                height: 50px;
                width: 50px;
                margin-left: 1em;
                margin-right: 0;

                &--fallback {
                    display: none;
                }
            }

            @include screen(1200) {
                display: block;
                float: left;
                width: 90px;
                height: 90px;
                margin-left: 0;
                margin-right: 20px;
            }
        }

        &__headline {
            margin-bottom: .2em;
            line-height: 1;

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

            em {
                background-color: $highlight-color;
                font-style: normal;
            }

            @include screen(600) {
                min-height: 38px;
            }
        }

        &__more {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
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
            font-size: 13px;
            background-position: 0 50%;
            background-repeat: no-repeat;
            background-size: 15px 15px;

            &--updated {
                padding-left: 20px;
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
