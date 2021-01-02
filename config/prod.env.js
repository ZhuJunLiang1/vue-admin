'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = {
  NODE_ENV: '"production"',
  BASE_API: '"http://39.106.185.236:8009"',
  OSS_PATH: '"https://online-zjl-edu.oss-cn-beijing.aliyuncs.com"'
}
