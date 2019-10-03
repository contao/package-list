export default {
    computed: {
        query: vm => vm.$route.query.q,
        pages: vm => Number(vm.$route.query.pages) || 1,
        sorting: vm => vm.$route.query.sort || '',

        isSearching: vm => vm.query || vm.pages > 1 || vm.sorting,
    },

    methods: {
        startSearch(q, pages = 1) {
            const query = { q };

            if (pages) {
                query.pages = pages;
            }

            if (this.sorting && this.query === q) {
                query.sort = this.sorting;
            }

            this.$router.push({ query, append: true });
        },

        stopSearch(e) {
            const route = Object.assign({}, this.$route);
            delete route.query;

            this.$router.push(route);

            if (e && e.target) {
                e.target.blur();
            }
        },

        sortBy(sort) {
            this.$router.push({ query: Object.assign({}, this.$route.query, { sort })});
        },

        loadMore(e) {
            this.startSearch(this.query, this.pages + 1);

            if (e && e.target) {
                e.target.blur();
            }
        },
    },
};
