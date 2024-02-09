<template>
    <div class="package-popup__tabcontent">
        <slot>
            <div class="package-popup__packagelist" v-if="links">
                <template v-for="(text, name) in iterableLinks">
                    <slot name="links" v-bind="{ name, text }">
                        <package-link :name="name" :key="name" :text="text">
                            <slot name="actions" v-bind="{ name }"/>
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
