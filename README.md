# auth-system

权限管理系统的实现，包含用户管理、角色管理、权限管理、菜单管理等功能。  
本项目是一个后台系统技术选型React18 + ReactRouter7 + Vite4 + Antd5 + zustand + TS。  
其中包含权限系统，包括登录、权限、菜单、用户、角色等功能。  
[从零搭建的具体文档](https://juejin.cn/column/7468533169966120987)

## 项目结构

本项目采用前后端分离的方式进行开发，此为前端项目代码。

```shell
git clone git@github.com:frontzhm/auth-system.git
cd auth-system
pnpm install
pnpm run start
# 文档
pnpm run docs
```

如果想要运行接口，需要[后端项目](https://github.com/frontzhm/auth-system-server)，基本仅做展示，后端项目做的粗糙。

```shell
git clone git@github.com:frontzhm/auth-system-server.git
cd auth-system-server
pnpm install
pnpm run start
```

## 项目截图

![auth_role_4.gif](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_role_4.gif)
