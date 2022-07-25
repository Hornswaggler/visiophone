console.log(process.env);

module.exports = {
  outputDir : 'dist',
  runtimeCompiler: true,
  pluginOptions: {
    webpack: {
      dir: [
        './webpack'
      ]
    }
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 200000,
      }
    }
  }
}