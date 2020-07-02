<template>
    <div v-if="items && items.length">
        {{ $t('ui.package-details.funding') }}
        <template v-for="(item, i) in items">
            <a :href="githubUrl(item)" target="_blank" rel="noreferrer noopener" :key="i" v-if="item.type === 'github'">GitHub</a>
            <a :href="item.url" target="_blank" rel="noreferrer noopener" :key="i" v-else-if="item.type === 'tidelift'">Tidelift</a>
            <a :href="item.url" target="_blank" rel="noreferrer noopener" :key="i" v-else-if="item.type === 'patreon'">Patreon</a>
            <a :href="item.url" target="_blank" rel="noreferrer noopener" :key="i" v-else-if="item.type === 'opencollective'">OpenCollective</a>
            <a :href="item.url" target="_blank" rel="noreferrer noopener" :key="i" v-else>{{ item.url.replace(/^https?:\/\/(www.)?([^/]+).*$/, '$2') }}</a>
        </template>
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

<style lang="scss">

</style>
