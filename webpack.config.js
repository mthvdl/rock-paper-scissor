module.exports = {
  entry: './src/app.ts',
  output: {
    filename: 'dist/bundle.js',
    libraryTarget: 'var',
    library: 'rps'
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader'
      }
    ]
  }
}