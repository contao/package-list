export default {
    computed: {
        query: vm => vm.$route.query.q,
        pages: vm => Number(vm.$route.query.pages) || 0,
        sorting: vm => vm.$route.query.sort || '',

        isSearching: vm => vm.query || vm.pages || vm.sorting,
    },

    methods: {
        startSearch(q, pages = 1) {
            const query = { q };

            if (pages) {
                query.pages = pages;
            }

            if (this.sorting) {
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

        loadMore(e) {
            this.startSearch(this.query, this.pages + 1);

            if (e && e.target) {
                e.target.blur();
            }
        },
    },
};
