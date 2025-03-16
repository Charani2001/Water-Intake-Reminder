// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js', // ඔබේ React app එකේ මුල් JavaScript ගොනුව
  output: {
    path: path.resolve(__dirname, 'build'), // Build folder එකේ output ගොනු
    filename: 'bundle.js', // Webpack bundle එකේ නම්
  },
  module: {
    rules: [
      {
        test: /\.js$/, // JS ගොනු
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Babel ක්‍රමය භාවිතා කර JS transcompile කිරීම
        },
      },
      // අමතර Loader එකක් ඇතුලත් කරන්න (CSS, Image Files)
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // React JS & JSX දෝෂාන්විතා
  },
  plugins: [
    // Webpack plugins එකතු කරන්න (e.g., HTML plugin)
  ],
};