<template>
    <div class="layout-main">
        <header class="layout-main__header" :class="{ 'layout-main__header--margin': !$slots.subheader }">
            <div class="layout-main__content">
                <router-link to="/" class="layout-main__logo">
                    <img src="../../assets/images/logo.svg" alt="">
                    <p>{{ $t('ui.app.title') }}</p>
                </router-link>
            </div>
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
        overflow: hidden;

        &__logo {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 30px 0;
            text-align: left;
            text-decoration: none !important;

            img {
                width: 60px;
                height: 60px;
            }

            p {
                overflow: hidden;
                margin-left: 20px;
                font-size: 24px;
                font-weight: $font-weight-light;
                color: $text-color;
            }
        }

        &__content,
        footer {
            margin: 0 20px;

            @include screen(1024) {
                max-width: 960px;
                margin: 0 auto;
            }

            @include screen(1200) {
                max-width: 1180px;
            }
        }

        @include screen(600) {
            &__logo {
                p {
                    font-size: 30px;
                }
            }
        }

        @include screen(1024) {
            &__logo {
                float: left;
                height: 86px;
                margin: 0;
            }

            .search-bar {
                margin-top: 0;

                &__inside {
                    margin: 0 0 0 auto;
                }
            }
        }
    }
</style>
