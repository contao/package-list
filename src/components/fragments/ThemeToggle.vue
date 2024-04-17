<template>
    <div class="theme-switch">
        <button @click="toggleColorMode" ref="themeToggle">{{ themeOptions[getColorMode()] }}</button>
    </div>
</template>

<script>
    export default {
        data: () => ({
            visible: false,
        }),

        computed: {
            themeOptions() {
                return {
                    light: 'Dark Mode',
                    dark: 'Light Mode'
                }
            },
        },

        methods: {
            toggleColorMode() {
                this.setColorMode(this.getColorMode() === 'dark' ? 'light' : 'dark')
            },

            setColorMode(colorMode) {
                document.documentElement.setAttribute('data-theme', colorMode);
                localStorage.setItem("theme", colorMode);

                this.$refs.themeToggle.innerText = this.themeOptions[colorMode]
            },

            getColorMode() {
                const storedTheme = localStorage.getItem("theme");

                if (storedTheme) {
                    return storedTheme;
                }

                return window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
            },
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/styles/defaults";

    :root {
        --icon-color-scheme: url(~@/assets/images/color_scheme.svg)
    }

    html[data-theme=dark] {
        --icon-color-scheme: url(~@/assets/images/color_scheme--dark.svg)
    }

    .theme-switch {
        position: relative;
        display: inline-block;

        button {
            width: auto;
            height: auto;
            padding: 0 0 0 24px;
            background: transparent;
            color: var(--text);
            font-size: 12px;
            font-weight: $font-weight-normal;
            line-height: 20px;
            background: var(--icon-color-scheme) left center no-repeat;
            background-size: 20px 20px;
            border: none;
            cursor: pointer;

            &:hover {
                color: var(--black);
            }
        }
    }

</style>
