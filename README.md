#安装cnpm (先安装npm)
npm install -g cnpm --registry=https://registry.npm.taobao.org

#cnpm安装项目所需node_module
cnpm install

#启动命令
npm run dev

#打包命令
npm run build

#bootstrap资源
asstes
--global/scripts/cms.host.js     域名地址配置文件
--global/scripts/cms.config.js   接口地址配置文件
......

#发布配置文件目录
build

#vue开发目录
src
--assets          静态资源
--common          公共方法及样式
--components      组件
--modules         业务模块
--utils           其他工具方法
--vuex            vuex管理，只有选择图片弹框用到，等需要修改时再看
--App.vue         应用主入口
--config.js       项目端口等配置
--index.js        项目初始化入口
--routes.js       路由配置
--template.html   模板文件