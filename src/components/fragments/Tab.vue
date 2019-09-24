<template>
    <li :class="{ 'package-popup__tab': true, 'package-popup__tab--active': active }">
        <button @click="$emit('click')" :disabled="disabled || count === 0">
            <slot/>
            <span :class="{ 'package-popup__pill': true, 'package-popup__pill--highlight': highlight && count > 0 }" v-if="count !== undefined">{{ count }}</span>
        </button>
    </li>
</template>

<script>
    export default {
        props: {
            active: Boolean,
            disabled: Boolean,
            count: Number,
            highlight: Boolean,
        }
    };
</script>
