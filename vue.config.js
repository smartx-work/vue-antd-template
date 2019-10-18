// eslint-disable-next-line no-console
console.log('加载本地配置项...')

const path = require('path')

// https://webpack.docschina.org/configuration/  webpack配置实例
// https://github.com/vuejs/vue-cli/blob/dev/docs/zh/guide/webpack.md
// https://github.com/neutrinojs/webpack-chain/blob/master/test/Rule.js  测试用例

module.exports = {

    // publicPath: '',
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: 80,
        proxy: {
            '/merchant-gw/': {
                target: 'https://test2sop.sharegoodsmall.com/', // 开发环境
                changeOrigin: true,
                /*
                pathRewrite: {
                    '^/merchant-console-gateway/': '/merchant-console-gateway/',
                }, */
            },
        },
    },
    configureWebpack: (function () {
        if (process.env.NODE_ENV === 'production') {
            return {
                plugins: [

                ],
            }
        } else {
            return {
                devtool: 'eval-source-map',
                plugins: [

                ],
            }
        }
    }()),
    chainWebpack: (config) => {
        // 修改svg加载配置
        const svgRule = config.module.rule('svg')
        svgRule.uses.clear()
        svgRule
            .include.add(path.join(__dirname, 'src/styles/svgicon')).end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({ symbolId: 'icon-[name]' })

        // resolve override
        config.resolve.alias
            .set('@', path.resolve(__dirname, './src'))
            .set('@packages', path.resolve(__dirname, './src/packages'))
            .set('@components', path.resolve(__dirname, './src/components'))
            .set('@styles', path.resolve(__dirname, './src/styles'))
            .set('@views', path.resolve(__dirname, './src/views'))
    },
}
