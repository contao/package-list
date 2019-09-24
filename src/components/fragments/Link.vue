<template>
    <article class="package-link">
        <div class="package-link__details">
            <p class="package-link__name">{{ name }}</p>
            <p class="package-link__text">{{ text }}</p>
        </div>

        <div class="package-link__actions">
            <details-button small :name="name"/>
            <!--<install-button small :data="data" v-if="installable"/>-->
        </div>
    </article>
</template>

<script>
    // import InstallButton from './InstallButton';
    import DetailsButton from './DetailsButton';

    export default {
        components: { /*InstallButton,*/ DetailsButton },

        props: {
            name: String,
            text: String,
            installable: Boolean,
        },

        computed: {
            data: vm => ({ name: vm.name, }),
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/styles/defaults";

    .package-link {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding-bottom: 4px;
        margin-bottom: 4px;
        border-bottom: 1px solid #e9eef1;

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
            font-weight: $font-weight-bold;

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
    }
</style>
