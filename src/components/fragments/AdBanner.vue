<template>
    <div class="ads">
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
        <div class="link" v-if="$i18n.locale === 'de'"><a href="https://contao.org/de/anzeigen-erweiterungsliste.html" target="_blank">{{ $t('ui.discover.advertisement') }}</a></div>
        <div class="link" v-else><a href="https://contao.org/en/extension-ads.html" target="_blank">{{ $t('ui.discover.advertisement') }}</a></div>
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
        aspect-ratio: 2; // For aligning images that are slightly smaller e.g. "0.1-Theme"
    }

    .ads {
        margin: 59px 0 69px;
    }

    .link {
        padding-top: 5px;
        text-align: right;

        a {
            padding-left: 16px;
            font-size: .8em;
            color: inherit;
            background: var(--svg--link-blank) left center no-repeat;
            background-size: 13px 13px;
        }
    }

    .container {
        position: relative;
        background: #FFF;
        box-shadow: var(--ad-shadow);
        border-radius: 14px;
        overflow: hidden;
    }
</style>
