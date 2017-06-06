var path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js|jsx$/,
        loader: 'babel',
        query: {
          compact: false,
          cacheDirectory: true,
          plugins: ['transform-class-properties' ],
          presets: ['es2015', 'react']
        },
        //query: { compact: false },
        include: path.join(__dirname, 'src')
      },
      // LESS
     /* {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", 'css-loader!autoprefixer-loader?{browsers:["last 2 versions", "ie 8", "ie 9", "> 1%"]}!less-loader')
      },*/
      { 
        test: /\.less$/, 
        loader: 'style!css!less' 
      },
      { 
        test: /\.css$/, 
        loader: 'style!css' 
      },
      // CSS
      /*{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", 'css-loader!autoprefixer-loader?{browsers:["last 2 versions", "ie 8", "ie 9", "> 1%"]}')
      },*/
      // IMAGE
      {
        test: /.(gif|jpg|png$)/,
        loader: 'file?name=/static/images/img-[hash].[ext]'
      },
      // FONT
      {test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=/static/[name].[ext]" },
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=/static/[name].[ext]" },
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=/static/[name].[ext]" },
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=/static/[name].[ext]" }
    ]
  },
  resolve: {
      extensions: ['', '.js', ".jsx"],
      root: '',
      alias: {
        'silk-cashier': path.join(__dirname, 'src/components') 
      } 
  }
}