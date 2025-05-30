<template>
    <article class="package-link" :class="{ 'package-link--limit': !text }">
        <div class="package-link__details">
            <p class="package-link__name" :title="name">{{ metadata && metadata.title || name }}</p>
            <p class="package-link__text">{{ text || metadata && metadata.description }}</p>
        </div>

        <div class="package-link__actions">
            <slot/>
            <details-button small :name="name"/>
        </div>
    </article>
</template>

<script>
    import DetailsButton from './DetailsButton';
    import metadata from '../../mixins/metadata';

    export default {
        mixins: [metadata],
        components: { DetailsButton },

        props: {
            name: String,
            text: String,
        },

        computed: {
            data: vm => ({ name: vm.name, }),
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
@use "../../assets/styles/defaults";

.package-link {
    display: flex;
    column-gap: 8px;
    justify-content: space-between;
    width: 100%;
    padding-bottom: 4px;
    margin-bottom: 4px;
    border-bottom: 1px solid var(--border--light);

    &:last-child {
        padding-bottom: 0;
        margin-bottom: 0;
        border-bottom: none;
    }

    &__details {
        padding: 5px 0;
        line-height: 18px;
    }

    &__name {
        display: inline;
        font-weight: defaults.$font-weight-bold;

        &:after {
            content: ": ";
        }
    }

    &__text {
        display: inline;
    }

    &__actions {
        display: flex;
        margin-left: 20px;
        margin: 0 -4px;

        > * {
            margin: 0 4px;
        }
    }

    &--limit {
        .package-link {
            &__details {
                display: flex;
            }

            &__name {
                white-space: nowrap;
            }

            &__text {
                display: -webkit-box;
                overflow: hidden;
                line-clamp: 1;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                padding: 0 10px 0 5px;
            }
        }
    }
}
</style>
