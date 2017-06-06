/**
 * @desc 当gulp任务出现错误的时候，catch住，让其不中断
 */
var notify = require("gulp-notify");

module.exports = function(errorObject, callback) {
  notify.onError(errorObject.toString().split(': ').join(':\n')).apply(this, arguments);
  // Keep gulp from hanging on this task
  if (typeof this.emit === 'function') this.emit('end');
};