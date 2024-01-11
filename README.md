# vhhgx-cdn

一个乱七八糟的常用文件库，通过`https://cdn.jsdelivr.net/gh/vhhgx/cdn/`拼接文件路径的方式白嫖 [JSDELIVR](https://www.jsdelivr.com/) 提供的免费 cdn

使用 github 前置钩子，在提交前进行打包

## 一些基础目录

- dist：用于存放打包压缩后的 js、css 等文件
  - js
  - css
  - bash：linux 脚本文件（gulp 无法处理 bash 文件
  - third：第三方文件
- src：存放源文件，打包后移动至 dist
  - scripts：js 文件
  - styles：css 文件
- squeeze：v. 压缩，用于放置 gulp 使用的一些文件
