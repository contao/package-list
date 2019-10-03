<template>
    <section class="package-sorting">
        <label class="package-sorting__label">{{ $t('ui.discover.sortBy') }}</label>
        <ul class="package-sorting__group">
            <template v-for="(value, label) in sortOptions">
                <li
                    class="package-sorting__item"
                    :class="{ 'package-sorting__item--active': sorting === value }"
                    :title="$t(`ui.discover.sort${label}Title`)"
                    :key="value"
                    @click="sortBy(value)"
                    v-if="value !== '' || query"
                >
                    {{ $t(`ui.discover.sort${label}`) }}
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
            sortOptions: {
                'Relevance': '',
                'Latest': 'latest',
                'Downloads': 'downloads',
                'Favers': 'favers',
            },
        }),
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/styles/defaults";

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
            display: inline-flex;
            margin: 0;
            padding: 0;
            list-style-type: none;
        }

        &__item {
            margin: 0 0 0 10px;
            padding: 3px 0;
            text-transform: uppercase;
            cursor: pointer;
            border-bottom: 2px solid transparent;

            &:hover {
                color: $link-color;
            }

            &--active {
                color: $link-color;
                border-bottom: 2px solid $link-color;
            }
        }
    }
</style>
