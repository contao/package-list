<template>
    <div class="package-funding" v-if="items && items.length">
        <div>
            <span>{{ $t('ui.package-details.funding') }}</span>
            <template v-for="(item, i) in items">
                <a :href="githubUrl(item)" target="_blank" rel="noreferrer noopener" :key="i" v-if="item.type === 'github'">GitHub</a>
                <a :href="item.url" target="_blank" rel="noreferrer noopener" :key="i" v-else-if="item.type === 'tidelift'">Tidelift</a>
                <a :href="item.url" target="_blank" rel="noreferrer noopener" :key="i" v-else-if="item.type === 'patreon'">Patreon</a>
                <a :href="item.url" target="_blank" rel="noreferrer noopener" :key="i" v-else-if="item.type === 'opencollective'">OpenCollective</a>
                <a :href="item.url" target="_blank" rel="noreferrer noopener" :key="i" v-else>{{ item.url.replace(/^https?:\/\/(www.)?([^/]+).*$/, '$2') }}</a>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PackageFunding',

        props: {
            items: {
                type: Array,
                required: true,
            },
        },

        computed: {
            githubUrl: () => item => item.url.replace(/^https:\/\/github.com\/([^/]+)$/, 'https://github.com/sponsors/$1'),
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/defaults";

    .package-funding {
        padding: 10px 20px 10px 50px;
        font-weight: $font-weight-medium;
        font-size: 12px;
        line-height: 1.8;
        background: rgba(var(--funding-rgb), .025) url('../../assets/images/funding.svg') 15px 50% no-repeat;
        background-size: 23px 23px;
        border: 1px solid rgba(var(--funding-rgb), .5);
        border-radius: 6px;

        > div {
            overflow: hidden;
        }

        span {
            margin-right: 15px;
        }

        a {
            position: relative;
            display: inline-block;
            margin: 0 20px 0 0;
            padding-left: 16px;
            color: var(--funding);
            background: url("../../assets/images/link-funding.svg") 0 50% no-repeat;
            background-size: 13px 13px;

            &:before {
                content: "|";
                position: absolute;
                left: -12px;
            }

            &:nth-child(2):before {
                content: none;
            }
        }
    }
</style>
