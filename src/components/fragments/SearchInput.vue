<template>
    <section class="search-bar">
        <div class="layout-main__content">
            <div class="search-bar__inside">
                <input class="search-bar__input" ref="search" id="search" type="text" :placeholder="$t('ui.discover.searchPlaceholder')" autocomplete="off" :value="query" @input="searchInput" @keypress.esc.prevent="stopSearch">
                <button class="search-bar__button search-bar__button--stop" @click="stopSearch" v-if="isSearching">
                    <svg height="24" viewBox="0 0 24 24" width="24" fill="#737373" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </button>
                <button class="search-bar__button search-bar__button--start" @click="$refs.search.focus()" v-else>
                    <svg fill="#737373" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </button>
            </div>
        </div>
    </section>
</template>

<script>
    import search from '../../mixins/search';

    export default {
        mixins: [search],

        methods: {
            searchInput(e) {
                this.startSearch(e.target.value);
            },
        },

        mounted() {
            this.$nextTick(() => {
                this.$refs.search.focus();
            });
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/styles/defaults";

    .search-bar {
        margin: 30px 0 45px;
        padding: 20px 0;
        background: #e5dfcf;
        border-bottom: 1px solid #dcd8cc;

        &__inside {
            position: relative;
            max-width: 400px;
            margin: 0 auto;
        }

        &__input {
            height: 46px !important;
            padding-right: 40px !important;
        }

        &__button {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            align-items: center;
            width: 38px;
            height: 46px;
            margin: 0;
            padding: 7px;
            line-height: 36px;
            border: none;
            background: none;
            outline: none;
        }
    }
</style>
