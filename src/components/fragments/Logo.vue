<template>
    <figure :class="computedClass">
        <!--suppress HtmlUnknownTarget -->
        <img :src="src" loading="lazy" alt="" v-if="src">
        <img src="../../assets/images/placeholder.png" alt="" v-else>
    </figure>
</template>

<script>
    export default {
        props: {
            src: String,
            componentClass: String,
        },

        computed: {
            computedClass: vm => ({
                [vm.componentClass]: true,
                [`${vm.componentClass}--fallback`]: !vm.src,
            }),
        },
    };
</script>
