<template>
    <div class="container" v-if="ads && ads.length > 1">
        <vueper-slides
            class="no-shadow"
            autoplay
            infinite
            :duration="10000"
            :slide-ratio="1/4"
            :visible-slides="2"
            :breakpoints="{ 630: { slideRatio: 1/2, visibleSlides: 1 } }"
            :bullets="false"
            :touchable="false"
            :arrows-outside="false"
        >
            <vueper-slide v-for="ad in ads" :key="ad.objectID">
                <template #content>
                    <a href="#" :title="ad.title" @click.stop="setCurrent(ad.package)" v-if="ad.package"><img :src="ad.image" alt=""></a>
                    <a :href="ad.url" :title="ad.title" target="_blank" rel="noreferrer noopener" v-else><img :src="ad.image" alt=""></a>
                </template>
            </vueper-slide>
        </vueper-slides>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';

    import { VueperSlides, VueperSlide } from 'vueperslides'
    import 'vueperslides/dist/vueperslides.css'

    export default {
        components: { VueperSlides, VueperSlide },

        computed: {
            ...mapState('algolia', ['ads']),
        },

        methods: {
            ...mapMutations('packages/details', ['setCurrent']),
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    img {
        width: 100%;
    }

    .container {
        position: relative;
        margin: 59px 0 69px;
        background: rgba(0, 0, 0, 0.2);
        box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.2);
    }
</style>
