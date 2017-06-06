/**
 * @file browserSync配置
 */
var base = require('./');
module.exports = {
  server: {
    baseDir: base.publicDirectory,
    index: 'index.html'
  }
}
