# V2Board 小工具 查询每日流量王

反馈群：[https://t.me/dyaogroup](https://t.me/dyaogroup)  
兼容 `V2Board 1.7.4` 及 `XBoard`  

支持查询 30 天内指定范围流量排行  
支持显示 用户ID、用户邮箱以及对应流量  

![image](https://s3.haruka.cloud/images/20240826-171730.png)

## 常规部署

首先你需要 [Node.js](https://nodejs.org/en/download/package-manager/all) 环境

```
# Clone 库 并跳转至该文件夹
git clone https://github.com/DyAxy/V2B-Tool-Ranking.git
cd V2B-Tool-Ranking
# 当然你可以修改配置在 .env
# API_URL 为API地址
# NEXT_PUBLIC_PATH 为管理路径
# 安装依赖环境并测试，你也可以使用yarn/pnpm/bun
npm i
npm run dev
```

浏览器打开 http://你的IP:3000 来查看是否正常运行.

当一切就绪后，你可以打包构建运行它

```
npm run build
npm run start
```

此时打开 [http://你的IP:3000](http://你的IP:3000/) 即可正常使用。
需要**常驻进程**，可使用：`screen`，`pm2`，`nohup`，`systemctl`

可能你还需要反代，推荐使用 `Caddy` 轻量化反代，仅需加入到 `CaddyFile` 这些即可使用：

```
你的域名.com {
  encode gzip
  reverse_proxy 127.0.0.1:3000
}
```

## 持久化运行

### 使用PM2进行持久化运行

如果你希望使用PM2进行持久化运行，可以按照以下步骤操作：

1. 首先，确保你已经安装了PM2。如果没有安装，可以使用以下命令进行安装：

    ```bash
    npm install pm2 -g
    ```

2. 在项目根目录下，创建一个名为`ecosystem.config.js`的文件，并将以下内容添加到文件中：

    ```javascript
    module.exports = {
      apps: [
         {
            name: "v2b-theme-nest",
            script: "server.js",
            watch: true,
            env: {
              NODE_ENV: "production",
            },
         },
      ],
    };
    ```

3. 使用以下命令启动应用程序：

    ```bash
    pm2 start ecosystem.config.js
    ```

    这将启动应用程序并使用PM2进行监控和持久化运行。


## 常见问题
Q: 我不是 `1.7.4` 我是 `1.7.3` 怎么办？
A: 
1. 升级; 
2. `$router->get ('/stat/getRanking', 'Admin\\StatController@getRanking');` 根据 [AdminRoute.php](https://github.com/v2board/v2board/blob/master/app/Http/Routes/AdminRoute.php) 这个修改