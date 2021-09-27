const SriPlugin = require('webpack-subresource-integrity');
const WebpackPwaManifest = require('webpack-pwa-manifest')
const path = require('path');

module.exports = {
    productionSourceMap: false,

    pluginOptions: {
        webpackBundleAnalyzer: {
            analyzerMode: 'disabled',
            openAnalyzer: false,
        },
    },

    configureWebpack: () => {
        const config = {
            output: {
                crossOriginLoading: 'anonymous',
            },

            plugins: [
                new SriPlugin({
                    hashFuncNames: ['sha384'],
                    enabled: process.env.NODE_ENV === 'production',
                }),
                new WebpackPwaManifest({
                    name: 'Contao Extensions',
                    background_color: '#ffffff',
                    theme_color: '#ffffff',
                    orientation: 'omit',
                    publicPath: '',
                    icons: [
                        {
                            src: path.resolve('src/assets/icons/android-chrome-192x192.png'),
                            size: '192x192',
                            destination: 'icons',
                        },
                        {
                            src: path.resolve('src/assets/icons/android-chrome-512x512.png'),
                            size: '512x512',
                            destination: 'icons',
                        },
                    ],
                }),
            ],
            module: {
                rules: [
                    {
                        test: /icons\/[^/]+.(png|jpe?g|gif|webp|svg|ico)(\?.*)?$/,
                        use: [
                            {
                                loader: "file-loader",
                                options: {
                                    name: "icons/[name].[hash:8].[ext]",
                                },
                            },
                            {
                                loader: "image-webpack-loader",
                            },
                        ]
                    },
                    {
                        test: /packages\/[^/]+\.(png|jpe?g|gif|webp)(\?.*)?$/,
                        use: [
                            {
                                loader: "file-loader",
                                options: {
                                    name: "packages/[hash].[ext]",
                                },
                            },
                            {
                                loader: "image-webpack-loader",
                            },
                            {
                                loader: 'bin-exec-loader',
                                options: {
                                    binary: 'convert',
                                    prefix: '-',
                                    export: false,
                                    emitFile: false,
                                    args: {
                                        $1: '[input]',
                                        scale: '590x295',
                                        unsharp: '0x0.75+0.75+0.008',
                                        $2: '[output]',
                                    },
                                },
                            },
                        ],
                    },
                    {
                        test: /packages\/[^/]+\.svg(\?.*)?$/,
                        use: [
                            {
                                loader: "file-loader",
                                options: {
                                    name: "packages/[hash].[ext]",
                                },
                            },
                            {
                                loader: "image-webpack-loader",
                            },
                        ],
                    },
                    {
                        test: /news\/[^/]+\.(png|jpe?g|gif|webp)(\?.*)?$/,
                        use: [
                            {
                                loader: "file-loader",
                                options: {
                                    name: "news/[hash].[ext]",
                                },
                            },
                            {
                                loader: "image-webpack-loader",
                            },
                        ],
                    },
                ],
            },
        };

        return config;
    },

    chainWebpack: config => {
        config.module
            .rule('images')
            .test(/images\/[^/]+.(png|jpe?g|gif|webp)(\?.*)?$/)
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
        ;

        config.module
            .rule('svg')
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
        ;
    }
};
