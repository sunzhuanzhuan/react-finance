# 配置编辑器环境
安装vscode插件，其他编辑器自己安装，在vscode编辑器里面最左侧边栏上点击扩展
1. 安装EditorConfig，统一编辑器风格
2. 安装ESLint 插件
$ npm install eslint@4.x babel-eslint@8 --save-dev
# or
$ yarn add eslint@4.x babel-eslint@8 -D

# 配置开发环境

### 配置host
1. 修改根目录下，.env.development中的host值。b.nip.io
2. 修改/etc/hosts 下配置127.0.0.1 b.nip.io
3. 在浏览器中访问b.nip.io:3000
4. 开发机环境配置 192.168.100.196 bentley.me
5. 在8090上部署bentley分支,填写后端的提测ip和端口

### 配置转发服务，修改proxy字段
    1. mock数据开发
        "/api":{
            "target":"http://192.168.20.51:7300/project/5b6013d40a4cc60021ebdfc5",
            "changeOrigin": true
        },
    2. 和后端联调配置
        "/api": {
			"target": "http://bentley.me:8090",
			"changeOrigin": true
		}

### B端账号
hanyi 123456

### B端开发分支
主分支：bentley
开发分支格式：bentleyDev/项目名/版本号








