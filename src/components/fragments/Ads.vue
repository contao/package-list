<template>
    <div class="container" v-if="ads && ads.length > 1">
        <div ref="controls">
            <button class="button prev">Prev</button>
            <button class="button next">Next</button>
        </div>
        <div ref="slider">
            <div v-for="ad in ads" :key="ad.objectID">
                <a :title="ad.title" @click.stop="setCurrent(ad.package)" v-if="ad.package"><img :src="ad.image" alt=""></a>
                <a :href="ad.url" :title="ad.title" target="_blank" rel="noreferrer noopener" v-else><img :src="ad.image" alt=""></a>
            </div>
        </div>
    </div>
</template>

<script>
    import { tns } from 'tiny-slider/src/tiny-slider';
    import { mapState, mapMutations } from 'vuex';

    export default {
        data: () => ({
            slider: null,
        }),

        computed: {
            ...mapState('algolia', ['ads']),
        },

        methods: {
            ...mapMutations('packages/details', ['setCurrent']),

            initSlider() {
                if (this.$refs.slider && this.$refs.controls) {
                    this.slider = tns({
                        container: this.$refs.slider,
                        controlsContainer: this.$refs.controls,
                        items: 1,
                        slideBy: 'page',
                        autoplay: true,
                        nav: false,
                        autoplayButtonOutput: false,
                        responsive: {
                            630: {
                                items: 2,
                            },
                        },
                    });
                }
            },
        },

        mounted() {
            this.initSlider();
        },

        updated() {
            if (this.slider) {
                this.slider.refresh();
            }
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "~tiny-slider/dist/tiny-slider.css";

    img {
        width: 100%;
    }

    .container {
        position: relative;
    }

    .button {
        position: absolute;
        top: 50%;
        margin-top: -9px;
        width: 18px;
        height: 18px;
        background: none;
        border: none;
        font-size: 0;
        line-height: 0;
        text-indent: -999em;
        transform: rotateZ(45deg);
        z-index: 100;
        -webkit-appearance: none;
        cursor: pointer;

        &.prev {
            left: 25px;
            border-bottom: 4px solid #fff;
            border-left: 4px solid #fff;
        }

        &.next {
            right: 25px;
            border-top: 4px solid #fff;
            border-right: 4px solid #fff;
        }
    }
</style>
