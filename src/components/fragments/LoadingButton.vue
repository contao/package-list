<template>
    <component
        :is="link ? 'a' : 'button'"
        :type="link ? null : (submit ? 'submit' : 'button')"
        :href="link"
        :class="buttonClass"
        :disabled="disabled || loading"
        @click="click"
        @mouseover="e => $emit('mouseover', e)"
        @mouseout="e => $emit('mouseout', e)"
    >
        <span :class="slotClass"><slot/></span>
        <loading-spinner v-show="loading"/>
    </component>
</template>

<script>
    import LoadingSpinner from './LoadingSpinner';

    export default {
        components: { LoadingSpinner },

        emits: ['click', 'mouseover', 'mouseout'],

        props: {
            href: String,
            to: [String, Object],
            color: String,
            icon: String,
            inline: Boolean,
            loading: Boolean,
            disabled: Boolean,
            submit: Boolean,
        },

        computed: {
            buttonClass: vm => ({
                'loading-button': true,
                'widget-button': true,
                'widget-button--inline': vm.inline,
                [`widget-button--${vm.color}`]: vm.color,
                'disabled': vm.link && (vm.loading || vm.disabled),
            }),

            slotClass: vm => ({
                loading: vm.loading,
                [`widget-button--${vm.icon}`]: vm.icon,
            }),

            link: vm => vm.href || (vm.to && vm.$router.resolve(vm.to).href) || null,
        },

        methods: {
            click(e) {
                if (!this.submit && !this.link) {
                    e.preventDefault();
                    this.$emit('click', e);
                }
            },
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
.loading-button {
    position: relative;

    > .loader {
        position: absolute;
        left: calc(50% - 25px / 2);
        top: calc(50% - 25px / 2);
    }

    > .loading {
        visibility: hidden;
    }
}
</style>
