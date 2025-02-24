<template>
    <div class="footer-languages">
        <button class="footer-languages__toggle" :title="$t('ui.app.language')" @click="toggle">{{ locales[current] }}</button>
        <link-menu
            ref="menu"
            class="footer-languages__menu"
            color="contao"
            valign="top"
            tabindex="-1"
            :items="languageOptions"
            @focusout="close" @click="close"
            v-show="visible"
        />
    </div>
</template>

<script>
    import LinkMenu from './LinkMenu.vue';

    export default {
        components: { LinkMenu },
        emits: ['change'],

        props: {
            display: String,
            locales: Object,
            current: String,
        },

        data: () => ({
            visible: false,
        }),

        computed: {
            languageOptions() {
                return Object.keys(this.locales).map((code) => ({
                    label: this.locales[code],
                    active: code === this.current,
                    action: () => this.$emit('change', code),
                }));
            },
        },

        methods: {
            open() {
                this.visible = true;
                setTimeout(() => this.$refs.menu?.focus(), 0);
            },

            close(event) {
                if (event && this.$refs.menu?.contains(event.relatedTarget)) {
                    return;
                }

                this.$refs.menu.blur();
                setTimeout(() => {
                    this.visible = false;
                }, 100);
            },

            toggle() {
                if (this.visible) {
                    this.close();
                } else {
                    this.open();
                }
            },
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
@use "../../assets/styles/defaults";

.footer-languages {
    position: relative;
    display: inline-block;

    &__toggle {
        width: auto;
        height: auto;
        padding: 0 0 0 25px;
        background: transparent;
        color: var(--text);
        font-size: 12px;
        font-weight: defaults.$font-weight-normal;
        line-height: 20px;
        background: var(--svg--language) left center no-repeat;
        background-size: 20px 20px;
        border: none;
        cursor: pointer;

        &:hover {
            color: var(--black);
        }
    }

    &__menu {
        display: grid;
        grid-template: auto / 1fr 1fr;
        bottom: 25px;
        white-space: nowrap;
        transform: translateX(-50%);

        button {
            margin: 0;
            padding: 6px;
            text-align: left;
            font-size: inherit;
        }
    }
}
</style>
