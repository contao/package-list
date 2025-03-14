import { createApp } from 'vue';

export default async function(App, i18n, plugins, install = () => {}) {
    await i18n.init();

    if (URLSearchParams !== undefined) {
        const params = new URLSearchParams(location.search);

        if (params.has('_locale')) {
            await i18n.switch(params.get('_locale'));
            params.delete('_locale');
            // window.location.search = params.toString();
            const url = new URL(location.pathname, location);
            url.search = params.toString();
            history.replaceState(history.state, '', url.toString())
        }
    }

    const app = createApp({
        ...App,
    });

    app.use(i18n.plugin);

    plugins.forEach((plugin) => {
        app.use(plugin)
    });

    install(app);

    app.mount('body');
}
