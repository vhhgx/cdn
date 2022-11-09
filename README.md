# vhhgx-cdn

一个乱七八糟的常用文件库，通过`https://cdn.jsdelivr.net/gh/vhhgx/cdn/`拼接文件路径的方式白嫖 [JSDELIVR](https://www.jsdelivr.com/) 提供的免费cdn

使用github前置钩子，在提交前进行打包



## 一些基础目录


- dist：用于存放打包压缩后的js、css等文件
  - js
  - css
  - bash：linux脚本文件（gulp无法处理bash文件
  - third：第三方文件
- src：存放源文件，打包后移动至dist
  - scripts：js文件
  - styles：css文件
- images：见名知意，主要用来放图片文件
  - 其实最好还是放在 https://github.com/vhhgx/images 仓库里
  - 需要研究一下github api 上传
- squeeze：v. 压缩，用于放置gulp使用的一些文件


