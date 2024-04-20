<template>
    <div>
        <figure :class="computedClass">
            <img :src="src" loading="lazy" alt="" v-if="src">
            <template v-else>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="2 2 20 20"><path d="M4 4h7V2H4a2 2 0 0 0-2 2v7h2V4zm6 9-4 5h12l-3-4-2 2.7-3-3.7zm7-4.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zM20 2h-7v2h7v7h2V4a2 2 0 0 0-2-2zm0 18h-7v2h7a2 2 0 0 0 2-2v-7h-2v7zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z"/></svg>
            </template>
        </figure>
    </div>
</template>

<script>
    export default {
        props: {
            src: String,
            componentClass: String,
        },

        computed: {
            computedClass: vm => ({
                'package-logo--fallback': !vm.src,
                [vm.componentClass]: true,
                [`${vm.componentClass}--fallback`]: !vm.src,
            }),
        },
    };
</script>

<style lang="scss" scoped>
    .package-logo {
        &--fallback {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    svg {
        width: 80%;
        height: 80%;
        fill: #ccc;
    }
</style>
