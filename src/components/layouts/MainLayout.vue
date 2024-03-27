<template>
    <div class="layout-main">
        <header class="layout-main__header" :class="{ 'layout-main__header--margin': !$slots.subheader }">
            <div class="layout-main__header-inside">
                <router-link to="/" class="layout-main__logo">
                    <img src="../../assets/images/logo.svg" alt="">
                    <p>{{ $t('ui.app.title') }}</p>
                </router-link>
                <div class="layout-main__search">
                    <slot name="search"/>
                </div>
            </div>
        </header>

        <main class="layout-main__content">
            <slot/>
        </main>

        <footer-fragment display="main"></footer-fragment>
    </div>
</template>

<script>
    import FooterFragment from '../fragments/FooterFragment';

    export default {
        components: { FooterFragment },
    };
</script>


<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/styles/defaults";

    .layout-main {
        overflow: hidden;

        &__search {
            display: flex;
            flex-grow: 1;
            justify-content: center;
            margin: 30px 0 45px;
            padding: 20px 0;
            background: var(--header-bg);
            border-bottom: 1px solid var(--header-bdr);

            .search-bar {
                flex-grow: 1;
            }
        }

        &__logo {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 30px 20px;
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
                color: var(--text);
            }
        }

        &__header-inside,
        &__content,
        footer {
            @include screen(1024) {
                max-width: 960px;
                margin: 0 auto;
            }

            @include screen(1200) {
                max-width: 1180px;
            }
        }

        &__content,
        footer {
            margin: 0 20px;
        }

        @include screen(600) {
            &__logo {
                p {
                    font-size: 30px;
                }
            }
        }

        @include screen(1024) {
            &__header {
                position: relative;
                margin: 0 0 45px;
                padding: 13px 0;
                background: var(--header-bg);
                border-bottom: 1px solid var(--header-bdr);

                &-inside {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
            }

            &__logo {
                margin: 0;
            }

            &__search {
                justify-content: flex-end;
                margin: 0;
                padding: 0;
                background: none;
                border: none;
            }

            &__header-inside,
            &__content,
            footer {
                max-width: 960px;
                margin: 0 auto;
            }
        }

        @include screen(1200) {
            &__header-inside,
            &__content,
            footer {
                max-width: 1180px;
            }
        }
    }
</style>
