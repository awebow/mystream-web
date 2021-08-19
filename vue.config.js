module.exports = {
    chainWebpack: config => {
        config.module
        .rule('vue')
        .use('vue-loader')
        .tap(options => {
            options.compilerOptions = {
            ...options.compilerOptions,
            isCustomElement: tag => tag.startsWith('ion-')
            }
            return options
        })
    },
    pages: {
        index: {
            entry: "src/main.js",
            template: "public/index.html",
            filename: "index.html"
        },
        embedded: {
            entry: "src/embedded.js",
            template: "public/index.html",
            filename: "embedded.html"
        }
    }
};