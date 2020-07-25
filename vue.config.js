module.exports = {
  transpileDependencies: ['vuetify'],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/fe/digitz-book/dist/'
    : '/'
}
