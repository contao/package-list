<template>
    <div class="popup-overlay" @click="clearCurrent">
        <div ref="popup" :class="popupClass">
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
            clearCurrent(event) {
                // Clicking the details link of a new package removes the button from the DOM,
                // so the event target would not be in the popup anymore
                if (this.$refs.popup && !this.$refs.popup.contains(event.target) && document.body.contains(event.target)) {
                    this.$emit('clear');
                }
            },
        },
    };
</script>

<style lang="scss">
@use "../../assets/styles/defaults";

.popup-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: var(--popup-overlay-bg);

    @include defaults.screen(960) {
        padding: 20px 0;
        overflow-y: auto;
    }
}
</style>
