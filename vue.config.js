const Timestamp = new Date().getTime();
module.exports = {
  publicPath: "./",
  // outputDir: "cii_web",
  outputDir: process.env.VUE_APP_TYPE === "production" ? "cii_web" : "cii_test_web",
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: process.env.VUE_APP_TYPE === "test",

  configureWebpack: {
    //configureWebpack 这部分打包文件添加时间戳，防止缓存不更新
    output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `[name].${Timestamp}.js`,
      chunkFilename: `[name].${Timestamp}.js`
    },
  },
}