<template>
    <discover-list :wrapper="wrapper"/>
</template>

<script>
    import MainLayout from '../layouts/MainLayout';
    import DiscoverList from '../fragments/DiscoverList';

    export default {
        components: { DiscoverList },

        computed: {
            wrapper: () => MainLayout,
        }
    };
</script>
