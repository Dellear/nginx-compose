# nginx-compose
nginx-compose  使用docker技术快速开启多个nginx服务器

### 食用方法
🛎️🛎️🛎️必备：docker 和 docker-compose

```
1、clone代码

2、 cd 到项目目录

3、执行docker-compose up -d

停止服务，执行docker-compose down即可
```

```
目前已创建三个示例，可以下载后直接放置自己的代码。

6061为最基础用法，只映射了web目录

6062中映射了web目录和nginx的conf.d目录，内部放置了nginx官方的default.conf

6063中映射了web目录和nginx的conf.d目录，内部放置了加入缓存控制conf文件
```

💡💡💡 目前日志记录时间是utc时间，可以添加如下配置改成北京时间
```
command: bash -c "ln -snf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime 
      && echo Asia/Shanghai > /etc/timezone
      && nginx -t
      && nginx -g 'daemon off;'"
```