module.exports = {
    webpackDevMiddleware: config => {
        connfig.watchOptions.poll = 300;
        return config;
    }
}