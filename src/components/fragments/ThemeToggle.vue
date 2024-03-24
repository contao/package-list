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
                    light: 'Light',
                    dark: 'Dark'
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
        --toggle-light: #ecd21f radial-gradient(#ecd21f 35%, #ff9b00);
        --toggle-dark: #666 linear-gradient(123deg, #fff 0%, #666 40%, #444 50%);
        --theme-toggle: var(--toggle-light);
    }

    html[data-theme=dark] {
        --theme-toggle: var(--toggle-dark);
    }

    .theme-switch {
        position: relative;
        display: inline-block;

        button {
            position: relative;
            width: auto;
            height: auto;
            padding: 0 0 0 25px;
            background: transparent;
            color: $text-color;
            font-size: 12px;
            font-weight: $font-weight-normal;
            line-height: 20px;
            border: none;
            cursor: pointer;

            &:hover {
                color: var(--black);
            }

            &:before {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 20px;
                background: var(--theme-toggle);
                box-shadow: 0 0 1px var(--text);
                border-radius: 50%;
                content: "";
            }
        }
    }

</style>
