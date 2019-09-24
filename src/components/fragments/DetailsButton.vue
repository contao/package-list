<template>
    <button
        class="widget-button widget-button--details widget-button--info"
        :class="{ 'widget-button--small': small, 'widget-button--inline': inline }"
        :small="small"
        @click="setCurrent(name)"
        v-if="name.includes('/')"
    >
        {{ $t('ui.discover.detailsButton') }}
    </button>
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
        }
    };
</script>
