export default {
    data: () => ({
        metadata: {},
    }),

    methods: {
        async loadMetadata() {
            if (!this.data) {
                this.metadata = null;
                return;
            }

            this.metadata = {};
            const metadata = await this.$store.dispatch('packages/metadata', this.data);

            if (metadata) {
                this.metadata = Object.assign(
                    {},
                    this.data,
                    metadata,
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
