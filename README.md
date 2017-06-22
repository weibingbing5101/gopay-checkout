# 如有问题请联系我的qq  510137831

## 使用技术
`react reflux es6 less gulp webpack react-router html5-history nodejs iconfont`


## 运行方式

1. 执行`npm install`
2. 执行`npm start`
3. 浏览器打开[http://127.0.0.1:6221](http://127.0.0.1:6221)

## 分支介绍
* dev 开发分支，用于前端人员开发的分支
* test 联调分支，与后端人员进行联调的分支
* sit 提测分支，用于给测试进行测试的分支
* master 线上分支，用于生产环境上线的分支

## 打包命令
* `gulp dev` 启动本地开发环境
* `gulp test` 打包联调环境代码
* `gulp sit` 打包QA环境代码
* `gulp prod` 打包生产环境代码


## 文件结构

以下只对和项目相关的重要文件做了说明，其他文件不需要关注

```
--gulpfile.js 打包工具
--server 开发环境和线上环境服务脚本
----deployServer.js 上线后用nodejs运行项目、代理接口、进行权限控制等的脚本
----其他文件无需关注
--src 项目具体逻辑
----actions 逻辑的控制层，重要用于接收view的请求，并做相应的处理，广播给store
----components 与业务相关的组件
----modules 提供一些公共的工具方法
----pages 具体业务逻辑的拼接页面。设计思路为：将页面做最大限度的碎片化，将剥离出来的组件放到components里，然后这里做每一个具体业务逻辑的拼接。实现复用最大化。
----stores 数据持久化层，用户接收action的广播，对数据做一些存储处理，并广播给view
----app.less 页面样式入口
----font.less iconfont
----index.js 页面js入口
----normalize.less css初始化
----routes.js 页面路由配置
----variable.less less的一些全局变量
--test 单元测试（暂时无需关注）
--view 对于一些纯静态不需要js的页面或者逻辑很简单不要用到react的放到这里
--devServer.js 开发环境运行脚本
--index.html 页面入口
```
