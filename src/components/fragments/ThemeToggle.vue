<template>
    <div class="theme-switch">
        <button @click="toggle" ref="themeToggle">{{ themeOptions[getColorMode()] }}</button>
        <ul class="link-more__menu" ref="menu" v-show="visible" tabindex="-1" @blur="close" @click="close">
            <li v-for="(label, code) in themeOptions" :key="code">
                <a :class="[ 'theme_icon is--'+ code, { active: code === getColorMode() }]" @click="setColorMode(code)" @touchstart.stop="">{{ label }}</a>
            </li>
        </ul>
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
            open() {
                this.visible = true;
                this.$nextTick(() => this.$refs.menu.focus());
            },

            close() {
                this.$refs.menu.blur();
                setTimeout(() => {
                    this.visible = false;
                }, 300);
            },

            toggle() {
                this.visible ? this.close() : this.open();
            },

            setColorMode(colorMode) {
                document.documentElement.setAttribute('data-theme', colorMode);
                localStorage.setItem("theme", colorMode);

                //this.load(locale);

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

        ul {
            position: absolute;
            display: block;
            width: 200px;
            left: 50%;
            bottom: 25px;
            margin: 0;
            padding: 3px 3px 0;
            text-align: left;
            list-style-type: none;
            white-space: nowrap;
            background: var(--form-bg);
            border: 1px solid var(--tiles-bdr);
            border-bottom: 2px solid var(--contao);
            transform: translateX(-50%);
            z-index: 100;

            &:after {
                position: absolute;
                left: 50%;
                bottom: -6px;
                width: 0;
                height: 0;
                margin-left: -4px;
                border-style: solid;
                border-width: 4px 3.5px 0 3.5px;
                border-color: var(--contao) transparent transparent transparent;
                content: "";
            }
        }

        li {
            margin: 0 0 3px;
            padding: 0;

            a {
                display: flex;
                align-items: center;
                margin: 0;
                padding: 5px;
                color: var(--text);
                cursor: pointer;

                &.active {
                    font-weight: $font-weight-bold;
                }

                &.active,
                &:hover {
                    color: var(--text);
                    background: var(--focus); // ToDo:
                    text-decoration: none;
                }
            }
        }
    }

    .theme_icon {
        position: relative;
        padding-left: 25px;
        gap: 5px;

        &:before {
            display: inline-block;
            width: 14px;
            height: 14px;
            background: var(--theme-icon);
            box-shadow: 0 0 1px var(--text);
            border-radius: 50%;
            content: "";
        }

        &.is--light { --theme-icon: var(--toggle-light); }
        &.is--dark { --theme-icon: var(--toggle-dark); }
    }

</style>
