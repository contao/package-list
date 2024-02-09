const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    productionSourceMap: false,

    pluginOptions: {
        webpackBundleAnalyzer: {
            analyzerMode: 'disabled',
            openAnalyzer: false,
        },
    },

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
    }
};
