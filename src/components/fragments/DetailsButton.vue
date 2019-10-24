<template>
    <a
        :href="$router.resolve({ query: { p: name } }).href"
        class="widget-button widget-button--details widget-button--info"
        :class="{ 'widget-button--small': small, 'widget-button--inline': inline }"
        :small="small"
        @click.prevent="setCurrent(name)"
        v-if="name.includes('/')"
    >
        {{ $t('ui.discover.detailsButton') }}
    </a>
</template>

<script>
    import { mapMutations } from 'vuex';

    export default {
        props: {
            name: {
                type: String,
                required: true,
            },
            small: Boolean,
            inline: Boolean,
        },

        methods: {
            ...mapMutations('packages/details', ['setCurrent']),
        },
    };
</script>
