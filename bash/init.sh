#!/bin/bash

set -e

# 绿色提示
echoTip() {
	echo -e "\033[32m$1\033[0m"
}

# 青色加粗标题
echoTitle() {
	echo -e "\033[1;36m$1\033[0m"
}

setupSSHKey() {
	if [ -e ${HOME}/.ssh/id_rsa.pub ]; then
		echoTip "\n* ssh-key已存在\n"
  	cat ${HOME}/.ssh/id_rsa.pub
	else
		echoTip "\n* 创建密钥，请输入git用户名和邮箱\n"
	  read -p" 👨 用户名: " username && read -p" 📮 邮箱: " email
		echoTip "\n* 即将创建密钥，请根据提示进行操作\n"
		git config --global user.name "$username" && git config --global user.email "$email" && ssh-keygen -t rsa -C "$email"
		echoTip "\n* ssh-key创建完成\n"
		cat ${HOME}/.ssh/id_rsa.pub
	fi
}

# 不支持
unsupportedSystem() { 
  echo -e "\033[31m\n ! 暂不支持该发行版系统 ! \033[0m" 
}

# 根据系统版本选择镜像源
selectMirror() {
  local codename=$(lsb_release -cs)
  local mirror=""

  case $codename in
    "noble") 
      echoTip "\n当前系统版本为 Ubuntu 24.04 LTS (noble)";;
    "mantic") 
      echoTip "\n当前系统版本为 Ubuntu 23.10 (mantic)";;
    "lunar") 
      echoTip "\n当前系统版本为 Ubuntu 23.04 (lunar)";;
    "jammy") 
      echoTip "\n当前系统版本为 Ubuntu 22.04 LTS (jammy)";;
    "focal") 
      echoTip "\n当前系统版本为 Ubuntu 20.04 LTS (focal)";;
    "bionic") 
      echoTip "\n当前系统版本为 Ubuntu 18.04 LTS (bionic)";;
    "xenial") 
      echoTip "\n当前系统版本为 Ubuntu 16.04 LTS (xenial)";;
    "trusty") 
      echoTip "\n当前系统版本为 Ubuntu 14.04 LTS (trusty)";;
    *)
      echoTip "\n未知的系统版本，无法自动切换源。";;
  esac

  echoTip "请选择要使用的镜像源，默认为阿里云\n"
  echoTip "1. 阿里云"
  echoTip "2. 清华大学"
  echoTip "3. 中科大\n"
  read -p "请输入序号: " choice

  case $choice in
    1)
      echoTip "\n使用阿里云镜像源"
      mirror="http://mirrors.aliyun.com/ubuntu/";;
    2)
      echoTip "\n使用清华镜像源"
      mirror="https://mirrors.tuna.tsinghua.edu.cn/ubuntu/";;
    3)
      echoTip "\n使用中科大镜像源"
      mirror="https://mirrors.ustc.edu.cn/ubuntu/";;
    *)
      echoTip "\n未输入选项 默认使用阿里云镜像源。"
      mirror="http://mirrors.aliyun.com/ubuntu/";;
  esac

  replaceSources "$mirror"
}

# 替换 sources.list 文件内容
replaceSources() {
  # 备份当前的 sources.list 文件
  cp /etc/apt/sources.list /etc/apt/sources.list.bak
  local mirror=$1

  cat > /etc/apt/sources.list <<EOF
deb $mirror $(lsb_release -cs) main restricted universe multiverse
deb $mirror $(lsb_release -cs)-security main restricted universe multiverse
deb $mirror $(lsb_release -cs)-updates main restricted universe multiverse
deb $mirror $(lsb_release -cs)-proposed main restricted universe multiverse
deb $mirror $(lsb_release -cs)-backports main restricted universe multiverse
deb-src $mirror $(lsb_release -cs) main restricted universe multiverse
deb-src $mirror $(lsb_release -cs)-security main restricted universe multiverse
deb-src $mirror $(lsb_release -cs)-updates main restricted universe multiverse
deb-src $mirror $(lsb_release -cs)-proposed main restricted universe multiverse
deb-src $mirror $(lsb_release -cs)-backports main restricted universe multiverse
EOF

  # 更新软件包列表
  echoTip "\n* 更新软件包列表\n\n"
  apt-get update
  echoTip "\n软件源已经更新为 $mirror 源，并且软件包列表已更新\n"
}

# 欢迎信息和使用方法
welcomeMessage() {
  echoTitle "\n扬灵的前端环境部署脚本"

  echoTip "\n- 根据系统版本更改国内软件源，默认源为阿里云"
  echoTip "- 默认执行下列内容，单个执行请直接输入序号\n\n"
  
  echo -e "\033[32m1.\033[0m key        生成 SSH KEY"
  echo -e "\033[32m2.\033[0m node       安装 Node.js LTS"
  echo -e "\033[32m3.\033[0m nginx      安装 Nginx"
  echo -e "\033[32m4.\033[0m zsh        安装并切换至 ZSH"
  echo -e "\033[32m5.\033[0m omz        安装 Oh My Zsh"

  echo -e "\n\033[33m扩展内容\033[0m\n"
  echo -e "\033[33m6.\033[0m docker     安装 Docker"
  echo -e "\033[33m7.\033[0m docker     更换镜像源\n"
}

# 安装 NVM 并使用 NVM 安装 Node.js
installNodeViaNvm() {
  echoTip "\n* 安装nvm，如遇到网络问题请重新执行命令\n"
  if ! command -v nvm &> /dev/null; then
    wget -qO- https://fastly.jsdelivr.net/gh/vhhgx/dists/bash/nvm_0.39.7.sh | bash
    # 将 NVM 初始化脚本添加到 bash 配置文件中，确保永久性安装
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
    source ~/.bashrc
  fi

  echoTip "\n* 使用nvm安装最新版本 Node.js LTS\n"
  nvm install --lts
  nvm use --lts
  nvm alias default 'lts/*'
  echoTip "\n* Node.js $(node -v) 已安装\n"

  configureNpmTaobao
}

# 配置 NPM 使用淘宝镜像
configureNpmTaobao() {
  echoTip "\n* 配置 NPM 使用淘宝镜像\n"
  npm install -g nrm
  nrm use taobao
  echoTip "\n* 当前 NPM 镜像: $(nrm current)\n"
}

# 安装 Nginx
installNginx() {
  echoTip "\n* 安装 Nginx"
  add-apt-repository -y ppa:nginx/stable
  apt-get update
  apt-get install -y nginx
}

# 安装 ZSH
installZsh() {
  echoTip "\n* 安装 ZSH\n"
  sudo apt-get install -y zsh
  chsh -s /bin/zsh
}

# 安装 Oh My Zsh
installOhMyZsh() {
  echoTip "\n* 安装 Oh My Zsh\n"
  wget -qO- https://fastly.jsdelivr.net/gh/vhhgx/dists/bash/omz_gitee.sh | bash
  zsh
  cd $HOME/.oh-my-zsh
  git remote set-url origin https://gitee.com/mirrors/oh-my-zsh.git
  cd ~

  export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  source ~/.zshrc

  echoTip "\n* Oh My Zsh安装完成\n"
}

# 显示帮助信息并获取用户选择
showHelpAndReadInput() {
  welcomeMessage
  read -p "请输入序号或直接回车执行默认安装: " choice
  case $choice in
    1)
      setupSSHKey;;
    2)
      installNodeViaNvm;;
    3)
      installNginx;;
    4)
      installZsh;;
    5)
      installOhMyZsh;;
    6)
      echo -e "安装Docker";;
    7)
      selectMirror;;
    *)
      installAll ;;
  esac
}

# 安装所有组件
installAll() {
  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    if [[ -f /etc/redhat-release ]]; then
      unsupportedSystem
    elif [[ -f /etc/debian_version ]]; then
      # welcomeMessage
      selectMirror
      echoTip "\n* 安装系统必备包\n"
      apt install -y software-properties-common curl wget git net-tools openssh-server
      setupSSHKey
      installNodeViaNvm
      installNginx
      installZsh
      installOhMyZsh
      echoTip "\n* 执行结束，所有安装已完成\n"
    else
      unsupportedSystem
    fi
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    unsupportedSystem
  else
    unsupportedSystem
  fi
}

# ----------------------------------------------- 脚本开始 -----------------------------------------------

if [[ -z "$1" ]]; then
    showHelpAndReadInput
else
  case $1 in
    key)
      setupSSHKey;;
    node)
      installNodeViaNvm;;
    nginx)
      installNginx;;
    zsh)
      installZsh;;
    omz)
      installOhMyZsh;;
    *)
      installAll;;
  esac 
fi

