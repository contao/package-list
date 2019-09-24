<template>
    <discover :wrapper="wrapper"/>
</template>

<script>
    import MainLayout from '../layouts/Main';
    import Discover from '../fragments/Discover';

    export default {
        components: { Discover },

        computed: {
            wrapper: () => MainLayout,
        }
    };
</script>
