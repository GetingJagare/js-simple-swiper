import { resolve } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

export default function ( env ) {
    const currentDir = resolve('.');
    return {
        mode: env.MODE === 'development' ? env.MODE : 'production',
        devServer: {
            client: {
                logging: 'log',
                overlay: false,
            },
            open: true,
            host: '0.0.0.0',
            allowedHosts: 'all',
            liveReload: true,
            watchFiles: [
                `${currentDir}/src/**/*.js`,
                `${currentDir}/src/**/*.scss`,
                `${currentDir}/public/**/*.html`,
            ],
            webSocketServer: 'ws',
            static: [
                {
                    directory: `${currentDir}/public`,
                    watch: false,
                },
                {
                    directory: `${currentDir}/dist`,
                    publicPath: '/dist',
                },
            ],
            hot: false,
            compress: true,
            port: 9000,
            historyApiFallback: true,
            devMiddleware: {
                index: true,
                mimeTypes: { phtml: 'text/html' },
                publicPath: '/public',
                serverSideRender: true,
                writeToDisk: true,
            },
        },
        entry: './src/ts/swiper.ts',
        output: {
            filename: 'index.js',
            path: resolve('.', 'dist'),
            clean: true,
            library: {
                type: 'module',
            },
        },
        experiments: {
            outputModule: true,
        },
        optimization: {
            minimize: true,
            minimizer: [
                new CssMinimizerPlugin(),
                new TerserPlugin({
                    terserOptions: {
                      format: {
                        comments: false,
                      },
                    },
                    extractComments: false,
                }),
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'index.css',
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader",
                    ],
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.ts'],
        },
    };
}