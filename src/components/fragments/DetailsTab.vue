<template>
    <li
        class="package-popup__tab"
        :class="{ 'package-popup__tab--active': name === current }"
        v-if="showEmpty || count > 0"
    >
        <button @click="$emit('tab', name)" :disabled="count === 0 && links !== false">
            {{ $t(`ui.package-details.tab${name[0].toUpperCase()}${name.slice(1)}`) }}
            <span :class="{ 'package-popup__pill': true, 'package-popup__pill--highlight': highlight && count > 0 }" v-if="links !== false">{{ count }}</span>
        </button>
    </li>
</template>

<script>
    export default {
        props: {
            name: String,
            current: String,
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
