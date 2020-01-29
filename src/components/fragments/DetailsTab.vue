<template>
    <li
        class="package-popup__tab"
        :class="{ 'package-popup__tab--active': active }"
        v-if="showEmpty || count > 0"
    >
        <button @click="$emit('click')" :disabled="count === 0 && links !== false">
            <slot/>
            <span :class="{ 'package-popup__pill': true, 'package-popup__pill--highlight': highlight && count > 0 }" v-if="links !== false">{{ count }}</span>
        </button>
    </li>
</template>

<script>
    export default {
        props: {
            active: Boolean,
            showEmpty: Boolean,
            highlight: Boolean,
            links: [Object, Array, Boolean],
        },

        computed: {
            count() {
                if (!this.links) {
                    return 0;
                }

                if (this.links instanceof Array) {
                    return this.links.length;
                }

                return Object.values(this.links).length;
            },
        },
    };
</script>
