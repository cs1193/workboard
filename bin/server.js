const path = require('path');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config');
const compiler = webpack(config);
const express = require('express');
const app = express();
// const DashboardPlugin = require('webpack-dashboard/plugin');

const HOST = process.env.WEBPACK_HOST || '0.0.0.0';
const PORT = process.env.WEBPACK_PORT || 3000;

const server = {
  publicPath: config.output.publicPath,
  contentBase: 'http://${HOST}:${PORT}',
  quiet: false,
  noInfo: false,
  hot: true,
  inline: true,
  watchOptions: {
    aggregateTime: 300,
    poll: false,
    ignored: /node_modules/
  },
  lazy: false,
  stats: {
    colors: true
  }
};

// compiler.apply(new DashboardPlugin());

app.use(middleware(compiler, server));
app.use(hotMiddleware(compiler));

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, HOST, () => console.log(`App listening on port ${HOST}:${PORT}`));
