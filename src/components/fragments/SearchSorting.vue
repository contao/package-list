<template>
    <section class="package-sorting" @click="open = !open">
        <label class="package-sorting__label">{{ $t('ui.discover.sortBy') }}</label>
        <ul class="package-sorting__group" :class="{ 'package-sorting__group--open': open }">
            <!-- eslint-disable-next-line -->
            <template v-for="(value, label) in sortOptions" :key="value">
                <li
                    class="package-sorting__item"
                    :class="{ 'package-sorting__item--active': sorting === value, 'package-sorting__item--open': open }"
                >
                    <button
                        :title="$t(`ui.discover.sort${label}Title`)"
                        @click="sortBy(value)"
                    >{{ $t(`ui.discover.sort${label}`) }}</button>
                </li>
            </template>
        </ul>
    </section>
</template>

<script>
    import search from '../../mixins/search';

    export default {
        mixins: [search],

        data: () => ({
            open: false,
            sortOptions: {
                'Released': 'released',
                'Latest': 'latest',
                'Favers': 'favers',
                'Downloads': 'downloads',
            },
        }),
    };
</script>

<style rel="stylesheet/scss" lang="scss">
@use "../../assets/styles/defaults";

.package-sorting {
    margin: 20px 0 15px;
    text-align: right;

    &__label {
        display: inline-block;
        text-transform: uppercase;

        &:after {
            content: ":";
        }
    }

    &__group {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        margin: 0;
        padding: 0 15px 0 0;
        list-style-type: none;
        text-align: left;

        &:after {
            content: "";
            position: absolute;
            top: .8em;
            right: 0;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #777;
        }
    }

    &__item {
        display: none;
        margin: 0 0 0 10px;
        padding: 3px 0;
        border-bottom: 2px solid transparent;

        &:hover {
            color: var(--link);
        }

        &--open {
            display: inline;
        }

        &--active {
            display: inline;
            color: var(--link);
            border-bottom: 2px solid var(--link);
        }

        button {
            margin: 0;
            padding: 0;
            background: none;
            border: none;
            text-transform: uppercase;
            cursor: pointer;
        }
    }

    @include defaults.screen(600) {
        &__group {
            flex-direction: row;
            justify-content: flex-end;
            padding: 0;

            &:after {
                content: none;
            }
        }

        &__item {
            display: inline;
        }
    }
}
</style>
