const SriPlugin = require('webpack-subresource-integrity');
const SshWebpackPlugin = require('ssh-webpack-plugin');

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
            ],
            module: {
                rules: [
                    {
                        test: /(site\.webmanifest|browserconfig\.xml)$/,
                        use: [
                            {
                                loader: "file-loader",
                                options: {
                                    name: "icons/[name].[hash:8].[ext]",
                                },
                            },
                            {
                                loader: "app-manifest-loader",
                            },
                        ]
                    },
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
                        test: /packages\/[^/]+.(png|jpe?g|gif|webp)(\?.*)?$/,
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
                        test: /packages\/[^/]+.svg(\?.*)?$/,
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
                ],
            },
        };

        if (process.env.NODE_ENV === 'production') {
            config.plugins.push(new SshWebpackPlugin({
                host: 'w1.vhost.io',
                port: 22,
                username: 'packages',
                privateKey: require('fs')
                    .readFileSync(require('path').join(require('os').homedir(), '.ssh/id_rsa')),
                from: 'dist',
                to: '/srv/home/packages/public',
                // cover: false,
            }));
        }

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
