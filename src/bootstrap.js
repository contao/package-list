
export default async function(Vue, App, router, store, i18n) {
    await i18n.init();

    if (URLSearchParams !== undefined) {
        const params = new URLSearchParams(location.search);

        if (params.has('_locale')) {
            await i18n.switch(params.get('_locale'));
            params.delete('_locale');
            // window.location.search = params.toString();
            const url = new URL(location.pathname, location);
            url.search = params.toString();
            history.replaceState(null, '', url.toString())
        }
    }

    /* eslint-disable no-new */
    const $vue = new Vue({
        router,
        store,
        render: h => h(App),
    });

    $vue.$store.commit('packages/details/setRouter', router);

    $vue.$mount('#app');
}
