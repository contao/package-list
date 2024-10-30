import { createApp, configureCompat } from 'vue';

configureCompat({ ATTR_FALSE_VALUE: false });
configureCompat({ RENDER_FUNCTION: false })

export default async function(App, router, store, i18n) {
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

    const app = createApp({
        ...App,
    });

    app.use(router);
    app.use(store);
    app.use(i18n.plugin);

    app.mount('#app');
}
