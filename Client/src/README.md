### 配置Node.js开发环境

1. 安装nvm
2. 利用nvm安装nodejs
3. 安装 tnpm



### Getting Started

1. git clone -b development **--recursive** http://gitlab.alibaba-inc.com/sd/data-got.git 
2. cd data-got && tnpm install
3. npm start

### How to Build
npm run build  

此时访问 __http://localhost:8088/__即可开始开发

### 目录结构

```
.
├── /build/                     # The folder for compiled output
├── /docs/                      # Documentation files for the project
├── /node_modules/              # 3rd-party libraries and utilities
├── /src/                       # The source code of the application
│   ├── /actions/               # Action creators that allow to trigger a dispatch to stores
│   ├── /api/                   # REST API / Relay endpoints
│   ├── /components/            # React components
│   ├── /constants/             # Constants (action types etc.)
│   ├── /content/               # Static content (plain HTML or Markdown, Jade, you name it)
│   ├── /core/                  # Core components (Flux dispatcher, base classes, utilities)
│   ├── /decorators/            # Higher-order React components
│   ├── /public/                # Static files which are copied into the /build/public folder
│   ├── /stores/                # Stores contain the application state and logic
│   ├── /utils/                 # Utility classes and functions
│   ├── /index.js                 # Client-side startup script
│   ├── /config.js              # Global application settings
│   ├── /routes.js              # Universal (isomorphic) application routes
│   └── /server.js              # Server-side startup script
├── /tools/                     # Build automation scripts and utilities
│   ├── /lib/                   # Library for utility snippets
│   └── /server.js              # Launches the Node.js/Express web server
├── /mockData/                  # store backend mock data
│   ├── /index.js               
│   └── /chartJson.js           
├── /forTempPageUsage/          # Any free style pages
│   ├── /bower_components/                   # 3rd-party libraries and utilities, use bower to manage
│   │     ├── jquery 
│   ├── /css/    
│   │     ├── /global.css       #store common global css setting  
│   │     ├── /[yourFeature].css       #store common global css setting                   
│   ├── /js/   
│         ├── /mod/             #store common module, like chart and map
│   │     ├── /[yourFeature].js                   
│   ├── /img/                   
│   ├── /font/                  # Utility classes and functions
│   └── /[yourFeature].html       # Launches the Node.js/Express web server
│── package.json                # 
└── preprocessor.js             # ES6 transpiler settings for Jest
```


### 如何开始制作一个新页面
1. 添加新文件/src/components/got/pages/newPage.js, newPage.less 
2. 修改/src/routes.jsx中引入newPage.js  
    import newPage from 'newPage.js'; 
    <Route path="newPage" component={newPage}/>
3. 修改/components/application/application.js添加菜单导航指向newPage.  
    ```<li><Link to="/newPage" activeStyle={ACTIVE}> NewPage  </Link></li>```   
        

### 如何正确的使用git开发新功能
1. git pull origin development && git submodule update --remote
2. git checkout -b **yourFeature**
3. __write your code__
4. git add .
4. git commit -m 'myfeature'
5. git checkout development (切换回development branch)
6. git pull origin development （更新最新代码）
7. git cherry-pick yourFeature (合并代码，解决冲突)
9. git push origin development (推代码到服务器) 
10. git branch -D yourFeature (删除本地分支，严禁将本地分支推到服务器)
11. 回到步骤1开始新开发

### 如何正确的更新pizza3
**问题背景**：当前pizza3是作为submodule引入到项目中的。如果pizza3有更新，并且你希望用到这个更新，那么你需要这么做：

1. cd到项目根目录
2. git submodule update --remote --merge (更新合并pizza3)
3. git status你可以如下文字
    
   ```modified:   src/components/pizza/pizza3 (new commits)```
4. 接下来你就可以正常使用你的git技能操作了 

### 如何正确的发布版本
__背景介绍:__

 
平时我们开发都在development分支上进行, 其中当前开发版本信息存在package.json中的version字段，如果打算版本发布, 是通过tag标签进行的。假设之前版本是v0.1.2, 那么发布新版本需要先将package.json中的version号递增，然后再打tag v0.1.3，将其推到gitlab服务器。gitlab会通过webhook将本次tag信息告知第三方服务器，该服务器会clone下本次提交对应的代码，打包，将最终生产代码放到webserver上。
注意：服务器会核查提交的tag信息是否和package.json中的版本信息是否一致

1. 假设目前版本是v0.1.2, 经过一段时间开发后打算发布v0.1.3
2. 修改package.json中的version为0.1.3，并且推送到gitlab。__请参考上文__
3. git tag -a v0.1.3 -m 'my version 0.1.3'
4. git push origin v0.1.3 （将该标签推送到服务器）
5. 此时，会触发第三方服务器的build行为，之后就可以让开发访问最新资源了

http://10.101.235.15:3000/public/0.1.3/index.html

**Note**:  
* 如果想发布jquery写的临时代码, tag的时候加上freeStyle-, 比如git tag -a freeStyle-v0.1.3 -m 'my freestyle version 0.1.3'



#### Others
* pizza3 sourcecode is sync from sd/pizza3 project with CL **a6ce3487712526ec5b6ae92148a3f7ca0e54f2b3**