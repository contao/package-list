<template>
    <ul ref="menu" :class="cssClass">
        <li v-for="(item, k) in items" :key="k" class="link-menu__item">
            <a class="link-menu__action" :class="{ 'link-menu__action--active': item.active }" :href="item.href" :target="item.target" @click="event => click(event, item)" v-if="item.href">{{ item.label }}</a>
            <button class="link-menu__action" :class="{ 'link-menu__action--active': item.active }" @click="event => click(event, item)" v-else>{{ item.label }}</button>
        </li>
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
            focus() {
                this.$refs.menu?.focus();
            },

            blur() {
                this.$refs.menu?.blur();
            },

            contains(el) {
                return this.$refs.menu.contains(el);
            },

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
@use "../../assets/styles/defaults";

.link-menu {
    position: absolute;
    display: grid;
    grid-template: 1fr / 1fr;
    left: 50%;
    gap: 2px;
    margin: 0;
    padding: 2px;
    text-align: center;
    list-style-type: none;
    white-space: nowrap;
    background: var(--form-bg);
    border-top: 3px solid var(--text);
    border-radius: 5px;
    z-index: 100;
    box-shadow: 0 0 1px var(--shadow);
    outline: none;

    &:before {
        position: absolute;
        left: 50%;
        top: -7px;
        width: 0;
        height: 0;
        margin-left: -4px;
        border-style: solid;
        border-width: 0 3.5px 4px 3.5px;
        border-color: transparent transparent var(--text) transparent;
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
        border-bottom: 3px solid var(--text);
        box-shadow: 0 0 2px var(--shadow);

        &:before {
            top: auto;
            bottom: -7px;
            border-width: 4px 3.5px 0 3.5px;
            border-color: var(--text) transparent transparent transparent;
        }
    }

    &--contao {
        border-color: var(--contao);

        &:before {
            border-bottom-color: var(--contao);
        }

        &.link-menu--valign-top:before {
            border-bottom-color: transparent;
            border-top-color: var(--contao);
        }
    }

    &--primary {
        border-color: var(--btn-primary);

        &:before {
            border-bottom-color: var(--btn-primary);
        }

        &.link-menu--valign-top:before {
            border-bottom-color: transparent;
            border-top-color: var(--btn-primary);
        }
    }

    &--warning {
        border-color: var(--btn-warning);

        &:before {
            border-bottom-color: var(--btn-warning);
        }

        &.link-menu--valign-top:before {
            border-bottom-color: transparent;
            border-top-color: var(--btn-warning);
        }
    }

    &--alert {
        border-color: var(--btn-alert);

        &:before {
            border-bottom-color: var(--btn-alert);
        }

        &.link-menu--valign-top:before {
            border-bottom-color: transparent;
            border-top-color: var(--btn-alert);
        }
    }

    &__item {
        margin: 0;
        padding: 0;
        display: block;
    }

    &__action {
        display: block;
        width: 100%;
        border-radius: 5px;
        padding: 8px 16px;
        color: var(--text);
        font-size: inherit;
        text-align: center;
        background: none;
        border: none;
        cursor: pointer;

        &:hover {
            color: var(--text);
            background: var(--focus);
            text-decoration: none;
        }

        &--active {
            font-weight: defaults.$font-weight-bold;
            background: var(--focus);
        }
    }
}
</style>
