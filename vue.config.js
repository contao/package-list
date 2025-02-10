const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    productionSourceMap: false,

    configureWebpack: () => {
        return {
            output: {
                crossOriginLoading: 'anonymous',
            },

            plugins: [
                new SubresourceIntegrityPlugin(),
                new FaviconsWebpackPlugin({
                    logo: './src/assets/images/logo.svg',
                    favicons: {
                        appName: 'Contao Extensions',
                        appDescription: 'The official list of extensions for the Contao Open Source CMS.',
                        background: '#ffffff',
                        theme_color: '#ffffff',
                        lang: null,
                        start_url: '/',
                    }
                }),
            ],
        };
    },

    chainWebpack: config => {
        config.plugin('define').tap((definitions) => {
            Object.assign(definitions[0], {
                __VUE_OPTIONS_API__: 'true',
                __VUE_PROD_DEVTOOLS__: 'false',
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
            })
            return definitions
        })

        config
            .module
            .rule('images')
            .test(/images\/[^/]+.(png|jpe?g|gif|webp)(\?.*)?$/)
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
        ;

        config
            .module
            .rule('svg')
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
        ;

        config.module
            .rule('vue')
            .use('vue-loader')
    }
};
