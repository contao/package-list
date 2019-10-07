<template>
    <div class="package-popup__tabcontent" v-show="current === name">
        <slot>
            <div class="package-popup__packagelist" v-if="links">
                <package-link :name="name" :key="name" :text="text" v-for="(text, name) in iterableLinks">
                    <slot name="actions" v-bind="{ name }"/>
                </package-link>
            </div>
        </slot>
    </div>
</template>

<script>
    import PackageLink from './Link';

    export default {
        components: { PackageLink },

        props: {
            name: String,
            current: String,
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
    };
</script>
