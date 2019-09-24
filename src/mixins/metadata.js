export default {
    data: () => ({
        metadata: {},
    }),

    methods: {
        async loadMetadata() {
            this.metadata = {};
            const metadata = await this.$store.dispatch('algolia/getPackage', this.data.name);

            if (metadata) {
                this.metadata = Object.assign(
                    {},
                    this.data,
                    metadata,
                    {
                        metadata: `https://github.com/contao/package-metadata/tree/master/meta/${this.data.name}/${this.$i18n.locale()}.yml`
                    }
                );
            } else {
                this.metadata = null;
            }
        },
    },

    watch: {
        data() {
            this.loadMetadata();
        },
    },

    created() {
        this.loadMetadata();
        this.$watch(this.$i18n.locale, this.loadMetadata);
    },
}
