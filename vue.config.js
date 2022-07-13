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
          chunks: "all"
        }
      }
    }
  }