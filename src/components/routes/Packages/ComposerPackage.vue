<template>
    <package
        :title="data.title"
        :name="data.hideName ? '' : data.name"
        :logo="data.logo"
        :badge="badge"
        :description="data.description"
    >
        <template slot="logo"><slot name="logo"/></template>

        <more :name="data.name" :homepage="data.homepage" :support="Object.assign({}, data.support)" :hide-packagist="hidePackagist" slot="more"/>

        <template slot="additional">
            <strong class="package__version package__version--additional" v-if="data.version">{{ 'ui.package.version' | translate({ version: data.version }) }}</strong>
            <span v-for="(item,k) in additional" :key="k">{{ item }}</span>
        </template>

        <template slot="release">
            <slot name="release"/>
        </template>

        <template slot="actions">
            <slot name="actions"/>
        </template>

    </package>
</template>

<script>
    import Package from './Package';
    import More from './More';

    export default {
        components: { Package, More },

        props: {
            data: {
                type: Object,
                required: true,
            },
            updateOnly: Boolean,
            hidePackagist: Boolean,
        },

        computed: {
            badge() {
                if (this.isRequired) {
                    return {
                        title: this.$t('ui.package.requiredText'),
                        text: this.$t('ui.package.requiredTitle'),
                    };
                }

                if (this.data.abandoned) {
                    return {
                        title: this.data.replacement && this.$t('ui.package.replacement', { replacement: this.data.replacement }) || this.$t('ui.package.abandonedText'),
                        text: this.$t('ui.package.abandonedTitle'),
                    };
                }

                return {};
            },

            additional() {
                const additionals = [];

                if (this.data.license) {
                    if (this.data.license instanceof Array) {
                        additionals.push(this.data.license.join('/'));
                    } else {
                        additionals.push(this.data.license);
                    }
                }

                if (this.data.downloads) {
                    additionals.push(this.$t('ui.package.additionalDownloads', { count: this.data.downloads }, this.data.downloads));
                }

                if (this.data.favers) {
                    additionals.push(this.$t('ui.package.additionalStars', { count: this.data.favers }, this.data.favers));
                }

                return additionals;
            },

            released() {
                if (this.data.time === undefined) {
                    return '';
                }

                return new Date(this.data.time).toLocaleString();
            },
        },
    };
</script>
