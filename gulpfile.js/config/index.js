/**
 * @file 配置路径
 */
//TODO 目前不需要动态计算
var fs = require('fs');
var path = require('path');

/**
 * @desc 构建文件夹路径
 * @type {{publicDirectory: string}}
 */
var config = {
  publicDirectory: './dist',
  totalSourceDirectory: './'
}

/**
 * @desc 返回路径
 */
module.exports = config;
