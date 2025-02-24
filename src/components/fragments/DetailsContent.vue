<template>
    <div class="package-popup__tabcontent" v-show="active" tabindex="-1">
        <slot>
            <div class="package-popup__packagelist" v-if="links">
                <template v-for="(text, name) in iterableLinks">
                    <slot v-bind="{ name, text }" name="links">
                        <package-link :name="name" :key="name" :text="text">
                            <slot v-bind="{ name }" name="actions"/>
                        </package-link>
                    </slot>
                </template>
            </div>
        </slot>
    </div>
</template>

<script>
    import PackageLink from './PackageLink';

    export default {
        components: { PackageLink },

        props: {
            active: Boolean,
            links: [Object, Array],
        },

        computed: {
            iterableLinks() {
                if (this.links instanceof Array) {
                    const links = {};

                    this.links.forEach((v) => {
                        links[v] = null;
                    });

                    return links;
                }

                return this.links;
            }
        },

        watch: {
            active() {
                setTimeout(() => { this.$el.focus() }, 0);
            }
        }
    };
</script>
