<template>
    <div class="layout-main">
        <header class="layout-main__header" :class="{ 'layout-main__header--margin': !$slots.subheader }">
            <router-link to="/" class="layout-main__logo">
                <img src="../../assets/images/contao-logo-corporate.svg"/>
            </router-link>
        </header>

        <slot name="subheader"/>

        <main class="layout-main__content">
            <slot/>
        </main>

        <footer-fragment display="main"></footer-fragment>
    </div>
</template>

<script>
    import FooterFragment from '../fragments/Footer';

    export default {
        components: { FooterFragment },
    };
</script>


<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/styles/defaults";

    .layout-main {
        &__logo {
            display: block;
            margin: 30px;
            text-align: center;
        }

        &__content,
        footer {
            position: relative;
            margin: 0 20px;

            @include screen(1024) {
                max-width: 960px;
                margin: 0 auto;
            }

            @include screen(1200) {
                max-width: 1180px;
            }
        }
    }
</style>
