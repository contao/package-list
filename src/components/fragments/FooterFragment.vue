<template>
    <footer :class="'fragment-footer' + (display ? (' fragment-footer--'+display) : '')">
        <div class="fragment-footer__language">
            <button @click="toggle">{{ languageOptions[currentLanguage] }}</button>
            <ul class="link-more__menu" ref="menu" v-show="visible" tabindex="-1" @blur="close" @click="close">
                <li v-for="(label, code) in languageOptions" :key="code">
                    <a :class="{ active: code === currentLanguage }" @click="updateLanguage(code)" @touchstart.stop="">{{ label }}</a>
                </li>
            </ul>
        </div>
        <div class="dark-mode-select">
            <select
                @change="setColorMode($event.target.value)"
                v-model="colorMode"
            >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </div>
    </footer>
</template>

<script>
    import i18n from '../../i18n';
    import locales from '../../i18n/locales';

    export default {
        props: {
            display: String,
        },

        created () {
            this.colorMode = this.getColorMode()
        },

        data: () => ({
            visible: false,
            colorMode: 'light'
        }),

        computed: {
            currentLanguage() {
                return this.$i18n.locale;
            },

            languageOptions() {
                return locales;
            },
        },

        methods: {
            updateLanguage(value) {
                i18n.switch(value);
            },

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
                if (this.visible) {
                    this.close();
                } else {
                    this.open();
                }
            },

            setColorMode(colorMode) {
                document.documentElement.setAttribute('data-theme', colorMode);
                console.log(colorMode)
                localStorage.setItem("theme", colorMode);
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

    .fragment-footer {
        clear: both;
        width: 250px;
        margin: 10px auto 0;
        padding: 15px 0;
        font-size: 12px;
        text-align: center;
        border-top: 1px solid #eee; // ToDo:

        &--main {
            width: auto;
            margin-top: 52px !important;
            padding: 20px 0;
            border-top: 1px solid var(--footer-bdr);
        }

        &:before {
            content: "";
            display: table;
            clear: both
        }

        &__language {
            position: relative;
            display: inline-block;
            margin-left: 5px;

            button {
                width: auto;
                height: auto;
                padding: 0 0 0 25px;
                margin-top: 10px !important;
                background: transparent;
                color: $text-color;
                font-size: 12px;
                font-weight: $font-weight-normal;
                line-height: 20px;
                background: url(../../assets/images/language.svg) left center no-repeat;
                background-size: 20px 20px;
                border: none;

                &:hover {
                    color: var(--black);
                }
            }

            ul {
                position: absolute;
                display: block;
                width: 350px;
                left: 50%;
                bottom: 30px;
                margin: 0;
                padding: 0;
                text-align: left;
                list-style-type: none;
                white-space: nowrap;
                background: var(--white); // ToDo: maybe another background
                border-bottom: 3px solid var(--contao);
                transform: translateX(-50%);
                z-index: 100;
                box-shadow: $shadow-color 0 -1px 2px; // ToDo:

                &:after {
                    position: absolute;
                    left: 50%;
                    bottom: -7px;
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
                float: left;
                width: 50%;
                margin: 0;
                padding: 0;
                border-top: 1px solid #e5dfd0; // ToDo:

                a {
                    display: block;
                    margin: 0;
                    padding: 5px 10px;
                    color: $text-color;
                    cursor: pointer;

                    &.active {
                        font-weight: $font-weight-bold;
                    }

                    &:hover {
                        color: #000; // ToDo:
                        text-decoration: none;
                    }
                }

                &:first-child,
                &:nth-child(2) {
                    border-top: none;
                }
            }
        }

        @include screen(960) {
            &--boxed,
            &--main {
                .fragment-footer {
                    &__language button {
                        margin-top: 0 !important;
                    }
                }
            }

            &--boxed {
                width: 840px;
            }
        }
    }

</style>