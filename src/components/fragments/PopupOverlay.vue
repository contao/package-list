<template>
    <div class="popup-overlay" @click="clearCurrent()">
        <div ref="popup" :class="popupClass" @click.stop>
            <slot/>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            popupClass: [String, Object],
        },

        methods: {
            clearCurrent() {
                this.$emit('clear');
            },
        },
    };
</script>

<style lang="scss">
    @import "../../assets/styles/defaults";

    .popup-overlay {
        position: fixed;
        inset: 0;
        z-index: 1000;
        background: var(--popup-overlay-bg);

        @include screen(960) {
            padding: 20px 0;
            overflow-y: auto;
        }
    }
</style>
