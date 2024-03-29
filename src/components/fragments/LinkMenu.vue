<template>
    <ul :class="cssClass">
        <li v-for="(item, k) in items" :key="k" class="link-menu__item"><a class="link-menu__action" :href="item.href" :target="item.target" @click="event => click(event, item)">{{ item.label }}</a></li>
    </ul>
</template>

<script>
    export default {
        props: {
            items: {
                type: Array,
                required: true,
            },
            color: String,
            align: String,
            valign: String,
        },

        computed: {
            cssClass: vm => ({
                'link-menu': true,
                [`link-menu--${vm.color}`]: !!vm.color,
                [`link-menu--align-${vm.align}`]: !!vm.align,
                [`link-menu--valign-${vm.valign}`]: !!vm.valign,
            }),
        },

        methods: {
            click(event, item) {
                if (item.action) {
                    event.preventDefault();
                    item.action(item);
                }
            },
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/styles/defaults";

    .link-menu {
        position: absolute;
        display: block;
        left: 50%;
        margin: 0;
        padding: 0;
        text-align: center;
        list-style-type: none;
        white-space: nowrap;
        background: #fff;
        border-top: 3px solid $text-color;
        //transform: translateX(-50%);
        z-index: 100;
        box-shadow: $shadow-color 0 1px 2px;

        &:before {
            position: absolute;
            left: 50%;
            top: -7px;
            width: 0;
            height: 0;
            margin-left: -4px;
            border-style: solid;
            border-width: 0 3.5px 4px 3.5px;
            border-color: transparent transparent $text-color transparent;
            content: "";
        }

        &--align-left {
            left: 0;
            right: auto;

            &:before {
                left: 17px;
                right: auto;
            }
        }

        &--align-right {
            left: auto;
            right: 0;

            &:before {
                left: auto;
                right: 17px;
            }
        }

        &--valign-top {
            bottom: 0;
            border-top: none;
            border-bottom: 3px solid $text-color;
            box-shadow: $shadow-color 0 0 2px;

            &:before {
                top: auto;
                bottom: -7px;
                border-width: 4px 3.5px 0 3.5px;
                border-color: $text-color transparent transparent transparent;
            }
        }

        &--contao {
            border-color: $contao-color;

            &:before {
                border-bottom-color: $contao-color;
            }

            &.link-menu--valign-top:before {
                border-bottom-color: transparent;
                border-top-color: $contao-color;
            }
        }

        &--primary {
            border-color: $green-button;

            &:before {
                border-bottom-color: $green-button;
            }

            &.link-menu--valign-top:before {
                border-bottom-color: transparent;
                border-top-color: $green-button;
            }
        }

        &--warning {
            border-color: $orange-button;

            &:before {
                border-bottom-color: $orange-button;
            }

            &.link-menu--valign-top:before {
                border-bottom-color: transparent;
                border-top-color: $orange-button;
            }
        }

        &--alert {
            border-color: $red-button;

            &:before {
                border-bottom-color: $red-button;
            }

            &.link-menu--valign-top:before {
                border-bottom-color: transparent;
                border-top-color: $red-button;
            }
        }

        &__item {
            margin: 0;
            padding: 0;
            display: block;
            border-top: 1px solid #e5dfd0;

            &:first-child {
                border-top: none;
            }
        }

        &__action {
            display: block;
            margin: 0;
            padding: 10px 20px;
            color: $text-color;
            cursor: pointer;

            &:hover {
                color: #000;
                text-decoration: none;
            }
        }
    }
</style>
