<template>
    <div class="popup-overlay" @click="clearCurrent">
        <div ref="popup" :class="`popup-overlay__popup ${popupClass}`">
            <slot name="content">
                <form @submit.prevent="$emit('submit')">
                    <template v-if="headline || $slots.headline">
                        <slot name="headline">
                            <h1
                                class="popup-overlay__headline"
                                :class="{ [`popup-overlay__headline--${headlineType}`]: !!headlineType }"
                            >{{ headline }}</h1>
                        </slot>
                    </template>
                    <div class="popup-overlay__content">
                        <slot/>
                    </div>
                    <div class="popup-overlay__actions" v-if="$slots.actions">
                        <slot name="actions"/>
                    </div>
                </form>
            </slot>
        </div>
    </div>
</template>

<script>
    export default {
        emits: ['submit'],

        props: {
            fixed: Boolean,
            popupClass: [String, Object],
            headline: String,
            headlineType: String,
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

    &__popup {
        position: fixed;
        display: block;
        top: 50%;
        left: 50%;
        width: 500px;
        max-width: 90%;
        background: var(--popup-bg);
        z-index: 10;
        opacity: 1;
        transform: translate(-50%, -50%);
        border-radius: var(--border-radius);
        overflow: hidden;
    }

    &__headline {
        position: relative;
        margin-bottom: 0;
        padding: 7px 30px 6px;
        background: var(--popup-hl-bg);
        font-size: 18px;
        color: #fff;
        font-weight: defaults.$font-weight-normal;
        line-height: 1.5em;
        text-align: center;

        &--primary {
            background-color: var(--btn-primary);
        }

        &--alert {
            background-color: var(--btn-alert);
        }
    }

    &__content {
        padding: 2em 20px;
    }

    &__actions {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
        padding: 0 20px 2em;

        .widget-button {
            width: auto;
            height: 35px;
            padding: 0 30px;
            line-height: 35px;
        }
    }

    @include defaults.screen(550) {
        &__content,
        &__actions {
            padding-left: 40px;
            padding-right: 40px;
        }
    }
}
</style>
