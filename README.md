# 公司官网

## 开发
- 官网首页当前改为使用webpack 打包，其它页面后续在改版的时候，应该都要统一使用这种方式
- 修改官网首页应该修改/src/pages/index目录下的三个文件
- 依赖： npm install
- 开发： npm run vendor 然后 npm run start
- 发布： npm run build
- 现在除了webpack.config.js里面配置了的页面，其它页面都是直接改html文件
## 移动端开发
- 移动端项目在 /m 目录下面
- 开发： npm run vendor_m 然后 npm run start_m
- 发布： npm run build_vendor_m 然后 npm run build_m

